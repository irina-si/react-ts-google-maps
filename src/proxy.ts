import Axios from 'axios';
import parceResponse from './services';

const getStops = () => {
    return Axios
        .get('city/minsk/stops.txt', {
        headers: {'Access-Control-Allow-Origin': '*'},  
        })
        .then((response => response.data))
        .then(data => parceResponse(data))
}

export default getStops;