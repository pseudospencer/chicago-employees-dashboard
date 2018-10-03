import React, { Component } from 'react';
import { Pager, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import EmployeeTableViewHeader from "./EmployeeTableViewHeaderComponent"
import EmployeeTable from "./EmployeeTableComponent";
import departmentNames from "./DepartmentNames"

class EmployeeTableView extends Component {
    render() {

        const { currentData, table, focusedEmployee, incrementTablePage, decrementTablePage, handleNameClick, handleDepartmentFilter } = this.props;

        const paginateTableUi = (
            <div className="paginate-table-buttons">
                <Pager>
                    <Pager.Item previous disabled={table.uiPage <= 1} onClick={decrementTablePage}>&larr;  Previous Page</Pager.Item>
                    <Pager.Item next disabled={table.uiPage >= table.maxPage} onClick={incrementTablePage}>Next Page &rarr;</Pager.Item>
                    <p>{"Page " + (table.uiPage) + " of " + (table.maxPage)}</p>
                </Pager>
            </div>
        );

        const departmentSelectOptions = departmentNames.map( item => {
            return (
                <option key={item} value={item}>{item}</option>
            );
        });

        const filterSelect = (
            <div>
                <FormGroup controlId="department-filter">
                    <ControlLabel htmlFor="department-filter">Filter by department</ControlLabel>
                    {"  "}
                    <FormControl
                        componentClass="select"
                        value={table.filter} onChange={handleDepartmentFilter}
                    >
                            {departmentSelectOptions}
                    </FormControl>
                </FormGroup>
            </div>
        )

        return(
            <div id="employee-table-view">
                <EmployeeTableViewHeader />
                {filterSelect}
                {paginateTableUi}
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
