import React, { Component } from 'react';
import EmployeeTable from "./EmployeeTableComponent";

// const DEBUG_STATEMENTS = true;

class EmployeeTableView extends Component {
    render() {

        const { currentData, table, focusedEmployee, incrementTablePage, decrementTablePage, handleNameClick } = this.props;

        const paginateApiButtons = (
            <div className="paginate-table-buttons">
                <button type="button" onClick={decrementTablePage}>Previous Page</button>
                <button type="button" onClick={incrementTablePage}>Next Page</button>
            </div>
        );

        return(
            <div id="employee-table-view">
                <hr></hr>
                <h2>Employee Table View</h2>
                <p>{"TableView Page " + (table.uiPage)}</p>
                {paginateApiButtons}
                <EmployeeTable
                    currentData={currentData}
                    table={table}
                    focusedEmployee={focusedEmployee}
                    handleNameClick={handleNameClick}
                />
            </div>
        )
    }
}

export default EmployeeTableView;
