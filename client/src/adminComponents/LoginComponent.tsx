import React from "react";
import { Form, FormGroup, Input, Label, Button, Alert } from "reactstrap";
import { baseUrl } from "../shared/baseUrl";
import { useNavigate } from "react-router-dom";
import ModalAlert from "./ModalAlertComponent";

interface LoginProps {
    tokenExpired: boolean,
    setTokenExpired: (expired: boolean) => void
}

function Login (props: LoginProps) {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const showAlert = (message: string) => {
        setAlertMessage(message);
        setAlertOpen(true);
    }
    const [modalState, setModalState] = React.useState({
        isOpen: false,
        color: 'secondary',
        icon: 'clock-o',
        phrase: 'Session expired, please login again.'
    })

    React.useEffect(() => {
        if (alertOpen) {
            setTimeout(() => setAlertOpen(false), 3000);
        }
    }, [alertOpen]);
    
    React.useEffect(() => {
        if (props.tokenExpired) {
            props.setTokenExpired(false);
            setModalState(state => { return {
                ...state,
                isOpen: true
            }})
        }
    }, [props]);

    const loginUser = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(baseUrl + '/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
    
            const data = await res.json();
            if (data.user) {
                localStorage.setItem('activeTab', '');
                localStorage.setItem('token', data.user);
                navigate('/admin');
            } else {
                showAlert('Incorrect email or password');
            }
        } catch (error) {
            // console.log(error);
            showAlert('Opsss! There is a problem');
        }
        
    }

    return (
        <div className="d-flex vh-100">
            <div className="form-user">
                <h4 className="text-center mb-4"><strong>Login</strong></h4>
                <Form onSubmit={loginUser}>
                    <FormGroup>
                        <Label for="login-email">Email</Label>
                        <Input id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                                required >
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="login-password">Password</Label>
                        <Input id="login-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required >
                        </Input>
                    </FormGroup>
                    <Button type="submit" className="w-100 mt-4" color="dark"><strong>LOGIN</strong></Button>
                </Form>
                
                <Alert isOpen={alertOpen} color="danger" className="mt-3 mb-0 p-1 text-center" fade >
                    {alertMessage}
                </Alert>
            </div>

            <ModalAlert modalState={modalState} setModalState={setModalState}
                        toDelete={false}
                        toAdmin={false}/>
        </div>
    );
};

export default Login;