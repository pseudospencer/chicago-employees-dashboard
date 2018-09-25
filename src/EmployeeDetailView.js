import React, { Component } from 'react';

class EmployeeDetailView extends Component {
    render() {
        const { currentData, focusedEmployee } = this.props;
        const focused = currentData[focusedEmployee.index];
        if (focused) {
            return (
                <div id="employee-detail-view">
                    <hr></hr>
                    <h2>Employee Detail View</h2>
                    <div className="employee-info">
                        <p>Employee name: {focused.name}</p>
                        <p>Employee ID: {focused.id}</p>
                        <p>Department: {focused.department}</p>
                        <p>Job Title: {focused.job_titles}</p>
                        <p>Salary: {focused.employee_annual_salary}</p>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div id="employee-detail-view"></div>
            );
        }
    }
}

export default EmployeeDetailView;
