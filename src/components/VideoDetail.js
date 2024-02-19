import React from 'react';

const VideoDetail = ({video}) => {

    if (!video) {
        return null
    }

    const  videoId =  video?.id?.videoId || video?.id

    return <div>
        <div className='video-detail-image' onClick={() => window.open(`https://youtube.com/watch?v=${videoId}`, "_blank")}>
            <img className='ui image' src={video.snippet.thumbnails.medium.url} alt={video.snippet.title}/>
        </div>
        <div className='ui segment'>
            <div>
                <a href={`https://youtube.com/watch?v=${videoId}`} target="_blank" className='ui header'>{video.snippet.title.replace("&#39;", "'")}</a>
            </div>
        </div>
    </div>
}

export default VideoDetail;