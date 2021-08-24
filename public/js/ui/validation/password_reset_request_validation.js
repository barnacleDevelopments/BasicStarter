import { isEmail } from './utilities.js';

window.addEventListener('load', () => {
  const emailInputEl = document.getElementById('recovery-email-input');
  const submitBtnEl = document.getElementById('submit-recovery-btn');
  const errorMessageEl = document.getElementById('error-message');

  submitBtnEl.addEventListener('click', (e) => {
    if (!isEmail(emailInputEl.value)) {
      e.preventDefault();
      errorMessageEl.textContent = 'Please enter a valid email address.';
    }
  });
})();
