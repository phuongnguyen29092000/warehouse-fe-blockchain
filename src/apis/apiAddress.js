import axiosClient from "./axiosClient";

const getProvince = () => {
    let url = 'https://raw.githubusercontent.com/nhidh99/codergamo/master/004-location-selects/locations/cities.json'
    return axiosClient.get(url)
}

const getDistrict = (proId) => {
    let url = `https://raw.githubusercontent.com/nhidh99/codergamo/master/004-location-selects/locations/districts/${proId}.json`
    return axiosClient.get(url)
}

const getWard = (id) => {
    let url = `https://raw.githubusercontent.com/nhidh99/codergamo/master/004-location-selects/locations/wards/${id}.json`
    return axiosClient.get(url)
}

export {
    getProvince,
    getDistrict,
    getWard,
}