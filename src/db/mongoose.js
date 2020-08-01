const mongoose = require('mongoose');

const dbaseHost = process.env.DBASEHOST || '127.0.0.1';
const dbasePort = process.env.DBASEPORT || 27017;
const dbaseDatabase = process.env.DBASEDATABASE || 'task-manager-api';

mongoose.connect(`mongodb://${dbaseHost}:${dbasePort}/${dbaseDatabase}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});