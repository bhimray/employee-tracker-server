const mongoose = require('mongoose');
// const WorkDetailsDB = require('./workDetailsDB');

const usersDBSchema = new mongoose.Schema({
    Name: {type:String},
    Email: {type:String},
    Password: {type:String},
    Tag:{type:Array},
    attendence:[{
        dailyWorkedHour:String,
        dailyEarned:String,
        date:String,
        dailyStatus:{
            type: String,
            enum : ['PRESENT','ABSENT'],
            default: 'PRESENT',
        },
        dailyDetails:[{
            time:String,
            hourlyStatus: {
                type: String,
                enum : ['WORKING','IDLING'],
                default: 'WORKING'
            },
            },
            { timestamps: true }]
    },
    { timestamps: true }]
},
{
    timestamps: true,
});

const UsersDB = mongoose.model('usersDB', usersDBSchema)

module.exports = UsersDB