var IMDB_API =  "http://www.omdbapi.com/?tomatoes=true";



$(document).ready(function() {
    // Grab all of our netfighters from storage and add them to the page
    chrome.storage.local.get('netfight', function(obj) {
        for (var i = 0; i < obj['netfight'].length; i++) {
            makeFighter(obj['netfight'][i]);
        
        getRatingStats(obj['netfight'][i].title);


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


function getRatingStats(title){
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
        
        
        
        var rating = {'title': title, 'IMDBScore': result.imdbRating, 'tomatoMeter': result.tomatoMeter, 'tomatoRating': result.tomatoRating, 'tomatoUserMeter': result.tomatoUserMeter, 'tomatoUserRating': result.tomatoUserRating};
        

        ratingCallBack(rating);
    });


}


function ratingCallBack(ratingStats){
    console.log(ratingStats);
    var $div = $('<div></div>');
    var $p = $('<p></p>', {'text': 'Title:' + ratingStats.title});
    var $p2 = $('<p></p>', {'text': 'IMDBScore:' + ratingStats.IMDBScore});
    var $p3 = $('<p></p>', {'text': 'Tomato Meter:' + ratingStats.tomatoMeter + '% Tomato Rating: ' + ratingStats.tomatoRating + ' out of 10'});
    var $p4 = $('<p></p>', {'text': 'Tomato User Meter:' + ratingStats.tomatoUserMeter + '% Tomato User Rating:' + ratingStats.tomatoUserRating + ' out of 5'});

     // Append everything together
    $div.append($p);
    $div.append($p2);
    $div.append($p3);
    $div.append($p4);


    // Add it to the page
    $('body').append($div);


}


function makeIMDBURL(title){
    url = IMDB_API + '&t=' + title;
    console.log(url);
    return url;
}