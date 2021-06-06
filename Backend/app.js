const express = require('express');
const app = express();
app.disable('etag').disable('x-powered-by');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const socket = require('socket.io');
// const server = app.listen(process.env.PORT || 3001, process.env.IP, () => {
//     console.log('Server Listening on Port 3001');
// });
var server = require('http').createServer(app);
const io = socket(server, {
    cors: {
        origin: '*',
    }
});
server.listen(process.env.PORT || 3001, process.env.IP, () => {
    console.log('Server Listening on Port 3001')
})
const errorHandler = require('./handlers/errorHandler');
require('dotenv').config();
// Middleware
const { loginRequired, ensureCorrectUser } = require('./middleware');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// Database
require('./models/index');
require('./Chat')(io);
// require('./seedDB')();
// ROutes

const authRoutes = require('./routes/auth');
const communityRoutes = require('./routes/community.js');
const internshipRoutes = require('./routes/internship')
const userRoutes = require('./routes/user');


// Incuding Routes
app.use('/api/auth', authRoutes);
app.use('/api/:secureId/community', loginRequired, ensureCorrectUser, communityRoutes);
app.use('/api/:secureId/internship', loginRequired, ensureCorrectUser, internshipRoutes);
app.use('/api/:secureId', loginRequired, ensureCorrectUser, userRoutes)


app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(errorHandler);
