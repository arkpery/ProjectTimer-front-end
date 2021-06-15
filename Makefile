all: init install test prod

init:
	docker build -f Dockerfile.angular -t my/ng-cli .

install:
	rm -rf node_modules
	docker run -it  -v `pwd`:/home/node/app -w /home/node/app my/ng-cli npm install

dev: 
	docker run -it -p 4200:4200/tcp -v `pwd`:/home/node/app -w /home/node/app my/ng-cli ng serve --host 0.0.0.0

prod: 
	docker run -it -v `pwd`:/home/node/app -w /home/node/app my/ng-cli ng build
	docker-compose up --build

test:
	docker run -it -v `pwd`:/home/node/app -w /home/node/app my/ng-cli ng test

shutdown:
	docker-compose stop

clear:
	docker-compose down
