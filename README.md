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

https://github.com/cs0320-f2022/class-livecode/tree/main/F22/reactNYT
- copied overall structure of Puzzle.tsx in order to display HTML and make changes to HTML

https://github.com/cs0320-f2022/sprint-3-aadams39-agupt137
- used alongside ReactNYT to create initial function, which displays terminal and input box

https://github.com/cs0320-f2022/sprint-3-ahudda1-ssompal1
- copied idea of using an outputs array to store results of commands in order to get rid of promise

## Design Choices


## Errors
No unresolved bugs have been encountered.

## Tests
 

## Running the Program
In order to run the program, first open the backend folder within IntelliJ. Navigating to the server class, run the main function of the server. Then proceeding to the frontend folder, run npm start in order to view the terminal. To enter a command, enter the command prefix followed by the arguments to the command. After submitting the request by clicking the submit button, the command and output should be displayed on the terminal. 

The REPL currently supports three commands: `get [filepath]`, `stats`, and `weather [latitude] [longitude]`. The get command loads and retrieves CSV files from the backend server. All files get is used on must be in the data folder of the project. The stats command returns the number of rows and columns in the CSV file that was last loaded. The weather command retrieves the temperature in Fahrenheit at the location of the provided longitutde and latitude from the National Weather Service's API.

Once done with the terminal, make sure to stop running the server and quitting npm with the stop button and Control-C, respectively. 
