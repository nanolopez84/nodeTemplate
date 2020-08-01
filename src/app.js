const express = require('express');

require('./db/mongoose.js');
const routerDefault = require('./router/default.js');
const routerUser = require('./router/users.js');
const routerTask = require('./router/tasks.js');

const app = express();

app.use(routerUser);
app.use(routerTask);
app.use(routerDefault);

module.exports = app;