var IMDB_API =  "http://www.omdbapi.com/?tomatoes=true";
var megaCritic_Movie = "http://www.metacritic.com/movie/";
var megaCritic_TV = "http://www.metacritic.com/tv/";


$(document).ready(function() {
    // Grab all of our netfighters from storage and add them to the page
    chrome.storage.local.get('netfight', function(obj) {
        for (var i = 0; i < obj['netfight'].length; i++) {
            makeFighter(obj['netfight'][i]);
            getRatings(obj['netfight'][i].title);
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



function getRatings(title){
    $.get(makeIMDBURL(title),function(result){
        try{
            result = JSON.parse(result);
        }
        catch(e){
          result = {
                'Response' : 'False',
            };
        }
        
        if (result.Response === 'False'){
            return null
        }
        
        var rating = {'Title': title, 'IMDBScore': result.imdbRating, 'Genre': result.Genre};
        imdbPrint(rating);

        //Finds if the title is a movie or a TV show and makes the appropriate request 
        //to Mega Critic
        var megaTitle = title.toLowerCase().replace(/ /g,"-");
        //Removes any punctuation
        megaTitle = megaTitle.replace(/[\.,\/#!$%\^&\*;:{}=_`~()]/g,"");
        //Corrects any mistakes made by the above two
        megaTitle = megaTitle.replace(/--/g,"-");

        if(result.tomatoMeter == "N/A")
            getMegaCriticTVRatings(megaTitle);
        else
            getMegaCriticMovieRatings(megaTitle);
    });
}


function getMegaCriticMovieRatings(title){
    $.get(makeMegaCriticMovieURL(title),function(result){
        megaRatings = megaCriticCallBack(result,title,false);
        megaPrint(megaRatings);
    });
}


function getMegaCriticTVRatings(title){
    $.get(makeMegaCriticTVURL(title),function(result){
        megaRatings = megaCriticCallBack(result,title,true);
        megaPrint(megaRatings);
    });
}


function imdbPrint(ratingStats){
    var $div = $('<div></div>');
    var $p1 = $('<p></p>', {'text': 'Title: ' + ratingStats.Title});
    var $p2 = $('<p></p>', {'text': 'IMDBScore: ' + ratingStats.IMDBScore});
    var $p3 = $('<p></p>', {'text': 'Genre: ' + ratingStats.Genre});

     // Append everything together
    $div.append($p1);
    $div.append($p2);
    $div.append($p3);

    // Add it to the page
    $('body').append($div);
}

function megaPrint(ratingStats){
    var $div = $('<div></div>');
    var $p1 = $('<p></p>', {'text': 'Title: ' + ratingStats.Title});
    var $p2 = $('<p></p>', {'text': 'MegaRating: ' + ratingStats.MegaRating});
    var $p3 = $('<p></p>', {'text': 'MegaScore: ' + ratingStats.MegaScore});

     // Append everything together
    $div.append($p1);
    $div.append($p2);
    $div.append($p3);

    // Add it to the page
    $('body').append($div);
}



function megaCriticCallBack(megaPage,title,isTV){
    var searchText = "ratingValue"
    var position = megaPage.search(searchText);
    var rating = parseFloat(megaPage.substr((position + searchText.length + 2),2));

    if(isTV)
        searchText = 'metascore_w user large tvshow positive';
    else
        searchText = 'metascore_w user large movie positive';
    
    position = megaPage.search(searchText);
    var score = parseFloat(megaPage.substr((position + searchText.length + 2),3));

    return numbers = {'Title': title, 'MegaRating':rating, 'MegaScore':score};
}


function makeMegaCriticMovieURL(title){
    url = megaCritic_Movie + title;
    return url;
}



function makeMegaCriticTVURL(title){
    url = megaCritic_TV + title;
    return url;
}


function makeIMDBURL(title){
    url = IMDB_API + '&t=' + title;
    console.log(url);
    return url;
}