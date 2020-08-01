const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const sharp = require('sharp');

const auth = require('../middleware/auth.js');
const User = require('../model/users.js');

const router = new express.Router();
router.use(express.json());

const upload = multer({
    dest: 'avatars',
    limits: {
        fileSize: 1048576
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(png|PNG)$/)) {
            return callback(new Error('Please upload a PNG image'));
        }

        callback(undefined, true);
    },
    storage: multer.memoryStorage()
});

router.post('/login', async (req, res) => {
    try {
        var user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        user = user.toJSON();
        user.token = token;
        res.status(200).send(user);
    } catch (error) {
        res.status(401).send(error.message);
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            throw new Error();
        }

        user.tokens = user.tokens.filter(value => value.token != token);
        await user.save();

        res.status(200).send();
    } catch (e) {
        res.status(401).send({ error: 'Authentication error' })
    }
});

router.post('/logoutAll', auth, async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            throw new Error();
        }

        user.tokens = [];
        await user.save();

        res.status(200).send();
    } catch (e) {
        res.status(401).send({ error: 'Authentication error' })
    }
});

router.post('/users', auth, async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find();
        if (users) {
            res.status(200).send(users);
        }
        else {
            res.status(404).send();
        }
    }
    catch (error) {
        console.log('error :', error);
        res.status(500).send(error);
    }
});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('File content must be in \'avatar\' field');
    }

    req.user.avatar = await sharp(req.file.buffer).resize({
        width: 250,
        height: 250
    }).toBuffer();

    await req.user.save();
    res.status(200).send();
}, (error, req, res, next) => {
    res.status(400).send(error.message);
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/jpg');
        res.status(200).send(user.avatar);
    } catch (error) {
        res.status(404).send(error)
    }
})

router.get('/users/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const user = await User.findById(_id);
        if (user) {
            res.status(200).send(user);
        }
        else {
            res.status(404).send(_id);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/users/:id/tasks', auth, async (req, res) => {
    try {
        const _id = req.params.id;
        var user = await User.findById(_id);
        if (user) {
            await user.populate('tasks').execPopulate();
            res.status(200).send({ user: user, tasks: user.tasks });
        }
        else {
            res.status(404).send(_id);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.patch('/users/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const user = await User.findByIdAndUpdate(_id, req.body,
            { new: true, runValidators: true, useFindAndModify: false }
        );
        if (user) {
            res.status(200).send(user);
        }
        else {
            res.status(404).send(_id);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/users/:id', auth, async (req, res) => {
    try {
        const user = await User.deleteOne({ _id: req.params.id });
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;