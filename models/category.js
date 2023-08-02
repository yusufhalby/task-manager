const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true // to add created_at and updated_at fields in the schema
});

module.exports = mongoose.model('Category', categorySchema);