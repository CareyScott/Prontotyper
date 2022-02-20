const express = require('express');
const cors =  require('cors');
require('dotenv').config()
require ('./db')()

// importing the controllers
const { getAllProjects, getSingleProject } = require('./controllers/project_controller') 
const { getAllUsers, getSingleUser } = require('./controllers/user_controller') 
// const { getAllComponent, getSingleComponent } = require('./controllers/component_controller') 


const port = process.env.PORT

const app = express()
app.use(cors())
app.use(express.json())

app.get('/projects', getAllProjects)
app.get('/projects:id', getSingleProject)

app.get('/users', getAllUsers)
app.get('/users:id', getSingleUser)

// app.get('/components', getAllComponent)
// app.get('/components:id', getSingleComponent)
// app.post('/projects', addProject)

app.listen(port, () => {
    console.log(`Listening on port${port}`)
})

