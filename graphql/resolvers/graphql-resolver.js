const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
// conecting the mongoose
const mongoose = require('mongoose');
const UsersDB = require('../../db/usersDB');
require('dotenv').config()
const MONGO_DB = process.env.MONGO_URI;

module.exports = {
    createEmployee: async args => {
        // check if the user is ADMIN
        console.log("hi, create employee")
        console.log(args,args.createEmployeeInput.Password, 'this is args in inside the createUser')
        if (args.createEmployeeInput.Email=== "yugen@gmail.com"){
             args.Tag= ["ADMIN", "ACTIVE"]
        }else{
            args.Tag = ["EMPLOYEE", "ACTIVE"]
        }
        const hashedPassword = await bcrypt.hash(args.createEmployeeInput.Password, 12);    
        try {
            const findUser = await mongoose.connect(MONGO_DB).then(()=>{
                return UsersDB.findOne({Name:args.createEmployeeInput.Name, Email:args.createEmployeeInput.Email})
            })
            console.log(findUser, "find user")
            if (findUser === null) {
                console.log(findUser, "existing user"); 
                const user = UsersDB({
                    Name: args.createEmployeeInput.Name,
                    Email: args.createEmployeeInput.Email,
                    Password: hashedPassword,
                    Tag:args.Tag
                    
                });
                user.save()
                return user;
                
            }else{
                console.log("user exists", data.Name)
            }
        }
        catch(err){
            console.log("try catch err", err)
        }
        // console.log(create, "this is the created user")
    },

    addWorkDetails: async args => {
        // CHECK IF THE USER IS ADMIN
        console.log("hi, update work details")
        console.log(args,args.attendenceInput.Name, args.attendenceInput.dailyStatus, args.attendenceInput.dailyDetails.hourlyStatus, 'this is args in inside the addWorkDetails')
        try {
            // const time = new Date()
            // const hourlyUpdate = `${time.getHours()}:${time.getMinutes()}`
            // const today = `${time.getFullYear()}:${time.getMonth()}:${time.getDay()}`
            const date= new Date()
            const time = date.toLocaleDateString('en-US')
            const hourlyUpdate = date.toLocaleTimeString('en-US', {hour12:false})
            const today = time
            console.log("Mongodb is connected && args in workdetails", args)
            const docs = await mongoose.connect(MONGO_DB).then(()=>{
                return UsersDB.findOne({Name:args.attendenceInput.Name, Email:args.attendenceInput.Email})
            })
            console.log(docs, "this is docs data i needed");// this one printed my results all other failed to do so. I don't know why other method exist in this world. (5hrs to solve).
            console.log(docs.attendence.length, "this is the id and date")
            if (docs.attendence.length !== 0){
                console.log("dates", docs.attendence.at(-1).date, today, typeof((docs.attendence.at(-1).date).toString().split('/')[1]), typeof(today.toString().split('/')[1]))
                console.log("true or false===>",(docs.attendence.at(-1).date).toString().split('/')[1] !== today.toString().split('/')[1],docs.attendence.at(-1).date )
                {(docs.attendence.at(-1).date).toString().split('/')[1] !== today.toString().split('/')[1] ?
                    UsersDB.updateOne({Name:args.attendenceInput.Name, Email:args.attendenceInput.Email},
                        {
                            $push: {
                                attendence:{ 
                                    dailyWorkedHour:"0",
                                    dailyEarned:"0",
                                    date:today,
                                    dailyStatus:args.attendenceInput.dailyStatus,
                                    dailyDetails:{
                                        time: hourlyUpdate,
                                        hourlyStatus:args.attendenceInput.dailyDetails.hourlyStatus
                                    }
                                }
                            }
                        }
                    ).then((res)=>{ console.log("workDetailsAdded")})
                    :
                    UsersDB.find((err, doc)=>{
                        if (err) return console.log(err);
                        const value = doc.at(-1).attendence.length;
                        const pushVariable = value - 1
                        UsersDB.updateOne({Name:args.attendenceInput.Name, Email:args.attendenceInput.Email},
                            {
                                $set: {
                                    [`attendence.${pushVariable}.date`]:today,
                                    [`attendence.${pushVariable}.dailyStatus`]:args.attendenceInput.dailyStatus,
                                }
                            }
                        ).then((res)=>{ console.log("workDetailsUpdated", res)})
                    })
                }
            }else if (docs.attendence.length === 0){
                console.log("docs length", docs.attendence.length)
                UsersDB.updateOne({Name:args.attendenceInput.Name, Email:args.attendenceInput.Email},
                    {
                        $push: {
                            attendence:{ 
                                dailyWorkedHour:"0",
                                dailyEarned:"0",
                                date:today,
                                dailyStatus:args.attendenceInput.dailyStatus,
                                dailyDetails:{
                                    time: hourlyUpdate,
                                    hourlyStatus:args.attendenceInput.dailyDetails.hourlyStatus
                                }
                            }
                        }
                    }
                    ,(err, docs)=>{})
            }else{
                console.log("docs is undefined, please check docs")
            }
            const employeeList = await mongoose.connect(MONGO_DB).then((res)=>{
                console.log("Mongodb is connected")
                return UsersDB.find({})
            }
            )
            return employeeList;
        }catch (err) {
            console.log("this is error", err)
            throw new Error('Error occurred while adding work details');
        }
    },

    addDailyDetails: async args => {
        // CHECK IF THE USER IS ADMIN
        console.log("hi, update hourly details")
        console.log(args, args.dailyDetailsInput.Name, args.dailyDetailsInput.dailyDetails, args.dailyDetailsInput.dailyDetails.hourlyStatus, 'this is args in inside the addDailyDetails')
        
        try {
            // const hashedPassword = await bcrypt.hash(args.createEmployeeInput.Password, 12);
            // console.log("password is hashed", typeof(hashedPassword))
            const date= new Date()
            const time = date.toLocaleDateString('en-US', {weekday:'long'})
            const hourlyUpdate = date.toLocaleTimeString('en-US', {hour12:false})
            const today = time
            const rate = 30;

            let value;
            UsersDB.find({Name:args.dailyDetailsInput.Name, Email:args.dailyDetailsInput.Email},(err, docs)=>{
                if (err) return console.log(err);
                console.log(docs, docs.at(-1),docs.at(-1).attendence.at(-1)?._id, "this is docs data i needed");// this one printed my results all other failed to do so. I don't know why other method exist in this world. (5hrs to solve).
                console.log(docs.at(-1).attendence.length, "this is the length of attendence")
                console.log(docs.at(-1).attendence.at(-1).dailyDetails, "this is the length of attendence")

                if (docs) {
                    value = docs.at(-1).attendence.length
                    const status = docs?.at(-1)?.attendence?.at(-1)?.dailyDetails.at(-1).hourlyStatus
                    if (status === "WORKING") {
                        const previousTime= docs?.at(-1)?.attendence?.at(-1)?.dailyDetails.at(-1).time
                        const hourlyUpdateValue = moment.duration(hourlyUpdate, "hh:mm:ss")
                        const previousTimeValue = moment.duration(previousTime, "hh:mm:ss")
                        console.log("previous time 000000=>", previousTime)
                        if (previousTime < hourlyUpdate){
                            function dailyWorkedHourFunc(){ const timeValue= hourlyUpdateValue.subtract(previousTimeValue); return timeValue}
                            const timeDifference = dailyWorkedHourFunc()
                            console.log(docs.at(-1).attendence.at(-1).dailyWorkedHour, "------------previous working hours")
                            var dailyWorkedHour = Number(timeDifference.hours())+Number(timeDifference.minutes())/60 + Number(docs.at(-1).attendence.at(-1).dailyWorkedHour);
                            var dailyEarned = Number(timeDifference.hours())*Number(rate)+ Number(timeDifference.minutes())*Number(rate)/60 + Number(docs.at(-1).attendence.at(-1).dailyWorkedHour);
                        }else{
                            function dailyWorkedHourFunc(){ const timeValue= previousTimeValue.subtract(hourlyUpdateValue); return timeValue}
                            const timeDifference = dailyWorkedHourFunc()
                            var dailyWorkedHour =  Number(timeDifference.hours()) + Number(timeDifference.minutes())/60 + Number(docs.at(-1).attendence.at(-1).dailyWorkedHour);
                            var dailyEarned = Number(timeDifference.hours())* Number(rate) + Number(timeDifference.minutes())*Number(rate)/60 + Number(docs.at(-1).attendence.at(-1).dailyWorkedHour);
                            
                        }
                    }
                }
                
                if (docs.at(-1).attendence.at(-1).dailyDetails.hourlyStatus === args.dailyDetailsInput.dailyDetails.hourlyStatus) console.log("Status is unchanged")
                const pushVariable = value - 1
                console.log(value ,pushVariable, typeof(pushVariable), "pushVariable")
                // console.log("finding user", UsersDB.findOne({Name:args.dailyDetailsInput.Name, Email:args.dailyDetailsInput.Email}))
                UsersDB.updateOne(
                    {Name:args.dailyDetailsInput.Name, Email:args.dailyDetailsInput.Email},
                    {     
                        $set:{
                            [`attendence.${pushVariable}.dailyWorkedHour`]:dailyWorkedHour,
                            [`attendence.${pushVariable}.dailyEarned`]:dailyEarned
                        },         
                        $push:{
                            [`attendence.${pushVariable}.dailyDetails`]:{
                                time: hourlyUpdate,
                                hourlyStatus:args.dailyDetailsInput.dailyDetails.hourlyStatus
                            }
                        }
                    }      
                    ,(err, docs)=>{
                        console.log(err, "this is error")
                        console.log(docs, "this is docs")
                    }
                )
            })
            const employeeList = await mongoose.connect(MONGO_DB).then((res)=>{
                console.log("Mongodb is connected")
                return UsersDB.find({})
            }
            )
            return employeeList;

        }catch (err) {
            console.log("this is error", err)
            throw new Error('Error occurred while adding daily details');
        }
    },


    employeeLogin: async (args) => {
        console.log(args, "this is args in login")
        const email= args.Email
        const password = args.Password

        const user = await mongoose.connect(MONGO_DB).then(()=>{
            return UsersDB.findOne({ Email: email });
        })
        console.log(user)
        if (!user) {
            throw new Error('User does not exist!');
        }
        const isEqual = bcrypt.compare(password, user.Password);
        if (!isEqual) {
            throw new Error('Password is incorrect!');
        }
        const token = jwt.sign(
            { user: user.id, email: user.Email },
            'r38ridnfksdlfei48t94r9rf4r92m',
            {
                expiresIn: '1h'
            }
        );
        return { user: user.id, token: token, tokenExpiration: 1, tag:user.Tag };
    },

    employeeDetails: async()=>{
        console.log("querying employee details")
        const employeeList = await mongoose.connect(MONGO_DB).then((res)=>{
            console.log("Mongodb is connected")
            return UsersDB.find({})
        }
        )
        console.log(employeeList, "this is employeeList")
        return employeeList;
    }
};




//     try {
            
    //         console.log("password is hashed", typeof(hashedPassword))
    //         const date= new Date()
    //         const time = new Date()
    //         const hourlyUpdate = `${time.getHours()}:${time.getMinutes()}`
    //         const today = `${time.getFullYear()}:${time.getMonth()}:${time.getDay()}`
    //         create()
    //         // const bilen = UsersDB.find({Name:args.createEmployeeInput.Name, Email:args.createEmployeeInput.Email}, (err, docs)=>{
                
    //         //     console.log(docs, "this is docs in create user")
    //         //     if (docs){
    //         //         console.log(docs, "there is docs")
    //         //     }
    //         //     if (err) return console.log(err);
    //         // })
    //         // bilen.clone().exec()
            
            
            
    //         // else{
    //         //         const user = UsersDB({
    //         //             Name: args.createEmployeeInput.Name,
    //         //             Email: args.createEmployeeInput.Email,
    //         //             Password: hashedPassword,
                        
    //         //         });
                    
    //         //         // console.log(user)
    //         //         // recreating the connection with mongodb and saving the data
    //         //         // error is still unknown, is it due to slow internet? Yes...
    //         //         async function run() {
    //         //             await mongoose.connect(MONGO_DB).then(()=>{
    //         //                 user.save();
    //         //             })
    //         //             console.log("user is saved")
    //         //         }
    //         //         run()
    //         //         console.log("result is saved", user)
    //         //         return user;
    //         //     }
    //         // })
            

    //     }catch (err) {
    //         console.log("this is error", err)
    //         throw err;
    //     }
    // },