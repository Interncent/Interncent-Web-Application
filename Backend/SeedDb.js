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
    //         type: ['External','Work from Home'][Math.floor(Math.random() * 2)]
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
    //         type: ['External','Work from Home'][Math.floor(Math.random() * 2)]
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
    //         type: ['External','Work from Home'][Math.floor(Math.random() * 2)]
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
    //         type: ['External','Work from Home'][Math.floor(Math.random() * 2)]
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
    //         type: ['External','Work from Home'][Math.floor(Math.random() * 2)]
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
    //         type: ['External','Work from Home'][Math.floor(Math.random() * 2)]
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
    //         type: ['External','Work from Home'][Math.floor(Math.random() * 2)]
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
    //         type: ['External','Work from Home'][Math.floor(Math.random() * 2)]
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
    //         type: ['External','Work from Home'][Math.floor(Math.random() * 2)]
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
    //         type: ['External','Work from Home'][Math.floor(Math.random() * 2)]
    //     }
    // ];
    // for (let i = 0; i < 7; i++) {
    //     for (let i = 0; i < 10; i++) {
    //         db.InternshipDetails.create(ints[i])
    //             .then((internship) => console.log(internship))
    //             .catch(err => console.log(err))
    //     }
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