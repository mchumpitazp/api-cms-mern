import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import { baseUrl } from '../shared/baseUrl';
import BackButton from './BackButtonComponent';
import FormItem from './ItemFormComponent';
import ModalAlert from './ModalAlertComponent';

interface ItemEditProps {
    tokenWorking: (token: string) => boolean
}

function ItemEdit (props: ItemEditProps) {
    const navigate = useNavigate();
    const [itemObj, setItemObj] = React.useState({});
    const [submit, setSubmit] = React.useState(false);
    const [modalState, setModalState] = React.useState({
        isOpen: false,
        color: 'success',
        icon: 'check-circle-o',
        phrase: 'Successfully saved!'
    });

    const { item_title } = useParams();
    const { state } = useLocation();

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && props.tokenWorking(token)) {
            fetch(baseUrl + '/' + item_title + '/' + state.item_id, {
                method: 'GET',
                headers: { 'x-access-token': localStorage.getItem('token')! }
            })
            .then(res => res.json())
            .then(item => setItemObj(item))
            .catch((error) => {
                console.log(error);
                setModalState({
                    isOpen: true,
                    color: 'danger',
                    icon: 'exclamation-circle',
                    phrase: 'Opsss! There is a server problem.'
                });
            })
        } else {
            navigate('login');
        }
    }, [props, item_title, state, navigate]);

    const submitForm = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData: FormData = new FormData(e.currentTarget);
        let newData: { [key: string]: any } = {};
        formData.forEach((value, key) => newData[key] = value );

        const token = localStorage.getItem('token');
        if (token && props.tokenWorking(token)) {
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
        } else {
            setModalState({
                isOpen: true,
                color: 'danger',
                icon: 'exclamation-circle',
                phrase: 'Opsss! There is a token problem.'
            });
        }
    }

    if (itemObj) {
        return (
            <div className='admin'>
                <BackButton submit={submit}/>

                <Container className='item'>
                    <h4 className='item-title'>{item_title} editor</h4>
                    <br />
                    <FormItem  onSubmit={submitForm}
                                itemObj={itemObj}
                                defaultValue={true} />
                    <ModalAlert modalState={modalState} setModalState={setModalState}
                                toDelete={false}
                                toAdmin={true} />
                </Container>
            </div>
            
        )
    }
}

export default ItemEdit;