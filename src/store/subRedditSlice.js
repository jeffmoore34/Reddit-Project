import { createSlice } from '@reduxjs/toolkit';
import { getSubreddits } from '../API/api';

const initialState = {
    subReddits: [],
    error: false,
    isLoading: false,
};

const subRedditSlice = createSlice({
    name: 'subReddit',
    initialState,
    reducers: {
        getSubReddits(state) {
            state.isLoading = true;
            state.error = false;
        },
        getSubRedditsSuccess(state, action) {
            state.isLoading = false;
            state.subReddits = action.payload;
        },
        getSubRedditsFailure(state) {
            state.isLoading = false;
            state.error = true;
        },
    }
});

export const { getSubReddits, getSubRedditsSuccess, getSubRedditsFailure } = subRedditSlice.actions;

export default subRedditSlice.reducer;

export const fetchSubReddits = () => async (dispatch) => {
    try {
        dispatch(getSubReddits());
        const subReddits = await getSubreddits();
        dispatch(getSubRedditsSuccess(subReddits));
    } catch (error) {
        dispatch(getSubRedditsFailure());
    }
};

export const selectSubReddits = (state) => state.subReddit.subReddits;