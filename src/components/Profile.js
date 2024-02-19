import React, {useEffect, useState} from 'react'
import axios from "axios";
import {useHistory} from 'react-router-dom'
import powerHourLogo from "./images/PowerHour.jpeg";
import PowerHourItem from "./PowerHourItem";

function Profile() {
    const history = useHistory();
    const userId = window.location.href.split("/user/")[1]
    const [allPowerHours, setAllPowerHours] = useState([])
    useEffect(() => {
        axios.get(`http://192.168.86.249:8091/powerHour`)
            .then(response => {
                setAllPowerHours(response.data)
                console.log(response.data)
            })
    }, [])

    const userOwnedPowerHours = allPowerHours?.filter(powerHour => {
        return powerHour?.owner?.id.toString() === userId
    })

    const userEditedPowerHours = allPowerHours?.filter(powerHour => {
        return powerHour?.owner?.id.toString() !== userId &&
            powerHour.videoSelections?.some(videoSelection => {
                return videoSelection.user.id.toString() === userId
            }).length > 0
    })

    console.log(userOwnedPowerHours)

    const createPowerHourList = powerHourList => {
        return powerHourList?.map(powerHour => {
            return (
                <PowerHourItem powerHour={powerHour} />
            )
        })
    }

    return (
        <div className="profile">
            <div className="power-hour-logo">
                <img src={powerHourLogo}/>
            </div>
            <button onClick={() => history.replace(`/powerHour/create`)} className="power-hour-button">Create new Power Hour Playlist</button>
            <div className="power-hour-lists">
                <div className="user-owned-power-hours power-hour-list">
                    <h2>Created by you</h2>
                    {createPowerHourList(userOwnedPowerHours)}
                </div>
                <div className="user-edited-power-hours power-hour-list">
                    <h2>Recently edited</h2>
                    {createPowerHourList(userEditedPowerHours)}
                </div>
                <div className="all-power-hours power-hour-list">
                    <h2>All</h2>
                    {createPowerHourList(allPowerHours)}
                </div>
            </div>
        </div>
    )

}

export default Profile;