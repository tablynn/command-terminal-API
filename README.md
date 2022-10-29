Sprint 3: Command Terminal Webapp
=============
### Authors: Calvin Eng (ceng4), Tabitha Lynn (tlynn1)
###### Estimated time contribution: 18 hrs
Link to Github Repository-
https://github.com/cs0320-f2022/sprint-3-ceng4-tlynn1
## Project Details
Created a command terminal webapp, which makes requests to an API designed in a previous project. The REPL-based terminal allows for commands, such as "stats," "get," and "weather." The project was designed using TypeScript, CSS, HTML, React, and Java.
References and Collaborators-
https://github.com/cs0320-f2022/sprint-3-aarrazol-nharbiso
- copied overall structure of fetching from the backend and registering commands with some minor changes
- used Aria Labels from their REPL class
- copied structure of tests
- copied how to make ouput format into a table
https://github.com/cs0320-f2022/class-livecode/tree/main/F22/reactNYT
- copied overall structure of Puzzle.tsx in order to display HTML and make changes to HTML
https://github.com/cs0320-f2022/sprint-3-aadams39-agupt137
- used alongside ReactNYT to create initial function, which displays terminal and input box
https://github.com/cs0320-f2022/sprint-3-ahudda1-ssompal1
- copied idea of using an outputs array to store results of commands in order to get rid of promise
## Design Choices
Most of our code is handled in the Terminal.tsx class, which sets up the frontend of our web page. In the Terminal class, we create the REPL command box and the area for the REPL history. The class handles the inputted command (and resulting output) and adds it to the history of the page. The class also creates the interface for the REPLFunctions implemented in the Commands class a function that registers all the valid commands.
We chose to create a separate command class for our "get", "stats", and "weather" commands. Each of these functions implements the REPLFunction interface. Each function makes a call to the API and retrieves the result if it was a valid command. For example, for the weather call, the function fetches "http://localhost:3232/loadcsv?filepath=" + the user inputted filepath. It then returns the result as a resolved promise.
 
The creation of our separate command function also satisfies User Story 4. If a web developer wanted to register new commands, they would call the registerCommand function and create the new function in the Commands class. The developer would also need to create a new handler in the backend (i.e. StatsHandler.Java).
## Errors
No unresolved bugs have been encountered.
## Tests
We test our program through one testing class: Terminal.test.tsx. In the class, we begin by setting up the tests with a beforeEach() call which renders the app and registers "get", "stats", and "weather" as a command.
 
Rendering tests
- Tests if repl div exists
- Tests if repl history exists
- Tests if button exists
 
Basic tests
- Tests input box clears when button is submitted
- Tests clicking the submit button with an empty input
- Tests registering a new command
- Tests running an invalid command
 
Get and stats tests
- Tests calling stats without a CSV
- Tests calling stats with a valid CSV file
- Tests calling get with more arguments than required
- Tests calling get with no arguments
- Tests calling get with invalid file path
- Tests calling get with a file not in the data folder
 
Weather tests
- Tests calling weather with wrong number of arguments
- Tests calling weather with invalid longitude/latitude
- Tests calling weather with valid arguments

Unit tests
- Tests calling get on a valid filepath
- Tests stats on a valid filepath
- Tests weather on valid longitude and longitude 
 
 
 
## Running the Program
In order to run the program, first open the backend folder within IntelliJ. Navigating to the server class, run the main function of the server. Then proceeding to the frontend folder, run npm start in order to view the terminal. To enter a command, enter the command prefix followed by the arguments to the command. After submitting the request by clicking the submit button, the command and output should be displayed on the terminal.
The REPL currently supports three commands: `get [filepath]`, `stats`, and `weather [latitude] [longitude]`. The get command loads and retrieves CSV files from the backend server. All files get is used on must be in the data folder of the project. The stats command returns the number of rows and columns in the CSV file that was last loaded. The weather command retrieves the temperature in Fahrenheit at the location of the provided longitutde and latitude from the National Weather Service's API.
Once done with the terminal, make sure to stop running the server and quitting npm with the stop button and Control-C, respectively.
 
