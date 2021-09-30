const db = require('./models/index');

function randrange(minimum,maximum){
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

function addDays(days) {
    var result = new Date();
    result.setDate(result.getDate() + days);
    return result;
}

async function seedDB() {
    // var ints = [
    //     {
    //         faculty: "6155bc052426181b3443d959",
    //         title: 'Machine Learning',
    //         skillsRequired: ['Python', 'R', 'Pandas',"Matplotlib"],
    //         duration: Math.floor(Math.random() * 13) + 1,
    //         applyBy: addDays(Math.floor(Math.random() * 40)+1),
    //         numberOpenings: Math.floor(Math.random() * 10+1),
    //         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque delectus tempore eos quibusdam, tenetur quas nihil asperiores molestiae ad sunt, dolore, minima blanditiis? Error unde sapiente, temporibus sit eius neque.",
    //         perks: 'Certificate',
    //         type: ['External','Work from Home'][Math.floor(Math.random() * 2)],
    //         category: ['Internship','Research','Recruitment'][Math.floor(Math.random() * 2)]
    //     },
    //     {
    //         faculty: "6155bc052426181b3443d959",
    //         title: 'Deep Learning',
    //         skillsRequired: ['Python',"Keras","NumPy", 'Pandas'],
    //         duration: Math.floor(Math.random() * 13) + 1,
    //         applyBy: addDays(Math.floor(Math.random() * 40)+1),
    //         numberOpenings: Math.floor(Math.random() * 10+1),
    //         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque delectus tempore eos quibusdam, tenetur quas nihil asperiores molestiae ad sunt, dolore, minima blanditiis? Error unde sapiente, temporibus sit eius neque.",
    //         perks: 'Certificate',
    //         type: ['External','Work from Home'][Math.floor(Math.random() * 2)],
    //         category: ['Internship','Research','Recruitment'][Math.floor(Math.random() * 2)]
    //     },
    //     {
    //         faculty: "6155bc052426181b3443d959",
    //         title: 'Image Processing',
    //         skillsRequired: ['Python', 'R', 'Pandas',"OpenCV","NumPy"],
    //         duration: Math.floor(Math.random() * 13) + 1,
    //         applyBy: addDays(Math.floor(Math.random() * 40)+1),
    //         numberOpenings: Math.floor(Math.random() * 10+1),
    //         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque delectus tempore eos quibusdam, tenetur quas nihil asperiores molestiae ad sunt, dolore, minima blanditiis? Error unde sapiente, temporibus sit eius neque.",
    //         perks: 'Certificate',
    //         type: ['External','Work from Home'][Math.floor(Math.random() * 2)],
    //         category: ['Internship','Research','Recruitment'][Math.floor(Math.random() * 2)]
    //     },
    //     {
    //         faculty: "6155bc052426181b3443d959",
    //         title: 'NLP development',
    //         skillsRequired: ['Python', 'R', 'Pandas'],
    //         duration: Math.floor(Math.random() * 13) + 1,
    //         applyBy: addDays(Math.floor(Math.random() * 40)+1),
    //         numberOpenings: Math.floor(Math.random() * 10+1),
    //         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque delectus tempore eos quibusdam, tenetur quas nihil asperiores molestiae ad sunt, dolore, minima blanditiis? Error unde sapiente, temporibus sit eius neque.",
    //         perks: 'Certificate',
    //         type: ['External','Work from Home'][Math.floor(Math.random() * 2)],
    //         category: ['Internship','Research','Recruitment'][Math.floor(Math.random() * 2)]
    //     },
    //     {
    //         faculty: "6155bc052426181b3443d959",
    //         title: 'Python Development',
    //         skillsRequired: ['Python', 'Pygame'],
    //         duration: Math.floor(Math.random() * 13) + 1,
    //         applyBy: addDays(Math.floor(Math.random() * 40)+1),
    //         numberOpenings: Math.floor(Math.random() * 10+1),
    //         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque delectus tempore eos quibusdam, tenetur quas nihil asperiores molestiae ad sunt, dolore, minima blanditiis? Error unde sapiente, temporibus sit eius neque.",
    //         perks: 'Certificate',
    //         type: ['External','Work from Home'][Math.floor(Math.random() * 2)],
    //         category: ['Internship','Research','Recruitment'][Math.floor(Math.random() * 2)]
    //     },
    //     {
    //         faculty: "6155bc6f2426181b3443d95f",
    //         title: 'Node Development',
    //         skillsRequired: ['Javascript', 'Node.js'],
    //         duration: Math.floor(Math.random() * 13) + 1,
    //         applyBy: addDays(Math.floor(Math.random() * 40)+1),
    //         numberOpenings: Math.floor(Math.random() * 10+1),
    //         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque delectus tempore eos quibusdam, tenetur quas nihil asperiores molestiae ad sunt, dolore, minima blanditiis? Error unde sapiente, temporibus sit eius neque.",
    //         perks: 'Certificate',
    //         type: ['External','Work from Home'][Math.floor(Math.random() * 2)],
    //         category: ['Internship','Research','Recruitment'][Math.floor(Math.random() * 2)]
    //     },
    //     {
    //         faculty: "6155bc6f2426181b3443d95f",
    //         title: 'Graphic Designing',
    //         skillsRequired: ['Blender', 'Photoshop', 'Figma'],
    //         duration: Math.floor(Math.random() * 13) + 1,
    //         applyBy: addDays(Math.floor(Math.random() * 40)+1),
    //         numberOpenings: Math.floor(Math.random() * 10+1),
    //         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque delectus tempore eos quibusdam, tenetur quas nihil asperiores molestiae ad sunt, dolore, minima blanditiis? Error unde sapiente, temporibus sit eius neque.",
    //         perks: 'Certificate',
    //         type: ['External','Work from Home'][Math.floor(Math.random() * 2)],
    //         category: ['Internship','Research','Recruitment'][Math.floor(Math.random() * 2)]
    //     },
    //     {
    //         faculty: "6155bc6f2426181b3443d95f",
    //         title: 'Flutter Development',
    //         skillsRequired: ['Flutter',"Firebase"],
    //         duration: Math.floor(Math.random() * 13) + 1,
    //         applyBy: addDays(Math.floor(Math.random() * 40)+1),
    //         numberOpenings: Math.floor(Math.random() * 10+1),
    //         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque delectus tempore eos quibusdam, tenetur quas nihil asperiores molestiae ad sunt, dolore, minima blanditiis? Error unde sapiente, temporibus sit eius neque.",
    //         perks: 'Certificate',
    //         type: ['External','Work from Home'][Math.floor(Math.random() * 2)],
    //         category: ['Internship','Research','Recruitment'][Math.floor(Math.random() * 2)]
    //     },
    //     {
    //         faculty: "6155bc6f2426181b3443d95f",
    //         title: 'Full Stack Development',
    //         skillsRequired: ['React.js', 'Javascript', 'MongoDB'],
    //         duration: Math.floor(Math.random() * 13) + 1,
    //         applyBy: addDays(Math.floor(Math.random() * 40)+1),
    //         numberOpenings: Math.floor(Math.random() * 10+1),
    //         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque delectus tempore eos quibusdam, tenetur quas nihil asperiores molestiae ad sunt, dolore, minima blanditiis? Error unde sapiente, temporibus sit eius neque.",
    //         perks: 'Certificate',
    //         type: ['External','Work from Home'][Math.floor(Math.random() * 2)],
    //         category: ['Internship','Research','Recruitment'][Math.floor(Math.random() * 2)]
    //     },
    //     {
    //         faculty: "6155bc6f2426181b3443d95f",
    //         title: 'Game Development',
    //         skillsRequired: ['C#', 'Blender'],
    //         duration: Math.floor(Math.random() * 13) + 1,
    //         applyBy: addDays(Math.floor(Math.random() * 40)+1),
    //         numberOpenings: Math.floor(Math.random() * 10+1),
    //         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque delectus tempore eos quibusdam, tenetur quas nihil asperiores molestiae ad sunt, dolore, minima blanditiis? Error unde sapiente, temporibus sit eius neque.",
    //         perks: 'Certificate',
    //         type: ['External','Work from Home'][Math.floor(Math.random() * 2)],
    //         category: ['Internship','Research','Recruitment'][Math.floor(Math.random() * 2)]
    //     }
    // ];
    // for (let i = 0; i < 10; i++) {
    //     for (let i = 0; i < 10; i++) {
    //         db.InternshipDetails.create(ints[i])
    //             .then((internship) => console.log(internship))
    //             .catch(err => console.log(err))
    //     }
    // }





    events =[
        {
            organiser: "6155cf0752ad2031dfaa1523",
            title: "Lorem ipsum dolor sit amet",
            venue: "Room number "+randrange(100,599),
            startTime: "5 PM",
            endTime: "7 PM",
            date: addDays(Math.floor(Math.random() * 40)+1),
            category: ['Competetion', 'Workshop', 'Culture & Entertainment', 'Seminar', 'Webinar', 'Social Work'][Math.floor(Math.random() * 6)],
            link: "https://www.microsoft.com/en-us/event",
            photo: "https://randomwordgenerator.com/img/picture-generator/57e5d04a4a52ac14f1dc8460962e33791c3ad6e04e507440762e79d7924ac5_640.jpg",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque delectus tempore eos quibusdam, tenetur quas nihil asperiores molestiae ad sunt, dolore, minima blanditiis? Error unde sapiente, temporibus sit eius neque.",
            applyBy: new Date(),
            openToAll: [true,false][Math.floor(Math.random() * 2)]
        },
        {
            organiser: "6155cf0752ad2031dfaa1523",
            title: "Lorem ipsum dolor sit amet",
            venue: "Room number "+randrange(100,599),
            startTime: "5 PM",
            endTime: "7 PM",
            date: addDays(Math.floor(Math.random() * 40)+1),
            category: ['Competetion', 'Workshop', 'Culture & Entertainment', 'Seminar', 'Webinar', 'Social Work'][Math.floor(Math.random() * 6)],
            link: "https://www.microsoft.com/en-us/event",
            photo: "https://randomwordgenerator.com/img/picture-generator/54e8d0414851ad14f1dc8460962e33791c3ad6e04e50744172287cd09f48c5_640.jpg",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque delectus tempore eos quibusdam, tenetur quas nihil asperiores molestiae ad sunt, dolore, minima blanditiis? Error unde sapiente, temporibus sit eius neque.",
            applyBy: new Date(),
            openToAll: [true,false][Math.floor(Math.random() * 2)]
        },
        {
            organiser: "6155cf0752ad2031dfaa1523",
            title: "Lorem ipsum dolor sit amet",
            venue: "Room number "+randrange(100,599),
            startTime: "5 PM",
            endTime: "7 PM",
            date: addDays(Math.floor(Math.random() * 40)+1),
            category: ['Competetion', 'Workshop', 'Culture & Entertainment', 'Seminar', 'Webinar', 'Social Work'][Math.floor(Math.random() * 6)],
            link: "https://www.microsoft.com/en-us/event",
            photo: "https://randomwordgenerator.com/img/picture-generator/54e0d6444e53a414f1dc8460962e33791c3ad6e04e5074417c2d78d39444c4_640.jpg",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque delectus tempore eos quibusdam, tenetur quas nihil asperiores molestiae ad sunt, dolore, minima blanditiis? Error unde sapiente, temporibus sit eius neque.",
            applyBy: new Date(),
            openToAll: [true,false][Math.floor(Math.random() * 2)]
        },
        {
            organiser: "6155cf0752ad2031dfaa1523",
            title: "Lorem ipsum dolor sit amet",
            venue: "Room number "+randrange(100,599),
            startTime: "5 PM",
            endTime: "7 PM",
            date: addDays(Math.floor(Math.random() * 40)+1),
            category: ['Competetion', 'Workshop', 'Culture & Entertainment', 'Seminar', 'Webinar', 'Social Work'][Math.floor(Math.random() * 6)],
            link: "https://www.microsoft.com/en-us/event",
            photo: "https://randomwordgenerator.com/img/picture-generator/54e6d5464f52ae14f1dc8460962e33791c3ad6e04e50744172297cdc9e48c3_640.jpg",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque delectus tempore eos quibusdam, tenetur quas nihil asperiores molestiae ad sunt, dolore, minima blanditiis? Error unde sapiente, temporibus sit eius neque.",
            applyBy: new Date(),
            openToAll: [true,false][Math.floor(Math.random() * 2)]
        },
        {
            organiser: "6155cf0752ad2031dfaa1523",
            title: "Lorem ipsum dolor sit amet",
            venue: "Room number "+randrange(100,599),
            startTime: "5 PM",
            endTime: "7 PM",
            date: addDays(Math.floor(Math.random() * 40)+1),
            category: ['Competetion', 'Workshop', 'Culture & Entertainment', 'Seminar', 'Webinar', 'Social Work'][Math.floor(Math.random() * 6)],
            link: "https://www.microsoft.com/en-us/event",
            photo: "https://randomwordgenerator.com/img/picture-generator/54e6d4474f50a814f1dc8460962e33791c3ad6e04e5074417c2c7fd59e48c3_640.jpg",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque delectus tempore eos quibusdam, tenetur quas nihil asperiores molestiae ad sunt, dolore, minima blanditiis? Error unde sapiente, temporibus sit eius neque.",
            applyBy: new Date(),
            openToAll: [true,false][Math.floor(Math.random() * 2)]
        },
        {
            organiser: "6155cf0752ad2031dfaa1523",
            title: "Lorem ipsum dolor sit amet",
            venue: "Room number "+randrange(100,599),
            startTime: "5 PM",
            endTime: "7 PM",
            date: addDays(Math.floor(Math.random() * 40)+1),
            category: ['Competetion', 'Workshop', 'Culture & Entertainment', 'Seminar', 'Webinar', 'Social Work'][Math.floor(Math.random() * 6)],
            link: "https://www.microsoft.com/en-us/event",
            photo: "https://randomwordgenerator.com/img/picture-generator/53e1d7444d53af14f1dc8460962e33791c3ad6e04e507440742a7ad19f4cc0_640.jpg",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque delectus tempore eos quibusdam, tenetur quas nihil asperiores molestiae ad sunt, dolore, minima blanditiis? Error unde sapiente, temporibus sit eius neque.",
            applyBy: new Date(),
            openToAll: [true,false][Math.floor(Math.random() * 2)]
        },
        {
            organiser: "6155cf0752ad2031dfaa1523",
            title: "Lorem ipsum dolor sit amet",
            venue: "Room number "+randrange(100,599),
            startTime: "5 PM",
            endTime: "7 PM",
            date: addDays(Math.floor(Math.random() * 40)+1),
            category: ['Competetion', 'Workshop', 'Culture & Entertainment', 'Seminar', 'Webinar', 'Social Work'][Math.floor(Math.random() * 6)],
            link: "https://www.microsoft.com/en-us/event",
            photo: "https://randomwordgenerator.com/img/picture-generator/52e7dc414851af14f1dc8460962e33791c3ad6e04e5077497c2a7cd49349cc_640.jpg",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque delectus tempore eos quibusdam, tenetur quas nihil asperiores molestiae ad sunt, dolore, minima blanditiis? Error unde sapiente, temporibus sit eius neque.",
            applyBy: new Date(),
            openToAll: [true,false][Math.floor(Math.random() * 2)]
        },
        {
            organiser: "6155cf0752ad2031dfaa1523",
            title: "Lorem ipsum dolor sit amet",
            venue: "Room number "+randrange(100,599),
            startTime: "5 PM",
            endTime: "7 PM",
            date: addDays(Math.floor(Math.random() * 40)+1),
            category: ['Competetion', 'Workshop', 'Culture & Entertainment', 'Seminar', 'Webinar', 'Social Work'][Math.floor(Math.random() * 6)],
            link: "https://www.microsoft.com/en-us/event",
            photo: "https://randomwordgenerator.com/img/picture-generator/gae70ff0c9be5b5f10c08736584b1dcd6308500f6dab9e94e500464a9774c8bbd0a0d6c620b806ad6f7ce814363416e3d_640.jpg",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque delectus tempore eos quibusdam, tenetur quas nihil asperiores molestiae ad sunt, dolore, minima blanditiis? Error unde sapiente, temporibus sit eius neque.",
            applyBy: new Date(),
            openToAll: [true,false][Math.floor(Math.random() * 2)]
        },
        {
            organiser: "6155cf0752ad2031dfaa1523",
            title: "Lorem ipsum dolor sit amet",
            venue: "Room number "+randrange(100,599),
            startTime: "5 PM",
            endTime: "7 PM",
            date: addDays(Math.floor(Math.random() * 40)+1),
            category: ['Competetion', 'Workshop', 'Culture & Entertainment', 'Seminar', 'Webinar', 'Social Work'][Math.floor(Math.random() * 6)],
            link: "https://www.microsoft.com/en-us/event",
            photo: "https://randomwordgenerator.com/img/picture-generator/54e9d6474257ab14f1dc8460962e33791c3ad6e04e507749712e79d29348c2_640.jpg",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque delectus tempore eos quibusdam, tenetur quas nihil asperiores molestiae ad sunt, dolore, minima blanditiis? Error unde sapiente, temporibus sit eius neque.",
            applyBy: new Date(),
            openToAll: [true,false][Math.floor(Math.random() * 2)]
        },
    ]
    // for (let i = 0; i < 10; i++) {
    for (let i = 0; i < 3; i++) {
        db.Event.create(events[i])
            .then((internship) => console.log(internship))
            .catch(err => console.log(err))
    }
    // }








    // data = {};
    // for (let i = 0; i < 5; i++) {
    //     data = {
    //         title: faker.lorem.words(3),
    //         content: faker.lorem.lines(3),
    //         image: 'https://lh3.googleusercontent.com/4xhPnTIwrmREmHVKhwAmTRovdrkhNEOneYsx9YQ8DAUyTpjIVemMn03MdZbDN1rk3MqLTUg5xcThfDjpgfPKHZZ1RY0=w640-h400-e365-rj-sc0x00ffffff',
    //         author: "5ff05ad4c3b7a10a3c967062",
    //         hashtags: faker.lorem.word(1)
    //     }
    //     let user = await db.User.findById(data.author);
    //     db.Post.create(data)
    //         .then(async (newPost) => {
    //             await user.posts.push(newPost);
    //             await user.save();
    //         })
    //         .catch(err => console.log(err))
    // }
}
module.exports = seedDB;