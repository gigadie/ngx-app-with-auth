# Generic FE App - NGX - With Authentication
### Angular 5.x
#### This app needs to be used with api [nodejs-api](https://github.com/gigadie/nodejs-api) which listens on http://localhost:8888

## Dependencies

- [angular](https://angular.io/) (5.x)
- [bootstrap](https://getbootstrap.com/) (4.x)
- [spinkit](http://tobiasahlin.com/spinkit/) (1.2.x)
- [material design icons](https://materialdesignicons.com/) (2.1.x)

## Dev Dependencies
- [Angular CLI](https://cli.angular.io/)
- [Gulp](https://gulpjs.com/)
- [yargs](https://github.com/yargs/yargs)
- [gulp-sequence](https://github.com/teambition/gulp-sequence)

## Before you start, be sure you have the latest version of npm and Angular CLI installed on your machine

To upgrade your Angular CLI
```shell
# --> Only if you have a version which is earlier than 1.0.0-beta.28
npm uninstall -g angular-cli

# --> This always
npm uninstall -g @angular/cli
npm cache verify
npm install -g @angular/cli@latest
```
Then locally in your *ngx-app-with-auth* folder
```shell
rm -rf node_modules dist
npm install
```

## Development server

Run `npm start`, which will execute underneath `ng serve --disable-host-check` for a dev server. Navigate to `http://localhost:4200/` or the domain you added to your hosts configuration. The app will automatically reload if you change any of the source files.

<!-- This will automatically point to `xxxxx` for its API, using environment settings. -->

## Build

Run `npm run build` or `npm run build:prod` to build the project, with target development or production. 

The build artifacts will be stored in the `dist/` directory.

Using the `:prod` build will compile with AOT and build-optimizer for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).