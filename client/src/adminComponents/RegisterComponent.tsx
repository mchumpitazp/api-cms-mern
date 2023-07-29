import React from "react";
import { Form, FormGroup, Input, Label, Button, Alert } from "reactstrap";
import { baseUrl } from "../shared/baseUrl";
import { useNavigate } from "react-router-dom";

function Register () {
    const navigate = useNavigate();
    const [name, setName] = React.useState('');
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
            setTimeout(() => setAlertOpen(false), 5000);
        }
    }, [alertOpen]);

    const registerUser = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(baseUrl + '/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            console.log(res);
    
            const data = await res.json();
            if (data.status === 'ok') {
                navigate('/admin/login')
            } else {
                showAlert('Sorry, this email is already taken');
            }
        } catch {
            showAlert('Opsss! There is a problem');
        }
        
    }

    return (
        <div className="d-flex vh-100">
            <div className="form-user">
                <h4 className="text-center mb-4"><strong>Register</strong></h4>
                <Form onSubmit={registerUser}>
                    <FormGroup>
                        <Label for="register-name">Name</Label>
                        <Input id="register-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter name" 
                                required >
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="register-email">Email</Label>
                        <Input id="register-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                                required >
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="register-password">Password</Label>
                        <Input id="register-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required >
                        </Input>
                    </FormGroup>
                    <Button type="submit" className="w-100 mt-4" color="dark"><strong>REGISTER</strong></Button>
                </Form>

                <Alert isOpen={alertOpen} color="danger" className="mt-3 mb-0 p-1 text-center" fade >
                    {alertMessage}
                </Alert>
            </div>
        </div>
    );
};

export default Register;