const crypto = require('crypto');
const jwt= require('jsonwebtoken');

const misc={
    dateTime: new Date().toString('dd-MM-yyyy hh:mm:ss'),
    verifyToken:crypto.randomBytes(16).toString('hex'),
    dateOnly(){
        const getDateOnly= new Date();
        return `${getDateOnly.getDate()}-${getDateOnly.getMonth()+1}-${getDateOnly.getFullYear()}`;
    },
    dbDateNow(date){
        const getDateOnly= new Date(date);
        return `${getDateOnly.getFullYear()}-${(getDateOnly.getMonth()+1).toString().padStart(2,'0')}-${getDateOnly.getDate().toString().padStart(2,'0')}`;
    },
    dbAddDate(date,days){
        const today= new Date(date);
        const tommorrow=new Date();
        tommorrow.setDate(today.getDate()+days);
        return `${tommorrow.getFullYear()}-${tommorrow.getMonth()+1}-${tommorrow.getDate()}`;
    },
    timeOnly(){
        const getTimeOnly=new Date();
        return `${getTimeOnly.getHours()}.${getTimeOnly.getMinutes()}`;
    },
    dbAddTime(time,duration){

        const timeGiven=time;
        const hours= new Date(duration).getHours();
        const minutes=new Date(duration).getMinutes();

        console.log('hours',hours)
        console.log('minutes',minutes);

        timeGiven.setHours(timeGiven.getHours()+hours);
        timeGiven.setMinutes(timeGiven.getMinutes()+minutes);

        return timeGiven;


    },
    convertTimeTo12H(time){
        const tempTime= misc.parseTime(time);
        const hours= tempTime[0];
        tempTime[1]= tempTime[1].toString().padStart(2,'0')
        if(hours>12) { 
            tempTime[0]-=12;
            tempTime[1]+=' PM';
        }else if(hours===0) {
            tempTime[0]=12;
            tempTime[1]+=' AM';
        }else if(hours<12) tempTime[1]+=' AM';
        else if(hours===12) tempTime[1]+=' PM';
        return tempTime.join(':');
    },
    addTime(time,timeToAdd){
        let [hours,minutes]= misc.parseTime(time);
        let [toAddHours,toAddMinutes]= misc.parseTime(timeToAdd);
        let [addedHours,addedMinutes]=[00,00];
        if (toAddHours==00) addedHours= hours;
        else if((hours+toAddHours)>=23) addedHours=((hours+toAddHours)-24);
        else if((hours+toAddHours)<23) addedHours=hours+toAddHours;
        if((minutes+toAddMinutes)>=59) {
            addedMinutes=((minutes+toAddMinutes)-60).toString().padStart(2,'0');
            if((addedHours+=1)>=24) addedHours=0;
        }else if(minutes+toAddMinutes<59) addedMinutes=(minutes+toAddMinutes).toString().padStart(2,'0');
        else addedMinutes=minutes;
        return `${addedHours}.${addedMinutes}`;
    },
    parseTime(time){
        time=parseFloat(time).toFixed(2);
        let tempTime= time.toString().split('.');
        tempTime[0]= parseInt(tempTime[0]);
        tempTime[1]=parseInt(tempTime[1]);
        return tempTime;
    },
    parseDuration(time){
        time=parseFloat(time).toFixed(2);
        let tempTime= time.toString().split(':');
        tempTime[0]= parseInt(tempTime[0]);
        tempTime[1]=parseInt(tempTime[1]);
        return tempTime;
    },
    getTokenDetails(token){
        try{
        const loggedUser=jwt.decode(token);
        // console.log(loggedUser);
        // console.log(Date.now(),loggedUser.exp*1000);
        // if(!loggedUser) return false;
        // //Check token expiry
        // console.log(Date.now(),loggedUser.exp*1000);
        // if(Date.now()>=loggedUser.exp*1000) return false;
        return loggedUser;
        } catch(err){
            console.log(`Error checking auth token ${err}`);
            return false;
        }
    }
}

module.exports = misc;