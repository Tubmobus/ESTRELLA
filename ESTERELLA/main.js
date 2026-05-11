/* ============================================================
   ESTERELLA — main.js
   ============================================================

   This file controls three things:
   1. NAV SCROLL EFFECT   — frosted glass background on scroll
   2. SCROLL REVEAL       — elements fade in as you scroll down
   3. FORM SUBMISSION     — success message after email submit

   HOW TO EDIT:
   • To change scroll trigger point: search "60" and change the number
   • To change how fast elements fade in: see the .reveal CSS in style.css
   • To connect the form to a real email service: see section 3 below

   ============================================================ */


/* ============================================================
   1. NAV SCROLL EFFECT
   ============================================================
   Watches how far you've scrolled.
   If > 60px → adds class "scrolled" to the <nav>.
   CSS in style.css uses .nav.scrolled to apply the frosted
   glass background (see style.css section 5).

   To change the trigger point: change 60 to any pixel value.
   • 0   = background always visible
   • 200 = waits longer before background appears
============================================================ */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true }); // passive: true = better scroll performance


/* ============================================================
   2. SCROLL REVEAL ANIMATION
   ============================================================
   Elements with the class "reveal" in the HTML start invisible.
   As you scroll down and they enter the viewport, this code
   adds the class "visible" to them — triggering a CSS fade-up.

   The CSS for this is in style.css under section 15.

   HOW IT WORKS:
   IntersectionObserver watches each .reveal element.
   When 12% of the element is visible on screen → it animates.

   To change the threshold (how much of element must be visible):
   Edit threshold: 0.12 below. Range 0 (any bit visible) to 1 (fully visible).

   To make cards stagger (animate one after another in a row):
   The code adds a small delay to each card based on its index.
   Edit the 0.1 multiplier to change stagger speed.
============================================================ */

// Find all elements with class "reveal"
const revealEls = document.querySelectorAll('.reveal');

// Create the observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Element is in view — make it visible
        entry.target.classList.add('visible');
        // Stop watching it (animates once, stays visible)
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,    // 12% of element must be visible
    rootMargin: '0px 0px -40px 0px' // trigger 40px before bottom of viewport
  }
);

// Add stagger delays to cards so they animate in sequence
// (each card in a row animates slightly after the previous one)
document.querySelectorAll('.card.reveal').forEach((card, index) => {
  // index 0 = no delay, index 1 = 0.1s, index 2 = 0.2s, etc.
  card.style.transitionDelay = `${(index % 3) * 0.1}s`;
});

// Start watching each reveal element
revealEls.forEach(el => observer.observe(el));


/* ============================================================
   3. EMAIL FORM SUBMISSION
   ============================================================
   Currently: shows a success message in the browser.
   No data is actually sent anywhere yet.

   TO CONNECT TO A REAL EMAIL SERVICE:
   ─────────────────────────────────────────────────────────
   Option A — Mailchimp:
   Replace the entire <form> block in index.html with the
   Mailchimp embed code from your Mailchimp account.
   (Audience → Signup forms → Embedded forms)

   Option B — Klaviyo:
   Same — replace the form with your Klaviyo embed code.

   Option C — Custom backend / Formspree (easiest):
   1. Go to https://formspree.io and create a free account
   2. Create a new form → copy your form endpoint URL
   3. Change the fetch URL below from '#' to your endpoint:
      fetch('https://formspree.io/f/YOUR_FORM_ID', { ... })
   4. Remove the event.preventDefault() line so the form submits

   Option D — EmailJS (send emails without a backend):
   1. Go to https://www.emailjs.com
   2. Follow their setup guide
   3. Replace the code below with their sendForm() call
   ─────────────────────────────────────────────────────────
============================================================ */
function handleSubmit(event) {
  // Prevent the page from refreshing (default form behavior)
  event.preventDefault();

  // Get references to the input and the message element
  const form  = event.target;
  const input = form.querySelector('input[type="email"]');
  const msg   = document.getElementById('formMsg');
  const btn   = form.querySelector('button');

  // Show loading state on button
  btn.textContent = 'Adding you...';
  btn.disabled = true;

  // Simulate a small delay (like a real API call)
  // Remove this setTimeout when you connect a real service
  setTimeout(() => {

    // Success message
    msg.textContent = "You're in. Welcome to ESTERELLA.";

    // Clear the email input
    input.value = '';

    // Reset button
    btn.textContent = 'Join the list';
    btn.disabled = false;

    // Clear the success message after 6 seconds
    setTimeout(() => {
      msg.textContent = '';
    }, 6000);

  }, 900);
}


/* ============================================================
   OPTIONAL: SMOOTH ACTIVE NAV HIGHLIGHTING
   ============================================================
   This watches which section is currently in view and could
   be used to bold/highlight the matching nav link.
   Uncomment below to enable it, then add matching CSS.
============================================================ */

/*
const sections   = document.querySelectorAll('section[id]');
const navLinks   = document.querySelectorAll('.nav__left a, .nav__right a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
*/