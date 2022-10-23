var emptyCSV = [];
var emptyRowCSV = [[]];
var oneRowCSV = [["hiss", "purr", "meow"]];
var oneColumnCSV = [
    ["hiss"],
    ["purr"],
    ["meow"]
];
var emptyStrCSV = [
    ["x", "y", "z", "boo"],
    ["a", "", "", "324"],
    ["", "", "", ""]
];
var nonAlphCSV = [
    ["23[5]32", "234[", "732", "\t\n23423\t342     ;", ""],
    ["324", "[][;.", "230", "23.4';.'23", "2;3;.23]]]'.';;.    "]
];
var simpleCSV = [
    ["hiss", "purr", "meow"],
    ["purr", "hiss", "meow"]
];
export default new Map([
    ["emptyCSV", emptyCSV],
    ["emptyRowCSV", emptyRowCSV],
    ["oneRowCSV", oneRowCSV],
    ["oneColumnCSV", oneColumnCSV],
    ["emptyStrCSV", emptyStrCSV],
    ["nonAlphCSV", nonAlphCSV],
    ["simpleCSV", simpleCSV]
]);
