const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const postRoute = require('./routes/posts');





//Tutorial Code Start

// import routes
const authRoute = require('./routes/auth');

dotenv.config();

//connect to db 
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true}, 
() => console.log('Connected to DB!'));

//middleware
app.use(express.json());

//route middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () => console.log('Server Up and running'));