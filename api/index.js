const {getLinkPreview} = require('link-preview-js')
const express = require('express')
const cors = require('cors')
const {loadHN, createOutput} = require('./lib');

const app = express()
const port = 8000

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

app.get('/', async (req, res) => {
  let hnPosts_raw = await loadHN();
  let hnPosts_wData = await createOutput(hnPosts_raw);

  res.render('index', {posts: hnPosts_wData})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
