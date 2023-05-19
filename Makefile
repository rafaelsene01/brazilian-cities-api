build:
	docker build -t rafaelsene01/brazilian-cities .
prod:
	docker run -p 3000:3000 -d rafaelsene01/brazilian-cities
dev:
	docker-compose up
hidden:
	docker-compose up -d 
down:
	docker-compose down