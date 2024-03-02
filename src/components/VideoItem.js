import React, {useEffect, useState} from 'react';
import './VideoItem.css';
import youtube from "../apis/youtube";
import VideoSelectionActionModal from "./VideoSelectionActionModal";
import SongSelectionStar from "./SongSelectionStar";
import SkipVideo from "./SkipVideo";
import {accessToken} from "./tokens";

const VideoItem = ({onVideoSelect, video, youtubeId, videoSelection}) => {
    const username = document.cookie?.split("username=")?.[1]
    const [searchVideo, setSearchVideo] = useState(null)
    const [openVideoSelectionActionModal, setOpenVideoSelectionActionModal] = useState(false)
    const [finishVideo, setFinishVideo] = useState(false)
    const [skipVideo, setSkipVideo] = useState(false)
    const [action, setAction] = useState(null)

    const getVideo = async () => {
        const response = await youtube.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&maxResults=10&key=${accessToken}&id=${youtubeId}&type=video`)
        setSearchVideo(response.data.items[0])
    }

    useEffect(() => {
        if (!video) {
            getVideo()
        }
        const userSelectedFinishVideo = videoSelection?.videoSelectionActions?.filter(videoSelectionAction => {
            return videoSelectionAction.action === 'FINISH' && videoSelectionAction.user.username?.toLowerCase() === username?.toLowerCase();
        })

        const userSelectedSkipVideo = videoSelection?.videoSelectionActions?.filter(videoSelectionAction => {
            return videoSelectionAction.action === 'SKIP' && videoSelectionAction.user.username?.toLowerCase() === username?.toLowerCase();
        })
        setSkipVideo(userSelectedSkipVideo?.length > 0)
        setFinishVideo(userSelectedFinishVideo?.length > 0)
    }, [])


    const youtubeVideo = video || searchVideo
    if (youtubeVideo) {

        return <div onClick={videoSelection?.user?.username === username || !videoSelection ? () => onVideoSelect(youtubeVideo) : null}
                    className='item video-item'>
            <VideoSelectionActionModal
                action={action}
                open={openVideoSelectionActionModal}
                videoSelection={videoSelection}
                currentFinishVideoSelectionStatus={action === 'FINISH' ? finishVideo : skipVideo}
                onClose={videoAction => {
                    setOpenVideoSelectionActionModal(false)
                    if (action === 'FINISH') {
                        setFinishVideo(videoAction)
                    } else {
                        setSkipVideo(videoAction)
                    }

                }}/>
            <img className='ui image' src={youtubeVideo.snippet.thumbnails.medium.url}
                 alt={youtubeVideo.snippet.title}/>
            <div className='content'>
                <
                    div className='header'>{youtubeVideo.snippet.title.replace("&#39;", "'")}</div>
            </div>
            {videoSelection && (
                <>
                <SongSelectionStar finishVideo={finishVideo} onClick={e => {
                    e.stopPropagation()
                    setOpenVideoSelectionActionModal(!openVideoSelectionActionModal)
                    setAction('FINISH')
                }}
                />
                <SkipVideo onClick={e => {
                    e.stopPropagation()
                    setOpenVideoSelectionActionModal(!openVideoSelectionActionModal)
                    setAction('SKIP')
                }} skipVideo={skipVideo} />
                </>
            )}
        </div>
    }
}

export default VideoItem;