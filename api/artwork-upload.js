// ═══════════════════════════════════════════════════════
// api/artwork-upload.js
// Handles artwork file upload → Supabase Storage → Resend email
// POST /api/artwork-upload  (multipart/form-data)
//   Fields: file, label, order_ref (optional)
//   Auth: Bearer token (Supabase JWT from logged-in user)
// ═══════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Vercel body parsing must be disabled for file uploads
export const config = { api: { bodyParser: false } };

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── Authenticate user from Bearer token ──
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Invalid session' });

  // ── Parse multipart form data ──
  // Use busboy to parse the incoming form
  const busboy = (await import('busboy')).default;
  const bb = busboy({ headers: req.headers, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB max

  let fileBuffer = null;
  let fileName = '';
  let mimeType = '';
  let fileSize = 0;
  let label = '';
  let orderRef = '';

  await new Promise((resolve, reject) => {
    bb.on('file', (fieldname, file, info) => {
      fileName = info.filename;
      mimeType = info.mimeType;
      const chunks = [];
      file.on('data', chunk => { chunks.push(chunk); fileSize += chunk.length; });
      file.on('end', () => { fileBuffer = Buffer.concat(chunks); });
    });
    bb.on('field', (name, val) => {
      if (name === 'label') label = val;
      if (name === 'order_ref') orderRef = val;
    });
    bb.on('finish', resolve);
    bb.on('error', reject);
    req.pipe(bb);
  });

  if (!fileBuffer) return res.status(400).json({ error: 'No file received' });

  // ── Validate file type ──
  const allowed = ['image/jpeg', 'image/png', 'image/svg+xml', 'application/pdf', 'application/postscript'];
  if (!allowed.includes(mimeType)) {
    return res.status(400).json({ error: 'File type not allowed. Use JPG, PNG, SVG, PDF or AI.' });
  }

  // ── Upload to Supabase Storage ──
  // Path: artwork/{user_id}/{timestamp}_{filename}
  const timestamp = Date.now();
  const safeName  = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath  = `${user.id}/${timestamp}_${safeName}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from('artwork')
    .upload(filePath, fileBuffer, { contentType: mimeType, upsert: false });

  if (uploadError) {
    console.error('Storage upload error:', uploadError);
    return res.status(500).json({ error: 'Upload failed' });
  }

  // ── Generate signed URL (valid 7 days) for email link ──
  const { data: signedData } = await supabaseAdmin.storage
    .from('artwork')
    .createSignedUrl(filePath, 60 * 60 * 24 * 7);

  const signedUrl = signedData?.signedUrl || '';

  // ── Save artwork record to database ──
  const { data: artworkRow, error: dbError } = await supabaseAdmin
    .from('artwork')
    .insert({
      user_id:   user.id,
      order_ref: orderRef || null,
      file_name: fileName,
      file_path: filePath,
      file_size: fileSize,
      mime_type: mimeType,
      label:     label || fileName,
      use_count: 0,
    })
    .select()
    .single();

  if (dbError) console.error('DB insert error:', dbError);

  // ── Get user profile for email ──
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('full_name, business_name, phone')
    .eq('id', user.id)
    .single();

  // ── Send Resend notification to Kraapht ──
  try {
    await resend.emails.send({
      from:    'Kraapht Bags <noreply@kraaphtbags.com>',
      to:      'kraaphtbags@gmail.com',
      subject: `New Artwork Upload — ${profile?.business_name || user.email}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
          <div style="background:#1F4D3A;padding:24px;color:white;">
            <h2 style="margin:0;font-size:20px;">New Artwork Upload</h2>
          </div>
          <div style="padding:24px;border:1px solid #D8C3A5;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:8px 0;color:#8B7355;width:130px;">Client</td><td style="padding:8px 0;font-weight:600;">${profile?.full_name || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:#8B7355;">Business</td><td style="padding:8px 0;font-weight:600;">${profile?.business_name || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:#8B7355;">Email</td><td style="padding:8px 0;">${user.email}</td></tr>
              <tr><td style="padding:8px 0;color:#8B7355;">Phone</td><td style="padding:8px 0;">${profile?.phone || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:#8B7355;">Order Ref</td><td style="padding:8px 0;">${orderRef || 'Not linked'}</td></tr>
              <tr><td style="padding:8px 0;color:#8B7355;">File</td><td style="padding:8px 0;">${fileName} (${(fileSize/1024).toFixed(0)}KB)</td></tr>
              <tr><td style="padding:8px 0;color:#8B7355;">Label</td><td style="padding:8px 0;">${label || '—'}</td></tr>
            </table>
            <div style="margin-top:24px;">
              <a href="${signedUrl}" style="display:inline-block;background:#1F4D3A;color:white;padding:12px 24px;text-decoration:none;font-weight:600;font-size:14px;letter-spacing:0.05em;">
                DOWNLOAD ARTWORK FILE →
              </a>
              <p style="font-size:12px;color:#8B7355;margin-top:8px;">Link expires in 7 days</p>
            </div>
          </div>
        </div>
      `,
    });
  } catch (emailError) {
    console.error('Resend error:', emailError);
    // Don't fail the upload if email fails
  }

  return res.status(200).json({
    success:    true,
    artwork_id: artworkRow?.id,
    file_path:  filePath,
    file_name:  fileName,
    label:      label || fileName,
  });
}
