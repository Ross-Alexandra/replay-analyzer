import { Link } from 'react-router-dom';

export const Error: React.FC = () => {
    return (
        <>
            <p>Error trying to process files. Is your r6-dissect up-to-date?</p>
            <Link to='/no-utility'>Re-select r6-dissect</Link>
        </>
    );
};