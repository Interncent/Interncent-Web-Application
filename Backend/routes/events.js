const express = require('express');
const router = express.Router();
const db = require('../models');

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// Get all Events
router.get('/getall', (req, res, next) => {
    db.Event.find().populate('organiser', 'fname lname email photo').exec()
        .then((events) => {
            res.send(events)
        }).catch((err) => {
            next(err)
        });
})

// Filter Events by Title
router.get('/title/:query', async (req, res, next) => {
    try {
        var regex = new RegExp(escapeRegex(req.params.query), 'gi');
        var recentDate = new Date();
        let events = await db.Event.find({ title: regex, applyBy: { $gte: recentDate } }).populate('organiser', 'fname lname email photo').exec();
        res.status(200).send(events);
    } catch (err) {
        next(err);
    }
});

// Filter Events by college, council, category
// Category- competetion, culture & entertainment, seminar, webinar,workshop, social work 
router.post('/filter', async (req, res, next) => {
    console.log(req.body);
    try {
        var query = new RegExp(escapeRegex(req.body.query), 'gi');
        var { category } = req.body;
        var recentDate = new Date();
        try {
            let events = await db.Event.find({ applyBy: { $gte: recentDate }, title: query, category: { $in: category } }).populate('organiser', 'fname lname email photo').exec();
            return res.status(200).send(events);
        } catch (err) {
            console.log(err);
            return next(err);
        }
    } catch (err) {
        console.log(err);
        next(err);
    }

});


// Add an Event
router.post('/events', (req, res, nex) => {
    db.User.findById(req.body.userId)
        .then(async (user) => {
            if (!user) {
                return next({
                    status: 404,
                    message: 'User Not Found'
                })
            }
            if (user.role !== "Council") {
                return next({
                    status: 405,
                    message: 'Only Councils Can Create Events'
                })
            }
            try {
                let event = await db.Event.create(req.body);
                await user.events.push(event);
                await user.save();
                res.send(event);
            } catch (err) {
                next(err);
            }

        }).catch((err) => {
            next(err);
        });
})

// Delete Individual event
router.delete('/events', async (req, res, next) => {
    try {
        let user = await db.User.findById(req.body.userId);
        let event = await db.Event.findById(req.body.eventId);
        if (user._id.equals(event.organiser) && events) {
            user.events = user.events.filter((i) => event._id !== i);
            await event.remove();
            await user.save();
            return res.status(200).send("deleted")
        } else {
            next({
                status: 403,
                message: 'Permission denied to perfrom the action.'
            })
        }

    } catch (error) {
        next(error);
    }

});

// Edit Individual Event
router.put('/events', async (req, res, next) => {
    try {
        let user = await db.User.findById(req.body.id);
        let event = await db.Event.findById(req.body.data._id);
        if (user._id.equals(event.organiser) && event) {
            await event.update(req.body.data);
            await event.save();
            return res.status(200).send("edited")
        } else {
            next({
                status: 403,
                message: 'Permission denied to perfrom the action.'
            })
        }
    } catch (error) {
        next(error);
    }
});


// Find Individual Event
router.get('/specific/:id', (req, res, next) => {
    db.Event.findById(req.params.id).populate('organiser', 'fname lname email photo')
        .then((result) => {
            res.send(result)
        }).catch((err) => {
            next(err)
        });
})


// Register for Event
router.post('/register/:id', (req, res, next) => {
    db.Event.findById(req.params.id)
        .then((event) => {
            if (!event) {
                return next({
                    status: 404,
                    message: 'Event Not Found'
                })
            }
            db.EventRegistration.findOne({ email: req.body.email })
                .then(async (registration) => {
                    if (Object.keys(registration).length != 0) {
                        return next({ status: 403, message: 'Email is already registered' })
                    }
                    try {
                        let newReg = await db.EventRegistration.create(req.body)
                        event.registrations.push(newReg)
                        await event.save()
                        res.send('Registraion Successfull')
                    } catch (error) {
                        next(error)
                    }
                }).catch((err) => {
                    next(err)
                });
        }).catch((err) => {
            next(err)
        });
})
module.exports = router