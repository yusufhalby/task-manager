const Category = require('../models/category');

exports.createCategory = async (req, res, next) => {
    const {
        title
    } = req.body;
    const category = new Category({
        title
    });
    try {
        const savedCategory = await category.save();
        res.status(201).send({
            message: 'category created successfully',
            category: savedCategory
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getCategories = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    try {
        const totalItems = await Category.find().countDocuments();
        const categories = await Category.find()
            .sort({
                createdAt: -1
            })
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        if (categories.length == 0 || !categories) {
            const error = new Error('Categories not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).send({
            message: 'categories fetched successfully',
            categories,
            totalItems
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};