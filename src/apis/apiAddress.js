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

const getServiceType = (from, to) => {
    let url = 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services'
    return axiosClient.get(url, {data: {
        shop_id: 3476277,
        from_district: from,
        to_district: to
    }}, {headers: {
        'Content-Type': 'application/json',
        'token': 'c68d015c-6a1b-11ed-be76-3233f989b8f3'
    }})
}

const getPayService = (service_id, from, to, ward) => {
    let url = 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee'
    return axiosClient.get(url, {data: {
        "service_id":service_id,
        "insurance_value":0,
        "coupon": null,
        "from_district_id":from,
        "to_district_id":to,
        "to_ward_code": ward,
        "height":15,
        "length":15,
        "weight":1000,
        "width":15
    }}, {headers: {
        'Content-Type': 'application/json',
        'token': 'c68d015c-6a1b-11ed-be76-3233f989b8f3'
    }})
}
export {
    getProvince,
    getDistrict,
    getWard,
    getServiceType,
    getPayService
}