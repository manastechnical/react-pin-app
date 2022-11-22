const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//register
router.post("/register",async(req,res)=>{
    try {
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password,salt);

        //create new user
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPass
        });

        //check if username already exists
        const userExist = await User.findOne({username:req.body.username});
        if(userExist) return res.status(400).json("User already exists");

        const uExist = await User.findOne({email:req.body.email});
        if(uExist) return res.status(400).json("User already exists");

        //save user and send response
        const user = await newUser.save();
        res.status(200).json(user._id);
    } catch (error) {
        res.status(500).json(error);
    }
})

//login 
router.post("/login",async(req,res)=>{
    try {
        //find user
        const user = await User.findOne({username:req.body.username});
        if(!user){
            return res.status(400).json("Wrong username or password!");
        }

        //validate pass
        const validPass = await bcrypt.compare(req.body.password,user.password);
        if(!validPass){
            return res.status(400).json("Wrong username or password!");
        }

        //send res
        res.status(200).json({_id:user._id,username:user.username});
    } catch (error) {
        res.status(500).json(error);    
    }
})


module.exports = router