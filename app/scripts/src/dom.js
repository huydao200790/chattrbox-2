import $ from 'jquery';
import md5 from 'crypto-js/md5';
import moment from 'moment';

function createGravatarUrl(username) {
  let userhash = md5(username);
  return `http://www.gravatar.com/avatar/${userhash.toString()}`;
}

export function promptForUserName() {
  let username = prompt('Enter a username');
  return username.toLowerCase();
}
// this class cover sending out chat message
export class ChatForm {
  constructor(formSel, inputSel) {
    this.$form = $(formSel); //add property the element that need to be track
    this.$input = $(inputSel);
  }

  init(submitCallback) {
    this.$form.submit((event) => {
      event.preventDefault(); // prevent default action from submit
      let val = this.$input.val(); // retrieve value from input field
      submitCallback(val); // call back function (do anything)
      this.$input.val(''); // reset the value to default
    });

    this.$form.find('button').on('click', () => this.$form.submit()); //submit handler using jquery SUBMIT method
  }
}

// this class take care of display new message
export class ChatList {
  constructor(listSel, username) {
    this.$list = $(listSel); //selector
    this.username = username;
  }

  drawMessage({
    user: u,
    timestamp: t,
    message: m
  }) {
    let $messageRow = $('<li>', {
      'class': 'message-row'
    });
    if (this.username === u) {
      $messageRow.addClass('me'); //????
    }


    let $message = $('<p>');
    $message.append($('<span>', {
      'class': 'message-username',
      text: u
    })); //display username// class is CSS style
    $message.append($('<span>', {
      'class': 'timestamp',
      'data-time': t,
      text: moment(t).fromNow()
    })); //display time//
    $message.append($('<span>', {
      'class': 'message-message',
      text: m
    })); //display message//

    let $img = $('<img>', {
      src: createGravatarUrl(u),
      title: u
    });
    $messageRow.append($img);
    $messageRow.append($message);
    this.$list.append($messageRow);
    $messageRow.get(0).scrollIntoView();
  }

  init() {
    this.timer = setInterval(() => {
      $('[data-time]').each((idx, element) => {
        let $element = $(element);
        let timestamp = new Date().setTime($element.attr('data-time'));
        let ago = moment(timestamp).fromNow();
        $element.html(ago);
      });
    }, 1000);
  }

}
