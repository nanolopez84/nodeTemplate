const express = require('express');

const router = new express.Router();

router.get('', (req, res) => {
    res.status(200).send('<h1>Home</h1>');
});

router.get('*', (req, res) => {
    res.status(404).send('<h1>Not Found</h1>');
});

module.exports = router;