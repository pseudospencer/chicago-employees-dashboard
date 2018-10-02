import React from 'react';
import { Table } from 'react-bootstrap';
import TableRow from "./TableRowComponent";

const DEBUG_STATEMENTS = !true;

function EmployeeTable(props) {

    const { currentData, table, focusedEmployee, handleNameClick } = props;
    let tableRows;

    if (DEBUG_STATEMENTS) {
        console.log("should create table: ", table.displayPagesLookup, table.currentPage, table.maxPage, table.currentPage <= table.maxPage);
    }

    if (table.displayPagesLookup && table.currentPage <= table.maxPage) {
        const start = table.displayPagesLookup[table.currentPage].startIndex;
        const end = table.displayPagesLookup[table.currentPage].endIndex;
        const currentPageData = currentData.slice(start, end);

        if (DEBUG_STATEMENTS) {
            console.log("Creating table: curr page =", table.currentPage, "displayPagesLookup =", table.displayPagesLookup,  "start", start, "end", end, "currentPageData");
        }

        tableRows = currentPageData.map( (item, index) => {
            return (
                <TableRow
                    key={item.id}
                    id={item.id}
                    index={start + index}
                    name={item.name}
                    jobTitle={item.job_titles}
                    department={item.department}
                    focusedEmployeeId={focusedEmployee.id}
                    handleNameClick={handleNameClick}
                />
            )
        });

        if (DEBUG_STATEMENTS) {
            console.log("EmployeeTableView Render currentPage",  table.currentPage, "maxPage", table.maxPage);
        }
    }

    return (
        <div className='table-wrapper'>
            <Table striped bordered condensed hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Job Title</th>
                        <th>Department</th>
                    </tr>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
            </Table>
        </div>
    )

}

export default EmployeeTable;
