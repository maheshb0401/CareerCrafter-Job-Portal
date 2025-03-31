import axios from 'axios';


const api = axios.create({
    baseURL: "http://localhost:8090/"
});


export const registerJobSeeker = (formData) => {
    return api.post("api/auth/registerJobSeeker", formData);
};

export const registerEmployer = (formData) =>{
    return api.post("api/auth/registerEmployer", formData);
}







