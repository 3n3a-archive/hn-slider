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
    if (url != null && url != '') {
        let res = await getLinkPreview(url)
        return res;
    } else {
        console.error("Emtpy URL provided to getOG")
        return
    }
}

async function createOutput(hnPosts) {
    for (const post of hnPosts) {
        let lp = {description: "testtestset", images: ["https://source.unsplash.com/random/600x300"]}//await getOG(post.url)
        post.image_url ? post.image_url : post.image_url = lp.images[0]
        lp.description ? post.description = lp.description : post.description = post.domain
    }
    return hnPosts
}

module.exports = {
    loadHN,
    createOutput
}