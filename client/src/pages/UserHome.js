import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';

import EntryLog from '../components/EntryLog';
import EntryForm from '../components/EntryForm';

import { GET_ME } from '../utils/queries';
import Auth from '../utils/auth';
import dateFormat from '../utils/dateFormat';
import loggedDayFormat from '../utils/loggedDayFormat';

import { ButtonAnimatedLeft, ButtonAnimatedRight } from '../utils/buttonAnimated';

const UserHome = () => {
    // create state for holding the viewed date
    const [viewedDay, setViewedDay] = useState(new Date());

    const { loading, error, data } = useQuery(GET_ME);
    const userData = data?.me;

    if (error) return `Error! ${error.message}`;
    if (loading) return 'Loading...';

    var today = new Date();
    const prev = new Date(viewedDay);
    prev.setDate(viewedDay.getDate() - 1);
    const prevDay = loggedDayFormat(prev);

    const next = new Date(viewedDay);
    next.setDate(viewedDay.getDate() + 1);
    const nextDay = loggedDayFormat(next);

    // nice formatted day for user home
    let formattedDay = dateFormat(viewedDay, { dayLength: '', monthLength: '', dateSuffix: true });

    // formatted loggedDay for backend ( mm/dd/yyyy )
    let loggedDay = loggedDayFormat(viewedDay); // 03/13/2023
    console.log("UserHome - loggedDay:", loggedDay);

    const handlePrev = async (event) => {
        event.preventDefault();

        // for reference: https://stackoverflow.com/questions/71507861/react-js-not-refreshing-state-update-with-date-value
        const prev = new Date(viewedDay);
        prev.setDate(viewedDay.getDate() - 1);
        console.log("UserHome - prev", prev);
        setViewedDay(prev);
    };

    const handleNext = async (event) => {
        event.preventDefault();

        const next = new Date(viewedDay);
        next.setDate(viewedDay.getDate() + 1);
        console.log("UserHome - next:", next);
        setViewedDay(next);
    }

    return (
        <div class="flex-column-center">
            <h2>Hello {Auth.getProfile().data.username}</h2>
            <div class="flex-row-center">
                <ButtonAnimatedLeft handlePrev={handlePrev} prev={prevDay}/>
                <h2>{formattedDay}</h2>
                <ButtonAnimatedRight handleNext={handleNext} next={nextDay}/>
            </div>
            <div>
                <EntryLog loggedDay={loggedDay} />
            </div>
            <div>
                <EntryForm loggedDay={loggedDay}/>
            </div>
        </div>
    );
};

export default UserHome;