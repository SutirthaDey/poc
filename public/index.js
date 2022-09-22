const message = document.querySelector('form');
const showList = document.getElementById("showList");

const socket = io("http://34.211.62.209:3000");

socket.on('connection');

socket.emit('fetch');

//showing the messages

socket.on('show', (messages)=>{
    messages.forEach(({id,message}) => {
        displayMessage(id,message);
    });
})

socket.on('response',(id,message)=>{
    displayMessage(id,message)
})

socket.on('remove',(id)=>{
    removeMessage(id);
})

message.addEventListener('submit',(e)=>{
    e.preventDefault();
    const messageInput = e.target.message;
    
    if(messageInput.value=="") return;

    // adding the messages
    socket.emit("add",messageInput.value);

    messageInput.value = "";
})

showList.addEventListener('click',(e)=>{
    if(e.target.innerText == 'Delete')
    {
     const targetDiv = e.target.parentElement;
     socket.emit('delete',targetDiv.id);
    }
})

function displayMessage(id,message)
{
 showList.innerHTML += `<div id=${id} class="items"><h2>${message}</h2><button>Delete</button></div>`
}

function removeMessage(id){
    const target = document.getElementById(id);
    target.remove();
}

