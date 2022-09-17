// const express=require("express");
// const mysql=require("mysql");
// const cors=require("cors");
// var bodyParser=require("body-parser");
// // const db=mysql.createConnection({
// //     host:"localhost",
// //     user:"root",
// //     password:"",
// //     database:"student",
// // });

// const db=mysql.createPool({      

//     connectionlimit:10,
//     host:'localhost',
//     user:'root',
//     password:'',
//     database:'student',
// })
// db.getConnection((err)=>{
// if(err){
//     console.log(err);
// }
// else{
//   console.log("Database Connected");
// }
// });


// app=express();
// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.urlencoded({extended: true}));
// app.get("/",(req,res)=>{
//     console.log("server started");
// });
// app.get("/report",(req,res)=>{
//     console.log("getting data from db....!");

//    db.query("select * from userdata",(err,result)=>{
//        if(err){
//            console.log(err);
//        }
//        else{
//            console.log(result);
//            res.send(result);
//        }
//    });
// });

// app.post("/signup",(req,res)=>{
//     const name=req.body.name;
//     const regno=req.body.regno;
    
//     const sqlInsert= "INSERT INTO userdata (regno,name) values(?,?)";
//     db.query(sqlInsert,[regno,name],(err,result)=>{
//         if(err){
//             console.log(err);
//         }else{
//             console.log("Inserted");
//         }
//     })
// });
// // app.get("/Delete",(req,res)=>{
// //     console.log("Database Deleted");
// //     db.query("select * from studenttable",(err,result)=>{
// //         if(err){
// //             console.log(err);
// //         }
// //         else{
// //             console.log(result);
// //             res.send(result);
// //         }
// //     });
// //  });
// app.post("/delete",(req,res)=>{
//     // const age=req.body.age;
//     const regno=req.body.regno;
//     const name=req.body.name;
//     // const lastname = req.body.lastname;
//     // const firstname = req.body.firstname;
//     const sqlDelete= "DELETE FROM userdata WHERE studenttable.regno=?";
//     db.query(sqlDelete,[regno,name],(err,result)=>{
//         if(err){
//             console.log(err);
//         }else{
//             console.log("deleted");
//         }
//     })
// });

// app.listen(3008,()=>{
//     console.log("server is listening!");
// });


// const request = require('request');

// const TelegramBot = require('node-telegram-bot-api');

// const token = '5448608977:AAGshiSXa8IH02ELzo3tW00OPNCkajNc0J4';

// const bot = new TelegramBot(token, {polling: true});

// bot.on('message', function(mg){
// request('http://www.omdbapi.com/?t='+mg.text+'&apikey=419f6a9b', function (error, response, body) {
//   if(JSON.parse(body).Response=="True"){
//     bot.sendMessage(mg.chat.id, "Title "+JSON.parse(body).Title)
//     bot.sendMessage(mg.chat.id, "Release Date "+JSON.parse(body).Released)
//     bot.sendMessage(mg.chat.id, "Actors "+JSON.parse(body).Actors)
//     bot.sendMessage(mg.chat.id, "Rating "+JSON.parse(body).Ratings[0].Value)
//   }
//   else{
//       bot.sendMessage(mg.chat.id, "Movie not found")
//   }
// });
// })

const express = require('express')
const { FieldValue } = require('firebase-admin/firestore')
const app = express()
const port = 8383
const { db } = require('./firebase')

app.use(express.json())

const friends = {
    'james': 'friend',
    'larry': 'friend',
    'lucy': 'friend',
    'banana': 'enemy',
}

app.get('/friends', async (req, res) => {
    const peopleRef = db.collection('people').doc('associates')
    const doc = await peopleRef.get()
    if (!doc.exists) {
        return res.sendStatus(400)
    }

    res.status(200).send(doc.data())
})

app.get('/friends/:name', (req, res) => {
    const { name } = req.params
    if (!name || !(name in friends)) {
        return res.sendStatus(404)
    }
    res.status(200).send({ [name]: friends[name] })
})

app.post('/addfriend', async (req, res) => {
    const { name, status } = req.body
    const peopleRef = db.collection('people').doc('associates')
    const res2 = await peopleRef.set({
        [name]: status
    }, { merge: true })
    // friends[name] = status
    res.status(200).send(friends)
})

app.patch('/changestatus', async (req, res) => {
    const { name, newStatus } = req.body
    const peopleRef = db.collection('people').doc('associates')
    const res2 = await peopleRef.set({
        [name]: newStatus
    }, { merge: true })
    // friends[name] = newStatus
    res.status(200).send(friends)
})

app.delete('/friends', async (req, res) => {
    const { name } = req.body
    const peopleRef = db.collection('people').doc('associates')
    const res2 = await peopleRef.update({
        [name]: FieldValue.delete()
    })
    res.status(200).send(friends)
})

app.listen(port, () => console.log(`Server has started on port: ${port}`))



