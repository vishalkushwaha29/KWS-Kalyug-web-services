/* ==============================================================
   CONFIGURATION
   --------------------------------------------------------------
   EDIT THIS FILE FIRST. Everything below feeds the whole site:
   contact cards, WhatsApp links, mailto links, footer icons and
   the structured data used by Google.

   The phone number must be digits only, with country code and no
   "+", spaces or dashes — that is the format wa.me requires.
   ============================================================== */

const CONFIG = {
  business: {
    name: "Kalyug Web Services",
    tagline: "Web • AI • Marketing • Digital Growth",
    url: "https://kalyugwebs.dpdns.org",
    location: "India (Remote / Online)",
    hours: "Mon – Sat, 9:00 AM – 7:00 PM IST",
  },

  // --- Contact details -------------------------------------
  email: "kalyugwebservices29@gmail.com",
  phone: "+91 63884 48372",
  whatsapp: "+91 63884 48372",
  whatsappNumber: "916388448372", // digits only — used to build wa.me links

  // --- Social media ----------------------------------------
  // Replace '#' with your real profile URLs.
  social: {
    instagram: "#",
    linkedin: "#",
    facebook: "#",
    youtube: "#",
    telegram: "#",
    x: "#",
    github: "#",
  },

  // --- Lead routing ----------------------------------------
  // 'whatsapp' opens WhatsApp with the message pre-filled.
  // 'email'    opens the visitor's mail client, addressed to you.
  // Both are serverless: nothing to host, nothing to pay for.
  lead: {
    subjectPrefix: "New enquiry",
    // Shown under each form so visitors know what happens on submit.
    note: "Submitting opens WhatsApp or your email app with the details filled in.",
  },
};

/** Builds a wa.me URL with an optional pre-filled message. */
CONFIG.waLink = function (message) {
  const base = "https://wa.me/" + CONFIG.whatsappNumber;
  return message ? base + "?text=" + encodeURIComponent(message) : base;
};

/** Builds a mailto: URL with subject and body. */
CONFIG.mailLink = function (subject, body) {
  return (
    "mailto:" +
    CONFIG.email +
    "?subject=" +
    encodeURIComponent(subject) +
    "&body=" +
    encodeURIComponent(body)
  );
};
