import mockCSVs from '../mocks/mockedJson.js';
/** The window.onload callback is invoked when the window is first loaded by the browser. */
window.onload = function () {
    prepareInput();
    prepareClick();
    // If you're adding an event for a button click, do something similar.
    // The event name in that case is "click", not "keypress", and the type of the element 
    // should be HTMLButtonElement. The handler function for a "click" takes no arguments.
};
// Set up of input from HTML elements
/**
 * Finds and returns the command line input HTML element on the page,
 * or undefined if it cannot be found.
 * @returns The command line HTML input element, or undefined if not found
 */
function getInput() {
    var maybeInput = document.getElementById('repl-command-box');
    if (maybeInput == null) {
        console.log("Couldn't find input element");
    }
    else if (!(maybeInput instanceof HTMLInputElement)) {
        console.log("Found element ${maybeInput}, but it wasn't an input");
    }
    else {
        return maybeInput;
    }
}
/** Sets up processing command line input in the webpage. */
function prepareInput() {
    var inputElem = getInput();
    inputElem === null || inputElem === void 0 ? void 0 : inputElem.addEventListener("keypress", handleKeyPress);
}
/** Sets up processing submit button clicks in the webpage. */
function prepareClick() {
    var maybeButton = document.getElementById('submit-button');
    if (maybeButton == null) {
        console.log("Couldn't find submit button");
    }
    else if (!(maybeButton instanceof HTMLButtonElement)) {
        console.log("Found element ${maybeButton}, but it is not the proper type");
    }
    else {
        maybeButton.addEventListener("click", handleClick);
    }
}
// Event handling for input HTML elements
/**
 * Handles key press input within HTML input element.
 * @param event Event object encapsulating key press input
 */
function handleKeyPress(event) {
    var inputElem = getInput();
    if (inputElem != null && event.key === "Enter") {
        processInput(inputElem.value);
        inputElem.value = "";
    }
}
/**
 * Handles mouse click input done upon submit button element.
 * @param event Event object encapsulating mouse click input
 */
function handleClick(event) {
    var inputElem = getInput();
    if (inputElem != null) {
        processInput(inputElem.value);
        inputElem.value = "";
    }
}
var commands = [];
var outputs = [];
// Background handling of input from HTML elements
/**
 * Contains the last loaded CSV file, or undefined if no CSV
 * file has yet been loaded.
 */
var loadedCSV;
/**
 * Takes in and processes appropriately the given command line input.
 * @param userCommand the command line input
 */
function processInput(userCommand) {
    commands.push(userCommand);
    logToRepl("Command: " + userCommand);
    var commandSplit = userCommand.split(" ");
    if (commandSplit.length < 1 && commandSplit.length > 2) {
        outputs.push("ERROR - Unknown command.");
    }
    else if (commandSplit.length == 2) {
        if (commandSplit[0] === "get") {
            var fileName = commandSplit[1];
            var contents = mockCSVs.get(fileName);
            if (contents != null) {
                loadedCSV = contents;
                outputs.push(csvAsString(contents));
            }
            else {
                outputs.push("ERROR - File unable to be found or opened.");
            }
        }
        else {
            outputs.push("ERROR - Unknown command.");
        }
    }
    else { //commandSplit.length == 1
        if (commandSplit[0] === "stats") {
            if (loadedCSV != null) {
                var stats = getStats(loadedCSV);
                outputs.push("Rows: " + stats[0] + ", Columns: " + stats[1]);
            }
            else {
                outputs.push("ERROR - No CSV file loaded.");
            }
        }
        else {
            outputs.push("ERROR - Unknown command.");
        }
    }
    logToRepl("Output: " + outputs[outputs.length - 1]);
}
/**
 * Logs the given output string as new paragraph element to the display
 * HTML element.
 * @param output
 */
function logToRepl(output) {
    var displayDiv = document.getElementById("repl-history");
    var newParagraph = document.createElement("p");
    newParagraph.textContent = output;
    displayDiv === null || displayDiv === void 0 ? void 0 : displayDiv.appendChild(newParagraph);
}
/**
 * For a given CSV file in represented JSON format, creates and
 * returns a formated printable multiline string of its contents
 * @param csv CSV file in JSON format
 * @return String representation of CSV file
 */
function csvAsString(csv) {
    var csvString = "[";
    for (var i = 0; i < csv.length - 1; i++) {
        csvString += "\n\t" + JSON.stringify(csv[i]) + ",";
    }
    if (csv.length > 0)
        csvString += "\n\t" + JSON.stringify(csv[csv.length - 1]) + "\n";
    csvString += "]";
    return csvString;
}
/**
 * For a given CSV file represented in JSON format, returns
 * the number of rows and columns, in said order, in the CSV.
 * @param csv A CSV file represented in JSON format
 * @returns The row and column count of the CSV file
 */
function getStats(csv) {
    if (csv.length == 0) {
        return [0, 0];
    }
    else {
        return [csv.length, csv[0].length];
    }
}
// Get methods of internal metadata for testing
/**
 * Returns a log of all user commands inputted.
 * @returns An array of all user commands
 */
function getCommands() {
    return commands;
}
/**
 * Returns a log of all outputs to user commands.
 * @returns An array of all outputs
 */
function getOutputs() {
    return outputs;
}
/**
 * Clears the global variables to be used for testing.
 */
function clearHistory() {
    commands = [];
    outputs = [];
    loadedCSV = undefined;
}
/**
 * Sets the HTML command line input element's value to the given string.
 * @param input The string to be inputted
 */
function setInput(input) {
    var inputElem = getInput();
    if (inputElem != null) {
        inputElem.value = input;
    }
}
// Provide this to other modules (e.g., for testing!)
// The configuration in this project will require /something/ to be exported.
export { handleKeyPress, prepareInput, handleClick, prepareClick, processInput, getStats, setInput, getCommands, getOutputs, clearHistory };