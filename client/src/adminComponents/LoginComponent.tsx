import React from "react";
import { Form, FormGroup, Input, Label, Button, Alert } from "reactstrap";
import { baseUrl } from "../shared/baseUrl";
import { useNavigate } from "react-router-dom";

function Login () {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const showAlert = (message: string) => {
        setAlertMessage(message);
        setAlertOpen(true);
    }

    React.useEffect(() => {
        if (alertOpen) {
            setTimeout(() => setAlertOpen(false), 3000);
        }
    }, [alertOpen]);

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
        } catch {
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
        </div>
    );
};

export default Login;