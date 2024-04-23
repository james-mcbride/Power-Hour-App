import React, {useState} from 'react'
import ReactModal from 'react-modal';
import {useHistory} from "react-router-dom";

function StartPowerHourModal({playlistId, onClose, open}) {
    const history = useHistory();
    const [startSongNumber, setStartSongNumber] = useState(1)

    return (
        <ReactModal isOpen={open} id="finish-song-selection-modal">
            <div id="finish-song-selection-div">
                <button onClick={e => {
                    e.stopPropagation()
                    onClose(false)
                }
                }
                        className="close-button"
                >
                    Close
                </button>
                <div className="edit-video-form">
                    <div>
                        <label>
                            Start Song Number
                        </label>
                        <input id="start-power-hour-input" value={startSongNumber}
                               onChange={e => setStartSongNumber(e.target.value)}/>

                    </div>
                    <div>
                        <button
                            className="confirm-button"
                            onClick={() => history.push(`/powerHour/play/${playlistId}?startSong=${startSongNumber}`)}
                        >Start
                        </button>
                    </div>
                </div>
            </div>
        </ReactModal>
    )
}

export default StartPowerHourModal