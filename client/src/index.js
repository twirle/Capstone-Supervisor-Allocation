import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import { StudentContextProvider } from './context/StudentContext';
import { AuthContextProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <StudentContextProvider>
        <App />
      </StudentContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
