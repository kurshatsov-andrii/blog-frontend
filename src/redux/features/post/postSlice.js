import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../utils/axios'

const initialState = {
	posts: [],
	popularPosts: [],
	loading: false,
}

export const createPost = createAsyncThunk('post/createPost', async params => {
	try {
		const { data } = await axios.post('/posts', params)
		return data
	} catch (error) {
		console.log(error)
	}
})

export const getAllPosts = createAsyncThunk('post/getAllPosts', async () => {
	try {
		const { data } = await axios.get('/posts')
		return data
	} catch (error) {
		console.log(error)
	}
})

export const removePost = createAsyncThunk('post/removePost', async id => {
	try {
		const { data } = await axios.delete(`/posts/${id}`, id)
		return data
	} catch (error) {
		console.log(error)
	}
})

export const updatePost = createAsyncThunk(
	'post/updatePost',
	async updatedPost => {
		try {
			const { data } = await axios.put(`/posts/${updatedPost.id}`, updatedPost)
			return data
		} catch (error) {
			console.log(error)
		}
	}
)

const handlePendingPost = state => {
	state.loading = true
}

const handleFulfilledPost = state => {
	state.loading = false
}

const handleRejectedPost = (state, action) => {
	state.isLoading = false
}

export const postSlice = createSlice({
	name: 'post',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(createPost.fulfilled, (state, { payload }) => {
				state.posts.push(payload)
			})
			.addCase(getAllPosts.fulfilled, (state, { payload }) => {
				state.posts = payload.posts
				state.popularPosts = payload.popularPosts
			})
			.addCase(removePost.fulfilled, (state, { payload }) => {
				state.posts = state.posts.filter(post => post._id !== payload._id)
			})
			.addCase(updatePost.fulfilled, (state, { payload }) => {
				const index = state.posts.findIndex(post => post._id === payload._id)
				state.posts[index] = payload
			})
			.addMatcher(action => action.type.endsWith('/pending'), handlePendingPost)
			.addMatcher(
				action => action.type.endsWith('/rejected'),
				handleRejectedPost
			)
			.addMatcher(
				action => action.type.endsWith('/fulfilled'),
				handleFulfilledPost
			)
	},
})

export default postSlice.reducer
