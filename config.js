// ============================================================
//  KRAAPHT BAGS LTD — WEBSITE CONFIGURATION FILE
//  Edit this file to update prices, images, contact info
//  and text across the entire website automatically.
//
//  HOW TO EDIT:
//  1. Go to your GitHub repository
//  2. Click on "config.js"
//  3. Click the pencil icon (top right of the file)
//  4. Change the value you need
//  5. Click "Commit changes" at the bottom
//  6. Vercel auto-deploys in ~60 seconds. Done.
//
//  RULES:
//  - Only change the VALUES after the colon (:)
//  - Text values need "quotes"
//  - Numbers do NOT need quotes
//  - Keep all commas exactly where they are
// ============================================================

const KRAAPHT_CONFIG = {

  // ----------------------------------------------------------
  // CONTACT DETAILS
  // ----------------------------------------------------------
  contact: {
    whatsapp_number:  "233558619224",
    whatsapp_display: "+233 558 619 224",
    email:            "kraaphtbags@gmail.com",
    website:          "https://project-sb5ta.vercel.app",
    location:         "Accra, Ghana",
  },

  // ----------------------------------------------------------
  // ORDER RULES
  // ----------------------------------------------------------
  order: {
    minimum_qty:    200,
    delivery_cost:  30,
    designer_fee:   100,
    die_cut_run:    60,
    die_cut_board:  300,
    labour_per_bag: 1,
  },

  // ----------------------------------------------------------
  // PAPER PRICES (GHS per ream — 100 sheets per ream)
  // Change these when material costs change in the market
  // ----------------------------------------------------------
  paper_prices: {
    chromo_coat:    525,
    brown_card_250: 550,
    brown_paper_80: 420,
    matt_150:       695,
    duplex_300:     300,
  },

  // ----------------------------------------------------------
  // PRINTING COSTS (GHS per print run)
  // ----------------------------------------------------------
  printing: {
    one_colour:   50,
    two_colour:   100,
    three_colour: 150,
    full_colour:  200,
  },

  // ----------------------------------------------------------
  // PLATE MAKING COSTS (GHS — one-time per design)
  // Waived for returning customers with the same design
  // ----------------------------------------------------------
  plate_making: {
    one_colour:   60,
    two_colour:   120,
    three_colour: 180,
    full_colour:  240,
  },

  // ----------------------------------------------------------
  // BAGS PER SHEET
  // ----------------------------------------------------------
  bags_per_sheet: {
    a5_small:  3,
    a4_medium: 2,
    a3_large:  2,
    custom:    2,
  },

  // ----------------------------------------------------------
  // IMAGES — HOMEPAGE
  // Change the filename here when you upload a new image
  // to GitHub. Use the exact filename you upload.
  // ----------------------------------------------------------
  images: {

    // HOMEPAGE
    // --------
    // Large hero advertisement image (left panel, "Path to Superior Packaging")
    hero_ad_image: "bag_lady.png",

    // Portfolio section — large left panel (biggest image on homepage)
    portfolio_main: "lifestyle_abachs.png",

    // Portfolio section — right top panel
    portfolio_right_top: "lifestyle_alounge.png",

    // Portfolio section — right bottom panel
    portfolio_right_bottom: "lifestyle_congress.png",

    // Homepage product grid — bottom 4 cards
    product_card_brown_card:   "paper_brown_card.png",
    product_card_brown_80:     "paper_brown_80.png",
    product_card_chromo:       "paper_chromo.png",
    product_card_duplex:       "paper_duplex.png",

    // ORDER PAGE
    // ----------
    // Top portfolio gallery on order page (6 images)
    order_gallery_1: "paper_brown_card.png",
    order_gallery_2: "paper_brown_80.png",
    order_gallery_3: "paper_chromo.png",
    order_gallery_4: "Brown_card_2.png",
    order_gallery_5: "lifestyle_abachs.png",
    order_gallery_6: "lifestyle_alounge.png",
    order_gallery_7: "Chromo_coat_bag.png",

    // Paper type selector cards (what shows in the paper chooser)
    paper_selector_chromo:       "paper_chromo.png",
    paper_selector_brown_card:   "paper_brown_card.png",
    paper_selector_brown_80:     "paper_brown_80.png",
    paper_selector_duplex:       "paper_duplex.png",

    // Logo — appears on every page top nav
    logo: "logo.png",

    // Hero video — homepage background
    hero_video: "hero_video.mp4",

  },

  // ----------------------------------------------------------
  // HOMEPAGE TEXT
  // ----------------------------------------------------------
  homepage: {
    hero_headline:    "Premium Paper Bags Built for Your Brand",
    hero_subtext:     "Custom-printed, eco-friendly flat bottom bags and food bowls. Pre-payment production. Delivered to your business in Accra.",
    stat_min_order:   "200+",
    stat_paper_types: "5",
    stat_delivery:    "7–10",
    stat_eco:         "100%",
  },
  // ----------------------------------------------------------
  // IMAGES
  // Change the filename here to swap any image on the website.
  // Upload your new image to GitHub with the same filename,
  // OR change the filename here to match your new file.
  // All pages update automatically.
  // ----------------------------------------------------------
  images: {

    // ---- HOMEPAGE ----
    hero_video:          "hero_video.mp4",      // Background video on homepage hero
    hero_poster:         "bag_lady.png",         // Fallback image if video doesn't play

    // Advertisement section — "Path to Superior Packaging"
    advert_main:         "bag_lady.png",         // Large left image

    // "Work We Have Delivered" — 4 portfolio cards
    portfolio_card_1:    "lifestyle_abachs.png",  // Card 1 — The Abachs
    portfolio_card_2:    "lifestyle_alounge.png", // Card 2 — AL Lounge
    portfolio_card_3:    "lifestyle_congress.png",// Card 3 — YAWC Congress
    portfolio_card_4:    "matt_paper.png",                      // Card 4 — Channay (leave empty to keep CSS bag, or add filename)

    // ---- ORDER PAGE ----
    // Paper type selector images — shown when customer picks paper type
    paper_chromo:        "paper_chromo.png",      // White / Chromo Coat
    paper_brown_card:    "paper_brown_card.png",  // Brown Card 250gsm
    paper_brown_80:      "paper_brown_80.png",    // Brown Paper 80gsm
    paper_matt:          "matt_paper.png",         // Matt Paper 150gsm
    paper_duplex:        "paper_duplex.png",      // Duplex Board

    // Order page gallery — top portfolio strip
    gallery_1:           "lifestyle_abachs.png",
    gallery_2:           "Chromo_coat_bag.png",
    gallery_3:           "food_bag.png",
    gallery_4:           "paper_duplex.png",
    gallery_lifestyle_1: "lifestyle_abachs.png",
    gallery_lifestyle_2: "Brown_card_2.png",
    gallery_lifestyle_3: "lifestyle_congress.png",

    // ---- GLOBAL ----
    logo:                "logo.png",             // Logo — top of every page

  },

};


// ============================================================
//  APPLY CONFIG TO PAGE — DO NOT EDIT BELOW THIS LINE
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
  var C = KRAAPHT_CONFIG;

  // Apply WhatsApp links
  document.querySelectorAll('a[href*="wa.me"]').forEach(function(el) {
    var current = el.getAttribute("href");
    var hasText = current.includes("?text=");
    el.href = "https://wa.me/" + C.contact.whatsapp_number +
      (hasText ? current.substring(current.indexOf("?text=")) : "");
  });

  // Apply email links
  document.querySelectorAll('a[href^="mailto:"]').forEach(function(el) {
    el.href = "mailto:" + C.contact.email;
    if (el.textContent.includes("@")) el.textContent = C.contact.email;
  });

  // Apply images — replace every img src and video src
  // that matches a config key pattern
  var imgMap = C.images;

  // Helper — find img by current src and replace
  function replaceImg(currentSrc, newSrc) {
    if (currentSrc === newSrc) return; // no change needed
    document.querySelectorAll('img[src="' + currentSrc + '"]').forEach(function(el) {
      el.src = newSrc;
    });
    // Also update video sources
    document.querySelectorAll('source[src="' + currentSrc + '"]').forEach(function(el) {
      el.src = newSrc;
      // Reload the parent video
      var vid = el.closest('video');
      if (vid) { vid.load(); vid.play().catch(function(){}); }
    });
    // Update logo srcs
    document.querySelectorAll('img[src="' + currentSrc + '"]').forEach(function(el) {
      el.src = newSrc;
    });
  }

  // Homepage images
  replaceImg("bag_lady.png",              imgMap.hero_ad_image);
  replaceImg("lifestyle_abachs.png",      imgMap.portfolio_main);
  replaceImg("lifestyle_alounge.png",     imgMap.portfolio_right_top);
  replaceImg("lifestyle_congress.png",    imgMap.portfolio_right_bottom);
  replaceImg("paper_brown_card.png",      imgMap.product_card_brown_card);
  replaceImg("paper_brown_80.png",        imgMap.product_card_brown_80);
  replaceImg("paper_chromo.png",          imgMap.product_card_chromo);
  replaceImg("paper_duplex.png",          imgMap.product_card_duplex);
  replaceImg("logo.png",                  imgMap.logo);

  // Video
  if (imgMap.hero_video !== "hero_video.mp4") {
    document.querySelectorAll('source[src="hero_video.mp4"]').forEach(function(el) {
      el.src = imgMap.hero_video;
      var vid = el.closest('video');
      if (vid) { vid.load(); vid.play().catch(function(){}); }
    });
  }

  // Minimum order qty
  document.querySelectorAll(".min-order-qty").forEach(function(el) {
    el.textContent = C.order.minimum_qty;
  });

  // Delivery cost
  document.querySelectorAll(".delivery-cost").forEach(function(el) {
    el.textContent = "GHS " + C.order.delivery_cost;
  });

  // Homepage stats
  var stats = {
    "stat-min-order":   C.homepage.stat_min_order,
    "stat-paper-types": C.homepage.stat_paper_types,
    "stat-delivery":    C.homepage.stat_delivery,
    "stat-eco":         C.homepage.stat_eco,
  };
  Object.entries(stats).forEach(function(entry) {
    var el = document.getElementById(entry[0]);
    if (el) el.textContent = entry[1];
  });

});

document.addEventListener("DOMContentLoaded", function() {
  if (typeof KRAAPHT_CONFIG === "undefined") return;
  const imgs = KRAAPHT_CONFIG.images;
  document.querySelectorAll("[data-img]").forEach(el => {
    const key = el.getAttribute("data-img");
    const src = imgs[key];
    if (!src) return;
    if (el.tagName === "IMG") el.src = src;
  });
  const heroVid = document.getElementById("hero-vid");
  if (heroVid && imgs.hero_poster) heroVid.poster = imgs.hero_poster;
  if (heroVid && imgs.hero_video) {
    const s = heroVid.querySelector("source");
    if (s) { s.src = imgs.hero_video; heroVid.load(); heroVid.play().catch(()=>{}); }
  }
  const channayCard = document.getElementById("channay-card");
  if (channayCard && imgs.portfolio_card_4) {
    channayCard.innerHTML = '<img src="' + imgs.portfolio_card_4 + '" alt="Channay" class="w-full h-full object-cover"/><div class="absolute inset-0 bg-gradient-to-t from-charcoal/90 to-transparent"></div><div class="absolute bottom-0 left-0 right-0 p-6"><span class="font-label-sm text-label-sm text-accent uppercase tracking-widest text-xs mb-1 block">Matt Paper 150gsm · 2-Colour Print</span><p class="font-body-lg font-semibold text-white">Channay</p></div>';
  }
});
