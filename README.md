## Eshop REST API Server
This Implementation includes secure Restful APIs. The APIs include user signup, authentication, 
hashing of passwords and signing of JWT tokens to be used in the secured APIs.

#### Pre-requisites
- NodeJs
- NPM
- MongoDB
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Please read about the dependencies. if you fail to do npm install. You probably need to install python for bcrypt to build the binary.

#### To install the NodeJs Server
* clone the repo using ```git clone```
* Run ```npm install```

#### Start the mongoDB Server
* get the mongodb docker image ```docker pull mongo```
* run the container ```docker run -d -p 27017:27017 -v <local-mount-folder>:/data/db mongo```

#### Start the NodeJs REST API Server
* Run ```npm start```

#### Refer to the Swagger documentation for API Reference
* To get the Swagger json hit the API endpoint ```http://localhost:3000/swagger.json```
* Run the swagger-ui docker container ```docker run -p 80:8080 -e API_URL=http://localhost:3000/swagger.json swaggerapi/swagger-ui```
    and go to the browser ```http://localhost```
    
#### To run the test
* Run ```npm test```    

#### Postman collection
* Refer to the postman collection for the API Reference
* Run the local API test by using [newman](https://github.com/postmanlabs/newman) ```newman run postman/eshop-online.postman_collection.json```

 
#### To build the docker image And run it with the MongoDB
```
docker build -f Dockerfile -t eshop-server:latest .
```
 
* Run the mongo docker container first

```docker run -d -p 27017:27017  mongo```

* Run the eshop app container with the link to the mongo container

```docker run --net container:<mongo container ID> eshop-server:latest```

* Run the mongdb server on your local machine and allow the container to connect to it

```docker run -p 3000:3000 --net=host eshop-server:latest```