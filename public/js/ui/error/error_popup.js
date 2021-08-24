const appendErrorNotification = (message) => {
  const createErrorEl = () => {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-popup';
    const errorText = document.createTextNode(message);
    errorEl.appendChild(errorText);
    setTimeout(() => {
      errorEl.remove();
    }, 6000);
    return errorEl;
  };

  document.body.append(createErrorEl());
};

export default appendErrorNotification;
