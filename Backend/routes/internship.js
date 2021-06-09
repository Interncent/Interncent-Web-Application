const express = require('express');
const router = express.Router();
const db = require('../models');
const skillJSON = require('../data binder/skills.json');
const mailer = require('../handlers/mailer');

// Search Internships

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

router.get('/search/all', async (req, res, next) => {
    try {
        var recentDate = new Date();
        let internships = await db.InternshipDetails.find({ applyBy: { $gte: recentDate } }).populate({ path: 'faculty', select: 'fname lname photo email _id' }).exec();
        res.status(200).send(internships);
    } catch (err) {
        next(err);
    }

});

router.get('/search/title/:query', async (req, res, next) => {
    try {
        var regex = new RegExp(escapeRegex(req.params.query), 'gi');
        let internships = await db.InternshipDetails.find({ title: regex, applyBy: { $gte: recentDate } }).populate('faculty').exec();
        res.status(200).send(internships);
    } catch (err) {
        next(err);
    }

});


router.post('/search/filter', async (req, res, next) => {
    console.log(req.body);
    try {
        var query = new RegExp(escapeRegex(req.body.query), 'gi');
        var { min, max, skills, type } = req.body;
        min = parseInt(min);
        max = parseInt(max);
        var recentDate = new Date();
        skills = skills.map(skill => {
            return new RegExp(escapeRegex(skill), 'gi');
        });

        try {
            if (type.length === 1) {
                if (skills.length == 0) {
                    let internships = await db.InternshipDetails.find({ applyBy: { $gte: recentDate }, duration: { $gte: min, $lte: max }, title: query, type: type[0] }).populate('faculty').exec();
                    return res.status(200).send(internships);
                } else {
                    let internships = await db.InternshipDetails.find({ applyBy: { $gte: recentDate }, duration: { $gte: min, $lte: max }, title: query, skillsRequired: { $all: skills }, type: type[0] }).populate('faculty').exec();
                    return res.status(200).send(internships);
                }
            } else {
                if (skills.length === 0) {
                    let internships = await db.InternshipDetails.find({ applyBy: { $gte: recentDate }, title: query, duration: { $gte: min, $lte: max } }).populate('faculty').exec();
                    return res.status(200).send(internships);
                } else {
                    let internships = await db.InternshipDetails.find({ applyBy: { $gte: recentDate }, title: query, skillsRequired: { $all: skills }, duration: { $gte: min, $lte: max } }).populate('faculty').exec();
                    return res.status(200).send(internships);
                }
            }
        } catch (err) {
            console.log(err);
            return next(err);
        }
    } catch (err) {
        console.log(err);
        next(err);
    }

});



router.get('/search/skills', async (req, res, next) => {
    var skills = req.query.skills.split(',');
    skills = skills.map(skill => {
        return new RegExp(escapeRegex(skill), 'gi');
    })
    try {
        let suggested = await db.InternshipDetails.find({ skillsRequired: { $all: skills } }).populate('faculty', 'fname lname photo _id').exec();
        res.send(suggested.filter((m) => String(m._id) !== String(req.query.id)));

    } catch (error) {
        next(err)
    }

});

// Create Internship
router.post('/details', async (req, res, next) => {
    req.body.duration = parseInt(req.body.duration);
    req.body.numberOpenings = parseInt(req.body.numberOpenings);
    let user = await db.User.findById(req.body.faculty);
    if (user) {
        db.InternshipDetails.create(req.body)
            .then(async (internship) => {
                await user.internshipsOffered.push(internship);
                await user.save();
                res.status(200).send(internship);
            }).catch((err) => {
                next(err);
            });
    } else {
        return next({
            status: 404,
            message: 'User Not Found'
        })
    }
});
// Skill Suggestions
router.get('/skillSuggestion/:skill', (req, res, next) => {
    let query = req.params.skill.toLowerCase().split('');
    if (query.length > 5) {
        query.splice(5);
    }
    top = skillJSON;
    query.forEach(char => {
        top = top[char];
    });
    var top10 = top["top"];
    var skillObj = {};
    var skillArray = [];
    top10.forEach(skill => {
        skillObj["text"] = skill;
        // skillObj["value"] = skill;
        skillArray.push(skillObj);
        skillObj = {};
    });
    res.send(skillArray);
});
// Get Internship Details
router.get('/details/:id', (req, res, next) => {
    db.InternshipDetails.findById(req.params.id).populate('faculty', 'fname lname email _id photo').populate('applicants', 'fname lname email _id photo')
        .exec((err, internship) => {
            if (!internship) {
                return res.status(404).send({});
            }
            if (err) {
                return next(err);
            }

            let curr = new Date();
            internship["canApply"] = new Date(internship.applyBy) - curr > 0
            console.log(internship.canApply)
            return res.status(200).send(internship)
        })
});

router.get('/applications/:id', (req, res, next) => {
    db.InternshipDetails.findById(req.params.id).populate({path:'applications',populate:{path:'applicantId',select:'email fname lname dept year rollNo'}})
        .exec((err, internship) => {
            if (!internship) {
                return res.status(404).send({});
            }
            if (err) {
                return next(err);
            }
            return res.status(200).send(internship.applications)
        })
});

router.put('/details/', async (req, res, next) => {
    try {
        let user = await db.User.findById(req.body.id);
        let internship = await db.InternshipDetails.findById(req.body.data._id);
        if (user._id.equals(internship.faculty) && internship) {
            await internship.update(req.body.data);
            await internship.save();
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

router.delete('/details/:intId/:userId', async (req, res, next) => {
    try {
        let user = await db.User.findById(req.params.userId);
        let internship = await db.InternshipDetails.findById(req.params.intId);
        if (user._id.equals(internship.faculty) && internship) {
            user.internshipsOffered = user.internshipsOffered.filter((i) => internship._id !== i);
            await internship.remove();
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

// Bookmarks
router.get('/bookmarks/:id', (req, res, next) => {
    db.User.findById(req.params.id).populate({ path: 'bookmarks', populate: { path: 'faculty', select: 'fname lname photo email _id' } }).exec()
        .then((user) => {
            res.send(user.bookmarks);
        }).catch((err) => {
            next(err);
        });
})
router.put('/bookmark/add/:id', (req, res, next) => {
    db.InternshipDetails.findById(req.params.id)
        .then(async (internship) => {
            if (!internship) {
                return next({
                    status: 404,
                    message: 'Internship Not Found'
                })
            }
            try {
                let user = await db.User.findById(req.body.userId);
                if (user.bookmarks.includes(JSON.stringify(internship._id))) {
                    return next({
                        status: 405,
                        message: 'You have already bookmarked this post'
                    })
                }
                await user.bookmarks.push(internship);
                await user.save();
                res.send('Bookmark Added');
            } catch (error) {
                return next(error);
            }
        }).catch((err) => {
            next(err);
        });
});

router.put('/bookmark/delete/:id', (req, res, next) => {
    db.InternshipDetails.findById(req.params.id)
        .then(async (internship) => {
            if (!internship) {
                return next({
                    status: 404,
                    message: 'Internship Not Found'
                })
            }
            try {
                let user = await db.User.findById(req.body.userId);
                let to_remove = user.bookmarks.findIndex((u) => JSON.stringify(u) == JSON.stringify(internship._id));
                if (to_remove !== -1) {
                    await user.bookmarks.splice(to_remove, 1)
                    await user.save();
                    return res.send('Bookmark Deleted')
                } else {
                    return next({
                        status: 405,
                        message: 'You have not bookmarked this internship'
                    })
                }

            } catch (error) {
                next(error);
            }
        }).catch((err) => {
            next(err);
        });
});


// Apply in a Internship
router.post('/apply', (req, res, next) => {
    db.InternshipDetails.findById(req.body.internshipId)
        .then(async (internship) => {
            try {
                let user = await db.User.findById(req.body.applicantId);
                if (!user) {
                    return next({ status: 404, message: 'User Not Found' })
                }
                let isApplied = user.applications.includes(internship._id);
                if (user.role === "Student" && !isApplied && !(user._id.equals(internship.faculty))) {
                    let application = await db.Application.create(req.body);
                    await user.applications.push(internship);
                    await internship.applications.push(application);
                    await internship.applicants.push(user);
                    await user.save();
                    await internship.save();
                    res.send(internship)
                } else {
                    return next({ status: 405, message: 'Action is Not Permitted' });
                }
            } catch (error) {
                next(err);
            }
        }).catch((err) => {
            next(err);
        });
});

// mail Applicants
router.post('/mailapplicants', (req, res, next) => {
    db.User.findById(req.body.userId, 'role _id')
        .then(async user => {
            if (!user) {
                return next({ status: 404, message: 'User Not Found' })
            }
            if (!(["Faculty", "Council", "Alumni"].includes(user.role))) {
                return next({ status: 405, message: 'You are not allowed to send Mails' })
            }
            try {
                let internship = await db.InternshipDetails.findById(req.body.internshipId, 'faculty');
                if (internship.faculty._id == req.body.userId) {
                    mailer(req.body.mailBody);
                    return res.send('Mail Sent');
                } else {
                    next({ status: 405, message: 'You are not allowed to send mails for this internship' })
                }
            } catch (error) {
                return next(error);
            }
        })
        .catch(err => { console.log(err.message); next(err) });
})

router.put('/recruited/:id', async (req, res, next) => {
    try {
        var user = await db.User.findById(req.body.userId);
        var internship = await db.InternshipDetails.findById(req.params.id);
        var times = 0;
        if (user._id.equals(internship.faculty) && internship && user) {
            var recruited = [];
            if (req.body.selecteduser.length === 0) {
                internship.recruited = [];
                await internship.save();
                return res.send('changed recruited');

            }
            req.body.selecteduser.forEach(async (userit) => {
                db.User.findById(userit._id)
                    .then(async (userrec) => {
                        if (userrec) {
                            recruited.push(userrec);
                        }
                        else {
                            return next({
                                status: 404,
                                message: 'Applicant Not Found'
                            })
                        }

                        if (times === req.body.selecteduser.length) {
                            internship.recruited = recruited;
                            await internship.save();
                            res.send('changed recruited');
                        }
                    }).catch((err) => {
                        next(err);
                    });
                times++;

            })

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

module.exports = router;