var playlists = null
var local = true
var key = 1
var lastKey = null
var $video = q('video')
var $iframe = q('iframe')
var bag = []



//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function playNext()
{
  
  if ( key != lastKey )
  {
    
    bag = []
  
    let keys = Object.keys(playlists)
    for( var i=0; i < keys.length; i++ )
    {
      if ( checkBoolean(key, i) )
      {
        bag = bag.concat( playlists[keys[i]] )
      }
    }
    
    shuffle(bag);
    
    lastKey = key
    
  }  
  
  
  
  bag.push( bag.shift() )
  
  let movie = bag[0]
  
  console.log(movie)
  
  if ( local )
  {
    $video.src = "http://localhost:3000/v/"+movie
  }
  
  else
  {
    var partes = movie.split(".");
    
    $iframe.src= "https://www.youtube.com/embed/"+code
  }
  
}

$video.addEventListener('ended', playNext)
$video.addEventListener('error', playNext)
$video.addEventListener('click', playNext)
addEventListener('keyup', playNext)

addEventListener('playlistsReady', function()
{
  
  if (local) q('body').classList.add('local');
  else q('body').classList.remove('local');
  
  let keys = Object.keys(playlists)
  for( var i=0; i < keys.length; i++ )
  {
    let list = playlists[keys[i]]
    for( var j=0; j < list.length; j++  )
    {
      list[j] = keys[i]+"/"+list[j]
    }
    
    shuffle(playlists[keys[i]]);
    
  }
  
  
  playNext();
  
})

function updatePlaylists()
{
  fetch("http://localhost:3000/playlists", {mode: 'cors'})
  .then(function(response)
  {
    return response.json();
  })
  .then(function(data)
  {
    playlists = data
    localStorage.setItem('playlists', JSON.stringify(playlists));
    console.log('playlists updated with', data);
    local = true
    emit('playlistsReady');
  })
  .catch(function(error)
  {
    local = false;
    // TODO; load cached playlists.json 
    alert(error);
  })
}

if (localStorage.getItem('playlists'))
{
  playlists = JSON.parse(localStorage.getItem('playlists'))
  emit('playlistsReady');
}
else
{
  updatePlaylists();
}

addEventListener('playlistsReady', function()
{
  
  if (local) q('body').classList.add('local');
  else q('body').classList.remove('local');
  
  console.log('helloe');
  
})
