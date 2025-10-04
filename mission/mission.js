const themeSelector = document.querySelector('#theme-select');

function changeTheme() {
    const logo = document.querySelector('.logo');
    
    if (themeSelector.value === 'dark') {
        document.body.classList.add('dark');
        logo.src = 'byui-logo_white.webp';
    } else {
        document.body.classList.remove('dark');
        logo.src = 'byui-logo_blue.webp';
    }
}

changeTheme();

themeSelector.addEventListener('change', changeTheme);
