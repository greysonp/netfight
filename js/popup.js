$(document).ready(function() {
    $('#js-fight').click(function() {
        chrome.runtime.sendMessage({ 'action': 'gotoNetfight' });
    });

    chrome.storage.local.get('netfight', function(obj) {
        for (var i = 0, len = obj['netfight'].length; i < len; i++) {
            makeFighter(obj['netfight'][i]);
        }
    });
});

function makeFighter(o) {
    // Build all of our fighters
    var $li = $('<li></li>', {
        'class': 'fighter',
        'id': o.id
    });
    $li.mouseenter(addOverlay);
    $li.mouseleave(removeOverlay);
    $li.click(removeFighter);
    var $div = $('<div></div>', {
        'class': 'fighterInner'
    });

    $.ajax({
        url: "http://www.omdbapi.com/?t=" + o.title,
        dataType: 'jsonp',
        success: function(o) {
            console.log("Success?");
            return function(data) {
                console.log("here");
                console.log(o);
                console.log(data);
            }
        },
        error: function(err) {
            console.log(err);
        }
    });

    if(!o.img) {
        //add call to IMDB to fetch image
        

        //for now, throw in a placeholder
        var $img = $('<img></img>', {
            'src': '../img/no_img_placeholder.png'
        });

    }
    else {
        var $img = $('<img></img>', {
        'src': o.img
        });
    }

    $div.append($img);    
    $li.append($div);

    // Add it to the page
    $('ul.fighters').append($li);
}

function addOverlay() {
    var $div = $('<div></div>', {
        'class': 'fighterOverlay'
    });
    var $p = $('<p>Remove</p>');
    $div.append($p);
    $(this).append($div);
}

function removeOverlay() {
    $('li.fighter div').remove('.fighterOverlay');
}

function removeFighter() {
    var li = this;
    chrome.storage.local.get('netfight', function(obj) {
        for (var i = 0, len = obj['netfight'].length; i < len; i++) {
            if(obj['netfight'][i].id === $(li).attr('id')) {
                var nArr = obj['netfight'];
                nArr.splice(i, 1);
                chrome.storage.local.set({'netfight': nArr});
                $(li).remove();
            }
        }
    });
}