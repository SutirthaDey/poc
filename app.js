const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
const Todo = require('./models/todos');
const sequelize = require('./utils/database');
const server = require('http').createServer(app);

dotenv.config();

// requring socket io
const io = require('socket.io')(server,{
        cors: {
            origin: "http://34.211.62.209:3000",
        },
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/',(req,res,next)=>{
    res.sendFile(path.join(__dirname,'public','index.html'));
})

// creating a connection

io.on("connection", socket => {
    
    socket.on("add", async(data)=>{
        const message = await Todo.create({
            message:data
        })
        io.emit('response', message.id,message.message);
    })

    socket.on('fetch', async()=>{
        const messages = await Todo.findAll({
            attribures: ['id','message']
    })
        socket.emit('show',messages);
    })

    socket.on('delete', async(id)=>{
        await Todo.destroy({
            where: {id:id}
        })

        io.emit('remove', id);
    })
})

console.log('1')


async function runServer(){
    await sequelize.sync();
    server.listen(3000, ()=>{
        console.log("Server running!");
    })
}

runServer();