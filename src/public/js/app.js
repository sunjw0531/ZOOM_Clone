const socket = io();

const welcome = document.getElementById("welcome")
const form = document.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName = "";

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () =>{
        addMessage(`You : ${value}`);
    });
    input.value = "";
}

function handleNicknameSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value);
}

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");
    nameForm.addEventListener("submit", handleNicknameSubmit);
    msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const room_input = form.querySelector("#enter_room");
    const nickname_input = form.querySelector("#enter_nickname");
    socket.emit("enter_room", room_input.value, nickname_input.value, showRoom);
    roomName = room_input.value;
    room_input.value = "";
}

// code start
form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) =>{
    addMessage(`${user} Joined!`);
})

socket.on("bye", (left) =>{
    addMessage(`${left} Left ,,`);
})

socket.on("new_message", addMessage);