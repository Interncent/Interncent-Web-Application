const express = require('express');
const app = express();
app.disable('etag').disable('x-powered-by');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Socket
const socket = require('socket.io');
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

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Database
require('./models/index');
require('./Chat')(io);
// require('./seedDB')();


// Routes
const authRoutes = require('./routes/auth');
const communityRoutes = require('./routes/community.js');
const internshipRoutes = require('./routes/internship')
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/messaging')

// Incuding Routes
app.use('/api/auth', authRoutes);
app.use('/api/:secureId/community', loginRequired, ensureCorrectUser, communityRoutes);
app.use('/api/:secureId/internship', loginRequired, ensureCorrectUser, internshipRoutes);
app.use('/api/:secureId', loginRequired, ensureCorrectUser, userRoutes)
app.use('/api/:secureId/message', messageRoutes)



app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error Handling
app.use(errorHandler);
