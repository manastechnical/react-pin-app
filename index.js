const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const app = express();
const pinRoute = require('./routes/pins');
const userRoute = require('./routes/users');
dotenv.config();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL || 'mongodb+srv://travel:travel@cluster0.ub9ufpe.mongodb.net/pin?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log("MongoDB Connected!");
}).catch((err)=>console.log(err));

app.use("/api/pins",pinRoute);
app.use("/api/users",userRoute);

app.use(express.static(path.join(__dirname,"/frontend/dist")));
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'/frontend/dist','index.html'));
});

app.listen(process.env.PORT || 8888,()=>{
    console.log(`Server running`);
})      