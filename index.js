const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const authMiddleware = require('./middlewares.js');
dotenv.config();

const app = express();

app.use(express.json());
const user = {

    username: "owdx1",
    password: "canboz31",
    email:"canbozkurt@gmail.com"
}

let refreshTokens = [];


app.post('/refresh' , async (req, res) =>{
    const {refreshToken} = req.body;
    if(!refreshToken) return res.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(401);

    jwt.verify(refreshToken , process.env.jwtSecret2 , (err , data) =>{
        if(err){
            console.error(err.message);
            return res.status(400).json(err);
        }

        const accessToken = jwt.sign({email : data.email , username: data.username}, process.env.jwtSecret, {expiresIn:"1hr"});
        return res.status(200).json(accessToken);

    })

})

app.post('/logout' , (req, res) =>{
    console.log("refreshtokens: " ,refreshTokens);
    console.log('current refresh token: ' , req.body.refreshToken);
    refreshTokens = refreshTokens.filter(token => token !== req.body.refreshToken);
    console.log("refreshtokens after implementation",refreshTokens);
    return res.sendStatus(200);
    
})


app.post('/login' , async (req , res) =>{

    const {username , password} = req.body;

    
    if(user.username !== username || user.password !== password){
        return res.status(401).json({message: 'fuck you'});
    }

    const accessToken = jwt.sign({email : user.email , username: user.username}, process.env.jwtSecret, {expiresIn:"1hr"});

    const refreshToken = jwt.sign({email : user.email , username: user.username}, process.env.jwtSecret2);

    refreshTokens.push(refreshToken);

    return res.status(200).json({accessToken , refreshToken});


})  

app.get('/can' , authMiddleware , (req,res)=>{
    console.log(req.user);
    res.json({name:"cancan31"});
})

app.get('/' , (req , res) =>{
    res.json({
        name:"can"
    })
})

app.listen(5000, () =>{
    console.log("listenin on port 5000");
})