import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import youtube from "../apis/youtube";
import axios from "axios";

function PowerHourItem({powerHour}) {
    const history = useHistory();
    const [coverVideo, setCoverVideo] = useState(null)

    const getVideo = async () => {
        const response = await youtube.get('/videos', {
            params: {
                id: powerHour.videoSelections[0].video.youtubeId,
                type: 'video',
                test: 'test'
            }
        })
        setCoverVideo(response.data.items[0])
    }

    useEffect(() => {
        if (powerHour.videoSelections?.length > 0) {
            getVideo()
        }
    }, [])

    if (powerHour.videoSelections?.length > 0 && !coverVideo) {
        return null
    }
    if (!powerHour) {
        return null
    }

    return (
     <div onClick={() => history.replace(`/powerHour/edit/${powerHour.id}`)} className='item video-item'>
        <img className='ui image' src={coverVideo?.snippet?.thumbnails?.medium?.url} alt={coverVideo?.snippet?.title}/>
        <div className='content'>
            <
                div className='header'>{powerHour.name}</div>
        </div>
    </div>
    )
}

export default PowerHourItem;