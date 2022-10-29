import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { within } from '@testing-library/dom'
import '@testing-library/jest-dom';

import { registerCommand } from './Terminal';
import App from './App';
import { get, stats, weather } from './Commands'


// Setup to make sure the page gets rendered
beforeEach(() => {
    render(<App />);
    registerCommand("get", get);
    registerCommand("stats", stats);
    registerCommand("weather", weather);
});

