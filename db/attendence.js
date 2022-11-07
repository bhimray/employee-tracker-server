const mongoose = require('mongoose');
const WorkDetailsDB = require('./workDetailsDB');

const attendenceSchema = new mongoose.Schema({
    status:String,
}
);

const attendenceDB = mongoose.model('attendence', attendenceSchema)

module.exports = attendenceDB