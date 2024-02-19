import React, {useEffect, useState} from 'react'
import axios from "axios";
import VideoSearch from "./VideoSearch";
import {useHistory} from "react-router-dom";
import VideoItem from "./VideoItem";
import EditVideoSelection from "./EditVideoSelection";
import SongSelectionStar from "./SongSelectionStar";

function EditPowerHour({loggedInUser}) {
    const history = useHistory();
    const powerHourId = window.location.href.split("/edit/")?.[1]
    const [name, setName] = useState("")
    const [powerHour, setPowerHour] = useState(null)
    const [openEditVideoModal, setOpenEditVideoModal] = useState(false)
    const [selectedVideo, setSelectedVideo] = useState(null)

    const getLatestPowerHour = () => {
        axios.get(`http://192.168.86.249:8091/powerHour/${powerHourId}`)
            .then(response => {
                setPowerHour(response.data)
            })
    }


    useEffect(() => {
        if (powerHourId){
            getLatestPowerHour()
        }
    }, [])

    const submitPowerHour = () => {
        axios.post("http://192.168.86.249:8091/powerHour/create", {
            name: name
        }, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
            }
        }).then(response => {
            history.replace(`/powerHour/edit/${response.data.id}`)
        });
    }

    const currentPlaylist = powerHour?.videoSelections?.map((videoSelection, index) => {
        return (
            <div className="playlist-item">
                <h1 className="playlist-item-number">{index + 1}</h1>
                <VideoItem
                    youtubeId={videoSelection.video.youtubeId}
                    videoSelection={videoSelection}
                    onVideoSelect={video => {
                        video.videoSelection = videoSelection
                        setOpenEditVideoModal(true)
                        setSelectedVideo(video)
                     }}


                />
            </div>
            )
    })

    return (
        <div className="edit-power-hour">
            <button className="back-to-profile-button" onClick={() => history.replace(`/user/${loggedInUser?.id}`)}>Back to profile</button>
            <EditVideoSelection open={openEditVideoModal} video={selectedVideo} onUpdatePlaylist={() => getLatestPowerHour()} onClose={() => setOpenEditVideoModal(false)} powerHour={powerHour}/>
            {!powerHour && (
                <div className="power-hour-form">
                    <label htmlFor="name">
                        Playlist Name
                    </label>
                    <input id="name" value={name} onChange={e => setName(e.target.value)}/>
                    <button onClick={submitPowerHour}>Submit</button>
                </div>
            )}
            {powerHour && (
                <div>
                <h1 className="edit-power-hour-title">
                    {powerHour.name}
                </h1>
                    <button className="power-hour-button" onClick={() => history.replace(`/powerHour/play/${powerHour?.id}`)}>Start Power Hour</button>
                    <div className="edit-power-hour-playlist">
                        <div className="power-hour-playlist">
                            <h1>Playlist</h1>
                            <h4 id="song-selection-demo">
                                <span className="text">
                                Click
                                    </span>
                                <SongSelectionStar finishVideo={false} onClick={() => {}}/>
                                <span className="text">
                                to play entire video
                                    </span>
                            </h4>
                            {currentPlaylist}
                        </div>
                    <div className="new-video-container">
                        <h2>
                            Add video to playlist
                        </h2>
                        <VideoSearch
                            setSelectedVideo={video => setSelectedVideo(video)}
                            setOpenEditVideoModal={() => setOpenEditVideoModal(!openEditVideoModal)}
                        />
                    </div>
                </div>
                </div>
            )}
        </div>

    )
}

export default EditPowerHour;