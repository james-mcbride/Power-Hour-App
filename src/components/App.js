import React, {useEffect, useState} from "react";
import {BrowserRouter, Route, useHistory} from 'react-router-dom'
import VideoSearch from "./VideoSearch";
import Login from "./Login";
import Profile from "./Profile";
import EditPowerHour from "./EditPowerHour";
import PlayPowerHour from "./PlayPowerHour"
import axios from "axios";

function App() {
    const history = useHistory();
    const [loggedInUser, setLoggedInUser] = useState(null)
    const username = document.cookie?.split("username=")?.[1]?.trim()?.replace(";", "")

    const loginUser = () => {
        if (username) {
            axios.get(`http://192.168.86.21:8091/user/${username}`)
                .then(response => {
                    setLoggedInUser(response.data)
                })
        }
    }

    useEffect(() => {
        if (username && !loggedInUser) {
            loginUser()
        } else if (!username && !loggedInUser && window.location.pathname !== "/") {
            window.location.pathname = "/"
        }
    }, [])
    return (
        <div className="App">
            <BrowserRouter>
                <Route exact path="/powerHour">
                    <VideoSearch />
                </Route>
                <Route exact path="/">
                    <Login onLogin={user => setLoggedInUser(user)}/>
                </Route>
                <Route exact path="/user/:id">
                    <Profile />
                </Route>
                <Route exact path="/powerHour/create">
                    <EditPowerHour loggedInUser={loggedInUser}/>
                </Route>
                <Route exact path="/powerHour/edit/:id">
                    <EditPowerHour loggedInUser={loggedInUser}/>
                </Route>
                <Route exact path="/powerHour/play/:id">
                    <PlayPowerHour />
                </Route>
            </BrowserRouter>
        </div>
    )
}

export default App;