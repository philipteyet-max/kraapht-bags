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
  ,

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
  // =================================================================
  //  IMAGES
  //  Change the filename value to swap any image on the website.
  //  Upload the new file to GitHub with the exact filename you type.
  //  Leave a value as "" to keep the built-in CSS placeholder.
  //  All pages update automatically on next deployment.
  // =================================================================
  images: {

    // ── GLOBAL ───────────────────────────────────────────────────────
    logo:           "logo.png",          // Site logo — top of every page

    // ── HOMEPAGE HERO ────────────────────────────────────────────────
    hero_video:     "hero_video.mp4",    // Background video
    hero_poster:    "bag_lady.png",      // Fallback image if video fails to play
    hero_ad_image:  "lifestyle_hotone.png",      // "Path to Superior Packaging" left image

    // ── HOMEPAGE PORTFOLIO — 2×2 grid ────────────────────────────────
    //  Reading order: top-left → top-right → bottom-left → bottom-right
    //
    //    [client_bag_1]  [client_bag_2]
    //    [client_bag_3]  [client_bag_4]
    //
    client_bag_1:  "client_bag_1.png",   // top-left
    client_bag_2:  "client_bag_2.png",  // top-right
    client_bag_3:  "client_bag_3.png", // bottom-left
    client_bag_4:  "client_bag_4.png",                        // bottom-right — upload client_bag_4.png to replace Channay CSS

    // ── HOMEPAGE PORTFOLIO — bottom product row ───────────────────────
    //  Reading order: left → right
    //
    //    [client_bag_5] [client_bag_6] [client_bag_7] [client_bag_8]
    //
    client_bag_5:  "client_bag_5.png",   // left
    client_bag_6:  "client_bag_6.png",     // 2nd
    client_bag_7:  "client_bag_7.png",       // 3rd
    client_bag_8:  "client_bag_8.png",       // right

    // ── ORDER PAGE GALLERY — top 4 product shots ─────────────────────
    //  Reading order: left → right
    //
    //    [client_bag_9] [client_bag_10] [client_bag_11] [client_bag_12]
    //
    client_bag_9:   "client_bag_9.png",  // left
    client_bag_10:  "paper_brown_80.png",    // 2nd
    client_bag_11:  "paper_chromo.png",      // 3rd
    client_bag_12:  "paper_duplex.png",      // right

    // ── ORDER PAGE GALLERY — lifestyle row ───────────────────────────
    //  Reading order: left → right
    //
    //    [client_bag_13] [client_bag_14] [client_bag_15]
    //
    client_bag_13: "lifestyle_abachs.png",   // left
    client_bag_14: "lifestyle_alounge.png",  // centre
    client_bag_15: "lifestyle_congress.png", // right

    // ── ORDER PAGE — PAPER TYPE SELECTORS ────────────────────────────
    //  Shown inside the paper selection cards on the order form
    chromo_coat_paper:    "paper_chromo.png",      // White / Chromo Coat
    brown_card_paper:     "paper_brown_card.png",  // Brown Card 250gsm
    brown_paper_80_paper: "paper_brown_80.png",    // Brown Paper 80gsm
    duplex_board_paper:   "paper_duplex.png",      // Duplex Board
    matt_card_paper:      "matt_card_paper.png",     // Matt Paper 150gsm

  },

};

// ============================================================
//  APPLY CONFIG TO PAGE — DO NOT EDIT BELOW THIS LINE
// ============================================================

// =================================================================
//  IMAGE UPDATER — runs on every page load
//  Finds elements with data-img="key" and sets their src from config
// =================================================================
document.addEventListener("DOMContentLoaded", function () {
  var C = (typeof KRAAPHT_CONFIG !== "undefined") ? KRAAPHT_CONFIG : null;
  if (!C) return;

  // ── Contact & text ──────────────────────────────────────────────
  document.querySelectorAll('a[href*="wa.me"]').forEach(function(el) {
    var cur = el.getAttribute("href");
    var hasText = cur.includes("?text=");
    el.href = "https://wa.me/" + C.contact.whatsapp_number +
      (hasText ? cur.substring(cur.indexOf("?text=")) : "");
  });
  document.querySelectorAll(".whatsapp-number").forEach(function(el) {
    el.textContent = C.contact.whatsapp_display;
  });
  document.querySelectorAll('a[href^="mailto:"]').forEach(function(el) {
    el.href = "mailto:" + C.contact.email;
    if (el.textContent.includes("@")) el.textContent = C.contact.email;
  });
  document.querySelectorAll(".min-order-qty").forEach(function(el) {
    el.textContent = C.order.minimum_qty;
  });
  document.querySelectorAll(".delivery-cost").forEach(function(el) {
    el.textContent = "GHS " + C.order.delivery_cost;
  });

  // ── Homepage stats ──────────────────────────────────────────────
  var stats = {
    "stat-min-order":   C.homepage.stat_min_order,
    "stat-paper-types": C.homepage.stat_paper_types,
    "stat-delivery":    C.homepage.stat_delivery,
    "stat-eco":         C.homepage.stat_eco,
  };
  Object.keys(stats).forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = stats[id];
  });

  // ── IMAGE UPDATER ───────────────────────────────────────────────
  var imgs = C.images;

  // 1. All elements with data-img attribute
  document.querySelectorAll("[data-img]").forEach(function(el) {
    var key = el.getAttribute("data-img");
    var src = imgs[key];
    if (!src) return;
    if (el.tagName === "IMG") {
      el.src = src;
    } else if (el.tagName === "SOURCE") {
      el.src = src;
      var vid = el.closest("video");
      if (vid) { vid.load(); vid.play().catch(function(){}); }
    } else {
      el.style.backgroundImage = "url('" + src + "')";
    }
  });

  // 2. Hero video special handling
  var heroVid = document.getElementById("hero-vid");
  if (heroVid) {
    if (imgs.hero_poster) heroVid.poster = imgs.hero_poster;
    var heroSrc = heroVid.querySelector("source");
    if (heroSrc && imgs.hero_video) {
      heroSrc.src = imgs.hero_video;
      heroVid.load();
      heroVid.play().catch(function(){});
    }
  }

  // 3. Channay card (client_bag_4) — swap CSS bag for real image
  var channayCard = document.getElementById("channay-card");
  if (channayCard && imgs.client_bag_4) {
    channayCard.innerHTML =
      '<img src="' + imgs.client_bag_4 + '" data-img="client_bag_4"' +
      ' alt="Channay Clothing Line" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>' +
      '<div class="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent"></div>' +
      '<div class="absolute bottom-0 left-0 right-0 p-6">' +
      '<span class="font-label-sm text-label-sm text-accent uppercase tracking-widest text-xs mb-1 block">Matt Paper 150gsm · 2-Colour Print</span>' +
      '<p class="font-body-lg font-semibold text-white">Channay</p>' +
      '<p class="font-body-md text-white/70 text-sm">Clothing &amp; Lifestyle Brand · Accra</p>' +
      '</div>';
  }

  // 4. Paper price display update on order page
  var paperPrices = C.paper_prices;
  var paperMap = {
    "chromo_coat":    paperPrices.chromo_coat,
    "brown_card_250": paperPrices.brown_card_250,
    "brown_paper_80": paperPrices.brown_paper_80,
    "matt_150":       paperPrices.matt_150,
    "duplex_300":     paperPrices.duplex_300,
  };
  document.querySelectorAll("#paper-options label[data-paper]").forEach(function(label) {
    var key = label.dataset.paper;
    if (paperMap[key] !== undefined) {
      label.dataset.price = paperMap[key];
      var priceEl = label.querySelector(".paper-price-display");
      if (priceEl) priceEl.textContent = "GHS " + paperMap[key].toLocaleString() + " / ream";
    }
  });

});
