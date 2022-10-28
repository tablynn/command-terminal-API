const emptyCSV: string[][] = [];

const emptyRowCSV: string[][] = [[]];

const oneRowCSV: string[][] = [["hiss", "purr", "meow"]];

const oneColumnCSV: string[][] = [
    ["hiss"],
    ["purr"],
    ["meow"]
];

const emptyStrCSV: string[][] = [
    ["x", "y", "z", "boo"],
    ["a", "", "", "324"],
    ["", "", "", ""]
];

const nonAlphCSV: string[][] = [
    ["23[5]32", "234[", "732", "\t\n23423\t342     ;", ""],
    ["324", "[][;.", "230", "23.4';.'23", "2;3;.23]]]'.';;.    "]
]

const simpleCSV: string[][] = [
    ["hiss", "purr", "meow"],
    ["purr", "hiss", "meow"]
];


export default new Map<string, string[][]>([
    ["emptyCSV", emptyCSV],
    ["emptyRowCSV", emptyRowCSV],
    ["oneRowCSV", oneRowCSV],
    ["oneColumnCSV", oneColumnCSV],
    ["emptyStrCSV", emptyStrCSV],
    ["nonAlphCSV", nonAlphCSV],
    ["simpleCSV", simpleCSV]
])