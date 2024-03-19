import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom';
import '../stylesheets/Home.css'

let data;
const Home = () => {


    const sendata = () => {
        data = document.getElementById('input').value
        console.log("User clicked");
        console.log(data);
        document.getElementById('input').value = "";
    }


    const [name, setName] = useState("")
    console.log(name);
    return (
        <div>
            <div className="home-main">

                <div className="home-heading">
                    <h1>Chit Chat</h1>
                </div>

                <div className="home-container">

                    <div className="home-left">
                        <img src="/images/1.png" alt="png" style={{ width: '22vw' }} />
                        {/* <img src="../public/images/2.png" alt="png" style={{ width: '29vw' }} /> */}
                    </div>

                    <div className="home-right">

                        <div className="home-form">
                            <h1>Let's Chat...</h1>
                            <form>
                                <input type="text" id='input' placeholder='Enter your name' value={name} onChange={(e) => setName(e.target.value)} />
                                <NavLink to="/chat" className='Link' onClick={sendata} >Enter Chat</NavLink>
                            </form>

                        </div>
                    </div>



                </div>

            </div>

        </div>
    )
    console.log(data);
}

export default Home
export { data }