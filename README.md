# Node base app

## Instructions

* Start a MongoDB server and set the environment

Here are setted with default values used by app

```
DBASEHOST='127.0.0.1'
DBASEPORT=27017
DBASEDATABASE='task-manager-api'
```

* Install dependencies

```
# npm install
```

* Run tests

```
# npm test
```

* Start the app

```
# npm start
```

* Try the endpoints

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
