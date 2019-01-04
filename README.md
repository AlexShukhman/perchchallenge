# <img src="public/images/logo.png" height=45> perchchallenge

Coding Challenge for Perch

## To Install

```sh
npm install
```

## To Start

```sh
npm start
```

## Notes

* Using most modern NPM and Node
* Using CSS from [Perch](www.perchinteractive.com)
* Using Google CDN for Lato font
* Using Socket.io for websockets

## Selected Project Structure

* public/
  * images/
  * output/  <-- here lies location data
  * scripts/  <-- all JavaScript separate for clarity
  * stylesheets/  <-- `custom.css` includes Perch CSS
* views/  <-- `*.pug` files and corresponding HTML for clarity
* index.js  <-- Server setup and sockets
* package.json  <-- Includes start script and required modules
* routes.js  <-- For all HTTP interaction