import React from 'react';
import jwt_decode, { JwtPayload } from "jwt-decode";
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import { fetchData } from '../redux/ActionCreators';
import { Container, Table, Nav, NavLink, TabContent, TabPane, Button, Spinner} from "reactstrap";
import ModalAlert from './ModalAlertComponent';

interface PanelProps {
    data: any
}

function Panel (props: PanelProps) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = React.useState(localStorage.getItem('activeTab') || '');
    const [toDelete, setToDelete] = React.useState(true);
    const [modalState, setModalState] = React.useState({
        isOpen: false,
        color: '',
        icon: '',
        phrase: '',
        itemTitle: '',
        itemId: ''
    })
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            const user = jwt_decode<JwtPayload>(token);
            if (user && user.exp) {
                const exp = user.exp * 1000;
                const now = new Date().getTime();

                if (exp > now) {
                    dispatch(fetchData(token));
                } else {
                    setToDelete(false);
                    setModalState(state => {
                        return {
                            ...state,
                            isOpen: true,
                            color: 'secondary',
                            icon: 'clock-o',
                            phrase: 'Session expired, please login again.'
                    }});
                    localStorage.removeItem('token');
                }
            }
        } else {
            navigate('login');
        }
    }, [dispatch, navigate]);

    React.useEffect(() => {
        if (props.data.data.length !== 0) {
            if (activeTab === '') {
                const key: string = Object.keys(props.data.data)[0];
                setActiveTab(key);
            } else {
                localStorage.setItem('activeTab', activeTab);
            }
        }
    }, [activeTab, setActiveTab, props]);

    const toggleModal = (itemId: string) => {
        setToDelete(true);
        setModalState({
            ...modalState,
            isOpen: true,
            color: 'danger',
            icon: 'trash-o',
            itemTitle: activeTab,
            itemId: itemId
        })
    }
    
    if (props.data.isLoading) {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center">
                <Spinner>Loading ...</Spinner>
            </div>
        )
    
    } else if (props.data.errMess) {
        return(
            <div className="container">
                <div className="row">
                    <h4>{props.data.errMess}</h4>
                </div>
            </div>
        );
    } else {
        const keys = Object.keys(props.data.data);
        const values = Object.values(props.data.data);

        const renderTable = (arrObj: any) => {
            let headers = Object.keys(arrObj[0])
                                .filter(key => key !== '_id' && key !== '__v');
            headers.push('actions');

            const tableHeaders = headers.map((header: string, i: number) => {
                return ( <th key={i}>{header}</th> );
            });

            const tableData = arrObj.map((itemObj: any) => {
                const newObj = Object.keys(itemObj)
                                    .filter(key => headers.includes(key))
                                    .reduce((cur, key) => { return Object.assign(cur, { [key]: itemObj[key] })}, {});

                const values = Object.values(newObj);
                const rowData = values.map((value: any, i: number) => ( <td key={i}>{value}</td>));
                rowData.push(
                    <td key={rowData.length}>
                        <Link  to={activeTab + '/edit'}
                                state={{item_id: itemObj._id}} relative='path'>
                            <Button color='primary'>
                                <i className='fa fa-pencil'></i>
                            </Button>
                        </Link>
                        &nbsp;
                        &nbsp;
                        <Button color='danger' onClick={() => toggleModal(itemObj._id)}>
                            <i className='fa fa-trash'></i>
                        </Button>
                    </td>
                )
                
                return ( <tr key={itemObj['_id']}>{rowData}</tr> );
            })

            return (
                <Table dark>
                    <thead>
                        <tr>
                            {tableHeaders}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData}
                    </tbody>
                </Table>
            );
        };

        const renderTabContent = values.map((arrObj: any, i: number) => {
            return (
                <TabPane tabId={keys[i]} key={i}>
                    {renderTable(arrObj)}
                </TabPane>
            );
        });

        const renderNav = keys.map((key: string, i: number) => {
            return (
                <NavLink key={i} onClick={() => setActiveTab(key)}
                        className = { activeTab === key ? 'active' : '' } >
                    {key}
                </NavLink>
            )
        });

        return (
            <Container id='panel'>
                <h2 className='admin-title'>Admin Panel</h2>

                <Nav tabs>
                    {renderNav}
                </Nav>

                <div className="d-flex justify-content-end">
                    <Link to={activeTab + '/new'}>
                        <Button className="my-3" color='success'>
                            + New {activeTab?.slice(0, -1)}
                        </Button>
                    </Link>
                </div>
                
                <TabContent activeTab={activeTab}>
                    {renderTabContent}
                </TabContent>
                <br/>

                <ModalAlert toDelete={toDelete} modalState={modalState} setModalState={setModalState}/>
            </Container>
        )
    }
}

export default Panel;