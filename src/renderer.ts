import "./ui/render";

var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

// Build our new menu
var menu = new Menu();
menu.append(new MenuItem({
    label: 'Delete',
    click: () => {
        // Trigger an alert when menu item is clicked
        alert('Deleted');
    }
}));
menu.append(new MenuItem({
    label: 'More Info...',
    click: () => {
        // Trigger an alert when menu item is clicked
        alert('Here is more information');
    }
}));

// Add the listener
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.js-context-menu').addEventListener('click', (event: MouseEvent) => {
        menu.popup(remote.getCurrentWindow());
    });
});
