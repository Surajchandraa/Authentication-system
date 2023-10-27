const express = require('express');
const app = express()
require('./config')
const path = require('path')
let user_sch= require('./schema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config()

app.use(express.json())
app.use(express.static("public"));
app.use(express.static(path.join(__dirname,'..','public','html files')))
app.use(express.static(path.join(__dirname,'..','public','css files')))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors())

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','public','html files','homepage.html'))
})


app.get('/sign_up',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','public','html files','signup.html'))
})

app.post('/sign_up',async(req,res)=>{
    try{
    let data ={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        phone:req.body.phone
    }

    let new_modle = new user_sch(data);
    let finaldata = await new_modle.save();
    let token = jwt.sign({userId:finaldata._id},process.env.secretkey)
    res.cookie('jwt', token, { expires: new Date(Date.now() + 604800000), httpOnly: true });
    res.redirect('chat.html')
}
catch(e){
    console.log(e)
}
})

app.get('/sign_in',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','public','html files','signin.html'))
})
app.post('/sign_in',async(req,res)=>{
    try{
        let data = await user_sch.find({phone:req.body.phone});
        if(data.length!=0){
            let isvaliddata=bcrypt.compareSync(req.body.password,data[0].password);
            if(isvaliddata){
                let token = jwt.sign({userId:data._id},process.env.secretkey)
            res.cookie('jwt', token, { expires: new Date(Date.now() + 604800000), httpOnly: true });
            res.redirect('chat.html')

            
            }
            else{
                res.send("invalid credentials")
            }
        }
        else{
            res.send("user not found")
        }
    }
    catch(e){
        console.log(e);
    }
})


const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt
    console.log(token)
    if (!token) return res.status(401).redirect('/sign_in');

    try {
        const decoded = jwt.verify(token, process.env.secretkey);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
};


app.get('/chat', verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'html files','chat.html'));
});

app.get('/fetch_user',async(req,res)=>{
    let data = await user_sch.find({});
    res.send(data)
})


app.get("/search_api/:name",async(req,res)=>{
    let data=await user_sch.find({name:req.params.name});
    res.send(data)
})

app.get('/logout',(req,res)=>{
    res.clearCookie('jwt');
    res.redirect("/")
})
module.exports=app;