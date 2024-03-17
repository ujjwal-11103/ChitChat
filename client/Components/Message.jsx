import React from 'react'
import '../stylesheets/Message.css'


const Message = ({ senderName, message, classes, name }) => {

    // console.log("Inside message component");
    // console.log(senderName, message, classes);


    if (senderName) {
        return (
            <div className={`messageContainer ${classes}`}>
                <h1>{`${senderName}` + ": " + `${message}`}</h1>
            </div>
        )
    }
    else {
        return (
            <div className={`messageContainer ${classes}`} >
                <h1>{`${message}`}</h1>
            </div >
        )

    }
}

export default Message
