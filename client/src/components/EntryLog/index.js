import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Modal } from 'react-bootstrap';
import { Button, Icon, Table } from 'semantic-ui-react'

import CalorieBar from '../CalorieBar';
import EntryForm from '../EntryForm';
import UpdateForm from '../UpdateForm';

import { QUERY_SINGLE_LOGGED_DAY } from '../../utils/queries';
import { REMOVE_ENTRY } from '../../utils/mutations'
import Auth from '../../utils/auth';

const EntryLog = (props) => {
   
    const [ edit, setEdit ] = useState(false);
    const [ showEntryForm, setShowEntryForm ] = useState(false);
    const [ showUpdateForm, setShowUpdateForm ] = useState(false);
    const [ updateId, setUpdateId ] = useState();
    const [ updateItem, setUpdateItem ] = useState();
    const [ updateCalories, setUpdateCalories ] = useState();
    const { loading, error, data } = useQuery(QUERY_SINGLE_LOGGED_DAY, {
        variables: { 
            loggedDay: props.loggedDay, 
            loggedDayAuthor: Auth.getProfile().data.username 
        },
        pollInterval: 500,
    });
    const [removeEntry, { removeError, removeData }] = useMutation(REMOVE_ENTRY);

    const calorieTarget = 2000;
    let calorieIntake = 0;

    if (loading) return 'Loading...';
    if (error) return console.error(error);

    const loggedDayData = data?.loggedDay;

    if (loggedDayData) {
        loggedDayData.entries.forEach(entry => {
            calorieIntake += entry.calories;
        });
    };

    const handleRemoveEntry = async (entryId) => {
        try {
            const { data } = await removeEntry({ 
                variables: { 
                    entryId: entryId,
                    loggedDayId: loggedDayData._id
                },
            });
            setEdit(false);
        } catch (err) {
            console.error(err);
        }
        
    };  
    
    return (
        <div className='flex-column-center'>
            <CalorieBar calorieIntake={calorieIntake} calorieTarget={calorieTarget} />
            
            <div className='entry-log'>
                { (!loggedDayData || (loggedDayData.entries.length < 1)) ?
                        <>
                            <div className='entry-log-msg'>
                                <p> You haven't made any entries for {props.loggedDay}.</p>
                                <p> Use the 'Add an entry' button below to get started! </p>
                            </div>
                            
                        </>
                    :
                    <>
                        <Table striped>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Item</Table.HeaderCell>
                                    <Table.HeaderCell>Calories</Table.HeaderCell>
                                    { (edit) ? 
                                        <Table.HeaderCell></Table.HeaderCell>
                                        : console.log('okay')
                                    }
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {loggedDayData.entries.map((entry) => (
                                    <Table.Row>
                                        <Table.Cell>{entry.item}</Table.Cell>
                                        <Table.Cell>{entry.calories}</Table.Cell>
                                        { (edit) ?
                                            <Table.Cell>
                                                <Button 
                                                    icon
                                                    color='red'
                                                    onClick={e=> { e.preventDefault(); handleRemoveEntry(entry._id)}}
                                                >
                                                    <Icon name='delete' />
                                                </Button>
                                                <Button
                                                    icon
                                                    onClick={e=> { 
                                                        e.preventDefault();
                                                        setUpdateId(entry._id);
                                                        setUpdateItem(entry.item);
                                                        setUpdateCalories(entry.calories);
                                                        setShowUpdateForm(true);
                                                    }}
                                                >
                                                    <Icon name='pencil' />
                                                </Button>
                                            </Table.Cell>
                                            : console.log('okay')
                                        }
                                    </Table.Row> 
                                ))}
                            </Table.Body>
                        </Table>
                        
                    </>
                }
            </div>

            { (!loggedDayData || (loggedDayData.entries.length < 1)) ? 
                <Button color='green' onClick={() => setShowEntryForm(true)}>
                    Add an entry
                </Button>
            :
                <div className='flex-column-row'>
                    <Button color='green' onClick={() => setShowEntryForm(true)}>
                        Add an entry
                    </Button>
                    <Button onClick={() => setEdit(!edit)}>
                        Edit entry
                    </Button>
                </div>
            }
            
            <Modal
                size='lg'
                show={showEntryForm}
                onHide={() => setShowEntryForm(false)}
                aria-labelledby='entryform-modal'
            >
                <Modal.Header closeButton>
                    <Modal.Title id='entryform-modal'>
                        Add a New Entry
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EntryForm loggedDay={props.loggedDay} handleModalClose={() => setShowEntryForm(false)} />
                </Modal.Body>
            </Modal> 

            <Modal
                size='lg'
                show={showUpdateForm}
                onHide={() => setShowUpdateForm(false)}
                aria-labelledby='updateform-modal'
            >
                <Modal.Header closeButton>
                    <Modal.Title id='updateform-modal'>
                        Edit an Entry
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <UpdateForm 
                        loggedDay={props.loggedDay} 
                        handleModalClose={() => {setShowUpdateForm(false);setEdit(false);}}
                        entryId={updateId}
                        item={updateItem}
                        calories={updateCalories}
                    />
                </Modal.Body>
            </Modal>          
        </div>
    );
};

export default EntryLog;
