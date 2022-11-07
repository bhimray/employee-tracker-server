const mongoose = require('mongoose');

const workDetailsDBSchema = new mongoose.Schema({
    Date:[
        {
          type: new mongoose.Schema(
            {
              status: {
                type: String,
                enum : ['Working','Idling'],
                default: 'Working'
            },
            },
            { timestamps: true }
          )
        }
      ],
},{
    timestamps: true,
});

const WorkDetailsDB = mongoose.model('workDetailsDB', workDetailsDBSchema)

module.exports = WorkDetailsDB