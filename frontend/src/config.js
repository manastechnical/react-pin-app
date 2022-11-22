import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "https://react-pin-app.herokuapp.com/api/"
})