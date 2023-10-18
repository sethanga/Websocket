
const name = prompt('What is your name?')
//Websocekt variables
const url = "ws://localhost:9876/chatServer"
const mywsServer = new WebSocket(url)

//DOM Elements
const myMessages = document.getElementById("messages")
const myInput = document.getElementById("input")
const sendBtn = document.getElementById("send")
const myUserid = document.getElementById("client-user")
const newuser = document.createElement("h5");
const userid = uuidv4();

var message = { }
window.onload = function () {
     
    newuser.innerText = "New User Connected" + "\n" + "Your ID is: " + name;
    myUserid.appendChild(newuser);
  
  
}

sendBtn.disabled = true
sendBtn.addEventListener("click", sendMsg, false)

//Sending message from client
function sendMsg(e) {
    e.preventDefault()
    const text = myInput.value
    //msgGeneration(text, name)
    message.join = false;
    message.msg = text;
    message.sender = name;
    mywsServer.send(JSON.stringify(message))
}

//Creating DOM element to show received messages on browser page
function msgGeneration(msg, from) {
    const newMessage = document.createElement("h5")
    newMessage.innerText = msg;
    myMessages.appendChild(newMessage)
}

//enabling send message when connection is open
mywsServer.onopen = function () {
    console.log("Connection Opened")
    sendBtn.disabled = false
    message.sender = name;
    message.message = "Joined the chat";
    message.join = true;
    mywsServer.send(JSON.stringify(message))
    
}

//handling message event
mywsServer.onmessage = function (event) {
    const { data } = event
    msgGeneration(data, "Server")
}

mywsServer.onclose = function (event) {
    console.log("Connection Closed")
}

mywsServer.onerror = function (event) { 
    console.log("Connection Error" ,event)
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
}