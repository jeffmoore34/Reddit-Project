import axios from "axios";

const API_ROOT = 'https://www.reddit.com';

export const getSubredditPosts = async (subreddit) => {
    try {
    const response = await axios.get(`${API_ROOT}/r/${subreddit}/top.json`);
    return response.data.data.children.map((post) => post.data);
    } catch (error) {
        console.log('Error fetching Subreddit Posts:', error);
        throw error;
    }
};

export const getSubreddits = async () => {
    try {
        const response = await axios.get(`${API_ROOT}/subreddits.json`);
        return response.data.data.children.map((subreddit) => subreddit.data);
    } catch (error) {
        console.log('Erros fetching Subreddits:', error);
        throw error;
    }
};


export const getPostComments = async (permalink) => {
    try {
        const response = await axios.get(`${API_ROOT}${permalink}.json`);
        return response.data.data.children.map((comment) => comment.data);
    } catch (error) {
        console.log('Error fetching comments:', error);
        throw error;
    }
};