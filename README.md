# Node base app

Simple Node.js REST server connected to a dockerized MongoDB.

## Instructions

### Requeriments

* Docker installed

### MongoDB with Docker

A volatile image is used without autentication to keep this example very simple.

### Procedure

1. Run MongoDB within Docker

```
# sudo docker run --name mongodb -d -p 27017:27017 mongo
```

This environment variables are used by default in the server:

```
DBASEHOST='127.0.0.1'
DBASEPORT=27017
DBASEDATABASE='task-manager-api'
```

2. Create admin user
    1. With your favourite MongoDB client, create a database called "task-manager-api", and within it create a collection called "users"
    2. Insert a new document as follows:

```
{
    "name" : "Admin",
    "email" : "admin@node.com",
    "password" : "$2a$08$WxsjsTssaR9oFaBT/V6P3.Wc9q9iDmfUiNBZ4ELKLR5wCZrnsp1gq"
}
```

The decrypted password is "adminpass".

3. Install Node.js dependencies

```
# npm install
```

4. Run tests

```
# npm test
```

5. Start the app

```
# npm start
```

6. Try these endpoints with your favourite REST client

```
POST      /login
POST      /logout
POST      /logoutAll
POST      /users
GET       /users
GET       /users/me
GET       /users/:id/avatar
GET       /users/:id
GET       /users/:id/tasks
PATCH     /users/:id
DELETE    /users/:id
POST      /tasks
GET       /tasks
GET       /tasks/:id
PATCH     /tasks/:id
DELETE    /tasks/:id
```
###### Calls templates

From directory "./resources" the file called "nodeTemplate.postman_collection.json" can be imported in Postman.