const { buildSchema } = require('graphql');

module.exports = buildSchema(`

interface loginInterface{
  Name:String
  Email:String
  Password:String
}
type hourlyStatusType{
  time:String,
  hourlyStatus:String
}
type attendenceType{
  dailyWorkedHour:String,
  dailyEarned:String,
  date:String,
  dailyStatus:String
  dailyDetails:[hourlyStatusType]
}
type dailyDetailsType{
  date:String,
  dailyStatus:String
  dailyDetails:[hourlyStatusType]
}

type createUserType {
  Name:String
  Email: String
  Password: String
  Tag:[String]
  attendence:[attendenceType]
}

type adminRegisterType implements loginInterface{
  Name:String
  Email:String
  Password:String
  Number:String
}
type authDataType{
  user:String!
  token:String!
  tokenExpiration:String!
  tag:[String]
}

type workDetailsType{
    Name:String,
    Email:String,
    Password:String,
    Mobile:[String],
    workDetails:[String]
}
type employeeDetailsType{
  _id:String,
  Name:String,
  Email:String,
  Password:String,
  Tag:[String],
  attendence:[attendenceType]
}

input dailyDetailsInput{
  Name:String,
  Email:String,
  dailyStatus:String
  dailyDetails:hourlyStatus
}
input hourlyStatus{
  hourlyStatus:String
}
input attendence{
  Name:String,
  Email:String,
  dailyStatus:String
  dailyDetails:hourlyStatus
}

input createEmployeeInput{
  Name:String
  Email:String
  Password:String
  Tag:String
  attendence:attendence
}


type RootQuery {
  adminLogin(Email:String, Password:String):authDataType
  employeeLogin(Email:String, Password:String):authDataType
  employeeDetails:[employeeDetailsType]
}

type RootMutation {
  createAdmin(Name:String, Email:String, Password:String):adminRegisterType
  createEmployee(createEmployeeInput:createEmployeeInput): createUserType
  addWorkDetails(attendenceInput:attendence):[employeeDetailsType]
  addDailyDetails(dailyDetailsInput:dailyDetailsInput):[employeeDetailsType]
  employeeLogin(Email:String, Password:String):authDataType
}


schema {
    query: RootQuery
    mutation: RootMutation
}
`);