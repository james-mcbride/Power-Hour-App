import axios from 'axios';
import {accessToken} from "../components/tokens";

export default axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3',
    params: {
        part: 'snippet',
        maxResults: 10,
        key:  accessToken
    }

})

