# ProjectTimer

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.0.2.

## Build Docker Angular

`docker build -f Dockerfile.angular -t my/ng-cli .`

## Install Dependencies

`docker run -it  -v $PWD:/home/node/app -w /home/node/app my/ng-cli npm install`

## Build the project

`docker run -it  -v $PWD:/home/node/app  -w /home/node/app my/ng-cli ng build`

## Run development server

`docker run -it -p 4200:4200/tcp -v $PWD:/home/node/app -w /home/node/app my/ng-cli ng serve --host 0.0.0.0`

## Run Angular Test

`docker run -it -v $PWD:/home/node/app -w /home/node/app my/ng-cli ng test`

## Run Docker

`docker-compose up --build`

## Deploy in production

`docker run -it -v $PWD:/home/node/app -w /home/node/app my/ng-cli ng build`

## Development server

`hit http://127.0.0.1:4200`

## Production server

`hit http://127.0.0.1:80`


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.


## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
