const Task = require('../models/task');

exports.createTask = async (req, res, next) => {
    const {
        title,
        description,
        status,
        deuDate,
        category
    } = req.body;
    const task = new Task({
        title,
        description,
        status,
        deuDate,
        category
    });
    try {
        const savedTask = await task.save();
        res.status(201).send({
            message: 'task created successfully',
            task: savedTask
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getTasks = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    try {
        const totalItems = await Task.find().countDocuments();
        const tasks = await Task.find()
            .sort({
                createdAt: -1
            })
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        if (tasks.length == 0 || !tasks) {
            const error = new Error('Tasks not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).send({
            message: 'Tasks fetched successfully',
            tasks,
            totalItems
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getTask = async (req, res, next) => {
    const id = req.params.id;
    try {
        const task = await Task.findById(id);
        if (!task) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).send({
            message: 'Task fetched successfully',
            task
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};