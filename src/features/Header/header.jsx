import React, {useState, useEffect } from "react";
import { setSearchTerm } from "../../store/redditSlice";
import { useDispatch, useSelector } from "react-redux";
import './header.css';


function Header() {
    console.log('Header component rendered');
    const [searchTermApp, setSearchTermApp] = useState('');
    const searchTerm = useSelector((state) => state.reddit.searchTerm);
    const dispatch = useDispatch();

    const onSearchTermChange = (e) => {
        setSearchTermApp(e.target.value);
    };

    useEffect(() => {
        setSearchTermApp(searchTerm);
    }, [searchTerm]);

    const onSearchTermSubmit = (e) => {
        e.preventDefault();
        dispatch(setSearchTerm(searchTermApp));
    };

    return (
        <header>
            <div className='logo'>
            <p>Reddit<span>Reader</span></p>
            </div>
            <form className='search' onSubmit={onSearchTermSubmit}>
                <input
                    type='text'
                    placeholder='Search'
                    value={searchTermApp}
                    onChange={onSearchTermChange}
                    aria-label='Search posts'
                />
                <button type='submit'>
                  Search
                </button>
            </form>
        </header>
    );
};

export default Header