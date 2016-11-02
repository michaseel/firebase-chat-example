import React, { Component } from 'react';

export default class Message extends Component {
  render() {
    const { author, timestamp, value } = this.props.message;
    const hour = new Date(timestamp).getHours();
    const minute = new Date(timestamp).getMinutes();
    return (
      <div className="message">
        <div>{value}</div>
        <div className="message-info">geschrieben von {author} um {hour}:{minute}</div>
      </div>
    );
  }
}
