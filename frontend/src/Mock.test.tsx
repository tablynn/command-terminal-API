import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { registerCommand, replAria, historyAria, buttonAria, inputAria, REPLFunction, commands, processInput, Terminal } from './Terminal';
import App from './App';
import { get, stats, weather, mockGet, mockStats, mockWeather } from './Commands'
import {tableAria} from './CSVTable';


// Mock testing

// Setup to make sure the page gets rendered
beforeEach(() => {
    render(<App />);
});

// registers mock versions of each command
registerCommand("mockGet", mockGet)
registerCommand("mockStats", mockStats)
registerCommand('mockWeather', mockWeather)

/**
 * This test allows for testing of get and stats through mocking, instead of running the backend server. It
 * returns the expected data for the one-star.csv.
 */
test('mock get/stats testing', () => {
    const mockCommand = commands.get("mockGet");
    expect(mockCommand).not.toBeNull();

    mockGet(["data/stars/one-star.csv"]).then(result => expect(result).toBe("[0,Sol,0,0,0]"));
    mockStats([]).then(result => expect(result).toBe("Rows: 1, Columns: 5"));
});

/**
 * This test allows for testing of weather through mocking, instead of running the backend server. It returns
 * the expected data for the Washington, D.C.
 */
test('mock weather', () => {
    const mockCommand = commands.get("mockWeather");
    expect(mockCommand).not.toBeNull();

    mockWeather(["38", "-77"]).then(result => expect(result).toContain("61"));
})