import axios from "axios";

const baseUrl = '/api/blogs'

const getAll = () => {
    const getRequest = axios.get(baseUrl)
    return getRequest.then(response => response.data)
}

const create = (toBeSavedBlog) => {
    const postRequest = axios.post(baseUrl , toBeSavedBlog)
    return postRequest.then(response => response.data)
}

const update = (id , toBeUpdatedBlog) => {
    const putRequest = axios.put(`${baseUrl}/${id}` , toBeUpdatedBlog)
    return putRequest.then(response => response.data)
}

const remove = (id) => {
    const deleteRequest = axios.delete(`${baseUrl}/${id}`)
    return deleteRequest.then(response => response.data)
}

export default {getAll , create , update , remove}