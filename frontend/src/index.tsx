import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { registerCommand } from './Terminal';
import { get, stats, weather } from './Commands';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

registerCommand("get", get);
registerCommand("stats", stats);
registerCommand("weather", weather);