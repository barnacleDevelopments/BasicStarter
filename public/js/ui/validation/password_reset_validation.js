import { stringsMatch } from './utilities.js';

window.addEventListener('load', () => {
  const resetPasswordBtnEl = document.getElementById('reset-password-btn');
  const validationMessage = document.getElementById('validation-message');

  resetPasswordBtnEl.addEventListener('click', (e) => {
    const passwordFieldsEl = document.querySelectorAll('.recover-password-field');
    const newPassword = passwordFieldsEl[0].value;
    const newPasswordRepeat = passwordFieldsEl[1].value;
    if (!stringsMatch(newPassword, newPasswordRepeat)) {
      e.preventDefault();
      validationMessage.textContent = 'Passwords do not match';
    }
  });
})();
