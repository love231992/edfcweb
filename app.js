const express = require('express');
const app= express();
const PORT = process.env.PORT || 8000;


const {google} = require('googleapis');
const keys = require('./Ballast.json');
const client = new google.auth.JWT(
    keys.client_email,null,keys.private_key,['https://www.googleapis.com/auth/spreadsheets']
);
client.authorize(function(err,tokens){
    if (err) {
        console.log(err);
        return;
    } else {
        console.log("connected")
        gsrun(client);
    }
});
// Establishing connection to Google sheets API
async function gsrun(cl){
    const gsapi = google.sheets({version : "v4", auth: cl});
    const opt = {
        spreadsheetId : '16EmX73zHz5Xvs6cJWh2QNpQaz8l_O9v05vY0xU9pOvA',
        range: 'detail!V4:Z2000'
    }
    var data = await gsapi.spreadsheets.values.get(opt);
    var dataArray = data.data.values;
    console.log(dataArray)
    if (dataArray.length){
        return dataArray
    } else {
        return "No data found"
    }
}

app.get("/data", async function(req, res){
    var a = gsrun(client)
    res.send(await a)
})

app.set('view engine','ejs')
app.use(express.static(__dirname + '/views'));

app.get('/', async function(req,res) {
    var a = gsrun(client)
    console.log( (await a)[0][0])
    res.render('index',{
        data : (await a)
    })
})

app.listen(PORT,function(){
    console.log("hello world")
})