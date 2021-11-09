async function loadHN(type = "news", page=1) {
  console.log('started loading posts')
  let e = document.getElementById('cardholder')
  let baseUrl = 'https://hackerfeed.dev/'+type+'?page='+page
  fetch(baseUrl, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    })
    .then(res => res.json())
    .then(async (data) => {
      for(const post of data) {
        // console.log(post)
        let lp = await getLinkPreview(post.url)
        e.innerHTML += `<div class="tinder--card" data-url="${post.url}" data-title="${post.title}"><img src="${post.image_url ? post.image_url : lp.images[0]}"><h3>${post.title}</h3><p>${lp.description ? lp.description : `<a href="${post.url}">${post.domain}</a>`}</p></div>`
      }
      main()
    })
  }

async function getLinkPreview(url) {
  let baseAPI = window.location.origin + '/lp'
  let apiKey = "3756e0341fa1edf43b23bff4e09baad1"
  let res = await fetch(`${baseAPI}?key=${apiKey}&q=${url}`)
  let json = await res.json()
  return json
}

async function getLinkPeek(url) {
  try {
    let apiKey = "987bed17-eba9-4fd1-b691-08187e30e847"
    let res = await fetch(`https://api.peekalink.io/`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'omit',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      headers: {
        'X-API-Key':apiKey, 
        'Content-Type':'application/json'
      }, 
      body: JSON.stringify({
        "link": url
      })
    })
    let json = await res.json()
    return json
  } catch (error) {
    return null
  }
}

function initCards(card, index) {
  var newCards = document.querySelectorAll('.tinder--card:not(.removed)');
  var allCards = document.querySelectorAll('.tinder--card');
  var tinderContainer = document.querySelector('.tinder');

  newCards.forEach(function (card, index) {
    card.style.zIndex = allCards.length - index;
    card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + 30 * index + 'px)';
    card.style.opacity = (10 - index) / 10;
  });
  
  tinderContainer.classList.add('loaded');
}

function createButtonListener(love) {
  return function (event) {
    var cards = document.querySelectorAll('.tinder--card:not(.removed)');
    var moveOutWidth = document.body.clientWidth * 1.5;

    if (!cards.length) return false;

    var card = cards[0];

    card.classList.add('removed');

    if (love) {
      card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';
      window.open(card.dataset.url,card.dataset.title)
    } else {
      card.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';
    }

    initCards();

    event.preventDefault();
  };
}

loadHN();

function main() {
  var tinderContainer = document.querySelector('.tinder');
  var allCards = document.querySelectorAll('.tinder--card');
  var nope = document.getElementById('nope');
  var love = document.getElementById('love');
  initCards();

  allCards.forEach(function (el) {
    var hammertime = new Hammer(el);

    hammertime.on('pan', function (event) {
      el.classList.add('moving');
    });

    hammertime.on('pan', function (event) {
      if (event.deltaX === 0) return;
      if (event.center.x === 0 && event.center.y === 0) return;

      tinderContainer.classList.toggle('tinder_love', event.deltaX > 0);
      tinderContainer.classList.toggle('tinder_nope', event.deltaX < 0);

      var xMulti = event.deltaX * 0.03;
      var yMulti = event.deltaY / 80;
      var rotate = xMulti * yMulti;

      event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
    });

    hammertime.on('panend', function (event) {
      el.classList.remove('moving');
      tinderContainer.classList.remove('tinder_love');
      tinderContainer.classList.remove('tinder_nope');

      var moveOutWidth = document.body.clientWidth;
      var keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

      event.target.classList.toggle('removed', !keep);

      if (keep) {
        event.target.style.transform = '';
      } else {
        var endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
        var toX = event.deltaX > 0 ? endX : -endX;
        var endY = Math.abs(event.velocityY) * moveOutWidth;
        var toY = event.deltaY > 0 ? endY : -endY;
        var xMulti = event.deltaX * 0.03;
        var yMulti = event.deltaY / 80;
        var rotate = xMulti * yMulti;

        event.target.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';

        if (toX > 0) {
          // love
          window.open(event.target.dataset.url,event.target.dataset.title)
        } else {
          // no love
        }
        initCards();
      }
    });
  });

  var nopeListener = createButtonListener(false);
  var loveListener = createButtonListener(true);

  nope.addEventListener('click', nopeListener);
  love.addEventListener('click', loveListener);
}
