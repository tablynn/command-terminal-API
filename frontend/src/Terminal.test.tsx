import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { within } from '@testing-library/dom'
import '@testing-library/jest-dom';

import { registerCommand, replAria, historyAria, buttonAria, inputAria, REPLFunction, commands, processInput } from './Terminal';
import App from './App';
import { get, stats, weather } from './Commands'

registerCommand("get", get);
registerCommand("stats", stats);
registerCommand("weather", weather);

// Setup to make sure the page gets rendered
beforeEach(() => {
    render(<App />);
});

test('renders repl overarching div', () => {
    const replDiv = screen.getByRole(/.*/, {name: replAria});
    expect(replDiv).toBeInTheDocument();
});

test('renders repl command history', () => {
    const replHistory = screen.getByRole(/.*/, {name: historyAria});
    expect(replHistory).toBeInTheDocument();
});

test('renders button', () => {
    const buttonElement = screen.getByRole('button', {name: buttonAria});
    expect(buttonElement).toBeInTheDocument();
});
  
test('renders repl command box', () => {
    const textboxElement = screen.getByRole('textbox', {name: inputAria});
    expect(textboxElement).toBeInTheDocument();
});

test('registering a new command', async () => {
    const hello: REPLFunction = (args: string[]): Promise<string> => {
        if(args.length !== 0) {
            return Promise.resolve("Error - requires 0 arguments.");
        }
        return Promise.resolve("hello");
    }
    registerCommand("hello", hello);

    const getCommand = commands.get("get");
    expect(getCommand).not.toBeNull();
    const helloCommand = commands.get("hello");
    expect(helloCommand).not.toBeNull();

    if(helloCommand !== undefined) {
        helloCommand([]).then(value => expect(value).toBe("hello"))
        helloCommand(["-4", "5"]).then(value => expect(value).toBe("Error - requires 0 arguments."));
    }

    let logged: string = "";
    const addOutput = (output: string) => {logged = output};
  
    processInput("", addOutput);
    expect(logged).toBe("Error - unknown command.");
    processInput("load data/misc/empty_row.csv", addOutput);
    expect(logged).toBe("Error - unknown command.");
    await processInput("hello", addOutput);
    expect(logged).toBe("hello");
});

test('submit with empty input', async () => {
    const submitButton = screen.getByRole('button', {name: buttonAria});
    userEvent.click(submitButton);
  
    const commandText = await screen.findByText(new RegExp("Command:"));
    const outputElem = await screen.findByText(new RegExp("Error - unknown command."));
  
    expect(commandText).toBeInTheDocument();   
    expect(outputElem).toBeInTheDocument();   
});

test('running an invalid command', async () => {
    const textbox = screen.getByRole('textbox', {name: inputAria});
    const submitButton = screen.getByRole('button', {name: buttonAria});
  
    userEvent.type(textbox, "meow purr");
    userEvent.click(submitButton);
  
    const commandText = await screen.findByText(new RegExp("meow purr"));
    const outputElem = await screen.findByText(new RegExp("Error - unknown command."));
  
    expect(commandText).toBeInTheDocument();   
    expect(outputElem).toBeInTheDocument();   
});

test("calling stats with more arguments", async () => {
    const textbox = screen.getByRole('textbox', {name: inputAria});
    const submitButton = screen.getByRole('button', {name: buttonAria});

    userEvent.type(textbox, "stats asdf");
    userEvent.click(submitButton);
  
    const statsCommand = await screen.findByText(new RegExp("stats asdf"));
    const statsOutputElem = await screen.findByText(new RegExp("Error - requires 0 arguments."));
    expect(statsCommand).toBeInTheDocument();   
    expect(statsOutputElem).toBeInTheDocument();   
});

test("calling stats without a CSV", async () => {
    const textbox = screen.getByRole('textbox', {name: inputAria});
    const submitButton = screen.getByRole('button', {name: buttonAria});

    userEvent.type(textbox, "stats");
    userEvent.click(submitButton);
  
    const statsCommand = await screen.findByText(new RegExp("stats"));
    const statsOutputElem = await screen.findByText(new RegExp("Error - no file is loaded."));
    expect(statsCommand).toBeInTheDocument();   
    expect(statsOutputElem).toBeInTheDocument();   
});

test("calling stats with a CSV", async () => {
    const textbox = screen.getByRole('textbox', {name: inputAria});
    const submitButton = screen.getByRole('button', {name: buttonAria});
  
    userEvent.type(textbox, "get data/stars/four-stars.csv");
    userEvent.click(submitButton);  
    userEvent.type(textbox, "stats");
    userEvent.click(submitButton);
  
    const statsCommand = await screen.findByText(new RegExp("stats"));
    const statsOutputElem = await screen.findByText(new RegExp("Rows: 4, Columns: 5"));
    expect(statsCommand).toBeInTheDocument();   
    expect(statsOutputElem).toBeInTheDocument();   
});

test('get with more arguments than required', async () => {
    const textbox = screen.getByRole('textbox', {name: inputAria});
    const submitButton = screen.getByRole('button', {name: buttonAria});
  
    userEvent.type(textbox, "get purrr meow");
    userEvent.click(submitButton);
  
    const commandText = await screen.findByText(new RegExp("get purrr meow"));
    const outputElem = await screen.findByText(new RegExp("Error - requires one argument, a filepath."));
  
    expect(commandText).toBeInTheDocument();   
    expect(outputElem).toBeInTheDocument();   
});

test('get with no arguments', async () => {
    const textbox = screen.getByRole('textbox', {name: inputAria});
    const submitButton = screen.getByRole('button', {name: buttonAria});
  
    userEvent.type(textbox, "get");
    userEvent.click(submitButton);
  
    const commandText = await screen.findByText(new RegExp("get"));
    const outputElem = await screen.findByText(new RegExp("Error - requires one argument, a filepath."));
  
    expect(commandText).toBeInTheDocument();   
    expect(outputElem).toBeInTheDocument();   
});

test('get with invalid file path', async () => {
    const textbox = screen.getByRole('textbox', {name: inputAria});
    const submitButton = screen.getByRole('button', {name: buttonAria});
  
    userEvent.type(textbox, "get data/stars/random.csv");
    userEvent.click(submitButton);
  
    const commandText = await screen.findByText(new RegExp("get data/stars/random.csv"));
    const outputElem = await screen.findByText(new RegExp("Error - file could not be read or parsed."));
  
    expect(commandText).toBeInTheDocument();   
    expect(outputElem).toBeInTheDocument();   
});

test('get with file not in the data folder', async () => {
    const textbox = screen.getByRole('textbox', {name: inputAria});
    const submitButton = screen.getByRole('button', {name: buttonAria});
  
    userEvent.type(textbox, "get random/stars/random.csv");
    userEvent.click(submitButton);
  
    const commandText = await screen.findByText(new RegExp("get random/stars/random.csv"));
    const outputElem = await screen.findByText(new RegExp("Error - file could not be read or parsed."));
  
    expect(commandText).toBeInTheDocument();   
    expect(outputElem).toBeInTheDocument();   
});

test('calling weather with wrong number arguments', async () => {
    const textbox = screen.getByRole('textbox', {name: inputAria});
    const submitButton = screen.getByRole('button', {name: buttonAria});

    userEvent.type(textbox, "weather 234.12342 98 234");
    userEvent.click(submitButton);

    const commandText = await screen.findByText(new RegExp("weather 234.12342 98 234"));
    const outputElem = await screen.findByText(new RegExp("Error - requires 2 arguments, latitude and longitude."));

    expect(commandText).toBeInTheDocument();   
    expect(outputElem).toBeInTheDocument(); 
});

test('calling weather with invalid longitude/latitude', async () => {
    const textbox = screen.getByRole('textbox', {name: inputAria});
    const submitButton = screen.getByRole('button', {name: buttonAria});

    userEvent.type(textbox, "weather 38 77");
    userEvent.click(submitButton);

    const commandText = await screen.findByText(new RegExp("weather 38 77"));
    const outputElem = await screen.findByText(new RegExp("Error - weather not able to be retrieved."));

    expect(commandText).toBeInTheDocument();   
    expect(outputElem).toBeInTheDocument(); 
  });

test('calling weather with proper arguments', async () => {
    const textbox = screen.getByRole('textbox', {name: inputAria});
    const submitButton = screen.getByRole('button', {name: buttonAria});

    userEvent.type(textbox, "weather 38 -77");
    userEvent.click(submitButton);

    const commandText = await screen.findByText(new RegExp("weather 38 -77"));
    const outputElem = await screen.findByText(new RegExp("Temperature"));

    expect(commandText).toBeInTheDocument();   
    expect(outputElem).toBeInTheDocument(); 
});