# hn-slider

A Hacker news client, which pulls its data from <hackerfeed.dev>'s API and combines it with OpenGraph descriptions and images if none already present on Hacker news
Finally the Frontend is built on the server for improved performance. 

## Todo

- [] Add OpenGraph Data so looks nice when sharing
- [] Add title and link to GH
- [] Fix bugs with sliding on iOS
- [] Create a dedicated API
- [] Create a version like hnfee_mdb, allow switching

## Credits

- [Tinder Cards - Codepen]()
- [Modal - CSS Tricks](https://css-tricks.com/considerations-styling-modal/)

## Startup Script

Packages needed:
- screen
- git
- nodejs npm
- net-tools

`start.sh`
```shell
killall screen
cd /root/hn-slider/api
git fetch
git reset --hard HEAD
git merge '@{u}'
npm i
screen -d -m node index
sleep 1
netstat -tulpn
```
