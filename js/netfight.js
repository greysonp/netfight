$(document).ready(function() {
    // Grab all of our netfighters from storage and add them to the page
    chrome.storage.local.get('netfight', function(obj) {
        for (var i = 0; i < obj['netfight'].length; i++) {
            makeFighter(obj['netfight'][i]);
        }
    });
});

function makeFighter(o) {
    console.log(o);

    // Build all of our fighters
    var $div = $('<div></div>');
    var $img = $('<img></img>', {
        'src': o.img
    });
    var $h2 = $('<h2></h2>');
    var $title = $('<a></a>', {
        'text': o.title,
        'href': o.link
    });

    // Append everything together
    $h2.append($title);
    $div.append($h2);
    $div.append($img);

    // Add it to the page
    $('body').append($div);
}