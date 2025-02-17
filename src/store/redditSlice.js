import { createSlice, createSelector } from '@reduxjs/toolkit';
import { getSubredditPosts, getPostComments } from '../API/api';

const initialState = {
    posts: [],
    error: false,
    isLoading: false,
    searchTerm: '',
    selectedSubreddit: '/r/pics/',
  };

const redditSlice = createSlice({
    name: 'redditPosts',
    initialState,
    reducers: {
        setPosts(state, action) {
            state.posts = action.payload;
        },
        getPosts(state) {
            state.isLoading = true;
            state.error = false;
        },
        getPostsSuccess(state, action) {
            state.isLoading = false;
            state.posts = action.payload;
        },
        getPostsFailure(state) {
            state.isLoading = false;
            state.error = true;
        },
        setSearchTerm(state, action) {
            state.searchTerm = action.payload;
        },
        setSelectedSubreddit(state, action) {
            state.selectedSubreddit = action.payload;
            state.searchTerm = '';
        },
        toggleShowComments(state, action) {
            state.posts[action.payload].showingComments = !state.posts[action.payload].showingComments;
        },
        startGetComments(state, action) {
            // start with ability to hid comments
            state.posts[action.payload].showingComments = !state.posts[action.payload].showingComments;
            if (state.posts[action.payload.showingComments]) {
                return;
            }
            state.posts[action.payload].showingComments = true;
            state.posts[action.payload].error = false;
        },
        getCommentsSucces(state, action) {
            state.posts[action.payload.index].loadingComments = false;
            state.posts[action.payload.index].comments = true;
        },
        getCommentsFailure(state, action) {
            state.posts[action.payload.index].loadingComments = false;
            state.posts[action.payload.index].error = true;
        }
    }
});

// Need to export each item as well as the overall slice
export const {
    setPosts,
    getPosts,
    getPostsSuccess,
    getPostsFailure,
    setSearchTerm,
    setSelectedSubreddit,
    toggleShowComments,
    startGetComments,
    getCommentsSucces,
    getCommentsFailure,
} = redditSlice.actions;

export default redditSlice.reducer;

// Create Redux thunk that gets posts from a subreddit
export const fetchPosts = (subreddit) => async (dispatch) => {
    try {
      dispatch(startGetPosts());
      const posts = await getSubredditPosts(subreddit);
  
      // We are adding showingComments and comments as additional fields to handle showing them when the user wants to. We need to do this because we need to call another API endpoint to get the comments for each post.
      const postsWithMetadata = posts.map((post) => ({
        ...post,
        showingComments: false,
        comments: [],
        loadingComments: false,
        errorComments: false,
      }));
      dispatch(getPostsSuccess(postsWithMetadata));
    } catch (error) {
      dispatch(getPostsFailed());
    }
  };

  export const fetchComments = (permalink, index) => async (dispatch) => {
    try {
      dispatch(startGetComments(index));
      const comments = await getPostComments(permalink);
      dispatch(getCommentsSuccess({ comments, index }));
    } catch (error) {
      dispatch(getCommentsFailure({ index }));
    }
  };

  const selectPosts = (state) => state.redditPosts.posts;
  const selectSearchTerm = (state) => state.redditPosts.searchTerm;
  export const selectSelectedSubreddit = (state) => state.redditPosts.selectedSubreddit;

  export const selectFilteredPosts = createSelector(
    [selectPosts, selectSearchTerm],
    (posts, searchTerm) => {
      if (searchTerm !== '') {
        return posts.filter((post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return posts;
    }
  );