import { deleteAccount } from '../auth/manage_account.js';

const mutationObserver = new MutationObserver(() => {
  const deleteAccountBtn = document.getElementById('delete-account-btn');
  const emailInput = document.getElementById('delete-account-email');

  deleteAccountBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    deleteAccount(emailInput.value).then(() => (
      window.location.reload()
    ));
  });
});

mutationObserver.observe(document.body, { childList: true });
