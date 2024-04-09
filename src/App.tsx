import { useEffect } from 'react';
import styled from '@emotion/styled';
import {
    Navigate,
    NavigateFunction,
    Route,
    Routes,
    useNavigate
} from 'react-router-dom';
import { Home, NoUtility } from './pages';
import { Error } from './pages/error';

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    padding: 10px;
`;

async function setupDissect(navigate: NavigateFunction) {
    const {status} = await window.api.downloadLatestSupportedDissect();
    if (status !== 'success') {
        navigate('/error');
        return;
    }

    navigate('/');
}

export function App() {
    const navigate = useNavigate();
    
    useEffect(() => {
        navigate('/no-utility');
        setupDissect(navigate);
    }, []);

    return (
        <Wrapper>
            <Routes>
                <Route path='/' element={
                    <Home />
                } />

                <Route path='/no-utility' element={
                    <NoUtility />
                } />

                <Route path='/error' element={
                    <Error />
                } />

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        </Wrapper>
    );
}
