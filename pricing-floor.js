// ═══════════════════════════════════════════════════════
// pricing-floor.js — server-side minimum-price sanity check
//
// order.html's calcPrice() computes the checkout total entirely in the
// customer's browser, and payment.html sends both the Paystack charge
// amount and the declared order_total as ordinary form data — both are
// fully editable via devtools before the "Pay" button is clicked. Paystack's
// webhook signature (checked in api/webhook.js) proves a charge really
// happened for the amount stated, but says nothing about whether that
// amount was reasonable for the order described in the same metadata.
//
// This does NOT try to reproduce calcPrice() exactly — that formula has
// many optional extras (printing, plate-making, die-cutting, designer fee)
// and discounts, and keeping a second copy of all of it in sync here would
// just recreate the kind of drift bug already called out in order.html's
// own comments (the brown_card key-mismatch outage). Instead this computes
// a conservative LOWER BOUND every real order must cost — paper + labour +
// delivery only, at the cheapest applicable rates — using the exact same
// config.js prices as the order form. Every component calcPrice() adds on
// top (printing, plate-making, die-cutting, markup) only increases the
// real total, and its discounts are explicitly capped so the final total
// never drops below ~95% of paper+print+plate+diecut+labour+delivery (see
// order.html calcPrice() comments) — which is itself >= paper+labour+
// delivery. So real_total >= 0.95 * (paperCost + labour + delivery) always,
// and this returns that bound with an extra safety margin on top.
// ═══════════════════════════════════════════════════════

// Bags-per-sheet by size tier, mirroring order.html's SIZE_TIERS. Unknown/
// custom sizes fall back to 4 (the most paper-efficient, i.e. cheapest,
// tier) so this never overshoots a real, cheaper price and false-flags a
// legitimate order.
const BAG_SIZE_BPS = { a5: 4, a4: 2, a3: 1 };
const BOWL_BPS = 2;

function cheapestPaperKey(paperSpecs) {
  return Object.keys(paperSpecs).reduce((a, b) => {
    const perSheetA = paperSpecs[a].price / paperSpecs[a].sheets_per_ream;
    const perSheetB = paperSpecs[b].price / paperSpecs[b].sheets_per_ream;
    return perSheetA <= perSheetB ? a : b;
  });
}

// fields: the flattened Paystack custom_fields object from webhook.js
// (product_type, paper_type, size, quantity — whatever's present).
// config: the KRAAPHT_CONFIG object from config.js.
// Returns the minimum plausible GHS total for the whole order, or 0 if
// there isn't enough information (e.g. missing/zero quantity) to check.
function minimumOrderTotal(fields, config) {
  const qty = parseInt(fields.quantity) || 0;
  if (qty <= 0) return 0;

  const paperSpecs = config.paper_prices;
  const productType = String(fields.product_type || '');
  const isBowlOnly = productType.includes('Food Bowl') && !productType.includes('Flat Bottom Bag');

  const key = fields.paper_type && paperSpecs[fields.paper_type]
    ? fields.paper_type
    : cheapestPaperKey(paperSpecs);
  const spec = paperSpecs[key];

  const bps = isBowlOnly ? BOWL_BPS : (BAG_SIZE_BPS[fields.size] || 4);
  const sheetsNeeded = Math.ceil(qty / bps);
  const paperCost = (sheetsNeeded / spec.sheets_per_ream) * spec.price;

  const labourRate = isBowlOnly
    ? config.order.labour_per_bowl
    : Math.min(config.order.labour_per_bag_no_handle, config.order.labour_per_bag_handled_high);
  const labour = qty * labourRate;

  const baseFloor = paperCost + labour + config.order.delivery_cost;

  // 0.9x on top of the already-conservative 0.95x bound derived above, for
  // extra headroom against edge cases this simplified model doesn't know
  // about (e.g. a combined bag+addon-bowl order, where paper_type/size in
  // the metadata only describe the primary product).
  return baseFloor * 0.9;
}

module.exports = { minimumOrderTotal };
