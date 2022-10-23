// all exports from main will now be available as main.X
import * as main from './main';
import mockCSVs from '../mocks/mockedJson.js';
//----------------------------------------------------------------------------
// Functions utilized for testing
/**
 * Inputs a string into the command prompt HTML input element.
 * @param input String to be inputted
 */
function inputString(input) {
    var letters = input.split("");
    for (var i = 0; i < letters.length; i++) {
        main.handleKeyPress(new KeyboardEvent("keypress", { key: letters[i] }));
    }
    main.setInput(input);
}
/**
 * Mocks pressing the enter key within the command prompt HTML input element
 */
function hitEnter() {
    main.handleKeyPress(new KeyboardEvent("keypress", { key: "Enter" }));
}
/**
 * Mocks clicking the submit button
 */
function clickSubmit() {
    main.handleClick(new MouseEvent("click"));
}
//----------------------------------------------------------------------------
// Mock HTML for testing
var startHTML = "<body>\n  <div class=\"repl\">\n    <div id=\"repl-history\"></div>\n    <div id=\"repl-input\">\n        <input type=\"text\" placeholder=\"Enter command here!\" id=\"repl-command-box\">\n    </div>\n    <button id=\"submit-button\">Submit</button>\n  </div>\n</body>";
beforeEach(function () {
    main.clearHistory();
    document.body.innerHTML = startHTML;
});
//----------------------------------------------------------------------------
// Testing correct metadata updating
test('retriving CSV file contents', function () {
    expect(mockCSVs.get("emptyCSV")).toEqual([]);
    expect(mockCSVs.get("emptyRowCSV")).toEqual([[]]);
    expect(mockCSVs.get("oneRowCSV")).toEqual([["hiss", "purr", "meow"]]);
});
describe("test stats calculation", function () {
    test('stats for empty CSV file', function () {
        var empty = mockCSVs.get("emptyCSV");
        if (empty != null) {
            expect(main.getStats(empty)).toEqual([0, 0]);
        }
    });
    test('stats for CSV file with one empty row', function () {
        var emptyRow = mockCSVs.get("emptyRowCSV");
        if (emptyRow != null) {
            expect(main.getStats(emptyRow)).toEqual([1, 0]);
        }
    });
    test('stats for CSV file with only one row', function () {
        var oneRow = mockCSVs.get("oneRowCSV");
        if (oneRow != null) {
            expect(main.getStats(oneRow)).toEqual([1, 3]);
        }
    });
    test('stats for CSV file with one column', function () {
        var oneCol = mockCSVs.get("oneColumnCSV");
        if (oneCol != null) {
            expect(main.getStats(oneCol)).toEqual([3, 1]);
        }
    });
    test('stats for CSV with empty strings', function () {
        var empty = mockCSVs.get("emptyStrCSV");
        if (empty != null) {
            expect(main.getStats(empty)).toEqual([3, 4]);
        }
    });
    test('stats for CSV with non-alphabetic characters', function () {
        var nonAlph = mockCSVs.get("nonAlphCSV");
        if (nonAlph != null) {
            expect(main.getStats(nonAlph)).toEqual([2, 5]);
        }
    });
    test('stats for simple CSV file', function () {
        var simple = mockCSVs.get("simpleCSV");
        if (simple != null) {
            expect(main.getStats(simple)).toEqual([2, 3]);
        }
    });
});
test('unknown commands', function () {
    main.processInput(" ");
    expect(main.getCommands()[0]).toBe(" ");
    expect(main.getOutputs()[0]).toBe("ERROR - Unknown command.");
    main.processInput(" ");
    expect(main.getCommands()[1]).toBe(" ");
    expect(main.getOutputs()[1]).toBe("ERROR - Unknown command.");
    main.processInput("get stats wrong");
    expect(main.getCommands()[2]).toBe("get stats wrong");
    expect(main.getOutputs()[2]).toBe("ERROR - Unknown command.");
    main.processInput("stats simpleCSV");
    expect(main.getCommands()[3]).toBe("stats simpleCSV");
    expect(main.getOutputs()[3]).toBe("ERROR - Unknown command.");
    main.processInput("stats ");
    expect(main.getCommands()[4]).toBe("stats ");
    expect(main.getOutputs()[4]).toBe("ERROR - Unknown command.");
    main.processInput("get  emptyCSV");
    expect(main.getCommands()[5]).toBe("get  emptyCSV");
    expect(main.getOutputs()[5]).toBe("ERROR - Unknown command.");
});
test('get and stats for a nonexistent CSV file', function () {
    main.processInput("get randomCSV");
    expect(main.getOutputs()[0]).toBe("ERROR - File unable to be found or opened.");
    main.processInput("stats");
    expect(main.getOutputs()[1]).toBe("ERROR - No CSV file loaded.");
});
test('using stats after attempting another command', function () {
    main.processInput("get oneRowCSV");
    expect(main.getOutputs()[0]).toBe("[\n\t[\"hiss\",\"purr\",\"meow\"]\n]");
    main.processInput("oops");
    expect(main.getOutputs()[1]).toBe("ERROR - Unknown command.");
    main.processInput("stats");
    expect(main.getOutputs()[2]).toBe("Rows: 1, Columns: 3");
});
test('using stats multiple times', function () {
    main.processInput("get emptyStrCSV");
    expect(main.getOutputs()[0]).toBe("[\n\t[\"x\",\"y\",\"z\",\"boo\"],\n\t[\"a\",\"\",\"\",\"324\"],\n\t[\"\",\"\",\"\",\"\"]\n]");
    main.processInput("stats");
    expect(main.getOutputs()[1]).toBe("Rows: 3, Columns: 4");
    main.processInput("stats");
    expect(main.getOutputs()[2]).toBe("Rows: 3, Columns: 4");
});
test('get and stats for the emptyCSV', function () {
    main.processInput("get emptyCSV");
    expect(main.getOutputs()[0]).toBe("[]");
    main.processInput("stats");
    expect(main.getOutputs()[1]).toBe("Rows: 0, Columns: 0");
});
//----------------------------------------------------------------------------
// Testing metadata updated upon input
test('metadata updated with enter', function () {
    inputString("has fd huaew ");
    expect(main.getCommands().length).toBe(0);
    expect(main.getCommands().length).toBe(0);
    hitEnter(); // doesn't get updated until enter is hit
    expect(main.getCommands()[0]).toBe("has fd huaew ");
    expect(main.getOutputs()[0]).toBe("ERROR - Unknown command.");
});
test('metadata updated with button', function () {
    inputString("get emptyCSV");
    expect(main.getCommands().length).toBe(0);
    expect(main.getCommands().length).toBe(0);
    clickSubmit(); // doesn't get updated until button is clicked
    expect(main.getCommands()[0]).toBe("get emptyCSV");
    expect(main.getOutputs()[0]).toBe("[]");
    inputString("stats");
    expect(main.getCommands().length).toBe(1);
    expect(main.getCommands().length).toBe(1);
    clickSubmit(); // doesn't get updated until button is clicked
    expect(main.getCommands()[1]).toBe("stats");
    expect(main.getOutputs()[1]).toBe("Rows: 0, Columns: 0");
});
//----------------------------------------------------------------------------
// Testing HTML source is updated with proper output
test('HTML updated after submit button clicked', function () {
    inputString("get emptyCSV");
    clickSubmit(); // doesn't get updated until button is clicked
    expect(document.body.innerHTML.includes("Command: get emptyCSV")).toBeTruthy();
    expect(document.body.innerHTML.includes("Output: []")).toBeTruthy();
    inputString("stats");
    clickSubmit();
    expect(document.body.innerHTML.includes("Command: stats")).toBeTruthy();
    expect(document.body.innerHTML.includes("Output: Rows: 0, Columns: 0")).toBeTruthy();
});
test('HTML updated after Enter pressed', function () {
    inputString("get");
    hitEnter(); // doesn't get updated until button is clicked
    expect(document.body.innerHTML.includes("Command: get")).toBeTruthy();
    expect(document.body.innerHTML.includes("ERROR - Unknown command.")).toBeTruthy();
    inputString("stats");
    hitEnter();
    expect(document.body.innerHTML.includes("Command: stats")).toBeTruthy();
    expect(document.body.innerHTML.includes("ERROR - No CSV file loaded.")).toBeTruthy();
});
