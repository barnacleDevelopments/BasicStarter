window.addEventListener('load', () => {
  const optionMenu = document.getElementById('option-menu');
  const menuShadow = document.getElementById('option-menu-shadow');
  const menuList = document.getElementById('option-menu-list');

  optionMenu?.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-user')) {
      e.preventDefault();
      menuList.style.display = 'block';
      menuShadow.style.display = 'block';
    } else {
      menuList.style.display = 'none';
      menuShadow.style.display = 'none';
    }
  });

  menuShadow?.addEventListener('click', () => {
    menuList.style.display = 'none';
    menuShadow.style.display = 'none';
  });
});
