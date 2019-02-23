const express = require('express')
const app = express()
const cors = require('cors')
const fs = require('fs')
const port = 3000

app.use(cors())

app.use('/v', express.static('videos'))
app.use('/', express.static('app'))

app.get('/playlists', function(req, res)
{

  var keys = fs.readdirSync("videos")
  var ret = {}
  
  for( var i=0; i < keys.length; i++ )
  {
    ret[keys[i]] = fs.readdirSync( "videos/"+keys[i] )
  }
  
  res.send(ret);
  
})



app.listen(port, () => console.log(`TV SOFIA http://localhost:${port}`))
