import { isEmail } from './utilities.js';

window.addEventListener('load', () => {
  const loginBtnEl = document.getElementById('login-btn');
  const emailInputEl = document.getElementById('email-input');
  const passwordInputEl = document.getElementById('password-input');
  const errorMessageEl = document.getElementById('error-message');

  loginBtnEl.addEventListener('click', (e) => {
    if (!isEmail(emailInputEl.value)) {
      e.preventDefault();
      errorMessageEl.textContent = 'Please enter a valid email address.';
    }

    if (passwordInputEl.value === '') {
      e.preventDefault();
      errorMessageEl.textContent = 'You email or password is incorrect.';
    }
  });
});
