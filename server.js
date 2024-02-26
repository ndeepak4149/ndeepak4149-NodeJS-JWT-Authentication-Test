const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const exjwt = require('express-jwt');
const path = require('path');
const jwt = require('jsonwebtoken');

app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const PORT = 3001;

const secretKey = 'My super secret key';
const jwtMW = exjwt.expressjwt({
    secret: secretKey,
    algorithms: ['HS256']
});

let users = [
    {
        id:1,
        username: 'deepak',
        password: '123'
    },
    {
        id: 2,
        username:'namasani',
        password:'456'
    }
];

app.post('/api/login', (req,res)=>{
    const {username,password} =req.body;
    //console.log('This is me',username , password);
    //res.json({data: 'it works'});

    for(let user of users) {
        if(username == user.username && password == user.password){
            //JWT expiry time - 3 minutes
            let token = jwt.sign( { id:user.id, username: user.username}, secretKey, {expiresIn: '3m'});
            res.json({
                success: true,
                err:null,
                token
            });
            break;
        }
        else{
            res.status(401).json({
                success: false,
                token: null,
                err: 'Username or password is incorrect'
            })
        }
    }
});

app.get('/api/dashboard', jwtMW, (req,res)=>{
    //console.log(req);
    res.json({
        success:true,
        myContent: 'Secret content that only logged in people can see'
    });
});

app.get('/api/prices', jwtMW, (req,res)=>{
    //console.log(req);
    res.json({
        success:true,
        myContent: 'this is the price $3.99'
    });
});

app.get('/api/settings',jwtMW, (req,res) => {
    res.json({
        success: true,
        myContent: 'Settings content that only logged in people can see'
    });
});

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(function(err,req, res, next){
    if(err.name=='UnauthorizedError'){
        res.status(401).json({
            success: false,
            officialError:err,
            err: 'Username or Password is incorrect 2'
        });
    }
    else{
        next(err);
    }
});


app.listen(PORT, () =>{
    console.log(`serving on port ${PORT}`);
});