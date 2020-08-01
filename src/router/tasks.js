const express = require('express');

const auth = require('../middleware/auth.js');
const Task = require('../model/tasks.js');

const router = new express.Router();
router.use(express.json());

router.post('/tasks', auth, async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/tasks', auth, async (req, res) => {
    try {
        var limit = req.query.limit ? parseInt(req.query.limit) : 0;
        var skip = req.query.skip ? parseInt(req.query.skip) : 0;

        const match = {};
        if (req.query.completed) {
            // When query has no 'completed' parameter, match is null,
            // hence fetching both completed and pending tasks
            match.completed = req.query.completed === "true";
        }

        const sortBy = {};
        if (req.query.sortBy) {
            // If bad parameter is in the query, default order will be 'asc'
            sortBy.createdAt = req.query.sortBy === "desc" ? -1 : 1;
        }

        const tasks = await Task.find(match).limit(limit).skip(skip).sort(sortBy);
        if (tasks) {
            res.status(200).send(tasks);
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

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const task = await Task.findById(_id);
        if (task) {
            if (task.owner) {
                await task.populate('owner').execPopulate();
            }
            res.status(200).send(task);
        }
        else {
            res.status(404).send(_id);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const task = await Task.findByIdAndUpdate(_id, req.body,
            { new: true, runValidators: true, useFindAndModify: false }
        );
        if (task) {
            res.status(200).send(task);
        }
        else {
            res.status(404).send(_id);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const task = await Task.deleteOne({ _id: _id });
        if (task) {
            res.status(200).send(task);
        }
        else {
            res.status(404).send(_id);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;