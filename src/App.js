import React, { Component } from 'react';
import './App.css';
import Message from './Message';
import _ from 'lodash';

const BASE_URL = 'https://chat-c3af9.firebaseio.com/';

class App extends Component {

  constructor(props) { // React specific: Class constructor
    super(props);
    this.state = {
      messages: {},
      pending: false
    };
  }

  componentWillMount() { // React specific: Do this things when the component will be mounted
    this.getAllMessages(); // load all messages initially
    setInterval(this.getAllMessages, 5000); // after that poll every 5 seconds
  }

  getAllMessages = () => {
    fetch(BASE_URL + 'messages.json')
      .then(response => response.json()) // parse the json
      .then((json) => {
        this.setState({ messages: json }); // store the json in the react state
      });
  };

  postNewMessage = (e) => {
    e.preventDefault();  // do not reload page
    this.setState({ pending: true }); // disable button

    const newMessage = { // define a new message
      author: this.refs.author.value, // read the value of the input fields
      value: this.refs.message.value,
      timestamp: Date.now() // add a timestamp
    };

    fetch(BASE_URL + 'messages.json', { // post the new message
      method: 'POST',
      body: JSON.stringify(newMessage)
    })
    .then(this.getAllMessages) // after that load all Messages
    .then(() => {
      this.setState({ pending: false }); // enable the button
      this.refs.message.value = ''; // empty the input field
      this.refs.message.focus(); // set the focus on the input field
    });
  };

  deleteMessage = (id) => () => { // delete the message with this id
    fetch(BASE_URL + 'messages/' + id + '.json', {
      method: 'DELETE'
    })
    .then(this.getAllMessages); // then load all messages
  };

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Chat</h2>
          <input type="text" ref="author" placeholder="Name"/>
        </div>
        <ul>
          { _.map(this.state.messages, (message, key) =>
            <li key={key} onClick={this.deleteMessage(key)}>
              <Message message={message}/>
            </li>)
          }
        </ul>
        <form onSubmit={this.postNewMessage}>
          <input type="text" placeholder="Nachricht" ref="message"/>
          <input type="submit" value="Send" disabled={this.state.pending} />
        </form>
      </div>
    );
  }
}

export default App;
