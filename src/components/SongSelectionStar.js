import React from 'react'

function SongSelectionStar({finishVideo, onClick}) {
    return (
        <span className = "finish-song-button action-button" onClick={onClick}>
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                 width="512px" height="512px" viewBox="0 0 512 512" enable-background="new 0 0 512 512">
                <polygon fill={finishVideo ? "yellow" : "white"} stroke="#1D1D1B" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"
                         stroke-miterlimit="10" points="
	259.216,29.942 330.27,173.919 489.16,197.007 374.185,309.08 401.33,467.31 259.216,392.612 117.104,467.31 144.25,309.08
	29.274,197.007 188.165,173.919 "/>
            </svg>
        </span>
    )
}

export default SongSelectionStar
