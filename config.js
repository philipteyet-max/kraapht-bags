// ============================================================
//  KRAAPHT BAGS LTD — WEBSITE CONFIGURATION FILE
//  Edit this file to update prices, contact info, and text
//  across the entire website automatically.
//
//  HOW TO EDIT:
//  1. Go to your GitHub repository
//  2. Click on "config.js"
//  3. Click the pencil icon (top right of the file)
//  4. Change the value you need
//  5. Click "Commit changes" at the bottom
//  6. Vercel auto-deploys in ~60 seconds. Done.
//
//  IMPORTANT: Only change the VALUES after the colon (:)
//  Do not change the names on the left side.
//  Numbers do not need quotes. Text needs "quotes".
// ============================================================

const KRAAPHT_CONFIG = {

  // ----------------------------------------------------------
  // CONTACT DETAILS
  // Change these if your number or email changes
  // ----------------------------------------------------------
  contact: {
    whatsapp_number:  "233558619224",          // No + or spaces
    whatsapp_display: "+233 558 619 224",       // How it shows on screen
    email:            "kraaphtbags@gmail.com",
    website:          "https://project-sb5ta.vercel.app",
    location:         "Accra, Ghana",
  },

  // ----------------------------------------------------------
  // ORDER RULES
  // ----------------------------------------------------------
  order: {
    minimum_qty: 200,    // Minimum bags per order
    delivery_cost: 30,   // GHS — delivery within Accra
    designer_fee: 100,   // GHS — flat fee for requesting a designer
    die_cut_run: 60,     // GHS — die cutting per order
    die_cut_board: 300,  // GHS — one-time per new design (waived for returning customers)
    labour_per_bag: 1,   // GHS — folding labour per bag
  },

  // ----------------------------------------------------------
  // PAPER PRICES (GHS per ream — 100 sheets per ream)
  // Update these when material costs change in the market
  // ----------------------------------------------------------
  paper_prices: {
    chromo_coat:     700,   // White / Chromo Coat
    brown_card_250:  600,   // Brown Card 250gsm
    brown_paper_80:  420,   // Brown Paper 80gsm (no handle)
    matt_150:        695,   // Matt Paper 150gsm
    duplex_300:      350,   // Duplex Board
  },

  // ----------------------------------------------------------
  // PRINTING COSTS (GHS per print run — not per bag)
  // ----------------------------------------------------------
  printing: {
    one_colour:   50,    // 1 colour print run
    two_colour:   100,   // 2 colour print run
    three_colour: 150,   // 3 colour print run
    full_colour:  200,   // Full colour (4 colour) print run
  },

  // ----------------------------------------------------------
  // PLATE MAKING COSTS (GHS — one-time per design)
  // Waived for returning customers with same design
  // ----------------------------------------------------------
  plate_making: {
    one_colour:   60,    // 1 colour plate
    two_colour:   120,   // 2 colour plates (60 x 2)
    three_colour: 180,   // 3 colour plates (60 x 3)
    full_colour:  240,   // 4 colour plates (60 x 4)
  },

  // ----------------------------------------------------------
  // BAGS PER SHEET (how many bags cut from one sheet)
  // Used to calculate how many reams are needed
  // ----------------------------------------------------------
  bags_per_sheet: {
    a5_small:  4,   // A5 / Small bags — 3 per sheet
    a4_medium: 2,   // A4 / Medium bags — 2 per sheet
    a3_large:  2,   // A3 / Large bags — 2 per sheet
    custom:    2,   // Custom size — defaults to 2
  },

  // ----------------------------------------------------------
  // HOMEPAGE TEXT
  // Update these without touching any HTML
  // ----------------------------------------------------------
  homepage: {
    hero_headline:    "Premium Paper Bags Built for Your Brand",
    hero_subtext:     "Custom-printed, eco-friendly flat bottom bags and food bowls. Pre-payment production. Delivered to your business in Accra.",
    stat_min_order:   "100+",
    stat_paper_types: "5",
    stat_delivery:    "7–10",
    stat_eco:         "100%",
  },

};


// ============================================================
//  DO NOT EDIT BELOW THIS LINE
//  This section applies the config to the page automatically
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

  // Apply WhatsApp links
  document.querySelectorAll('a[href*="wa.me"]').forEach(el => {
    const current = el.getAttribute("href");
    // Preserve any text query params
    const hasText = current.includes("?text=");
    el.href = "https://wa.me/" + KRAAPHT_CONFIG.contact.whatsapp_number +
      (hasText ? current.substring(current.indexOf("?text=")) : "");
  });

  // Apply WhatsApp display numbers
  document.querySelectorAll(".whatsapp-number").forEach(el => {
    el.textContent = KRAAPHT_CONFIG.contact.whatsapp_display;
  });

  // Apply email links and text
  document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
    el.href = "mailto:" + KRAAPHT_CONFIG.contact.email;
    if (el.textContent.includes("@")) el.textContent = KRAAPHT_CONFIG.contact.email;
  });

  // Apply minimum order qty wherever shown
  document.querySelectorAll(".min-order-qty").forEach(el => {
    el.textContent = KRAAPHT_CONFIG.order.minimum_qty;
  });

  // Apply delivery cost
  document.querySelectorAll(".delivery-cost").forEach(el => {
    el.textContent = "GHS " + KRAAPHT_CONFIG.order.delivery_cost;
  });

  // Apply homepage stats
  const stats = {
    "stat-min-order":   KRAAPHT_CONFIG.homepage.stat_min_order,
    "stat-paper-types": KRAAPHT_CONFIG.homepage.stat_paper_types,
    "stat-delivery":    KRAAPHT_CONFIG.homepage.stat_delivery,
    "stat-eco":         KRAAPHT_CONFIG.homepage.stat_eco,
  };
  Object.entries(stats).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });
});
