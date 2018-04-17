import socket from './ws-client'; //import {init} from './ws-client';    why can't we used this(1)
import {
  UserStore
} from './storage';
import {
  ChatForm,
  ChatList,
  promptForUserName
} from './dom';

const FORM_SELECTOR = '[data-chat="chat-form"]';
const INPUT_SELECTOR = '[data-chat="message-input"]';
const LIST_SELECTOR = '[data-chat="message-list"]'; //output dom to this selector

let userStore = new UserStore('x-chattrbox/u');
let username = userStore.get();
if (!username) {
  username = promptForUserName();
  userStore.set(username)
}
// this class to handle socket connection and message
class ChatApp {
  // function to call websocket
  constructor() {
    this.chatForm = new ChatForm(FORM_SELECTOR, INPUT_SELECTOR);
    this.chatList = new ChatList(LIST_SELECTOR, username);

    socket.init('ws://localhost:3001'); //open socket
    socket.registerOpenHandler(() => { //ananymous function  () => {.....}   === function(){...}
      this.chatForm.init((text) => { // text will contain val(value from input field) in dom.js
        let message = new ChatMessage({
          message: text
        });
        socket.sendMessage(message.serialize());
      });
      this.chatList.init();
    });

    socket.registerMessageHandler((data) => {
      console.log(data);
      let message = new ChatMessage(data);
      this.chatList.drawMessage(message.serialize());
    }); //function(data){ console.log(data) }
  }
}


class ChatMessage {
  // set message, userename, time, date
  constructor({
    message: m,
    user: u = username,
    timestamp: t = (new Date()).getTime()
  }) {
    this.message = m;
    this.user = u;
    this.timestamp = t;
  }

  //function to return message, user, time
  serialize() {
    return {
      user: this.user,
      message: this.message,
      timestamp: this.timestamp
    };
  }
}


export default ChatApp;
