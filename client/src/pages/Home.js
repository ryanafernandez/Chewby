import React from 'react';
import { useNavigate } from 'react-router-dom';
import eggs from '../images/calorieeggs.jpg'
// we have to bring in the reference to the component

import styled from 'styled-components';

const Home = () => {
    const navigation = useNavigate();

    const handleClick = async (event) => {
        event.preventDefault();

    };

    return (
        <div>
            <div id = "left-box flexbox column">

            </div>
            
               
            <h1>Home Component</h1>
            <img src={eggs}/>
            <button onClick={handleClick}>Signup</button>
        </div>
    );
};


export default Home;
