import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import axios from 'axios'
import powerHourLogo from './images/PowerHour.jpeg'
import './PowerHour.scss'

function Login({onLogin}) {
    const history = useHistory();
    const existingUserName = document.cookie?.split("username=")?.[1]
    const [userName, setUserName] = useState(existingUserName || "")

    const loginUser = () => {
        if (userName) {
            document.cookie = `username=${userName}`
            axios.get(`http://192.168.86.249:8091/user/${userName}`)
                .then(response => {
                    onLogin(response.data)
                    history.replace(`/user/${response.data.id}`)
                })
        }
    }

    return (
        <div className="login-page">
            <div className="power-hour-logo">
                <img src={powerHourLogo}/>
            </div>
            <div className="login-page-form">
                <label htmlFor="username">
                    Username
                </label>
                <input id="username" value={userName} onChange={e => setUserName(e.target.value)}/>
                <button onClick={loginUser}>Submit</button>
            </div>
        </div>
    )

}

export default Login;