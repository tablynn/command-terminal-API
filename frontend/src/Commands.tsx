import CSVTable from './CSVTable';
import { REPLFunction } from './Terminal';
import React from 'react';

const BACKEND_URL = "http://localhost:3232"

/**
 * This function is called with the get command, calling the backend server to get the csv
 * contents.
 * @param args the string csv file
 * @returns the csv contents or an error message
 */
export const get: REPLFunction = (args: string[]): Promise<string | JSX.Element> => {
  if (args.length !== 1) {
    return Promise.resolve("Error - requires one argument, a filepath.");
  }
  return fetch(BACKEND_URL + "/loadcsv?filepath=" + args[0])
    .then((loadResponse: Response) => loadResponse.json())
    .then((loadJSON) => {
      if(loadJSON.result === "error_bad_request") {
        return Promise.resolve("Error - file could not be found or accessed.");
      } else if(loadJSON.result === "error_datasource") {
        return Promise.resolve("Error - file could not be read or parsed.");
      }
      return fetch(BACKEND_URL + "/getcsv")
        .then((getResponse: Response) => getResponse.json())
        .then((getJSON) => {
          if (getJSON.result === "error_bad_request") {
            return Promise.resolve("Error - no file is loaded.");
          } else if (getJSON.result === "error_datasource") {
            return Promise.resolve("Error - file could not be read or parsed.");
          } else if(getJSON.data instanceof Array<Array<string>>){
            return <CSVTable tableData={getJSON.data}/>
          }
        })
    })
}

/**
 * This function is called with the stats command, calling the backend server to get the number of
 * rows and columns of the last loaded csv file.
 * @returns the number of rows and columns of the file or an error message
 */
export const stats: REPLFunction = (args: string[]): Promise<string> => {
  if(args.length !== 0) {
    return Promise.resolve("Error - requires 0 arguments.")
  }
  return fetch(BACKEND_URL + "/stats")
    .then((statsResponse: Response) => statsResponse.json())
    .then((statsJSON) => {
      if(statsJSON.result === "error_bad_request") {
        return Promise.resolve("Error - no file is loaded.")
      } else if(statsJSON.result === "error_datasource") {
        return Promise.resolve("Error - file could not be read or parsed.")
      } else {
        return Promise.resolve("Rows: " + statsJSON.rows + ", Columns: " + statsJSON.columns)
      }
    })
}

/**
 * This function is called with the weather command, calling the backend server to get the weather
 * at the specified latitude and longitude.
 * @param args the latitude and longitude
 * @returns the temperature of the given location or an error message
 */
export const weather: REPLFunction = (args: string[]): Promise<string> => {
  if(args.length !== 2) {
    return Promise.resolve("Error - requires 2 arguments, latitude and longitude.")
  }
  return fetch(BACKEND_URL + "/weather?lat=" + args[0] + "&lon=" + args[1])
    .then((weatherResponse: Response) => weatherResponse.json())
    .then((weatherJSON) => {
      if(weatherJSON.result === "error_bad_request") {
        return Promise.resolve("Error - invalid arguments.");
      } else if(weatherJSON.result === "error_datasource") {
        return Promise.resolve("Error - weather not able to be retrieved.");
      } else if(weatherJSON.result === "error_bad_json") {
        return Promise.resolve("Error - weather not able to be retrieved.");
      } else {
        return Promise.resolve("Temperature (F): " + weatherJSON.temperature);
      }
    })
}

/**
 * This function mocks the get function, returning the contents of the file, data/stars/one-star.csv. 
 * @param args the string csv file
 * @returns contents of data/stars/one-star.csv
 */
export const mockGet: REPLFunction = (args: string[]): Promise<string | JSX.Element> => {
  if (args.length !== 1) {
    return Promise.resolve("Error - requires one argument, a filepath.");
  }
  else{
    if(args[0] == "data/stars/one-star.csv"){
      return Promise.resolve("[0,Sol,0,0,0]")
    }
    else{
      return Promise.resolve("Error - file could not be read or parsed.")
    }

  }
}

/**
 * This function mocks the stats function, returning the rows/columns of the file, data/stars/one-star.csv. 
 * @returns rows and columns of data/stars/one-star.csv
 */
export const mockStats: REPLFunction = (args: string[]): Promise<string | JSX.Element> => {
  if(args.length !== 0) {
    return Promise.resolve("Error - requires 0 arguments.")
  }
  else{
    return Promise.resolve("Rows: 1, Columns: 5")
  }
}

/**
 * This function mocks the weather function, returning the weather as 61 degrees.
 * @param args the latitude and longitude 
 * @returns the temperature as 61
 */
export const mockWeather: REPLFunction = (args: string[]): Promise<string> => {
  if(args.length !== 2) {
    return Promise.resolve("Error - requires 2 arguments, latitude and longitude.")
  }
  else {
    if(args[0] == "38" && args[1] == "-77"){
      return Promise.resolve("61")
    }
    else{
      return Promise.resolve("Error - file could not be read or parsed.")
    }
  }
}

