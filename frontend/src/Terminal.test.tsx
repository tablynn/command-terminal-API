import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { registerCommand, replAria, historyAria, buttonAria, inputAria, REPLFunction, commands, processInput } from './Terminal';
import App from './App';
import { get, stats, weather } from './Commands'
import {tableAria} from './CSVTable';

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

    let logged: string | JSX.Element = ""
    const addOutput = (output: string | JSX.Element) => {logged = output};
  
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
  
    userEvent.type(textbox, "get data/stars/one-star.csv");
    userEvent.click(submitButton);  

    const commandText = await screen.findByText(new RegExp("get data/stars/one-star.csv"));
    const outputElem = await screen.findByRole("table", {name: tableAria});
    expect(commandText).toBeInTheDocument();   
    expect(outputElem).toBeInTheDocument();  

    userEvent.type(textbox, "stats");
    userEvent.click(submitButton);
  
    const statsCommand = await screen.findByText(new RegExp("stats"));
    const statsOutputElem = await screen.findByText(new RegExp("Rows: 1, Columns: 5"));
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

test('get with valid CSV and page is updated', async () => {
    const textbox = screen.getByRole('textbox', {name: inputAria});
    const submitButton = screen.getByRole('button', {name: buttonAria});
  
    userEvent.type(textbox, "get data/stars/one-star.csv");
    userEvent.click(submitButton);
  
    const commandText = await screen.findByText(new RegExp("get data/stars/one-star.csv"));
    const outputElem = await screen.findByRole("table", {name: tableAria});
  
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

test('get on valid filepath', () => {
    const CSV: string[][] = [
        ["StarID", "ProperName", "X", "Y", "Z"],
        ["0", "Sol", "0", "0", "0"]
    ];
    
    const promise: Promise<string | JSX.Element> = get(["data/stars/one-star.csv"]);
    promise.then(result => {
        if(typeof result === "string") {
            fail("get returned unexpected error message: " + result);
        } else {
            render(result);
        }

        for(let i = 0; i < CSV.length; i++) {
            for(let j = 0; j < CSV[0].length; j++) {
                const val: string = CSV[i][j];
                const cellElem = screen.getByRole("cell", 
                    {name: "row " + (i + 1) + ", column " + (j + 1) + " of table, value is " + val});
                expect(cellElem).toBeInTheDocument();
                expect(cellElem.textContent).toBe(val);
            }
        }
    });
});

test('stats on valid filepath', () => {
    get(["data/stars/one-column.csv"]);
    stats([]).then(result => expect(result).toBe("Rows: 5, Columns: 1"));

    get(["data/stars/one-star.csv"]);
    stats([]).then(result => expect(result).toBe("Rows: 1, Columns: 5"));

    get(["data/stars/one-star.csv"]);
    stats([]).then(result => expect(result).toBe("Rows: 1, Columns: 5"));

    get(["data/stars/empty.csv"]);
    stats([]).then(result => expect(result).toBe("Rows: 0, Columns: 0"));

    get(["data/stars/one-star.csv"]);
    stats([]).then(result => expect(result).toBe("Rows: 1, Columns: 5"));
});

test('unknown commands', () => {
    get(["data/stars/one-column.csv"]);
    stats([]).then(result => expect(result).toBe("Rows: 5, Columns: 1"));

    get(["data/stars/one-star.csv"]);
    stats([]).then(result => expect(result).toBe("Rows: 1, Columns: 5"));

    get(["data/stars/one-star.csv"]);
    stats([]).then(result => expect(result).toBe("Rows: 1, Columns: 5"));

    get(["data/stars/empty.csv"]);
    stats([]).then(result => expect(result).toBe("Rows: 0, Columns: 0"));

    get(["data/stars/one-star.csv"]);
    stats([]).then(result => expect(result).toBe("Rows: 1, Columns: 5"));
});



