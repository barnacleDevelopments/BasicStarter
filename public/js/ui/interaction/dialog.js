import appendErrorNotification from '../error/error_popup.js';

window.addEventListener('load', () => {
  const dialogTriggers = document.querySelectorAll('.dialog-trigger');

  const getDialog = (path) => {
    const promise = new Promise((resolve) => {
      fetch(path)
        .then((response) => {
          if (!response.ok) {
            response.json().then((data) => (
              appendErrorNotification(data.error.message)
            ));
            throw Error(response.statusText);
          }
          return response.text();
        })
        .then((data) => resolve(data));
    });
    return promise;
  };

  const createWrapper = () => {
    const wrapper = document.createElement('div');
    wrapper.className = 'dialog-shadow';
    return wrapper;
  };

  const createXButton = (elementToRemove) => {
    const xEl = document.createElement('a');
    xEl.href = '/';
    xEl.className = 'dialog-x-btn';
    const xText = document.createTextNode('X');
    xEl.appendChild(xText);
    xEl.addEventListener('click', (e) => {
      e.preventDefault();
      elementToRemove.remove();
    });
    return xEl;
  };

  const appendDialogToBody = (htmlStr) => {
    const wrapper = createWrapper();
    // create x button element
    const xEl = createXButton(wrapper);
    // append elements to wrapper
    wrapper.innerHTML = htmlStr;
    wrapper.firstElementChild.append(xEl);
    document.body.append(wrapper);
  };

  const addTriggerListener = (element) => {
    element.addEventListener('click', (e) => {
      e.preventDefault();
      const deleteDialogPath = e.target.href;
      getDialog(deleteDialogPath)
        .then((data) => appendDialogToBody(data))
        .catch((err) => console.log(err));
    });
  };

  dialogTriggers.forEach((el) => addTriggerListener(el));
});
