let socket;

//function to establish web socket
function init(url) { //export function init(url) why cant we use this (1)
  socket = new WebSocket(url);
  console.log('connecting...');
}

//handlling when socket is open
function registerOpenHandler(handlerFunction) {
  //any function assign to onopen will be called when the connection is made
  socket.onopen = () => { //??
    console.log('open');
    handlerFunction();
  };
}

//handling recieving message
function registerMessageHandler(handlerFunction) {
  socket.onmessage = (e) => {
    console.log('message', e.data); //e.data
    let data = JSON.parse(e.data); //string -> json object
    handlerFunction(data);
  };
}

//handling sending message
function sendMessage(payload) {
  socket.send(JSON.stringify(payload)); //json object -> string
}

export default {
  init,
  registerOpenHandler,
  registerMessageHandler,
  sendMessage
}
