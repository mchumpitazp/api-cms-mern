import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import { baseUrl } from '../shared/baseUrl';
import BackButton from './BackButtonComponent';
import FormItem from './ItemFormComponent';
import ModalAlert from './ModalAlertComponent';

interface ItemEditProps {
    data: any
}

function ItemEdit (props: ItemEditProps) {
    const [submit, setSubmit] = React.useState(false);
    const [modalState, setModalState] = React.useState({
        isOpen: false,
        color: 'success',
        icon: 'check-circle-o',
        phrase: 'Successfully saved!'
    });

    const { item_title } = useParams();
    const { state } = useLocation();

    const submitForm = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData: FormData = new FormData(e.currentTarget);
        let newData: { [key: string]: any } = {};
        formData.forEach((value, key) => newData[key] = value );

        const token = localStorage.getItem('token');
        if (!token) {
            setModalState({
                isOpen: true,
                color: 'danger',
                icon: 'exclamation-circle',
                phrase: 'Opsss! There is a token problem.'
            });
            return;
        }

        fetch(baseUrl + '/' + item_title + '/' + state.item_id, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify(newData)
        })
        .then(response => response.json())
        .then(() => {
            setModalState({
                isOpen: true,
                color: 'success',
                icon: 'check-circle-o',
                phrase: 'Successfully saved!'
            });
        })
        .catch((error) => {
            console.log(error);
            setModalState({
                isOpen: true,
                color: 'danger',
                icon: 'exclamation-circle',
                phrase: 'Opsss! There is a server problem.'
            });
        })
        .finally(() => setSubmit(true));
    }

    if (!props.data.isLoading) {
        const itemObj = props.data.data[item_title!]?.filter((obj: any) => obj._id === state.item_id)[0];
        
        return (
            <div className='admin'>
                <BackButton submit={submit}/>

                <Container className='item'>
                    <h4 className='item-title'>{item_title} editor</h4>
                    <br />
                    <FormItem  onSubmit={submitForm}
                                itemObj={itemObj}
                                defaultValue={true} />
                    <ModalAlert modalState={modalState} setModalState={setModalState} toDelete={false}/>
                </Container>
            </div>
            
        )
    }
}

export default ItemEdit;