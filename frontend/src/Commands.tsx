import {registerCommand, REPLFunction, commands} from './Terminal';

const BACKEND_URL = "http://localhost:3232"

export const get: REPLFunction = (args: string[]): Promise<string> => {
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
          } else {
            return Promise.resolve(getJSON.data)
          }
        })
    })
}

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
