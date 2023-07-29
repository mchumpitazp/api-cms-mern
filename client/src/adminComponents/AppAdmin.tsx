import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from '../redux/hooks';

// Components
import Panel from "./PanelComponent";
import Login from "./LoginComponent";
import Register from "./RegisterComponent";
import EditItem from './ItemEditComponent';
import NewItem from './ItemNewComponent';

function AppAdmin () {
    const data = useAppSelector((state: { data: any; }) => state.data);

    return (
        <div className="admin">
            <Routes>
                <Route path="*" element={<Navigate to="/admin" replace />} />
                <Route path="/" element={<Panel data={data} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/:item_title/edit" element={<EditItem data={data} />} />
                <Route path="/:item_title/new" element={<NewItem data={data} />} />
            </Routes>
        </div>
    )
}

export default AppAdmin;