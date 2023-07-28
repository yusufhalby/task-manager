const Category = require('../models/category');

exports.createCategory = async (req, res, next) => {
    const {title} = req.body;
    const category = new Category({title});
    const savedCategory = await category.save();
    await res.status(201).send({message: 'category created successfully', category: savedCategory});

};