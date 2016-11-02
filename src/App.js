import React, {Component} from 'react';
import './App.css';
import _ from 'lodash';

const BASE_URL = 'https://chat-c3af9.firebaseio.com/';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: {},
      pending: false
    };
  }

  componentWillMount() {
    this.getAllMessages();
    setInterval(this.getAllMessages, 5000);
  }

  getAllMessages = () => {
    fetch(BASE_URL + 'messages.json')
      .then(response => response.json())
      .then((json) => {
        this.setState({ messages: json });
      });
  };

  postNewMessage = (e) => {
    e.preventDefault();
    this.setState({ pending: true });

    const newMessage = {
      author: this.refs.author.value,
      value: this.refs.message.value
    };

    fetch(BASE_URL + 'messages.json', {
      method: 'POST',
      body: JSON.stringify(newMessage)
    })
    .then(this.getAllMessages)
    .then(() => {
      this.setState({ pending: false });
      this.refs.message.value = '';
      this.refs.message.focus();
    });
  };

  deleteMessage = (id) => () => {
    fetch(BASE_URL + 'messages/' + id + '.json', {
      method: 'DELETE'
    })
    .then(this.getAllMessages);
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
            <li key={key} onClick={this.deleteMessage(key)}>{message.author}: {message.value}</li>)
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
