const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    title:{
        type: String,
        required: true
    }
},
{
    timestamps :true // to add created_at and updated_at fields in the schema
});

module.exports = mongoose.model('Category', categorySchema);