// const { Certificate } = require('crypto');
// const faker = require('faker');
const db = require('./models/index');


async function seedDB() {

    // data={
    //     name:'python',
    //     posts:['6005c3f662b5b0146419f686','6006d73dafda610c66141c40','60077ab8bfba5727e046fa62']
    // }
    // db.Hashtag.create(data)
    // .then((internship) => console.log(internship))
    //         .catch(err => console.log(err))
    // for (let i = 0; i < 3; i++) {
    //     data = {
    //         faculty: "5fd78c0e0bccef3be8cc08ab",
    //         title: 'Machine Learning',
    //         skillsRequired: ['Python', 'R', 'Pandas'],
    //         duration: Math.floor(Math.random() * 13),
    //         applyBy: new Date('2021-12-30T22:58:32.786Z'),
    //         numberOpenings: Math.floor(Math.random() * 3),
    //         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque delectus tempore eos quibusdam, tenetur quas nihil asperiores molestiae ad sunt, dolore, minima blanditiis? Error unde sapiente, temporibus sit eius neque.",
    //         perks: 'Certificate',
    //         type: 'External'
    //     }
    //     db.InternshipDetails.create(data)
    //         .then((internship) => console.log(internship))
    //         .catch(err => console.log(err))
    // }
    // data = {
    //     facultyEmails: ['vedant.nagani@somaiya.edu', 'huzaifa.k@somaiya.edu'],
    //     councilEmails: ['dhruva.b@somaiya.edu'],
    //     alumniEmails: ['vedantnagani@gmail.com']
    // }
    // db.HiddenData.create(data)
    //     .then((result) => {
    //         console.log('Added')
    //     }).catch((err) => {
    //         console.log(err);
    //     });

    // data = {
    //     text: 'Hieee',
    //     author: '600d75391095e4111c1f6967'
    // }
    // for (let i = 0; i < 1; i++) {

    //     db.Message.create(data)
    //         .then((result) => {
    //             console.log('Added')
    //         }).catch((err) => {
    //             console.log(err);
    //         });
    // }
    // db.Conversation.create({})
    //     .then((result) => {
    //         result.messages.push('60bc9a7f9da5a22d6c44968f')
    //         result.messages.push('60bca1b72583df2034d5fc73')
    //         result.save()

    //     }).catch((err) => {

    //     });

    // let user = await db.User.findById('60c4bcc82bf0ae1a4ca66e0e', 'interactions').populate({ path: 'interactions', populate: [{ path: 'otherUser', select: 'fname lname photo _id email' }, { path: 'conversation', select: 'updatedAt' }] })
    // console.log(user)


    // For Event Creation
    // 60c5fdd76b1a5b37680fabdb
    for (let i = 0; i < 20; i++) {
        data = {
            college: "KJSCE",
            organiser: '60c5fdd76b1a5b37680fabdb',
            title: "Flutter Workshop",
            venue: "Mumbai",
            startTime: '4',
            endTime: '5',
            date: new Date(),
            category: "Workshop",
            link: 'https://www.robocon.com',
            photo: "https://i.ytimg.com/vi/k1VWULNNHa4/maxresdefault.jpg",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            applyBy: new Date('2021-09-17T00:00:00.000Z')
        }
        db.Event.create(data)
            .then((result) => {
                console.log('event Created')
            }).catch((err) => {
                console.log(err);
            });
    }
}


module.exports = seedDB;