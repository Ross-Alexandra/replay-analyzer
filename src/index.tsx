import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { HashRouter } from 'react-router-dom';
import { ModalPortal } from '@ross-alexandra/react-utilities';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
        <ModalPortal />
    </React.StrictMode>
);
