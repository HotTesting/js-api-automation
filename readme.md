

-   Latest node needed 10.x or higher

Deployed app:

http://ip-5236.sunline.net.ua:30020

SuperAdmin credentials:
email: "test@test.com",
password: "123456"

# Start tests

Install dependencies

```
npm install
```

and run tests with

```
npm test
```

To run all available tests

# You can start application locally

You should have docker installed

Start database:

```
sudo docker run -d --name wekan-db -p 27017:27017 mongo:3.2.20
```

Start application:

```
sudo docker run -d --name wekan --link "wekan-db:db" -e "MONGO_URL=mongodb://db" -e "ROOT_URL=http://localhost:38021" -p 38020:80 -p 38021:8080 wekanteam/wekan
```

UI/API will be accessible at http://localhost:38021
DATABASE will be accessible at mongodb://localhost:27017

API doc:

-   https://github.com/wekan/wekan/wiki/REST-API#login
-   https://github.com/wekan/wekan/wiki/REST-API-Cards
