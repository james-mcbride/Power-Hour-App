import React from 'react'
import ReactModal from 'react-modal';
import axios from "axios";

function VideoSelectionActionModal({open, videoSelection, onClose, currentFinishVideoSelectionStatus, action}) {
    const username = document.cookie?.split("username=")?.[1]

    const addFinishVideoSelection = e => {
        e.stopPropagation()
        axios.post(`http://192.168.86.21:8091/powerHour/videoSelection/${videoSelection.id}/videoSelectionAction`, {
            username: username,
            actionStatus: !currentFinishVideoSelectionStatus,
            action
        }, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
            }
        }).then(response => {
            onClose(!currentFinishVideoSelectionStatus)
        });
    }

    const getPrompt = () => {
        if (action === 'FINISH') {
            return currentFinishVideoSelectionStatus ? "Do you no longer want to play entire song?" : "Play entire song? (WARNING YOU WILL HAVE TO FINISH YOUR DRINK)"
        } else if (action === 'SKIP') {
            return currentFinishVideoSelectionStatus ? "Do you no longer want to skip song?" : "Skip song? (WARNING TWO OR MORE SKIPS ARE REQUIRED TO SKIP OTHER USER'S SONG SELECTION)"
        }
    }


    return (
        <ReactModal isOpen={open} id="finish-song-selection-modal">
            <div id="finish-song-selection-div">
                <button onClick={e => {
                    e.stopPropagation()
                    onClose(false)}
                }
                        className="close-button"
                >
                    Close</button>
                <div className="edit-video-form">
                    <div>
                        {getPrompt()}
                    </div>
                    <div>
                        <button className="confirm-button" onClick={addFinishVideoSelection}>Confirm</button>
                    </div>
                </div>
            </div>
        </ReactModal>
    )
}

export default VideoSelectionActionModal