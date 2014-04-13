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
    // Get the reference to the popup box container
    var $parent = $(this).parents('.agMovie');

    // Get all of the movie attributes we want
    var id = $parent.attr('id').substring(3);
    var title = $parent.find('.title').text().trim();
    var link = $parent.find('.bobMovieHeader a:first').attr('href');
    var img = $('.vbox_' + id + ' img').attr('src');
    img = img.substring(0, img.length - 4);
    img += 'jpg';
    img = img.replace(/webp/, 'images');
    
    // var rating = $parent.find('span.sbmfpr').attr('class');
    // rating = parseInt(rating.split('sbmf-')[1])/10;

    var obj = {
        'id': id,
        'title': title,
        'link': link,
        'img': img
        // 'rating': rating
    }

    // Store the movie in local storage
    chrome.storage.local.get('netfight', function(old) {
        // Get the old array, or initialize it if it doesn't exist
        var oldArray = null;
        if (!old ||  Object.keys(old).length === 0)
            oldArray = [];
        else
            oldArray = old['netfight'];

        // Add our new object to the array and store it
        //oldArray.push(obj);
        addObject(oldArray, obj);
        chrome.storage.local.set({ 'netfight': oldArray });
    });
}

function addObject(arr, ele) {
    for(var i = 0; i < arr.length; ++i) {
        if(ele.id == arr[i].id) {
            return;
        }
    }
    arr.push(ele);
}

function ensureButtonExists() {
    if ($('.bobMovieContent .netfight-btn').length == 0) {
        var $wrapper = $('<div></div>', { 'class': 'btnWrap mltBtn mltBtn-s186' });
        var $link = $('<a></a>', {
            'class': 'netfight-btn svf-button svf-button-add svfb-silver addlk evo-btn'
        });
        var $inner = $('<span></span>', {
            'text': 'Netfight',
            'class': 'inr'
        })
        $link.append($inner);
        $wrapper.append($link);
        $('.bobMovieActions').append($wrapper);
        $('.bobMovieContent .netfight-btn').click(netfightClick);
    }
}