opacapp.net Website
===================

This repo contains the source code for the website [opacapp.net](https://oapcapp.net).

The website design is based on [Flat UI Free](http://designmodo.github.io/Flat-UI/) by Designmodo, which itself is based on [Twitter Bootstrap](http://getbootstrap.com/) and also uses the following libraries:

- [Font Awesome](http://fontawesome.io/)

## Build Setup

To build the website locally, you need the following requirements:

- [Jekyll](https://jekyllrb.com/)
- [Node.js / npm](https://nodejs.org/)
- [gulp](http://gulpjs.com/)

Then, run
```bash
npm install
```
to install the required Node.js packages.

You can then run either of these commands
```bash
gulp default-de
gulp default-en
```
to build and show the website locally using BrowserSync or
```bash
gulp build-de
gulp build-en
```
to just build the website (results will be saved in the `_site` directory).

## License

The contents of the websites are licensed under the [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) license, see also the LICENSE file.