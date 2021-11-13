const {getLinkPreview} = require('link-preview-js')
const express = require('express')
const cors = require('cors')
const {getHN} = require('./lib');
const Bree = require('bree');

const bree = new Bree ({
  jobs: [
    {
      name: "updateHN",
      timeout: '1s',
      interval: '5m'
    }
  ]
})
const app = express()
const port = 8000
let savePath = "./hnposts.json"

app.use(express.static(__dirname + '/public'))
app.use(cors())
app.set('view engine', 'hbs');
app.set('views', __dirname + '/templates');

app.get('/lp/', (req, res) => {
  let url = req.query.q
  let key = req.query.key
  if (url != null && url != '' && url != ' ') {
    getLinkPreview(url).then((data) =>
      res.json(data)
    );
  } else {
    res.send("Error")
  }
  
})

app.get('/hn/lp', async (req, res) => {
  res.json(getHN(savePath))
})

app.get('/', async (req, res) => {
  res.render('index', {posts: getHN(savePath), ModalTitle: "User Manual", ModalContent: "This unique Hackernews Client allows you to not only read what's going on, but also to see (with images). <br>If you just want to get to the next card <strong>Swipe Left</strong>, but if you are interested in reading more about a post <strong>Swipe Right</strong> and the link to that post will open in a new tab."})
})

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`)
  bree.start()
})
