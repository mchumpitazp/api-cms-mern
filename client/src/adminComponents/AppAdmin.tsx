import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import jwt_decode, { JwtPayload } from "jwt-decode";

// Components
import Panel from "./PanelComponent";
import Login from "./LoginComponent";
//import Register from "./RegisterComponent";
import EditItem from './ItemEditComponent';
import NewItem from './ItemNewComponent';

function AppAdmin () {
    const navigate = useNavigate();
    const [tokenExpired, setTokenExpired] = React.useState(false)
    
    const tokenWorking = React.useCallback((token: string) => {
        const user = jwt_decode<JwtPayload>(token);
        if (!user || !user.exp) return false;
        const exp = user.exp * 1000;
        const now = new Date().getTime();
        if (exp > now) {
            return true;
        } else {
            localStorage.removeItem('token');
            setTokenExpired(true);
            return false;
        }
    }, []);

    React.useEffect(() => {
        const sessionInterval = setInterval(() => {
            const token = localStorage.getItem('token');
            if (token) {
                if (tokenWorking(token)) return;
                navigate('login');
            }
        }, 1000 * 30);
        return () => clearInterval(sessionInterval);
    }, [tokenWorking, navigate])

    return (
        <div className="admin">
            <Routes>
                <Route path="*" element={<Navigate to="/admin" replace />} />
                <Route path="/" element={<Panel tokenWorking={tokenWorking} />} />
                <Route path="/login" element={<Login tokenExpired={tokenExpired} setTokenExpired={setTokenExpired} />} />
                {/* <Route path="/register" element={<Register />} /> */}
                <Route path="/:item_title/edit" element={<EditItem tokenWorking={tokenWorking} />} />
                <Route path="/:item_title/new" element={<NewItem tokenWorking={tokenWorking} />} />
            </Routes>
        </div>
    )
}

export default AppAdmin;