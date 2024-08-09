import React, { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import SocketIOFileClient from 'socket.io-file-client';
import Message from './Message';
import { data, room } from '../Components/Home';
import "../stylesheets/ChatUI.css";
import '../stylesheets/Message.css';

import { IoIosSend } from "react-icons/io";


const ChatUI = () => {
  const [message, setMessage] = useState("");
  const [allMessage, setAllMessage] = useState([]);
  const [userId, setUserId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const socket = useMemo(() => io("http://localhost:5000/"), []);

  useEffect(() => {
    const uploader = new SocketIOFileClient(socket);

    socket.on('connect', () => {
      console.log("You are now connected with id = " + socket.id);
      setUserId(socket.id);

      // Emit join room event
      socket.emit('joinRoom', { userName: data, room: room });
    });

    const user = data;
    socket.emit('userName', user);

    socket.on('id1', (mess) => {
      console.log(`New User ${mess.senderName} joined with ID = ${mess.userId}`);
      setAllMessage((allMessage) => [...allMessage, mess]);
    });

    socket.on('message', (mess) => {
      console.log("Message");
      console.log(mess);
      setAllMessage((allMessage) => [...allMessage, mess]);
    });

    socket.on('discon', (mess) => {
      console.log("Disconnect client");
      console.log(mess);
      setAllMessage((allMessage) => [...allMessage, mess]);
    });

    socket.on('file', (mess) => {
      console.log("File received");
      console.log(mess);
      setAllMessage((allMessage) => [...allMessage, mess]);
    });


    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const formHandler1 = (e) => {
    e.preventDefault();
    socket.emit('message', { message, userId, room: room });
    setMessage("");
  };


  return (
    <div>
      <div className="main">
        <div className="container">

          <div className="nav">
            <img src="/logo.png" alt="logo" />
            <h1>Chat Room</h1>
          </div>

          <div className="mainBody">
            {allMessage.map((m, i) => (
              <Message
                key={i}
                senderName={m.userId === userId ? "" : m.senderName}
                message={m.messages}
                classes={m.userId === userId ? 'right' : 'left'}
              />
            ))}
          </div>

          <div className="inputArea">
            <form onSubmit={formHandler1} className='form'>

              <div className="input-text">
                <input
                  type="text"
                  id='chat-input'
                  value={message}
                  placeholder='Enter your message...'
                  required
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="chat-btn">
                <button type='submit'><IoIosSend />
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
