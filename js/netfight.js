var IMDB_API =  "http://www.omdbapi.com/?tomatoes=true";
var metaCritic_Movie = "http://www.metacritic.com/movie/";
var metaCritic_TV = "http://www.metacritic.com/tv/";

var _stage;

$(document).ready(function() {
    // Grab all of our netfighters from storage and add them to the page
    chrome.storage.local.get('netfight', function(obj) {
        for (var i = 0; i < obj['netfight'].length; i++) {
            makeFighter(obj['netfight'][i]);
            getRatings(obj['netfight'][i].title, obj['netfight'][i].id);
        }
        preloadNetfight();
    });
});

function enableNetfight() {

}

function makeFighter(o) {
    // Build all of our fighters
    var $div = $('<div></div>', {
        'class': 'netbox',
        'id': 'netbox-' + o.id
    });
    var $img = $('<img></img>', {
        'src': o.img
    });
    var $h2 = $('<h2></h2>');
    var $title = $('<a></a>', {
        'text': o.title,
        'href': o.link
    });

    var $removeButton = $('<a></a>', {
        'href': '#',
        'class': 'remove-btn',
        'text': 'Remove',
        'data-id': o.id
    });
    $removeButton.click(removeNetboxClick);

    var genre = '<div><strong>Genre(s): </strong><span class="genre"></span></div>';
    var netflix = '<div><strong>Netflix: </strong><span class="netflix">' + o.rating + ' out of 5</span></div>';
    var imdb = '<div><strong>IMDB: </strong><span class="imdb"></span></div>';
    var metacritic = '<div><strong>Metacritic: </strong><span class="metacritic"></span></div>';

    // Append everything together
    $h2.append($title);
    $div.append($h2);
    $div.append($img);
    $div.append($removeButton);
    $div.append(genre);
    $div.append(netflix);
    $div.append(imdb);
    $div.append(metacritic);

    // Add it to the page
    $('.netbox-container').append($div);
}


function getRatings(title, id) {
    $.get(makeIMDBURL(title),function(result) {
        try{
            result = JSON.parse(result);
        }
        catch(e) {
          result = {
                'Response' : 'False',
            };
        }
        
        if (result.Response === 'False') {
            return null
        }
        
        var rating = {'Title': title, 'IMDBScore': result.imdbRating, 'Genre': result.Genre};
        imdbPrint(rating, id);

        //Finds if the title is a movie or a TV show and makes the appropriate request 
        //to Mega Critic
        var metaTitle = title.toLowerCase().replace(/ /g,"-");
        //Removes any punctuation
        metaTitle = metaTitle.replace(/[\.,\/#!$%\^&\*;:{}=_`~()]/g,"");
        //Corrects any mistakes made by the above two
        metaTitle = metaTitle.replace(/--/g,"-");

        if(result.tomatoMeter == "N/A")
            getMetaCriticTVRatings(metaTitle, id);
        else
            getMetaCriticMovieRatings(metaTitle, id);
    });
}


function getMetaCriticMovieRatings(title, id) {
    $.get(makeMetaCriticMovieURL(title),function(result) {
        metaRatings = metaCriticCallBack(result,title,false);
        metaPrint(metaRatings, id);
    });
}


function getMetaCriticTVRatings(title, id) {
    $.get(makeMetaCriticTVURL(title),function(result) {
        metaRatings = metaCriticCallBack(result,title,true);
        metaPrint(metaRatings, id);
    });
}


function imdbPrint(ratingStats, id) {
    $('#netbox-' + id + ' .imdb').text(ratingStats.IMDBScore + ' out of 10');
    $('#netbox-' + id + ' .genre').text(ratingStats.Genre);
}

function metaPrint(ratingStats, id) {
    $('#netbox-' + id + ' .metacritic').text(ratingStats.MetaRating + ' out of 100');
}



function metaCriticCallBack(metaPage,title,isTV) {
    var searchText = "ratingValue"
    var position = metaPage.search(searchText);
    var rating = parseFloat(metaPage.substr((position + searchText.length + 2),2));

    if(isTV)
        searchText = 'metascore_w user large tvshow positive';
    else
        searchText = 'metascore_w user large movie positive';
    
    position = metaPage.search(searchText);
    var score = parseFloat(metaPage.substr((position + searchText.length + 2),3));

    return numbers = {'Title': title, 'MetaRating':rating, 'MetaScore':score};
}


function makeMetaCriticMovieURL(title) {
    url = metaCritic_Movie + title;
    return url;
}



function makeMetaCriticTVURL(title) {
    url = metaCritic_TV + title;
    return url;
}


function makeIMDBURL(title) {
    url = IMDB_API + '&t=' + title;
    return url;
}

function removeNetboxClick(e) {
    e.preventDefault();
    var id = $(this).data('id');
    $('#netbox-' + id).remove();
    chrome.storage.local.get('netfight', function(obj) {
        var a = obj['netfight'];
        for (var i = a.length - 1; i >= 0; i--) {
            if (a[i].id == id) {
                a.splice(i, 1);
                break;
            }
        }
        chrome.storage.local.set(obj);
    });
}