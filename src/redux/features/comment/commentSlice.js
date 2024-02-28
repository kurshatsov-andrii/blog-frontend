import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../utils/axios'

const initialState = {
	comments: [],
	loading: false,
}

export const createComment = createAsyncThunk(
	'comment/createComment',
	async ({ postId, comment }) => {
		try {
			const { data } = await axios.post(`/comments/${postId}`, {
				postId,
				comment,
			})
			return data
		} catch (error) {
			console.log(error)
		}
	}
)

export const getPostComments = createAsyncThunk(
	'comment/getPostComments',
	async postId => {
		try {
			const { data } = await axios.get(`/posts/comments/${postId}`)
			return data
		} catch (error) {
			console.log(error)
		}
	}
)

const handlePendingComment = state => {
	state.loading = true
}

function handleFulfilledComment(state) {
	state.loading = false
}

const handleRejectedComment = (state, action) => {
	state.isLoading = false
}

export const commentSlice = createSlice({
	name: 'comment',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(createComment.fulfilled, (state, { payload }) => {
				state.comments.push(payload)
			})
			.addCase(getPostComments.fulfilled, (state, { payload }) => {
				state.comments = payload
			})
			.addMatcher(
				action => action.type.endsWith('/pending'),
				handlePendingComment
			)
			.addMatcher(
				action => action.type.endsWith('/rejected'),
				handleRejectedComment
			)
			.addMatcher(
				action => action.type.endsWith('/fulfilled'),
				handleFulfilledComment
			)
	},
})

export default commentSlice.reducer
