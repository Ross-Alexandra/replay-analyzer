import { useEffect } from 'react';
import styled from '@emotion/styled';
import {
    Navigate,
    Route,
    Routes,
    useNavigate
} from 'react-router-dom';
import { Home, NoUtility } from './pages';

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    padding: 10px;
`;

export function App() {
    const navigate = useNavigate();
    const utilityLocation = window.localStorage.getItem('r6-dissect-location');

    useEffect(() => {
        if (!utilityLocation) {
            navigate('/no-utility');
        }
    }, [utilityLocation]);

    return (
        <Wrapper>
            <Routes>
                <Route path='/' element={
                    <Home />
                } />

                <Route path='/no-utility' element={
                    <NoUtility />
                } />

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        </Wrapper>
    );
}
