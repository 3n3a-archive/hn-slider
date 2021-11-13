# hn-slider

## Credits

- [Tinder Cards - Codepen]()
- [Modal - CSS Tricks](https://css-tricks.com/considerations-styling-modal/)


## Startup Script

needed:
- screen
- git
- nodejs npm
- net-tools

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
