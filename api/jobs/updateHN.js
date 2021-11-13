const {updateHN } = require("../lib")

async function main() {
    await updateHN("./hnposts.json")
}

main()