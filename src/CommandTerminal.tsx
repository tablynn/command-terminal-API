import './styles/CommandTerminal.css';
import React, { useState, Dispatch, SetStateAction } from 'react';

function REPLCommandBox({command}: {command: string[]}) {
    return(
        <div className="repl-input">
            <input type="text" 
                   placeholder="Enter command here!" 
                   id="repl-command-box">
            </input>
            <button    
                onClick={submitFunc} 
                id="submit-button">Submit
            </button>
        </div>
    );
}

function AddToHistory({inputOutput}: {inputOutput: string[]}) {
    return (
        <div>
            <p>Command: {inputOutput[0]}</p>
            <p>Output: {inputOutput[1]}</p>
        </div>
    );
}

function processInput(userInput: string) {
    const input: string[] = userInput.split(" ");
    const commandType: REPLFunction | undefined = input[0];
    const args: string[] = input.slice(1);
    if (commandType == null) {
        logOutput("Error - not a registered command");
    }
    else {
        asdf(args).then(output => logOutput(output))
    }
}

export default function CommandTerminal() {
    const [history, setHistory] = useState<string[][]>([]);
    return (
      <div className='repl'>
        <div id="repl-history">
            { history.map((inputOutput, outputNumber) => 
            <AddToHistory           
                inputOutput={inputOutput} 
                key={outputNumber} />)}
        </div>
        <hr></hr>
            <REPLCommandBox>
                
            </REPLCommandBox>
        </div>
    );
  }