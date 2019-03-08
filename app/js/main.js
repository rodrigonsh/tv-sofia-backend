var playlists = null
var dirKeys = []
var local = true
var key = 0
var lastKey = null
var $video = q('video')
var $iframe = q('iframe')
var bag = []
var schedule = []
var firstTap = true;

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

function refreshKey()
{

  key = 0
  let now = moment();
  let td = now.format("YYYY-MM-DD ");
  
  for( var i=0; i < schedule.length; i++ )
  {
    
    let s = schedule[i]
     
    let start = moment( td + s.start+':00' )
    let end = moment( td + s.end+':00' )
    
    if ( s.week[ now.day() ] != "0" )
    {
      if ( now.isBetween(start, end) )
      {
        
        //console.log( dirKeys.indexOf(s.folder), s.folder );
        
        if (dirKeys.indexOf(s.folder) > -1)
        {
          key = key | 1 << dirKeys.indexOf( s.folder );
        }
        
        else  console.error(s.folder, 'not in playlist');
                
      }
    }
    
    
    
  }
  
  if ( key != lastKey )
  {
    
    bag = []
  
    for( var i=0; i < dirKeys.length; i++ )
    {
      if ( checkBoolean(key, i) )
      {
        console.log(i, dirKeys[i]);
        bag = bag.concat( playlists[dirKeys[i]] )
      }
    }
    
    shuffle(bag);
    
    lastKey = key
    
  }  
  
  console.log("refreshKey", key, bag.length, 'videos to play');
  
}




function playNext()
{
 
  $video.setAttribute('poster', '/img/loading.gif');
  console.log('playNext:', bag.length);
  
  bag.push( bag.shift() )
  
  
  let movie = bag[0]
  
  console.log("playNext movie", movie)
  
  if ( local )
  {
    $video.src = "/v/"+movie
    
    if (!firstTap) $video.play();
  }
  
  else
  {
    var partes = movie.split(".");
    
    $iframe.src= "https://www.youtube.com/embed/"+code
  }
  
}


setInterval(refreshKey, 60*1000)

$video.addEventListener('ended', playNext)
$video.addEventListener('error', playNext)

$video.addEventListener('click', function()
{
  
  if (firstTap)
  {
   $video.play();
   firstTap = false;
  }
  
})

addEventListener('keyup', function(ev)
{
  if( ev.which != 32 ) playNext();
})

addEventListener('playlistsReady', function()
{
  
  if (local) q('body').classList.add('local');
  else q('body').classList.remove('local');
  
  dirKeys = Object.keys(playlists)
  for( var i=0; i < dirKeys.length; i++ )
  {
    let list = playlists[dirKeys[i]]
    for( var j=0; j < list.length; j++  )
    {
      list[j] = dirKeys[i]+"/"+list[j]
    }
    
    shuffle(playlists[dirKeys[i]]);
    
  }
  
  playNext();
  
})

function updatePlaylists()
{
  fetch("/playlists", {mode: 'cors'})
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
    alert(error);
  })
}



addEventListener('playlistsReady', function()
{
  
  if (local) q('body').classList.add('local');
  else q('body').classList.remove('local');
  
  console.log('helloe');
  
})



function program( weekdays, start, end, folder )
{
  
  schedule.push
  ({
    week: weekdays,
    start: start,
    end: end,
    folder: folder    
    
  })
  
  
  refreshKey();
  
}

if (localStorage.getItem('playlists'))
{
  playlists = JSON.parse(localStorage.getItem('playlists'))
  emit('playlistsReady');
}

updatePlaylists();
