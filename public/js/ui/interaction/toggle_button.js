window.addEventListener('load', () => {
  const toggleBtnEls = document.querySelectorAll('.toggle-btn');

  const togglefyBtn = (element) => {
    let isToggled = false;

    function toggleBtn() {
      if (isToggled) {
        isToggled = false;
        element.classList.remove('active');
      } else {
        isToggled = true;
        element.classList.add('active');
      }
    }

    element.addEventListener('click', (e) => {
      e.preventDefault();
      toggleBtn();
    });

    return {
      getState() {
        return isToggled;
      },
    };
  };

  toggleBtnEls.forEach((btn) => togglefyBtn(btn));
});
