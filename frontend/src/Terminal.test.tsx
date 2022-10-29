import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { within } from '@testing-library/dom'
import '@testing-library/jest-dom';

import REPL, { registerCommand, commands, processCommand, REPLFunction, replAria, historyAria } from './REPL';

// Setup to make sure the page gets rendered and commands are registered 
beforeEach(() => {
    render(<REPL />);
    registerCommand("get", get);
    registerCommand("stats", stats);
    registerCommand("weather", weather);
  });