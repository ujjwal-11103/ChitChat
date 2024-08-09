import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import '../stylesheets/Home.css';

let data;
let room;
const Home = () => {
    const [name, setName] = useState("");
    const [roomName, setRoomName] = useState("");

    const navigate = useNavigate()

    const sendata = (e) => {
        e.preventDefault()
        data = document.getElementById('input').value;
        room = document.getElementById('room-input').value;
        setName("");
        setRoomName("");
        navigate("/chat")
    };

    console.log("In home.js :");

    console.log(import.meta.env.VITE_SERVER_URL);


    return (
        <div>
            <div className="home-main">
                <div className="home-container-main">

                    <div className="home-heading">
                        <h1>Chit Chat</h1>
                    </div>

                    <div className="home-container">

                        <div className="home-left">
                            <img src="/images/1.png" alt="png" />
                        </div>

                        <div className="home-right">
                            <div className="home-form">

                                <h1>Let's Chat...</h1>

                                <form onSubmit={sendata}>

                                    <label>Enter Name</label>

                                    <input type="text" id='input' placeholder='Enter your name' value={name} onChange={(e) => setName(e.target.value)} required />


                                    <label>Enter Room Id</label>

                                    <input type="text" id='room-input' placeholder='Enter room name' value={roomName} onChange={(e) => setRoomName(e.target.value)} required />

                                    <div className="home-btn-section">
                                        <button type='submit' className='Link'>Enter Chat</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
export { data, room };
