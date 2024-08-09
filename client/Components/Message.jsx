import React from 'react';
import '../stylesheets/Message.css';

const Message = ({ senderName, message, classes }) => {
    return (
        <div className={`messageContainer ${classes}`}>
            <h3 className='mess-h1'>{senderName ? `${senderName}: ` : ''}{message}</h3>
        </div>
    );
};

export default Message;
