const express = require('express');
const dotEnv = require('dotenv');
const bcrypt = require('bcrypt');
const expressSession = require('express-session')

// configure .env
dotEnv.config()
const dbConnect = require('./dbConnect')
const User = require('./user');

const port = process.env.port || 7777;
const APP_SECRET = process.env.APP_SECRET
const app = express();
app.use(expressSession({
    secret: APP_SECRET,
    resave: false,
    saveUninitialized:true,
    cookie:{}
}));

app.use(express.urlencoded({extended:false}))

app.get("/", (req, res) => {
    res.send('its Working')
})


// Router for user Login
app.post('/login', async(req, res) =>{

    const {user_name, password} = req.body;

    // Determing whether th user's data is valid
    const results = await User.findOne({where:{ 'user_name': user_name}});
    if(!results)
    return res.send('Ooops Invalid Credentials, Try again');

    const userCorrectPassword = results.password

    // comparing the hashPassword with the current password

    const isPasswordCorrect = await bcrypt.compare(password, userCorrectPassword);
    if(!isPasswordCorrect)
    return res.send('Login Sucessfully');

    req.session.user = results.id
    res.send('Login Sucessfully')
});

const isUserAuthenticated = (req, res, next)=>{
    if(req.session.user)
    return next()

    res.send('Kindly login first')
}

// User home Page
app.get('/home-page',isUserAuthenticated, async (req, res) => {
    console.log(req.session);
    res.send('req.session')

    try{
        const userID = req.session.user
        const userInfo = await User.findOne({where: {id:userID}})
        res.send('Welcome ${userInfo.user_name}')
    }catch(error){
        res.send('Unable to handle request')
    }
})

// Router for user register
app.post('/register', async (req, res) => {
    // acessing user inputs
    try{
    const {user_name, password} = req.body;

     const hashpassword = await bcrypt.hash(password, 10);


    //  hashing user password
    const result = await User.create({user_name,'password': hashpassword});

    if(result)
    return res.send('User created succesfully');

    res.send('Unable to create user');
    }catch {error}{
    res.send('Try aagin later')
    }
})



app.listen(port, () => {
    console.log(`server connected on http://localhost:${port}`);
    dbConnect.authenticate()
})