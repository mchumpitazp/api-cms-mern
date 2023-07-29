import './App.scss';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AppAdmin from './adminComponents/AppAdmin';

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Navigate to="/" replace />} />
                    <Route path="/" element={<div>Your App goes here!</div>} />
                    <Route path="/admin/*" element={<AppAdmin />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

export default App;