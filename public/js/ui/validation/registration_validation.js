import { isEmail, stringsMatch } from './utilities.js'

window.addEventListener('load', () => {
  const submitRegistrationBtn = document.getElementById('submit-registration-btn');
  const validationMessageEmail = document.getElementById('validation-message-email');
  const validationMessagePassword = document.getElementById('validation-message-password');

  const getPasswordInputs = () => {
    const registerPasswordInputs = document.getElementsByClassName('register-password-field');
    return {
      inputOne: registerPasswordInputs[0],
      inputTwo: registerPasswordInputs[1],
    };
  };

  const getEmailInput = () => (
    document.getElementById('register-email-field')
  );

  submitRegistrationBtn.addEventListener('click', (e) => {
    const { inputOne, inputTwo } = getPasswordInputs();
    const emailInput = getEmailInput();

    if (!isEmail(emailInput.value)) {
      e.preventDefault();
      validationMessageEmail.textContent = 'Please enter a valid email.';
      validationMessageEmail.style.display = 'block';
      emailInput.addEventListener('input', () => {
        const emailInput = getEmailInput();
        if (isEmail(emailInput.value)) {
          validationMessageEmail.textContent = '';
          validationMessageEmail.style.display = 'none';
        }
      });
    }

    if (!stringsMatch(inputOne.value, inputTwo.value)) {
      const { inputOne, inputTwo } = getPasswordInputs();
      e.preventDefault();
      validationMessagePassword.textContent = 'Password fields must match.';
      validationMessagePassword.style.display = 'block';
      inputOne.addEventListener('input', () => {
        const { inputOne, inputTwo } = getPasswordInputs();
        if (stringsMatch(inputOne.value, inputTwo.value)) {
          validationMessagePassword.textContent = '';
          validationMessagePassword.style.display = 'none';
        }
      });

      inputTwo.addEventListener('input', () => {
        const { inputOne, inputTwo } = getPasswordInputs();
        if (stringsMatch(inputOne.value, inputTwo.value)) {
          validationMessagePassword.textContent = '';
          validationMessagePassword.style.display = 'none';
        }
      });
    }
  });
});
