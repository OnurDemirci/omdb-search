storage = Object.entries(localStorage);
locals = [];
for (var i = 0; i < storage.length; i++) {
  locals.push(storage[i][0]);
}
function checkFavorites() {
  var x = document.getElementsByClassName("heart");
  for (var i = 0; i < x.length; i++) {
    if (locals.includes(x[i].id)){
      $("#"+x[i].id).html('<i class="fa fa-heart" aria-hidden="true"></i>');
      $("#"+x[i].id).addClass("liked");
    }
  }
}


function like(id){
  if($("#"+id).hasClass("liked")){
    $("#"+id).html('<i class="fa fa-heart-o" aria-hidden="true"></i>');
    $("#"+id).removeClass("liked");
    localStorage.removeItem(id);
    //location.reload();
  }else{
    $("#"+id).html('<i class="fa fa-heart" aria-hidden="true"></i>');
    $("#"+id).addClass("liked");
    localStorage.setItem(id,"Favorite");
    //location.reload();
  }
}

function getRatings(d,s,id){
  var js,stags=d.getElementsByTagName(s)[0];
  if(d.getElementById(id)){
  }
  js=d.createElement(s);
  js.id=id;
  js.class="query";
  js.src="https://ia.media-imdb.com/images/G/01/imdb/plugins/rating/js/rating.js";
  stags.parentNode.insertBefore(js,stags);
}
var link;
function getInputs(){
    film_name = document.getElementById("filmName").value;
    film_year = document.getElementById("filmYear").value;
    film_type = document.getElementById("type").value;
    if ((film_year!=="")&&(film_type!=="")) {
      link = "https://www.omdbapi.com/?apikey=95440045&s="+film_name+"&y="+film_year+"&type="+ film_type;
      link = link.replace(/\s+/g, '+');
    //  console.log(link);
    //  console.log("yes");
    }
    else if ((film_year==="")&&(film_type!=="")) {
      link = "https://www.omdbapi.com/?apikey=95440045&s="+film_name+"&type="+film_type;
      link = link.replace(/\s+/g, '+');
    //  console.log(link);
      console.log("no year given");
    }
    else if ((film_year!=="")&&(film_type==="")) {
      link = "https://www.omdbapi.com/?apikey=95440045&s="+film_name+"&y="+film_year;
      link = link.replace(/\s+/g, '+');
      //console.log(link);
      console.log("no type given");
    }
    else {
      link = "https://www.omdbapi.com/?apikey=95440045&s="+film_name;
      link = link.replace(/\s+/g, '+');
      //console.log(link);
      console.log("No year or type given.");
    }
}

function callapi() {
  $('[id^="imdb-jsonp"]').remove();
  document.getElementById("results").innerHTML = "";
  $.getJSON(link).then(function(response){
    var ids = [];
    var titles = [];
    var years = [];
    var genres = [];
    var posters = [];
    var results = response.Search;
    for (var i = 0; i < results.length; i++) {
        titles.push(results[i].Title);
        ids.push(results[i].imdbID);
        posters.push(results[i].Poster);
        years.push(results[i].Year);
      }
      for (var i = 0; i < ids.length; i++) {
        document.getElementById("results").innerHTML +=
        '<div class="result-container bg-light">'+
        '<div class="result">'+
        "<img src='"+posters[i]+"' onerror='imgError(this);'>"+
        "<div class='result_info'><a href='https://www.imdb.com/title/"+ids[i]+"/?ref_=plg_rt_1' target = '_blank' class='align-middle'>"+titles[i]+"</a><label> &nbsp("+years[i]+")  &nbsp;</label>"+'<span class="imdbRatingPlugin" data-user="ur111775116" data-title="'+ids[i]+'" data-style="p5"></span></div>'+
        '<span onclick=like(this.id) class="heart" id = '+ids[i]+'><i class="fa fa-heart-o" aria-hidden="true" ></i> </span>'+'</div></div>'
        //for (var i = 0; i < ids.length; i++) {
        //  document.getElementById("scores").innerHTML +='<span class="imdbRatingPlugin" data-user="ur111775116" data-title="'+ids[i]+'" data-style="p5"><a href="https://www.imdb.com/title/'+ids[i]+'/?ref_=plg_rt_1"></a></span>'
        getRatings(document,"script","imdb-rating-api");
        checkFavorites();
        }
    //  }
});
}


function callfuncs(){
  getInputs();
  callapi();
};

function imgError(image) {
    image.onerror = "";
    image.src = "images/noposter.png";
    return true;
}

function getFavorites() {
    for (var i = 0; i < locals.length; i++) {
      $.getJSON("https://www.omdbapi.com/?apikey=95440045&i="+locals[i]).then(function (favs) {
        document.getElementById("results").innerHTML +='<div class="result-container bg-light">'+'<div class="result">'+
        "<img src='"+favs.Poster+"' onerror='imgError(this);'>"+
        "<div class='result_info'><a href='https://www.imdb.com/title/"+favs.imdbID+"/?ref_=plg_rt_1' target = '_blank' class='align-middle'>"+favs.Title+"</a><label> &nbsp("+favs.Year+")  &nbsp; <strong>"+favs.imdbRating+"</strong>/10</label>"+'</div>'+
        '<span onclick=like(this.id) class="heart liked" id = '+favs.imdbID+'><i class="fa fa-heart" aria-hidden="true" ></i> </span>'+'</div></div>';
        console.log(favs);
      })
    }
}
