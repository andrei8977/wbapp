## Description

App is loading data from WB, storing it in PostgreSQL and Google Spreadsheets


## Project setup

```bash
$ git clone https://github.com/andrei8977/wbapp
$ cd wbapp
```
Add WB Token to .env file

Add Service Google Account API key (JSON) instead of "src/gsp/service-account-key.json"

## Compile and run the project

```bash
$ docker-compose build
$ docker-compose up
$ docker-compose up --build
```

## Checking database in pgAdmin

Visit "http://localhost:5050/" to check PostgreSQL database:
1) Register Server with any name
2) In tab "Connection" type host: "pg_db", username: "root", password: "root"
3) Check "my_db" database 
