import React, {useEffect, useState} from 'react'
import axios from "axios";

function PlayPowerHour() {
    console.log(window.location.search)
    const powerHourId = window.location.href.split("/play/")?.[1]
    const [playing, setPlaying] = useState(false)
    const [currentVideo, setCurrentVideo] = useState(null)
    const [powerHour, setPowerHour] = useState(null)
    const [currentTimeout, setCurrentTimeout] = useState(null)
    const [finished, setFinished] = useState(false)
    const [videoBeingSkipped, setVideoBeingSkipped] = useState(null)

    const getLatestPowerHour = timeout => {
        setTimeout(() => {
            axios.get(`http://192.168.86.21:8091/powerHour/${powerHourId}`)
                .then(response => {
                    setPowerHour(response.data)
                    getLatestPowerHour(5000)
                })
        }, timeout)
    }

    useEffect(() => {
        getLatestPowerHour(0)
    }, [])

    const userSkippedOwnVideo = video => {
        let userSkippedOwnVideo = false
        video.videoSelectionActions.forEach(action => {
            if (action.action === 'SKIP') {
                if (video.user.id === action.user.id) {
                    userSkippedOwnVideo = true
                }
            }
        })
        return userSkippedOwnVideo
    }

    //person who picked video can skip at any time, otherwise requires two votes
    const shouldSkipNextVideo = nextVideo => {
        let count = 0
        nextVideo?.videoSelectionActions?.forEach(action => {
            if (action.action === 'SKIP') {
                if (nextVideo.user.id === action.user.id) {
                    count += 2
                } else {
                    count += 1
                }
            }
        })
        return count >= 2
    }

    const shouldPlayEntireNextVideo = nextVideo => {
        return nextVideo?.videoSelectionActions?.filter(action => action.action === 'FINISH').length > 0
    }


    const getNextVideoTimeout = (playList, index) => {
        if (shouldSkipNextVideo(playList.data.videoSelections[index -1])) {
            return 0
        } else if (shouldPlayEntireNextVideo(playList.data.videoSelections[index -1])) {
            return 6000
        }
        return 3000
    }


    const playNextVideo = async (index, previousVideoPlayedEntireTime) => {
        setVideoBeingSkipped(null)
        setPlaying(false)
        const latestPlaylist = await axios.get(`http://192.168.86.21:8091/powerHour/${powerHourId}`)
        if (latestPlaylist.data.videoSelections.length === index) {
            setFinished(true)
            return
        }
        const nextVideo = latestPlaylist.data.videoSelections[index]
        if (shouldSkipNextVideo(nextVideo)) {
            if (userSkippedOwnVideo(nextVideo)) {
                playNextVideo(index + 1)
            } else {
                setVideoBeingSkipped(nextVideo)
                setTimeout(() => {
                    setVideoBeingSkipped(null)
                    playNextVideo(index + 1)
                }, 5000)
            }
            return
        }
        const playEntireNextVideo = shouldPlayEntireNextVideo(nextVideo)
        const nextVideoTimeout = getNextVideoTimeout(latestPlaylist, index)
        setTimeout(() => {
            setPlaying(true)
        }, nextVideoTimeout)
        setTimeout(() => {
            nextVideo.playStartTime = Date.now()
            setCurrentVideo(nextVideo)
            const videoStartTime = nextVideo.startTime ? nextVideo.startTime * 1000 : 0
            const timeout = setTimeout(() => {
                playNextVideo(index + 1, playEntireNextVideo)
            }, playEntireNextVideo ? nextVideo.video.runTime * 1000 - videoStartTime : 60000)
            setCurrentTimeout(timeout)
        }, nextVideoTimeout)
    }

    useEffect(() => {
        if (powerHour && !currentVideo) {
            const startSongNumber = new URLSearchParams(window.location.search).get('startSong')
            const firstVideoNumber = startSongNumber ? (Number(startSongNumber) - 1) : 0
            const firstVideo = powerHour.videoSelections[firstVideoNumber]
            firstVideo.playStartTime = Date.now()
            if (shouldSkipNextVideo(firstVideo)) {
                if (userSkippedOwnVideo(firstVideo)) {
                    playNextVideo(firstVideoNumber + 1, false)
                } else {
                    setVideoBeingSkipped(firstVideo)
                    setTimeout(() => {
                        playNextVideo(firstVideoNumber + 1, false)
                    }, 5000)
                }
                return
            }
            const playEntireFirstVideo = shouldPlayEntireNextVideo(firstVideo)
            setCurrentVideo(firstVideo)
            setPlaying(true)
            const videoStartTime = firstVideo.startTime ? firstVideo.startTime * 1000 : 0
            const timeout = setTimeout(() => {
                playNextVideo(1, playEntireFirstVideo)
            }, playEntireFirstVideo ? firstVideo.video.runTime * 1000 - videoStartTime : 60000)
            setCurrentTimeout(timeout)
        }
    }, [powerHour])


    let songIndex = 0
    const latestCurrentVideo = powerHour?.videoSelections?.filter((it, index) => {
        if (it?.id === currentVideo?.id) {
            songIndex = index
            return true
        }
    })?.[0]

    if (currentTimeout && !shouldSkipNextVideo(currentVideo) && shouldSkipNextVideo(latestCurrentVideo)) {
        clearTimeout(currentTimeout)
        setCurrentTimeout(null)
        if (userSkippedOwnVideo(latestCurrentVideo)) {
            setVideoBeingSkipped(latestCurrentVideo)
            playNextVideo(songIndex + 1)
        } else {
            setVideoBeingSkipped(latestCurrentVideo)
            setTimeout(() => {
                playNextVideo(songIndex + 1)
            }, 5000)
        }
    } else if (currentTimeout && !shouldPlayEntireNextVideo(currentVideo) && shouldPlayEntireNextVideo(latestCurrentVideo)) {
        const timeElapsed = Date.now() - currentVideo.playStartTime
        const videoStartTime = latestCurrentVideo.startTime ? latestCurrentVideo.startTime * 1000 : 0
        const timeRemaining = currentVideo.video.runTime * 1000 - timeElapsed - videoStartTime
        clearTimeout(currentTimeout)
        setCurrentTimeout(null)
        setTimeout(() => {
            playNextVideo(songIndex + 1)
        }, timeRemaining)
    }

    const startTime = Number(currentVideo?.startTime)
    let videoSrc = `https://www.youtube.com/embed/${currentVideo?.video?.youtubeId}?autoplay=1&controls=0&start=${startTime}`
    console.log(videoSrc)
    if (!playing) {
        videoSrc += '&mute=1'
    }

    const getUsersPerformingAction = action => {
        let usersPerformingAction = ""

        const usersPerformingActionList = latestCurrentVideo?.videoSelectionActions?.filter(videoSelectionAction => {
            return videoSelectionAction.action === action
        })
        const usersPerformingActionCount = usersPerformingActionList?.length

        if (usersPerformingActionCount === 1) {
            usersPerformingAction = usersPerformingActionList[0]?.user?.username?.toUpperCase()
        } else if (usersPerformingActionCount === 2) {
            usersPerformingAction = `${usersPerformingActionList[0]?.user?.username} & ${usersPerformingActionList[1]?.user?.username}`
        } else if (usersPerformingActionCount > 2) {
            usersPerformingActionList?.forEach((videoSelectionAction, index) => {
                if (index < usersPerformingActionList.length - 2) {
                    usersPerformingAction += `${videoSelectionAction?.user?.username.toUpperCase()}, `
                } else if (index < latestCurrentVideo.videoSelectionActions.length - 1) {
                    usersPerformingAction += `${videoSelectionAction?.user?.username.toUpperCase()} & `
                } else {
                    usersPerformingAction += videoSelectionAction?.user?.username.toUpperCase()
                }
            })
        }
        return usersPerformingAction
    }

    if (videoBeingSkipped) {
        return (<div style={{position: 'relative'}} className="power-hour-viewer">
                <div className="power-hour-header">
                    <h1>{`SKIPPED BY ${getUsersPerformingAction('SKIP')}`}</h1>
                </div>
            </div>
        )
    }

    if (finished) {
        return (
            <div style={{position: 'relative'}} className="power-hour-viewer">
                <div className="power-hour-header">
                    <h1>FINISHED</h1>
                </div>
            </div>
        )
    }

    return (
        <div style={{position: 'relative'}} className="power-hour-viewer">
            {/*<h1 style={!playing ? {position: 'absolute', width: 2000, height: 2000, left: 0, top: -100, zIndex: 100, background: 'red'} : {visibility: 'hidden'}}>DRINK</h1>*/}
            <div className="power-hour-header">
                <h1 style={!playing ? {} : {visibility: 'hidden'}}>{(shouldPlayEntireNextVideo(latestCurrentVideo)) ? `CHUG ${getUsersPerformingAction('FINISH')}` : 'DRINK'}</h1>
            </div>
            <iframe src={videoSrc} title='videoPlayer' allow="autoplay" id="iframe"
                    style={playing ? {} : {visibility: 'hidden'}}/>
        </div>
    )
}

export default PlayPowerHour;