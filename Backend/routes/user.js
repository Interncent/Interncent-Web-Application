const express = require('express');
const router = express.Router();
const db = require('../models');
const { correctAccess } = require('../middleware/index')
const cloudinary = require('cloudinary');
const multer = require('multer');
cloudinary.config({
    cloud_name: 'ved13',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
var storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter });


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}


// Get user for profile viewing
router.get('/userForProfile/:id', (req, res, next) => {
    db.User.findOne({ email: req.params.id + '@somaiya.edu' }, '-password').populate('events').populate({ path: 'applications', populate: { path: 'internshipId', select: 'title duration _id description category' }, select: 'internshipId state _id' }).populate('certificates').populate('experiences').populate('projects').populate('achievements').populate({ path: "internshipsOffered", select: "title category duration category description" }).populate({ path: 'members', populate: { path: 'member', select: 'fname lname _id email photo' } }).populate({ path: 'commented', populate: { path: 'post', select: '_id image author', populate: { path: 'author', select: ' fname lname email' } } }).populate({ path: 'liked', populate: { path: 'post', select: '_id image author', populate: { path: 'author', select: 'email fname lname photo' } } }).exec()
        .then((user) => {
            user.password = ''
            res.status(200).send(user);
        }).catch((err) => {
            next(err);
        });
});
// User Suggestions
router.get('/profile/search', (req, res, next) => {
    let regex = new RegExp(escapeRegex(req.query.name), 'gi')
    db.User.find({ fname: regex }, '_id lname fname photo')
        .then((users) => {
            users.forEach(user => {
                // Object.assign(user, { "text": `${user['fname']} ${user['lname']}` });
                // user['fname'] = user['text']
            });
            res.send(users);
            // res.status(200).send(users)
        }).catch((err) => {
            next({
                status: 404,
                message: 'User Not Found'
            })
        });
});

// Profile Picture Upload
router.put('/profile/update/photo', upload.single('file'), (req, res, next) => {
    db.User.findById(req.body.id)
        .then(async (user) => {
            try {
                await cloudinary.v2.uploader.destroy(user.photoId);
                var result = await cloudinary.v2.uploader.upload(req.file.path);
                user.photoId = result.public_id;
                user.photo = result.secure_url;
                await user.save();
                return res.send({ photo: result.secure_url, photoId: result.public_id });

            } catch (err) {
                next(err);
            }
        })
        .catch(err => next(err))
});


router.put('/profile/update/skills', (req, res, next) => {
    db.User.findByIdAndUpdate(req.body.id, { skills: req.body.skills })
        .then(async (user) => {
            res.send('Updated!');
        }).catch((err) => {
            next(err);
        });
});


router.put('/profile/update/basicinfo', (req, res, next) => {
    db.User.findByIdAndUpdate(req.body.id, req.body.user)
        .then(async (user) => {
            res.send('Updated!');
        }).catch((err) => {
            next(err);
        });
});


router.put('/profile/update/certificates', (req, res, next) => {
    db.User.findById(req.body.id)
        .then(async user => {
            if (!user) {
                return next({ status: 404, message: "User Not Found" });
            }
            try {
                let certificate = await db.Certificate.create(req.body.certificate)
                await user.certificates.push(certificate);
                await user.save();
                res.send(certificate);
            } catch (error) {
                next(error);
            }
        }).catch((err) => {
            next(err);
        });
});

router.delete('/profile/update/certificates/:userId/:certId', (req, res, next) => {
    db.User.findById(req.params.userId)
        .then(async (user) => {
            if (!user) {
                return next({
                    status: 404,
                    message: "User Not Found"
                })
            }
            try {
                let certificate = db.Certificate.findById(req.params.certId);
                if (certificate) {
                    await certificate.remove();
                    let to_remove = user.certificates.findIndex((m) => String(m._id) === String(req.params.certId));
                    await user.certificates.splice(to_remove, 1);
                    await user.save();
                    res.send('certificate deleted');
                } else {
                    return next({
                        status: 404,
                        message: "certificate Not Found"
                    })
                }
            } catch (err) {
                next(err);
            }
        }).catch((err) => {
            next(err);
        });
})

router.put('/profile/update/resume', (req, res, next) => {
    db.User.findById(req.body.id)
        .then(async (user) => {
            try {
                let resumeFile = {
                    files: req.body.file,
                    author: user
                };
                let resume = db.File.create(resumeFile);
                user.resume = resume;
                await user.save();
            } catch (err) {
                next(err);
            }
        })
        .catch(err => {
            next(err);
        })
});

router.put('/profile/update/experiences', (req, res, next) => {
    db.User.findById(req.body.id)
        .then(async user => {
            if (!user) {
                return next({ status: 404, message: "User Not Found" });
            }
            try {
                let experience = await db.Experience.create(req.body.experience)
                await user.experiences.push(experience);
                await user.save();
                res.send(experience);
            } catch (error) {
                next(error);
            }
        }).catch((err) => {
            next(err);
        });
});
router.delete('/profile/update/experiences/:userId/:expId', (req, res, next) => {
    db.User.findById(req.params.userId)
        .then(async (user) => {
            if (!user) {
                return next({
                    status: 404,
                    message: "User Not Found"
                })
            }
            try {
                let experience = db.Experience.findById(req.params.expId);
                if (experience) {
                    await experience.remove();
                    let to_remove = user.experiences.findIndex((m) => String(m._id) === String(req.params.expId));
                    await user.experiences.splice(to_remove, 1);
                    await user.save();
                    res.send('experience deleted');
                } else {
                    return next({
                        status: 404,
                        message: "experience Not Found"
                    })
                }
            } catch (err) {
                next(err);
            }
        }).catch((err) => {
            next(err);
        });
})
router.put('/profile/edit/experience', (req, res, next) => {
    db.Experience.findByIdAndUpdate(req.body.experience._id, req.body.experience)
        .then(async () => {
            res.send('Updated!');
        }).catch((err) => {
            next(err);
        });
})
router.put('/profile/update/projects', (req, res, next) => {
    db.User.findById(req.body.id)
        .then(async user => {
            if (!user) {
                return next({ status: 404, message: "User Not Found" });
            }
            try {
                let project = await db.Project.create(req.body.project)
                await user.projects.push(project);
                await user.save();
                res.send(project);
            } catch (error) {
                next(error);
            }
        }).catch((err) => {
            next(err);
        });
});

router.delete('/profile/update/projects/:userId/:projectId', (req, res, next) => {
    db.User.findById(req.params.userId)
        .then(async (user) => {
            if (!user) {
                return next({
                    status: 404,
                    message: "User Not Found"
                })
            }
            try {
                let project = db.Project.findById(req.params.projectId);
                if (project) {
                    await project.remove();
                    let to_remove = user.projects.findIndex((m) => String(m._id) === String(req.params.projectId));
                    await user.projects.splice(to_remove, 1);
                    await user.save();
                    res.send('project deleted');
                } else {
                    return next({
                        status: 404,
                        message: "project Not Found"
                    })
                }
            } catch (err) {
                next(err);
            }
        }).catch((err) => {
            next(err);
        });
})
router.put('/profile/edit/project', (req, res, next) => {
    db.Project.findByIdAndUpdate(req.body.project._id, req.body.project)
        .then(async () => {
            res.send('Updated!');
        }).catch((err) => {
            next(err);
        });
})
// COuncil
router.get('/council/findMembers/:name', (req, res, next) => {
    const nameArr = req.params.name.split(' ');
    const fname = RegExp(escapeRegex(nameArr[0]), 'gi');
    if (nameArr.length === 1) {
        db.User.find({ fname: fname, role: 'Student' }, 'fname lname photo email _id')
            .then((users) => {
                res.send(users);
            }).catch((err) => {
                next(err);
            });
    } else {
        const lname = RegExp(escapeRegex(nameArr[1]), 'gi');
        db.User.find({ fname: fname, lname: lname, role: 'Student' }, 'fname lname photo email _id')
            .then((users) => {
                res.send(users);
            }).catch((err) => {
                next(err);
            });
    }
});

router.put('/council/addMember/:id', (req, res, next) => {
    console.log(req.body)
    db.User.findById(req.params.id)
        .then(async (user) => {
            if (!user) {
                return next({
                    status: 404,
                    message: "User Not Found"
                })
            }
            if (user.role !== "Council") {
                return next({
                    status: 405,
                    message: 'Only Councils Can Add Members'
                })
            }
            try {
                let member = await db.CouncilMember.create(req.body);
                await user.members.push(member);
                await user.save();
                member = await member.populate({ path: 'member', select: 'fname lname email _id photo' });
                res.send(member);
            } catch (err) {
                next(err);
            }
        }).catch((err) => {
            next(err);
        });
})

router.delete('/council/deleteMember/:userId/:memberId', (req, res, next) => {
    db.User.findById(req.params.userId)
        .then(async (user) => {
            if (!user) {
                return next({
                    status: 404,
                    message: "User Not Found"
                })
            }
            try {
                let member = db.CouncilMember.findById(req.params.memberId);
                if (member) {
                    await member.remove();
                    let to_remove = user.members.findIndex((m) => JSON.stringify(m) == JSON.stringify(member._id));
                    await user.members.splice(to_remove, 1);
                    await user.save();
                    res.send('Member Deleted');
                } else {
                    return next({
                        status: 404,
                        message: "Member Not Found"
                    })
                }
            } catch (err) {
                next(err);
            }
        }).catch((err) => {
            next(err);
        });
})

router.post('/council/addEvent/:userId', (req, res, nex) => {
    db.User.findById(req.params.userId)
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

router.delete('/council/deleteEvent/:userId/:eventId', (req, res, next) => {
    db.User.findById(req.params.userId)
        .then(async (user) => {
            if (!user) {
                return next({
                    status: 404,
                    message: "User Not Found"
                })
            }
            try {
                let event = db.Event.findById(req.params.eventId);
                if (event) {
                    await event.remove();
                    let to_remove = user.events.findIndex((m) => String(m._id) === String(req.params.eventId));
                    await user.events.splice(to_remove, 1);
                    await user.save();
                    res.send('Event Added');
                } else {
                    return next({
                        status: 404,
                        message: "Event Not Found"
                    })
                }
            } catch (err) {
                next(err);
            }
        }).catch((err) => {

        });
})
router.put('/council/editEvent', (req, res, next) => {
    db.Event.findByIdAndUpdate(req.body.event._id, req.body.event)
        .then(async () => {
            res.send('Updated!');
        }).catch((err) => {
            next(err);
        });
})

router.put('/profile/update/achievements', (req, res, next) => {
    db.User.findById(req.body.id)
        .then(async user => {
            if (!user) {
                return next({ status: 404, message: "User Not Found" });
            }
            try {
                let achievement = await db.Achievement.create(req.body.achievement)
                await user.achievements.push(achievement);
                await user.save();
                res.send(achievement);
            } catch (error) {
                next(error);
            }
        }).catch((err) => {
            next(err);
        });
});
router.delete('/profile/update/achievements/:userId/:expId', (req, res, next) => {
    db.User.findById(req.params.userId)
        .then(async (user) => {
            if (!user) {
                return next({
                    status: 404,
                    message: "User Not Found"
                })
            }
            try {
                let achievement = db.Achievement.findById(req.params.expId);
                if (achievement) {
                    await achievement.remove();
                    let to_remove = user.achievements.findIndex((m) => String(m._id) === String(req.params.expId));
                    await user.achievements.splice(to_remove, 1);
                    await user.save();
                    res.send('achievement deleted');
                } else {
                    return next({
                        status: 404,
                        message: "achievement Not Found"
                    })
                }
            } catch (err) {
                next(err);
            }
        }).catch((err) => {
            next(err);
        });
})
router.put('/profile/edit/achievement', (req, res, next) => {
    db.Achievement.findByIdAndUpdate(req.body.achievement._id, req.body.achievement)
        .then(async () => {
            res.send('Updated!');
        }).catch((err) => {
            next(err);
        });
})


// Suggested Members
router.get('/suggestUsers/:name', (req, res, next) => {
    const nameArr = req.params.name.split(' ');
    const fname = RegExp(escapeRegex(nameArr[0]), 'gi');
    if (nameArr.length === 1) {
        db.User.find({ fname: fname }, 'fname lname photo email')
            .then((users) => {
                res.send(users);
            }).catch((err) => {
                next(err);
            });
    } else {
        const lname = RegExp(escapeRegex(nameArr[1]), 'gi');
        db.User.find({ fname: fname, lname: lname }, 'fname lname photo email')
            .then((users) => {
                res.send(users);
            }).catch((err) => {
                next(err);
            });
    }
})

router.put('/getConversations', (req, res, next) => {
    let array = []
    let times = 0
    req.body.list.forEach((e) => {
        try {
            db.Conversation.findById(e).populate({ path: 'users', select: 'fname lname email _id photo' }).populate("messages").then(data => {
                array.push(data)
                if (times === req.body.list.length - 1) {
                    res.status(200).send({ list: array });
                }
                times++;
            }).catch(e => console.log((e)))
        }
        catch (err) {
            next(err);
        }

    })
})

router.get('/getUsersPosts/:userId', async (req, res, next) => {
    db.User.findById(req.params.userId).populate("posts").populate({ path: "posts", populate: { path: 'comments', populate: { path: 'author' } } })
        .then(async (user) => {
            if (!user) {
                return next({
                    status: 404,
                    message: "User Not Found"
                })
            }
            try {
                res.status(200).send({ posts: user.posts })
            } catch (err) {
                next(err);
            }
        }).catch((err) => {
            next(err);
        });
    // let array = []
    // let times = 0
    // req.body.list.forEach((e) => {
    //     try {
    //         db.Post.findById(e).populate({ path: 'comments', populate: { path: 'author' } }).then(data => {
    //             array.push(data)
    //             if (times === req.body.list.length - 1) {
    //                 array.sort((a,b)=>{
    //                     return new Date(b.created) - new Date(a.created)})
    //                 res.status(200).send({ list: array.reverse() });
    //             }
    //             times++;
    //         }).catch(e => console.log((e)))
    //     }
    //     catch (err) {
    //         next(err);
    //     }

    // })
})

module.exports = router;
