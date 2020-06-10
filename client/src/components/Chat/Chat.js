import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";

import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

let socket;

const Chat = ({ location }) => {
  // create name and room hooks
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // set endpoint
  // DEV: set with localhost
  // PROD: set with server url
  const ENDPOINT = 'https://crainechat.herokuapp.com/';

  useEffect(() => {
    // get user input data
    const { name, room } = queryString.parse(location.search);
    // set socket and pass in endpoint
    socket = io(ENDPOINT);

    // set values
    setName(name);
    setRoom(room);

    // emit event to server with variables
    socket.emit('join', { name, room }, () => {

    });
    
    // implenent a return statement
    // for disconnecting
    return () => {
      socket.emit('disconnect'); // send disconnect event
      socket.off(); // turn the one instance of client off
    }
  }, [ENDPOINT, location.search]); // pass an array endpoint and query to avoid duplicating connection

  useEffect(() => {
    socket.on('message', (message) => {
      // spread existing messages and add new message to the array
      setMessages([...messages, message])
    })
  }, [messages])

  // function for sending messages
  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      // emit send message event and clear input field
      socket.emit('sendMessage', message, () => setMessage(''))
    }
  }

  // console.log(messages);
  

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      {/* <TextContainer users={users} /> */}
    </div>
  )
};

export default Chat;
