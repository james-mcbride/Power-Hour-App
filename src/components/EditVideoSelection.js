import React, {useEffect, useState} from 'react'
import ReactModal from 'react-modal';
import axios from "axios";
import VideoDetail from "./VideoDetail";
import youtube from "../apis/youtube";
import {accessToken} from "./tokens";

function EditVideoSelection({open, video, onUpdatePlaylist, onClose, powerHour}) {
    const username = document.cookie?.split("username=")?.[1]
    const powerHourId = window.location.href.split("/edit/")?.[1]
    const [finishSong, setFinishSong] = useState(false)
    const [startTime, setStartTime] = useState("0")
    const [detailVideo, setDetailVideo] = useState(null)


    const getVideoWithDetails = async () => {
        const response = await youtube.get(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&maxResults=10&key=${accessToken}&id=${video.id.videoId}&type=video`)
        setDetailVideo(response.data.items[0])
    }


    useEffect(() => {
        if (open && !video.contentDetails) {
            getVideoWithDetails()
        } else if (open) {
            if (video.videoSelection) {
                setStartTime(video.videoSelection.startTime)
                setFinishSong(!!video.videoSelection.usernameFinishingSong)
            }
        }
    }, [open, video])

    const getVideoRunTime = video => {
        const runTimeString = video.split("PT")[1]
        const minutes = runTimeString.split("M")[0]
        let seconds = 0
        if (runTimeString.includes("S")) {
            const secondsString = runTimeString.split("M")[1]
            seconds = secondsString.split("S")[0]
        }
        return Number(minutes) * 60 + Number(seconds)
    }

    const addToPlaylist = () => {
        axios.post("http://192.168.86.21:8091/powerHour/addVideo", {
            username,
            powerHourId,
            youtubeId: video.id.videoId,
            title: video.snippet.title,
            startTime: startTime.toString(),
            usernameFinishingSong: finishSong ? username : null,
            runTime: getVideoRunTime(video?.contentDetails?.duration || detailVideo?.contentDetails?.duration)
        }, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
            }
        }).then(() => {
            onUpdatePlaylist()
            setFinishSong(false)
            setStartTime(0)
            onClose()
        });
    }

    const updateVideoSelection = () => {
            axios.put(`http://192.168.86.21:8091/powerHour/videoSelection/${video.videoSelection.id}`, {
                username,
                powerHourId,
                youtubeId: video.id?.videoId || video.id,
                title: video.snippet.title,
                startTime: startTime.toString(),
                runTime: getVideoRunTime(video?.contentDetails?.duration || detailVideo?.contentDetails?.duration)
            }, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
                }
            }).then(response => {
                onUpdatePlaylist()
                setFinishSong(false)
                setStartTime(0)
                onClose()
            });
    }

    const videoAlreadyInPlaylist = powerHour?.videoSelections?.some(videoSelection => {
        console.log("test")
        return videoSelection.video.youtubeId === video?.id?.videoId
    })

    return (
        <ReactModal isOpen={open} id="edit-video-selection-modal">
            <div id="edit-video-selection-div">
                <button onClick={onClose} className="close-button">Close</button>
                <VideoDetail video={video}/>
                {videoAlreadyInPlaylist ? (<h1>Video already in playlist</h1>) : (
                    <div className="edit-video-form">
                        <div>
                            <label>
                                Song start time
                                <input
                                    type="text"
                                    value={startTime}
                                    onChange={e => setStartTime(e.target.value)}/>
                            </label>
                        </div>
                        <button className="confirm-button" onClick={() => {
                            if (video.videoSelection) {
                                updateVideoSelection()
                            } else {
                                addToPlaylist()
                            }
                        }}>{video?.videoSelection ? 'Update song' : 'Add to playlist'}</button>

                    </div>
                )
                }
            </div>
        </ReactModal>
    )
}

export default EditVideoSelection