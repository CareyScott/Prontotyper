const express = require('express');
const cors =  require('cors');
const jwt = require("jsonwebtoken");

require('dotenv').config()
require ('./db')()

// importing the controllers
const { getAllProjects, getSingleProject, addProject } = require('./controllers/project_controller') 
// const { getAllUsers, getSingleUser, registerUser, loginUser } = require('./controllers/user_controller') 
const {register, login, loginRequired } = require('./controllers/user_controller'); 
const { JsonWebTokenError } = require('jsonwebtoken');

// const { getAllComponent, getSingleComponent } = require('./controllers/component_controller') 


const port = process.env.PORT

const app = express()
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
        jwt.verify(req.headers.authorization.split(' ')[1], 'azure_jwt_api', (err, decode) => {
            if (err) req.user = undefined
            req.user = decode
            next()
        })
    }
    else{
        req.user = undefined
        next()
    }
})


app.get('/projects', loginRequired, getAllProjects)
app.get('/projects/:id', loginRequired,  getSingleProject)
app.post('/projects', addProject, loginRequired )

// app.get('/users', getAllUsers)
// app.get('/users:id', getSingleUser)



app.get('/register', register)
app.post('/login', login)

// app.get('/components', getAllComponent)
// app.get('/components:id', getSingleComponent)
// app.post('/projects', addProject)

app.listen(port, () => {
    console.log(`Listening on port${port}`)
})

