import './styles/Terminal.css';
import React, { useState, Dispatch, SetStateAction } from 'react';

interface NewCommandProps {
    addCommand: (input: string) => any
}

function REPLCommandBox({addCommand}: NewCommandProps): JSX.Element {
    const [command, setCommand] = useState<string>("");
    return(
        <div className="repl-input">
            <input type="text" 
                   value={command}
                   onChange={(e) => setCommand(e.target.value)}
                   placeholder="Enter command here!" 
                   id="repl-command-box">
            </input>
            <button onClick={() => { 
                if (command != null) {
                    processInput(command)
                    addCommand(command)
                    setCommand("")
                }}}
            id="submit-button">
            Submit
            </button>
        </div>
    );
}

function AddToHistory({userCommand}: {userCommand: string}) {
    processInput(userCommand)?.then((output) => {
        return (
            <div>
                <p>Command: {userCommand}</p>
                <p>Output: {output}</p>
            </div>
        );
    })

    // const output : string | undefined = await processInput(userCommand)
    // return (
    //     <div>
    //         <p>Command: {userCommand}</p>
    //         <p>Output: {output}</p>
    //     </div>
    // );
}

export default function Terminal() {
    const [commands, setCommands] = useState<string[]>([]);
    return (
      <div className='repl'>
        <div id="repl-history">
            {commands.map((userCommand, index) => 
            <AddToHistory           
                userCommand={userCommand} 
                key={index} />)}
        </div>
        <hr></hr>
            <REPLCommandBox 
                addCommand={(command: string) => {          
                    const newCommands = commands.slice(); 
                    newCommands.push(command)
                    setCommands(newCommands) }} /> 
        </div>
    );
}

const commands: Map<string, REPLFunction> = new Map<string, REPLFunction>();
export interface REPLFunction {    
    (args: Array<string>): Promise<string>;
}
export function registerCommand(endpoint: string, commandFunc : REPLFunction) {
    commands.set(endpoint, commandFunc);
}

function processInput(userInput: string) {
    const input: string[] = userInput.split(" ");
    const commandType: string | undefined = input[0];
    const args: string[] = input.slice(1);
    const command: REPLFunction | undefined = commands.get(commandType)
    if(command !== undefined) {
        return command(args)
    } 
}