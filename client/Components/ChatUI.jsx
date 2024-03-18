import React, { useEffect, useMemo, useState } from 'react'
import "../stylesheets/ChatUI.css"
import Message from "./Message"
import '../stylesheets/Message.css'
import { io } from 'socket.io-client'
import { data } from '../Components/Home'

const ChatUI = () => {

  const socket = useMemo(() => io("https://chit-chat-wine-eta.vercel.app/"), [])

  useEffect(() => {

    // fetching userName
    console.log("in chatUI " + data);
    const user = data
    socket.emit('userName', user)

    // when connected this code runs
    socket.on('connect', () => {
      console.log("You are now connected with id = " + socket.id)
      setUserId(socket.id)
    })

    socket.on('id1', (mess) => {
      console.log(mess);
      console.log(`New User ${mess.senderName} joined with ID = ${mess.userId}`);

      setAllMessage((allMessage) => [...allMessage, mess])
    })

    socket.on('message', (mess) => {
      console.log("Message");
      console.log(mess);
      setAllMessage((allMessage) => [...allMessage, mess])

    })

    socket.on('discon', (mess) => {
      console.log("Disconnect");
      console.log(mess);
      setAllMessage((allMessage) => [...allMessage, mess])
    })

    return () => {
      socket.disconnect();
    }

  }, [socket])




  const [message, setMessage] = useState("")
  const [allMessage, setAllMessage] = useState([])
  const [userId, setUserId] = useState("");


  const formHandler1 = (e) => {
    e.preventDefault();
    socket.emit('message', { message, userId })   //message and sender ka userID
    setMessage("")
  }






  return (

    <div >
      <div className="main">

        <div className="container">

          <div className="nav">
            <img src="../public/logo.png" alt="logp" />
            <h1>Chat Room</h1>
          </div>

          <div className="mainBody">

            {
              allMessage.map((m, i) => {
                console.log("inside map");
                console.log(m);
                return <Message key={i} senderName={m.userId === userId ? "" : m.senderName} message={m.messages} classes={m.userId === userId ? 'right' : 'left'} />;
              })
            }


          </div>

          <div className="inputArea">

            <form onSubmit={formHandler1} className='form'>

              <div className="input-text">
                <input type="text" id='chat-input' value={message} placeholder='Enter your message...' onChange={(e) => setMessage(e.target.value)} />
              </div>

              <div className="btn">
                <button type='submit'>Send</button>
              </div>

            </form>

          </div>


        </div>

      </div>

    </div>
  )
}

export default ChatUI
