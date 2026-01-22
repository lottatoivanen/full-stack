import axios from 'axios'
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
const api_key = import.meta.env.VITE_OPENWEATHER_API_KEY

const getWeather = (capital) => {
    const request = axios.get(`${baseUrl}?q=${capital}&appid=${api_key}&units=metric`)
    return request.then(response => response.data)
    }
    
export default { getWeather: getWeather }