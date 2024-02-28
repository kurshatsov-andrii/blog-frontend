import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../utils/axios'

const initialState = {
	user: null,
	token: null,
	isLoading: false,
	status: null,
}

export const registerUser = createAsyncThunk(
	'auth/registerUser',
	async ({ username, password }) => {
		try {
			const { data } = await axios.post('/auth/register', {
				username,
				password,
			})
			if (data.token) {
				window.localStorage.setItem('token', data.token)
			}
			return data
		} catch (error) {
			console.log(error)
		}
	}
)

export const loginUser = createAsyncThunk(
	'auth/loginUsers',
	async ({ username, password }) => {
		try {
			const { data } = await axios.post('/auth/login', {
				username,
				password,
			})
			if (data.token) {
				window.localStorage.setItem('token', data.token)
			}
			return data
		} catch (error) {
			console.log(error)
		}
	}
)

export const getMe = createAsyncThunk('auth/loginUser', async () => {
	try {
		const { data } = await axios.get('/auth/me')
		return data
	} catch (error) {
		console.log(error)
	}
})

const handlePending = state => {
	state.isLoading = true
	state.status = null
}

const handleFulfilled = state => {
	state.isLoading = false
}

const handleRejected = (state, action) => {
	state.status = action.payload.message
	state.isLoading = false
}

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: state => {
			state.user = null
			state.token = null
			state.isLoading = false
			state.status = null
		},
	},

	extraReducers: builder => {
		builder
			.addCase(loginUser.fulfilled, (state, { payload }) => {
				state.status = payload.message
				state.user = payload.user
				state.token = payload.token
			})
			.addCase(registerUser.fulfilled, (state, { payload }) => {
				state.status = payload.message
				state.user = payload.user
				state.token = payload.token
			})
			.addCase(getMe.fulfilled, (state, { payload }) => {
				state.status = null
				state.user = payload?.user
				state.token = payload?.token
			})
			.addMatcher(action => action.type.endsWith('/pending'), handlePending)
			.addMatcher(action => action.type.endsWith('/rejected'), handleRejected)
			.addMatcher(action => action.type.endsWith('/fulfilled'), handleFulfilled)
	},
})

export const checkIsAuth = state => Boolean(state.auth.token)

export const { logout } = authSlice.actions
export default authSlice.reducer
