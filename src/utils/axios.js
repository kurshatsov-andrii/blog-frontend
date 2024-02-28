import axios from 'axios'

const instance = axios.create({
	baseURL: 'https://blog-back-end-477b.onrender.com/api',
	validateStatus: () => true,
})

instance.interceptors.request.use(config => {
	config.headers.Authorization = window.localStorage.getItem('token')

	return config
})

export default instance
