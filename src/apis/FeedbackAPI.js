import axiosClient from "./axiosClient";
import {getHeaderWithToken} from "./getHeaderWithToken";

const addFeedback = (id,data) => {
    const url = `/feedback/create/${id}`;
    return axiosClient.post(url, data, {headers: getHeaderWithToken()})
}  

const getFeedbackByCompany = (id) => {
	const url = `/feedback/company/${id}`
	return axiosClient.get(url)
}

const getFeedbackById = (id) => {
	const url = `/feedback/${id}`
	return axiosClient.get(url, {headers: getHeaderWithToken()})
}

export default {
    addFeedback, 
    getFeedbackByCompany,
    getFeedbackById
}