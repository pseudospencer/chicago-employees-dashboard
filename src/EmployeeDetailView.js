import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import EmployeeDetailViewHeader from "./EmployeeDetailViewHeaderComponent"

class EmployeeDetailView extends Component {
    render() {
        const { currentData, focusedEmployee, handleBackButton } = this.props;
        const focused = currentData[focusedEmployee.index];
        if (focused) {
            return (
                <div id="employee-detail-view">
                    <EmployeeDetailViewHeader />
                    <div className="employee-info">
                        <p>Employee name: {focused.name}</p>
                        <p>Employee ID: {focused.id}</p>
                        <p>Department: {focused.department}</p>
                        <p>Job Title: {focused.job_titles}</p>
                        <p>Salary: {focused.employee_annual_salary}</p>
                    </div>
                    <Button onClick={handleBackButton}>Back to list</Button>
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
