const { getLinkPreview } = require('link-preview-js')
const fetch = require('cross-fetch');
const fs = require('fs');

async function loadHN(type = "news", page = 1) { 
    let options = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    }
    let baseUrl = 'https://hackerfeed.dev/' + type + '?page=' + page
    let res = await fetch(baseUrl)
    let json = await res.json();
    return json;
}

function getHN(savePath) {
    let rawdata = fs.readFileSync(savePath);
    let posts = JSON.parse(rawdata);
    return posts;
}

async function saveHN(posts, savePath) {
    let data = JSON.stringify(posts);
    fs.writeFileSync(savePath, data);
}

async function updateHN(savePath) {
    hnPosts_raw = await loadHN();
    hnPosts_wData = await createOutput(hnPosts_raw);
    await saveHN(hnPosts_wData, savePath)
}

async function createOutput(hnPosts) {
    for (const post of hnPosts) {
        if (post.url != undefined || post.url != '') {
            try {
                let data = await getLinkPreview(post.url, {
                    imagesPropertyType: "og",
                    headers: {
                      "user-agent": "Twitterbot", 
                    },
                    timeout: 100000
                  })

                if (post.image_url != undefined) {
                    continue
                } else if (data.hasOwnProperty("images")) {
                    post.image_url = data.images[0]
                } else {
                    post.image_url = "https://www.google.com/s2/favicons?domain="+post.domain
                }

                if (data.hasOwnProperty("description")) {
                    post.description = data.description
                } else {
                    post.description = post.domain
                }
            } catch (error) {
                console.log(`get Link outer catch ${error}`)
            }
        } 
    }
    return hnPosts
}

module.exports = {
    updateHN,
    getHN
}