const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: 'No Description'
    },
    status: {
        type: String,
        default: 'New'
    },
    deuDate: {
        type: Date,
        required: true
    },
    imageUrl: {
        type: String,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

}, {
    timestamps: true // to add created_at and updated_at fields in the schema
});

module.exports = mongoose.model('Task', taskSchema);