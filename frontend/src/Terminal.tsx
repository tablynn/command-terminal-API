import './styles/Terminal.css';
import React, { useState } from 'react';
import { JsxEmit } from 'typescript';
export {replAria, historyAria, inputDivAria, inputAria, buttonAria, commands, processInput, Terminal};

/** The aria label for the overarching REPL component */
const replAria: string = "command rep ul";
/** The aria label for the command history section of the REPL */
const historyAria: string = "history of commands processed";
/** The aria label for the outer ovearching component containing input elements. */
const inputDivAria: string = "input components of rep ul";
/** The aria label for the text input component for entering commands. */
const inputAria: string = "enter command here";
/** The aria label for the button for submitting commands. */
const buttonAria: string = "press to input command";

/**
 * This interface sets up the functions to add the inputted commands and its outputs for the
 * REPL command box.
 */
interface NewCommandProps {
    addCommand: (input: string) => any
    addOutput: (output: string | JSX.Element) => any,
}

/**
 * This method prepares a region of the page to hold the command input box, telling the user
 * where to enter the command. It also handles the button click, processing the inputted
 * text through addCommand and addOutput functions.
 * @param param0 the functions to add commands and add outputs to a map
 * @returns the command input box and the submit button
 */
function REPLCommandBox({addCommand, addOutput}: NewCommandProps): JSX.Element {
    const [command, setCommand] = useState<string>("");
    return(
        <div className="repl-input"
             aria-label={inputDivAria}>
            <input type="text" 
                   value={command}
                   onChange={(e) => setCommand(e.target.value)}
                   placeholder="Enter command here!" 
                   id="repl-command-box"
                   aria-label={inputAria}>
            </input>
            <button onClick={() => { 
                if (command != null) {
                    addCommand(command)
                    processInput(command, addOutput)
                    setCommand("")
                }}}
            id="submit-button"
            aria-label={buttonAria}>
            Submit
            </button>
        </div>
    );
}

/**
 * This method takes in the input and output and adds it to the web page.
 * @param param0 the command pair
 * @returns the inputted command and the processed output
 */
function AddToHistory( {commandpair} : {commandpair: (string | JSX.Element)[]}){
    if (typeof commandpair[1] === "string") {
        return (
            <div className="repl-history">
                <p>Command: {commandpair[0]}</p>
                <p>Output: {commandpair[1]}</p>
            </div>
        );  
    }
    return (
        <div className="repl-history">
            <p>Command: {commandpair[0]}</p>
            <p>Output: </p>
            {commandpair[1]}
        </div>
    ); 
}

/**
 * This function sets up the majority of our web page, preparing the region to hold 
 * the repl-history. It calls AddToHistory on the user command and its processed output. It 
 * creates the REPLCommandBox, adding the commands and outputs to new maps. 
 * @returns the repl-history and repl command box
 */
export default function Terminal() {
    const [commands, setCommands] = useState<string[]>([]);
    const [outputs, setOutputs] = useState<(string | JSX.Element)[]>([]);
    return (
      <div className='repl'
           aria-label={replAria}>
        <div id="repl-history"
             aria-label={historyAria}>
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
                addOutput={(output: string | JSX.Element) => {
                    const newOutputs = outputs.slice(); // return copy of array
                    newOutputs.push(output)
                    setOutputs(newOutputs) }}/> 
        </div>
    );
}


const commands: Map<string, REPLFunction> = new Map<string, REPLFunction>();

/**
 * This interface connects the user's command to a promise. 
 */
export interface REPLFunction {    
    (args: Array<string>): Promise<string | JSX.Element>;
}

/**
 * This function 
 * @param endpoint 
 * @param commandFunc 
 */
export function registerCommand(endpoint: string, commandFunc : REPLFunction) {
    commands.set(endpoint, commandFunc);
}

/**
 * This method processes the user input from the command box, splitting on the space and
 * adding the result as an output.
 * @param userInput the inputted command in the REPL box
 * @param addOutput the function that will add the output to a map
 */
async function processInput(userInput: string, addOutput: (output:string | JSX.Element) => any) {
    const input: string[] = userInput.split(" ");
    const commandType: string | undefined = input[0];
    const args: string[] = input.slice(1);

    let result: string | JSX.Element
    const command: REPLFunction | undefined = commands.get(commandType)
    if(command !== undefined) { 
        result = await command(args)
    } else {
        result = "Error - unknown command."
    }

    addOutput(result)
}