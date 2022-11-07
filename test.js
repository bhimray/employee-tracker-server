// var objname = {};
// objname["hi"] = 'value';
// console.log(objname)


// const now = new Date();
const moment = require('moment')
// console.log(now.toLocaleTimeString('en-US', {hour12:false}))
let valuestart = moment.duration("20:00", "HH:mm");
let valuestop = moment.duration("23:15", "HH:mm");
let difference = valuestop.subtract(valuestart);

console.log(difference.hours() + ":" + difference.minutes())
console.log(Number("5")+Number("6"))

const date = new Date;
const newdate = date.toLocaleDateString('en-US')
console.log(typeof(newdate))
