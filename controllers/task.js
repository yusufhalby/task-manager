const Task = require('../models/task');

exports.createTask = async (req, res, next) => {
    const {
        title,
        description,
        status,
        deuDate,
        category
    } = req.body;
    const userId = req.userId;
    const task = new Task({
        title,
        description,
        status,
        deuDate,
        category,
        user: userId
    });
    try {
        const savedTask = await task.save();
        res.status(201).json({
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
    const userId = req.userId;
    try {
        const totalItems = await Task.find({
            user: userId
        }).countDocuments();
        const tasks = await Task.find({
                user: userId
            })
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
        res.status(200).json({
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
    const userId = req.userId;
    try {
        const task = await Task.findById(id);
        if (!task) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }
        if (task.user != userId) {
            const error = new Error('Not authorized');
            error.statusCode = 402;
            throw error;
        }
        res.status(200).json({
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