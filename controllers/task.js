const Task = require('../models/task');

exports.createTask = async (req, res, next) => {
    const {title, description, status, deuDate, category} = req.body;

    const task = new Task({title, description, status, deuDate, category});

    const savedTask = await task.save();
    await res.status(201).send({message: 'task created successfully', task: savedTask});
};