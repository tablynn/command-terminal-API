import './styles/CSVTable.css'
import React from 'react';

// Data table that represents loaded CSV data

//-----------------------------------------------------------------------------------------
// Classes text for the component

/** The class of the overarching table component. */
const tableClass = "csv-table";
/** The class of each entry element in table. */
const tableEntryClass = "csv-cell";
/** The class of each row element in the table. */
const tableRowClass = "csv-row";

/** The aria of table HTML element. */
export const tableAria = "table of CSV data";

//-----------------------------------------------------------------------------------------


/**
 * Returns an HTML table component representing given CSV data.
 * 
 * @param tableData a list of list of strings representing CSV data
 * @returns a table HTML component for the given CSV data
 */
export default function CSVTable({tableData}: {tableData: string[][]}): JSX.Element {
    let maxCol: number = 0;

    tableData.forEach((row : string[]) => {
      if(row.length > maxCol) {
        maxCol = row.length;
      }
    })

    const rows: JSX.Element[] = tableData.map((rowData: string[], rowNum: number) => {
      const currRow: JSX.Element[] = [];
      const rowAria: string = "row " + (rowNum + 1) + " of table"

      for(let i = 0; i < maxCol; i++) {
        const val: string = i < rowData.length ? rowData[i] : "";
        const cellAria: string = "row " + (rowNum + 1) + ", column " + (i + 1) + " of table, value is " + val;
        currRow.push((<td className={tableEntryClass} aria-label={cellAria} key={i}>{val}</td>));
      }
      return (<tr className={tableRowClass} aria-label={rowAria} key={rowNum}>{currRow}</tr>);
    })
    return (
      <table aria-label={tableAria} className={tableClass}><tbody>{rows}</tbody></table>
    )
}