.PHONY: build-dev
build-dev: 
	docker build -t web-ui-dev -f Dockerfile.dev . 

.PHONY: start-dev
start-dev: 
	docker run --name web-ui-dev -p 3000:3000 web-ui-dev

.PHONY: stop-dev
stop-dev: 
	docker stop web-ui-dev


.PHONY: build-prod
build-prod: 
	docker build -t web-ui-prod -f Dockerfile.prod . 

.PHONY: start-prod
start-prod: 
	docker run --name web-ui-prod -p 3000:3000 web-ui-prod

.PHONY: stop-prod
stop-prod: 
	docker stop web-ui-prod