/* ============================================================
   ESTRELLA — main.js
   ============================================================

   CONTENTS:
   ─────────────────────────────────────────────────────────
   A. EMAILJS CONFIG  ← 🔑 PASTE YOUR IDs HERE
   B. CUSTOM CURSOR
   C. NAV SCROLL EFFECT
   D. SCROLL REVEAL (reveal / reveal-left / reveal-right)
   E. SPLIT TEXT ANIMATION
   F. MAGNETIC BUTTONS
   G. COUNT-UP NUMBERS
   H. PARALLAX (hero background + lookbook images)
   I. CARD TILT (3D tilt on product cards)
   J. MARQUEE PAUSE ON HOVER (CSS handles this, JS fallback)
   K. NEWSLETTER FORM  → sends to estrella.bus1n3ss@gmail.com
   L. CONTACT FORM     → sends to estrella.bus1n3ss@gmail.com
   ─────────────────────────────────────────────────────────
*/


/* ============================================================
   A. EMAILJS CONFIG
   ============================================================
   Emails go to: estrella.bus1n3ss@gmail.com

   SETUP STEPS (takes ~10 minutes, free):
   ────────────────────────────────────────────────────────

   1. Create a free account at https://www.emailjs.com
      (free plan = 200 emails/month, no credit card needed)

   2. Connect your Gmail:
      Dashboard → Email Services → Add New Service
      → Choose Gmail → sign in with estrella.bus1n3ss@gmail.com
      → Click "Connect Account" → Copy the Service ID shown
      → Paste it below as EMAILJS_SERVICE_ID

   3. Create an email template:
      Dashboard → Email Templates → Create New Template
      Set "To email": estrella.bus1n3ss@gmail.com

      Paste this as the template content:
      ─────────────────────────────────────
      Subject: {{subject}}

      From: {{from_name}}
      Email: {{from_email}}

      {{message}}
      ─────────────────────────────────────
      Save template → Copy the Template ID
      → Paste it below as EMAILJS_TEMPLATE_ID

   4. Get your Public Key:
      Dashboard → Account → General → Public Key
      → Paste it below as EMAILJS_PUBLIC_KEY

   5. Save this file. Reload Live Server. Test the form.
      You should receive an email at estrella.bus1n3ss@gmail.com.

   ── NEWSLETTER FORM uses the same config but a different
      template that just captures the email address.
      Create a second template called "newsletter_template":
      ─────────────────────────────────────
      Subject: New newsletter signup

      Email: {{email}}
      ─────────────────────────────────────
      Copy that template ID → paste as EMAILJS_NEWSLETTER_TEMPLATE_ID
   ──────────────────────────────────────────────────────── */

const EMAILJS_PUBLIC_KEY             = '2sn6TW0vU0CUP8GLh';         // ← paste here (step 4 below)
const EMAILJS_SERVICE_ID             = 'service_s5rzryn';         // ✅ your service ID
const EMAILJS_TEMPLATE_ID            = 'template_pyjdu6e';        // ← paste here (contact form template)
const EMAILJS_NEWSLETTER_TEMPLATE_ID = 'https://dashboard.emailjs.com/admin/templates/71t3z2o';// ← paste here (newsletter template)

// Initialize EmailJS with your public key
emailjs.init(EMAILJS_PUBLIC_KEY);


/* ============================================================
   B. CUSTOM CURSOR
   ============================================================
   Clean single dot — no trailing ring.
   Turns sand-colored when hovering over links/buttons.
============================================================ */
const cursor = document.getElementById('cursor');

// Move dot exactly with the mouse — no lag, no extra elements
document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
}, { passive: true });

// Change color on interactive elements
document.querySelectorAll('a, button, .card, .press__logo, .nav__logo').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});


/* ============================================================
   C. NAV SCROLL EFFECT
   ============================================================
   Adds .scrolled class to <nav> after 60px scroll.
   CSS applies frosted glass background when class is present.
   To change trigger point: change 60 to any pixel value.
============================================================ */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/* ============================================================
   D. SCROLL REVEAL
   ============================================================
   Watches .reveal, .reveal-left, .reveal-right elements.
   Adds .visible when 12% of the element enters the viewport.
   CSS animates them in (fade up / slide left / slide right).

   Cards in the same row stagger using a small delay per column.
============================================================ */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once only
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
);

// Stagger cards by their position in the grid (column index)
document.querySelectorAll('.card.reveal').forEach((card, i) => {
  card.style.transitionDelay = `${(i % 3) * 0.12}s`;
});

// Stagger press logos
document.querySelectorAll('.press__logo').forEach((logo, i) => {
  logo.style.transitionDelay = `${i * 0.08}s`;
});

revealEls.forEach(el => revealObserver.observe(el));


/* ============================================================
   E. SPLIT TEXT ANIMATION
   ============================================================
   Finds elements with class .split-text, wraps each word
   in a .word > .inner span structure, then the CSS
   clips each word up into view when .visible is added.
============================================================ */
function splitText(el) {
  const text  = el.innerHTML;
  const parts = text.split(/(<[^>]+>|&[^;]+;|\s+)/); // preserve tags & entities
  el.innerHTML = parts.map(part => {
    if (part.match(/^(<|&)/) || part.trim() === '') return part;
    return `<span class="word"><span class="inner">${part}</span></span>`;
  }).join('');
}

const splitEls = document.querySelectorAll('.split-text');

// Observe split-text elements
const splitObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stagger each word's inner span
        entry.target.querySelectorAll('.inner').forEach((inner, i) => {
          inner.style.transitionDelay = `${i * 0.07}s`;
        });
        splitObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

splitEls.forEach(el => {
  splitText(el);
  splitObserver.observe(el);
});


/* ============================================================
   F. MAGNETIC BUTTONS
   ============================================================
   Buttons with attribute magnetic="true" gently follow
   the cursor when hovered, snapping back on mouse leave.
   Strength is controlled by the 0.35 multiplier below.
============================================================ */
document.querySelectorAll('[magnetic="true"]').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) * 0.35; // 0.35 = strength
    const dy   = (e.clientY - cy) * 0.35;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
    btn.style.transition = 'transform 0.5s var(--ease-bounce)';
  });

  btn.addEventListener('mouseenter', () => {
    btn.style.transition = 'transform 0.1s linear';
  });
});


/* ============================================================
   G. COUNT-UP NUMBERS
   ============================================================
   Elements with class .count-up animate from 0 to their
   data-target value when they scroll into view.
   Also handles the .hero__stat-num spans in the hero.
============================================================ */
function animateCount(el, target, duration = 1600) {
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    // Ease out quad for natural deceleration
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const countEls = document.querySelectorAll('.count-up, .hero__stat-num');

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target || entry.target.dataset.count || 0);
        animateCount(entry.target, target);
        countObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

countEls.forEach(el => countObserver.observe(el));


/* ============================================================
   H. PARALLAX
   ============================================================
   Two effects:
   1. Hero background shifts at a slower rate than scroll
      (background-attachment:fixed handles most of it in CSS,
       this adds an extra subtle offset)
   2. Lookbook images (.parallax-img) shift vertically at
      different speeds creating a depth effect between panels.

   Disabled on mobile/touch devices for performance.
============================================================ */
const isTouch = window.matchMedia('(hover: none)').matches;

if (!isTouch) {

  // Lookbook image parallax
  const parallaxImgs = document.querySelectorAll('.parallax-img');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    parallaxImgs.forEach((img, i) => {
      const rect   = img.closest('.lookbook__cell').getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (window.innerHeight / 2 - center) * 0.08; // 0.08 = intensity
      img.style.transform = `translateY(${offset}px)`;
    });

  }, { passive: true });

  // About image parallax
  const aboutImg = document.querySelector('.about__img');
  const aboutPanel = document.querySelector('.about__img-panel');

  if (aboutImg && aboutPanel) {
    window.addEventListener('scroll', () => {
      const rect   = aboutPanel.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (window.innerHeight / 2 - center) * 0.06;
      aboutImg.style.transform = `scale(1.08) translateY(${offset}px)`;
    }, { passive: true });
  }

}


/* ============================================================
   I. CARD TILT (3D hover tilt on product cards)
   ============================================================
   Each product card subtly tilts in 3D to follow the cursor.
   Tilt resets smoothly on mouse leave.
   Strength controlled by TILT_AMOUNT below.
============================================================ */
const TILT_AMOUNT = 6; // degrees — increase for more dramatic tilt

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to 0.5
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;
    const rotX = -y * TILT_AMOUNT;  // invert Y for natural feel
    const rotY =  x * TILT_AMOUNT;
    card.style.transform  = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    card.style.transition = 'transform 0.1s linear';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    card.style.transition = 'transform 0.6s var(--ease-out-expo)';
  });
});


/* ============================================================
   K. NEWSLETTER FORM
   ============================================================
   Sends the subscriber email to estrella.bus1n3ss@gmail.com
   via EmailJS using the newsletter template.

   IMPORTANT: Before this works you must:
   1. Complete the EmailJS setup in section A above
   2. Create a newsletter template in EmailJS dashboard
   3. Paste the template ID as EMAILJS_NEWSLETTER_TEMPLATE_ID
============================================================ */
function handleNewsletter(event) {
  event.preventDefault();

  const form  = event.target;
  const btn   = form.querySelector('button');
  const msg   = document.getElementById('newsletterMsg');
  const email = form.querySelector('input[type="email"]').value;

  // Check if EmailJS is configured yet
  if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
    msg.textContent = 'Email service not configured yet — see main.js section A.';
    msg.classList.add('error');
    return;
  }

  // Loading state
  btn.textContent = 'Adding…';
  btn.disabled = true;

  // Send via EmailJS
  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_NEWSLETTER_TEMPLATE_ID, {
    name:    'Newsletter Signup',
    email:   email,
    title:   'New newsletter subscriber',
    message: `New subscriber: ${email}`,
  })
  .then(() => {
    msg.textContent = "You're in. Welcome to ESTRELLA.";
    msg.classList.remove('error');
    form.reset();
    btn.textContent = 'Join the list';
    btn.disabled = false;
    // Clear message after 6s
    setTimeout(() => { msg.textContent = ''; }, 6000);
  })
  .catch((err) => {
    console.error('EmailJS error:', err);
    msg.textContent = 'Something went wrong. Please try again.';
    msg.classList.add('error');
    btn.textContent = 'Join the list';
    btn.disabled = false;
  });
}


/* ============================================================
   L. CONTACT / MESSAGE FORM
   ============================================================
   Full contact form: name, email, subject, message.
   Sends directly to estrella.bus1n3ss@gmail.com via EmailJS.

   IMPORTANT: Before this works you must:
   1. Complete the EmailJS setup in section A above
   2. Paste your IDs at the top of this file

   The template variables used:
   • {{from_name}}  = person's name
   • {{from_email}} = person's email
   • {{subject}}    = subject line
   • {{message}}    = message body
============================================================ */
function handleContact(event) {
  event.preventDefault();

  const form = event.target;
  const btn  = document.getElementById('contactBtn');
  const msg  = document.getElementById('contactMsg');

  // Check if EmailJS is configured yet
  if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
    msg.textContent = 'Email service not configured yet — see main.js section A.';
    msg.classList.add('error');
    return;
  }

  // Loading state
  btn.textContent = 'Sending…';
  btn.disabled = true;

  // Variable names match your EmailJS template exactly:
  // {{name}} {{email}} {{message}} {{title}}
  const templateParams = {
    name:    form.from_name.value,
    email:   form.from_email.value,
    title:   form.subject.value,
    message: form.message.value,
  };

  // Send to estrella.bus1n3ss@gmail.com via EmailJS
  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
  .then(() => {
    msg.textContent = 'Message received. We\'ll be in touch.';
    msg.classList.remove('error');
    form.reset();
    btn.textContent = 'Send message';
    btn.disabled = false;
    setTimeout(() => { msg.textContent = ''; }, 7000);
  })
  .catch((err) => {
    console.error('EmailJS error:', err);
    msg.textContent = 'Something went wrong. Please email us directly.';
    msg.classList.add('error');
    btn.textContent = 'Send message';
    btn.disabled = false;
  });
}