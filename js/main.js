$(document).ready(init);

function init() {

    // I wish there was a better way to do this, but Netflix seems to re-use the
    // same content div, and upon hover it queries for the movie info, re-setting
    // the content of the popup
    setInterval(ensureButtonExists, 50);

    window.location.onhashchange = function() {
        console.log('change');
    }
}

function netfightClick(e) {
    var $parent = $(this).parents('.agMovie');
    var id = $parent.attr('id').substring(3);
    var img = $('.vbox_' + id + ' img').attr('src');
}

function ensureButtonExists() {
    if ($('.bobMovieContent .netfight-btn').length == 0) {
        $('.bobMovieContent').append($('<button></button>', {
            'text': 'Netfight',
            'class': 'netfight-btn'
        }));
        $('.bobMovieContent .netfight-btn').click(netfightClick);
    }
}