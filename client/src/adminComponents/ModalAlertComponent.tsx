import React from 'react';
import { Link } from 'react-router-dom';
import { Modal, ModalBody, Button, Alert } from 'reactstrap';
import { baseUrl } from '../shared/baseUrl';

interface ModalAlertProps {
    toDelete: boolean,
    toAdmin: boolean,
    modalState: {
        isOpen: boolean,
        color: string,
        icon: string,
        phrase?: string,
        itemTitle?: string,
        itemId?: string
    },
    setModalState: (modalState: any) => void,
    tokenWorking?: (token: string) => boolean
}

function ModalAlert (props : ModalAlertProps) {
    const toggle = () => props.setModalState((modalState: any) => ({
                                                ...modalState,
                                                isOpen: !props.modalState.isOpen
                                            }));
                                       
    const deleteItem = () => {
        const token = localStorage.getItem('token');
        if (token && props.tokenWorking!(token)) {
            fetch(baseUrl + '/' + props.modalState.itemTitle + '/' + props.modalState.itemId, {
                method: 'DELETE',
                headers: { 'x-access-token': token }
            })
            .then(() => window.location.reload())
            .catch((error) => console.log(error));
        } else {
            props.setModalState({
                isOpen: true,
                color: 'danger',
                icon: 'exclamation-circle',
                phrase: 'Opsss! There is a token problem.'
            });
        }
    }

    return (
        <Modal className='admin' isOpen={props.modalState.isOpen} toggle={toggle} centered >
            <Alert color={props.modalState.color} className='text-center m-0' >
                <i className={`fa fa-${props.modalState.icon}`} style={{fontSize: '5rem'}}></i>
            </Alert>

            <ModalBody className='text-center'>
                {
                    props.toDelete ?
                    <>
                       <h5 className='text-secondary py-2'>Are you sure you want to delete?</h5>
                        <div className='d-flex justify-content-around'>
                            <Button color='secondary' onClick={toggle}>
                                Cancel
                            </Button>
                            <Button color='danger' onClick={deleteItem}>
                                Yes, delete
                            </Button>
                        </div> 
                    </>
                    :
                    <>
                        <h5 className={`text-${props.modalState.color} py-2`}>{props.modalState.phrase}</h5>
                        {
                            props.toAdmin ?
                            <Link to='/admin' reloadDocument>
                                <Button color={props.modalState.color} outline>
                                    Close
                                </Button> 
                            </Link>
                            :
                            <Button color={props.modalState.color} outline onClick={toggle}>
                                    Close
                            </Button> 
                        }   
                    </>
                }
                
            </ModalBody>
        </Modal>
    )
}

export default ModalAlert;