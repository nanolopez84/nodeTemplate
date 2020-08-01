const app = require('./app.js');

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`${Date()}
Server is up on port ${port}
Database: ${process.env.DBASEDATABASE}`)
});