import { useAsyncResponse } from '@ross-alexandra/react-utilities';

export function App() {
    const [apiState, apiData] = useAsyncResponse(window.api.test);

    return (
        <div>
            <p>Get Hacking!</p>
            <p>{apiState === 'ready' ? 'Testing Api...' : apiData}</p>
        </div>
    );
}
