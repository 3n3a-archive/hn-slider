 const Bree = require('bree')
const bree = new Bree({jobs : [
      {
        name : 'app',
        interval : '5m'
      }
    ]
  })
bree.start()
