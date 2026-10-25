/**
 * FOOTER COMPONENT CONTROLLER
 * Manages newsletter interactions and footer UI states.
 */

window.handleNewsletter = function(e) {
  e.preventDefault();
  const form = e.target;
  const input = form.querySelector(".newsletter-input");
  const email = input.value.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (window.showToast) {
      window.showToast("Please provide a valid corporate email address.", "warning");
    }
    return;
  }

  // Store subscription mock
  const subscribers = JSON.parse(localStorage.getItem("estatecraft_newsletter_subs") || "[]");
  if (!subscribers.includes(email)) {
    subscribers.push(email);
    localStorage.setItem("estatecraft_newsletter_subs", JSON.stringify(subscribers));
  }

  input.value = "";
  if (window.showToast) {
    window.showToast("Thank you for subscribing to Habitex Market Intelligence.", "success");
  }
};
