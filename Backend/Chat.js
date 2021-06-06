
const db = require('./models');

function chat(io){
    console.log('socket started')
    io.on('connection', (socket) => {
        console.log('new client connected');
        socket.emit('yo', null);
        socket.on('join-room',rid=>{
            socket.join(rid)
            db.Conversation.findById(rid).populate({path:'messages',populate:{path:"author"}}).then(a=>{
                socket.emit('get-rmess',a)
            })
        })
        socket.on('leave-room',rid=>{
            socket.leave(rid)
        })
        socket.on('room-message',data=>{
            db.Message.create(data.message).then(m=>{
                db.Appointment.findById(data.rid).then(a=>{
                    a.messages.push(m)
                    a.save()
                })
                db.User.findById(m.author).then(k=>{
                    m.author=k
                    io.to(data.rid).emit('new-messr',m)
                })
                
            })
            
        })
        socket.on('disconnect', () => {
            console.log("disconnected")
        });

    });
}
module.exports =chat