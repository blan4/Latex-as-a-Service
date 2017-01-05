TAG = sigan/latex-api:latest


build-image:
	docker-compose build

clean:
	docker-compose down

start: build-image
	docker-compose up
