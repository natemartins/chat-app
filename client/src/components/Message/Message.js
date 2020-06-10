import React from "react";

import "./Message.css";

const Message = ({ message: { user, text }, name }) => {
  // check if message sent by current user
  let isSentByCurrentUser = false;

  // trim name and set to lower case
  const trimmedName = name.trim().toLowerCase();
  if (user === trimmedName) {
    // set current user to true
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    // render
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">me</p>
      <div className="messageBox backgroundBlue">
        <p className="messageText colorWhite">{text}</p>
      </div>
    </div>
  ) : (
    // render
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundLight">
        <p className="messageText colorDark">{text}</p>
      </div>
      <p className="sentText pl-10">{user}</p>
    </div>
  );
};

export default Message;
