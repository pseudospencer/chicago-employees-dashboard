import React, { Component } from 'react';
import EmployeeTable from "./EmployeeTableComponent";
import departmentNames from "./DepartmentNames"

class EmployeeTableView extends Component {
    render() {

        const { currentData, table, focusedEmployee, incrementTablePage, decrementTablePage, handleNameClick, handleDepartmentFilter } = this.props;

        const paginateTableButtons = (
            <div className="paginate-table-buttons">
                <button type="button" onClick={decrementTablePage}>Previous Page</button>
                <button type="button" onClick={incrementTablePage}>Next Page</button>
            </div>
        );

        const departmentSelectOptions = departmentNames.map( item => {
            return (
                <option key={item} value={item}>{item}</option>
            );
        });

        const filterSelect = (
            <div>
                <label htmlFor="department-filter">Filter by department</label>
                <select name="department-filter" placeholder="Choose Department" value={table.filter} onChange={handleDepartmentFilter}>
                    {departmentSelectOptions}
                </select>
            </div>
        )

        return(
            <div id="employee-table-view">
                <hr></hr>
                <h2>Employee Table View</h2>
                <p>{"Page " + (table.uiPage)}</p>
                {paginateTableButtons}
                {filterSelect}
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
