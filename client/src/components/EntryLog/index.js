import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Button, Icon, Table } from 'semantic-ui-react'

import { QUERY_SINGLE_LOGGED_DAY } from '../../utils/queries';
import { REMOVE_ENTRY } from '../../utils/mutations'

import Auth from '../../utils/auth';

// Option 1 if you wanna pass around props
// const EntryContent = () => {
//     const [entries, setEntries] = Reacct.useState({})
//     return(
//         <div>
//             <EntirLog entries={entries}></EntirLog>
//             <EntryForm setEntries={setEntries} entries={entries}></EntryForm>
//         </div>
//     )
// }

// Option 2: refetching for new data
// const EntryContent = () => {
    // const { loading, error, data, refetch } = useQuery(QUERY_SINGLE_LOGGED_DAY, {
    //     variables: { 
    //         loggedDay: loggedDay, 
    //         loggedDayAuthor: Auth.getProfile().data.username 
    //     }
    // });
//     return(
//         <div>
//             <EntirLog loggedDayData={data.loggedDay}></EntirLog>
//             <EntryForm onSubmit={refetch} ></EntryForm>
//         </div>
//     )
// }


const EntryLog = ({ loggedDay }) => {
   
    const { loading, error, data } = useQuery(QUERY_SINGLE_LOGGED_DAY, {
        variables: { 
            loggedDay: loggedDay, 
            loggedDayAuthor: Auth.getProfile().data.username 
        },
        pollInterval: 500,
    });

    const dailyGoal = 2000;
    let dailyCalories = 0;

    const [removeEntry, { removeError, removeData }] = useMutation(REMOVE_ENTRY);

    if (loading) return 'Loading...';
    if (error) return console.error(error);

    const loggedDayData = data?.loggedDay;

    let caloriePercentage = 100*(1-(dailyCalories/dailyGoal));
    if (caloriePercentage <= 0) {
        caloriePercentage = 0;
    }

    // If no data logged for the day, say so.
    if (!loggedDayData || (loggedDayData.entries.length < 1)) {
        console.log("EntryLog - No logs found for:", loggedDay);
        return (
            <>
                <p>{dailyGoal-dailyCalories}/{dailyGoal}</p>
                <div id="calorie-bar" style={{height: '30px', width: '300px', border: 'black 3px solid'}}>
                    <div id="daily-intake" style={{ backgroundColor: "#8CC152", width: `${caloriePercentage}%`, height: '100%'}}></div>
                </div>
                <p> You haven't made any entries for {loggedDay} yet. </p>
            </>
        );
    }

    const handleRemoveEntry = async (entryId) => {

        try {
            const { data } = await removeEntry({ 
                variables: { 
                    entryId: entryId,
                    loggedDayId: loggedDayData._id
                },
            });
            console.log("delete id:", entryId);
        } catch (err) {
            console.error(err);
        }
        
    };

    console.log("EntryLog - Displaying entry log for:", loggedDay);
    // Otherwise, return current entries.
    
    loggedDayData.entries.forEach(entry => {
        dailyCalories += entry.calories;
    });
    caloriePercentage = 100*(1-(dailyCalories/dailyGoal));
    if (caloriePercentage <= 0) {
        caloriePercentage = 0;
    }
    console.log("******daily:", dailyCalories);
    console.log("cal%: ", caloriePercentage);
    return (
        <div>
            <div class="calorieMeter">
                <p>{dailyGoal-dailyCalories}/{dailyGoal}</p>
                <div id="calorie-bar" style={{height: '30px', width: '300px', border: 'black 3px solid'}}>
                    <div id="daily-intake" style={{ backgroundColor: "#8CC152", width: `${caloriePercentage}%`, height: '100%'}}></div>
                </div>
            </div>
            
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Item</Table.HeaderCell>
                        <Table.HeaderCell>Calories</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {loggedDayData.entries.map((entry) => (
                        <Table.Row>
                            <Table.Cell>{entry.item}</Table.Cell>
                            <Table.Cell>{entry.calories}</Table.Cell>
                            <Table.Cell>
                                <Button 
                                    icon
                                    onClick={e=> { e.preventDefault(); handleRemoveEntry(entry._id)}}
                                >
                                    <Icon name='delete' />
                                </Button>
                            </Table.Cell>
                        </Table.Row> 
                    ))}
                </Table.Body>
            </Table>

            {/* <div class="flex-column-center">
                {loggedDayData.entries.map((entry) => (
                    <div class="flex-row-center" entryid={entry._id}>
                        <div class="flex-row-center">
                            <p>{entry.item}</p>
                            <p>{entry.calories}</p>
                        </div>
                        
                        <Button 
                            icon
                            onClick={e=> { e.preventDefault(); handleRemoveEntry(entry._id)}}
                        >
                            <Icon name='delete' />
                        </Button>
                    </div>
                ))}
            </div> */}
            
        </div>
    );
};

export default EntryLog;