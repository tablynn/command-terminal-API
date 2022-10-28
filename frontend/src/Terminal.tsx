import './styles/Terminal.css';
import React, { useState, Dispatch, SetStateAction } from 'react';

interface NewCommandProps {
    addCommand: (input: string) => any
    addOutput: (output: string) => any,
}

function REPLCommandBox({addCommand, addOutput}: NewCommandProps): JSX.Element {
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
                    processInput(command, addOutput)
                    setCommand("")
                }}}
            id="submit-button">
            Submit
            </button>
        </div>
    );
}

function AddToHistory( {commandpair} : {commandpair: string[]}){
    const label: string = commandpair[1]
    return (
        <div className="repl-history"
            aria-label={label}>
        <p>Command: {commandpair[0]}</p>
        <p>Output: {commandpair[1]}</p>

        </div>
  );  
}


export default function Terminal() {
    const [commands, setCommands] = useState<string[]>([]);
    const [outputs, setOutputs] = useState<string[]>([]);
    return (
      <div className='repl'>
        <div id="repl-history">
            {commands.map((userCommand, index) => 
            <AddToHistory          
                commandpair={[userCommand, outputs[index]]} 
                key={index} />)}

        </div>
        <hr></hr>

        <REPLCommandBox 
                addCommand={(command: string) => {          
                    const newCommands = commands.slice(); 
                    newCommands.push(command)
                    setCommands(newCommands) }}
                addOutput={(output: string) => {
                    const newOutputs = outputs.slice(); // return copy of array
                    newOutputs.push(output)
                    setOutputs(newOutputs) }}
                    /> 
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

async function processInput(userInput: string, addOutput: (output:string) => any) {
    const input: string[] = userInput.split(" ");
    const commandType: string | undefined = input[0];
    const args: string[] = input.slice(1);

    let result: string = ""
    const command: REPLFunction | undefined = commands.get(commandType)
    if(command !== undefined) {
        console.log(command)
        result = await command(args)
    } else {
        console.log("Errorrrrrrr")
        result = "Error - unknown command."
    }

    addOutput(result)
}