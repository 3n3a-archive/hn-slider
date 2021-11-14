https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

docker build . -t 3n3a/hn-slider

docker pull 3n3a/hn-slider

docker run -p 9062:8000 -d 3n3a/hn-slider
