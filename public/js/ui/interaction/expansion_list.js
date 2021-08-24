
window.addEventListener('load', () => {
  const expansionTriggerEls = document.querySelectorAll('.expansion-trigger')

  const expandify = (triggerEl, listEl) => {
    let expanded = false;

    function expandToggle() {
      if (expanded) {
        expanded = false;
        listEl.classList.remove('expanded');
      } else {
        expanded = true;
        listEl.classList.add('expanded');
      }
    }

    triggerEl.addEventListener('click', (e) => {
      e.preventDefault();
      expandToggle();
    });

    return {
      getStatus() {
        return expanded;
      },
    };
  };

  expansionTriggerEls.forEach((el) => expandify(el, el.nextSibling));
});
