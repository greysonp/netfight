$(document).ready(function() {
    $('#js-fight').click(function() {
        chrome.runtime.sendMessage({ 'action': 'gotoNetfight' });
    });
});