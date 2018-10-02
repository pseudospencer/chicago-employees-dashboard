import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class EmployeeDetailView extends Component {
    render() {
        const { currentData, focusedEmployee, handleBackButton } = this.props;
        const focused = currentData[focusedEmployee.index];
        if (focused) {
            return (
                <div id="employee-detail-view">
                    <h2>Employee Details</h2>
                    <div className="employee-info">
                        <p>Employee name: {focused.name}</p>
                        <p>Employee ID: {focused.id}</p>
                        <p>Department: {focused.department}</p>
                        <p>Job Title: {focused.job_titles}</p>
                        <p>Salary: {focused.employee_annual_salary}</p>
                    </div>
                    <Button onClick={handleBackButton}>Back</Button>
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
