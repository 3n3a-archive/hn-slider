const { getLinkPreview } = require('link-preview-js')
const fetch = require('cross-fetch');

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

async function getOG(url) {
    let res = await fetch(`https://v1.nocodeapi.com/123123/link_preview/iBYcXGNUXMyqzPbn?url=${url}`)
    let json = await res.json()
    return json
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

async function createOutputLP2(hnPosts) {
    for (const post of hnPosts) {
        let lp = await getOG(post.url)
        post.image_url ? post.image_url : 
            lp.image ? post.image_url = lp.image : post.image_url = lp.logo
        lp.description ? post.description = lp.description : post.description = post.domain
    }
    return hnPosts
}

module.exports = {
    loadHN,
    createOutput
}