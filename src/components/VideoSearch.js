import React, {useState} from "react"
import youtube from "../apis/youtube";
import SearchBar from "./SearchBar";
import VideoDetail from "./VideoDetail";
import VideoList from "./VideoList";
import EditVideoSelection from "./EditVideoSelection";

function VideoSearch({setOpenEditVideoModal, setSelectedVideo}) {
    const [videos, setVideos] = useState([])

    const onTermSubmit = async (term) => {
        console.log(term);
        const response = await youtube.get('/search', {
            params: {
                q: term,
                type: 'video'
            }
        })
        console.log(response.data.items)
        setVideos(response.data.items)
        setSelectedVideo(response.data.items[0])
    }


    return (
        <div className='ui container'>
            <SearchBar onFormSubmit={onTermSubmit}/>
            <div className='ui grid'>
                <div className='ui row'>
                    <div>
                        <VideoList videos={videos} onVideoSelect={video => {
                            setOpenEditVideoModal(true)
                            setSelectedVideo(video)
                        }}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoSearch;