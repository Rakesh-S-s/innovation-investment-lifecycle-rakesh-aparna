const express = require("express")
const mongoose = require("mongoose")
const app = express()
const User = require("./model/User")
const Ideas = require("./model/Ideas")
const cors = require("cors")
const MONGO_DB_URI = "mongodb+srv://rakesh:rakesh@cluster0.87z7u4l.mongodb.net/?retryWrites=true&w=majority"
const jwt = require('jsonwebtoken')
const Chat = require("./model/Chat")

app.use(cors())
app.use(express.json())

mongoose.connect(MONGO_DB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Connected to DB...")
}).catch((e)=>{
    console.log(e);
})



app.post("/api/login", async (req, res)=>{
    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password
    })
    if(user){
        const token = jwt.sign({
            username: user.username,
            email: user.email
        }, 'secret')
        res.json({status:"ok", user: token})
    }else{
        res.json({status:"error", user:false})
    }
})

app.post("/api/register", async (req, res)=>{
    try{
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            category: req.body.category
        })
        res.json({status:"ok", user: user});
    }catch(err){
        res.json({status:"error", err: err})
    }
})

app.get("/myideas", async(req, res) => {
    const token = req.headers['x-access-token']
    try{
        const decoded = jwt.verify(token, 'secret')
        const email = decoded.email;
        const post = await Ideas.find({createdBy: email})
        res.json({data: post, email: email})
    }catch(err){
        res.json(err)
    } 
})
app.get("/api/checkidea", async(req, res)=>{
    const token = req.headers['x-access-token']
    try{
        const decoded = jwt.verify(token, 'secret')
        const email = decoded.email;
        const data = await User.find({email: email})
        if(data[0].category === "ideas"){
            res.json({status: 'ok', isIdeator: true, user: data[0].username})
        }else{
            res.json({status: 'ok', isIdeator: false, user: data[0].username})
        }
    }catch(err){
        res.json(err)
    }
})

app.get("/ideas", async(req, res) => {
    const token = req.headers['x-access-token']
    try{
        const decoded = jwt.verify(token, 'secret')
        const email = decoded.email;
        const post = await Ideas.find()
        res.json({data: post, email: email})
    }catch(err){
        res.json(err)
    } 
})

app.post("/api/ideas", async(req, res) => {
    const token = req.headers['x-access-token']
    try{
        const decoded = jwt.verify(token, 'secret')
        const email = decoded.email;
        const data = new Ideas({
            createdBy: email,
            title: req.body.title,
            description: req.body.description
        })
        const post = await data.save()
        res.json({status:"ok", data: post})
    }catch(err){
        res.json(err)
    }
})

app.get("/ideas/:id", async (req,res)=>{
        const data = await Ideas.findById(req.params.id);
        if(data){
            res.json({data: data})
        }else{
            res.json({status: 'error'})
        }
})

app.get("/api/home", async (req, res)=>{
    const token = req.headers['x-access-token']
    try{
        const decoded = jwt.verify(token, 'secret')
        const email = decoded.email;
        const user = await User.findOne({email: email})
        // console.log(user)
        return res.json({status:'ok', username: user.username, email: user.email})
    }catch(err){
        console.log(err)
        res.json({status: 'ok', error: 'invalid token'})
    }
})

app.get("/api/user/profile", async(req, res) => {
    const token = req.headers['x-access-token']
    try{
        const decoded = jwt.verify(token, 'secret')
        const email = decoded.email;
        const user = await User.findOne({email: email})
        res.json({data: user})
    }catch(err){
        res.json({error: err})
    }
})

app.post("/message", async (req, res) => {
    const token = req.headers['x-access-token']
    try{
        const decoded = jwt.verify(token, 'secret')
        const email = decoded.email;
        const { message } = req.body;
        const chat = new Chat({ message:message, sender: email });
        await chat.save();
        res.json({data: chat, email: email});
    }catch(err){
        res.json(err)
    }
})


app.get("/message", async (req, res) => {
    const token = req.headers['x-access-token']
    try{
        const decoded = jwt.verify(token, 'secret')
        const email = decoded.email;
        const chat = await Chat.find();
        res.json({data: chat, user: token, email: email});
    }catch(err){
        res.json(err)
    }
})


app.delete("/idea/delete/:id", async (req,res)=>{
    const data = await Ideas.findByIdAndDelete(req.params.id);
    res.json(data);
})

app.put("/api/blog/edit/:id", async (req,res)=>{
    const {id} = req.params;
    const {title} = req.body;
    const {description} = req.body;
    const data = await Ideas.findByIdAndUpdate(id, {description: description});
    res.json({status: 'ok'})
})

app.listen(5000, () => {console.log("Listening...") });