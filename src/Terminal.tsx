import './styles/Terminal.css';
import React, { useState, Dispatch, SetStateAction } from 'react';

interface NewCommandProps {
    addCommand: (input: string) => any,
    setNotification: Dispatch<SetStateAction<string>>
}

function REPLCommandBox({addCommand, setNotification}: NewCommandProps): JSX.Element {
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
                    addCommand(command)
                    setCommand("")
                    setNotification("")
                    setCommand("")
                }}}
            id="submit-button">
            Submit
            </button>
        </div>
    );
}

function AddToHistory({userCommand}: {userCommand: string}) {
    const result: string = processInput(userCommand)
    return (
        <div>
            <p>Command: {userCommand}</p>
            <p>Output: {result}</p>
        </div>
    );
}

export default function Terminal() {
    const [commands, setCommands] = useState<string[]>([]);
    const [notification, setNotification] = useState('');
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
                setNotification={setNotification}
                addCommand={(command: string) => {          
                    const newCommands = commands.slice(); 
                    newCommands.push(command)
                    setCommands(newCommands) }} /> 
            {notification} 
        </div>
    );
}

const BACKEND_URL = "http://localhost:3232"
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
    if(command != null) {
        return command(args)
    } else {
        return "Error - unknown command"
    }
}