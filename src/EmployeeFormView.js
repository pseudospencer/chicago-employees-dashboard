import React, { Component } from 'react';

class EmployeeFormView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            middleInitial: '',
            jobTitle: '',
            salary: '',
            department: '',
        };

        this.clearFormData = this.clearFormData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    clearFormData() {
        this.setState({
            firstName: '',
            lastName: '',
            middleInitial: '',
            jobTitle: '',
            salary: '',
            department: '',
        });
    }
    validateForm() {

    }
    parseName() {

    }
    upperCaseEverything() {
    }
    handleSubmit(e) {
        const { firstName, lastName, middleInitial, jobTitle, salary, department } = this.state;
        alert("Submitted a new employee! Name: ",
            lastName, ",", firstName, " ", middleInitial,
            "Job title: ", jobTitle, "Department: ", department,
            "Salary: ", salary
        );
        e.preventDefault();
    }
    handleChange(e) {
        const propName = e.target.name;
        const propVal = e.target.value;
        this.setState({
            [propName] : propVal,
        })
    }
    render() {

        const { firstName, lastName, middleInitial, jobTitle, salary, department } = this.state;

        return (
            <div id="employee-form-view">
                <hr></hr>
                <h2>Employee Form View</h2>
                <div className="form-outer">
                    <form>
                        <label>
                            First name:
                            <input
                                autoFocus
                                required
                                type="text"
                                name="firstName"
                                placeholder="ex: Afua"
                                onChange={this.handleChange}
                                value={firstName}
                            />
                        </label>
                        <label>
                            Last name:
                            <input
                                required
                                type="text"
                                name="lastName"
                                placeholder="ex: Takashiro"
                                onChange={this.handleChange}
                                value={lastName}
                            />
                        </label>
                        <label>
                            Middle initial:
                            <input
                                type="text"
                                name="middleInitial"
                                placeholder="ex: Q"
                                onChange={this.handleChange}
                                value={middleInitial}
                            />
                        </label>
                        <label>
                            {/* Should this be something other than a text input? Maybe a dropdown? */}
                            Department:
                            <input
                                required
                                type="text"
                                name="department"
                                placeholder="ex: Police"
                                onChange={this.handleChange}
                                value={department}
                            />
                        </label>
                        <label>
                            Job Title:
                            <input
                                required
                                type="text"
                                name="jobTitle"
                                placeholder="ex: Police Officer"
                                onChange={this.handleChange}
                                value={jobTitle}
                            />
                        </label>
                        <label>
                            Salary:
                            <input
                                required
                                type="text"
                                name="salary"
                                placeholder="ex: 90744.00"
                                onChange={this.handleChange}
                                value={salary}
                            />
                        </label>
                        <input type="submit" value="Add Employee" />
                    </form>

                    {/* <form id="add-employee-form">
                        <div class="form-item">
                            <div className="label">
                                <label for="first-name" id="first-name-label">First name:</label>
                            </div>
                            <div class="input">
                                <input autoFocus type='text' id="first-name" required placeholder="ex: Afua"></input>
                            </div>
                        </div>
                        <div class="form-item">
                            <div className="label">
                                <label for="last-name" id="last-name-label">Last name:</label>
                            </div>
                            <div class="input">
                                <input type='text' id="last-name" required placeholder="ex: Takashiro"></input>
                            </div>
                        </div>
                        <div class="form-item">
                            <div className="label">
                                <label for="middle-initial" id="middle-initial-label">Last name:</label>
                            </div>
                            <div class="input">
                                <input type='text' id="middle-initial" placeholder="ex: Q"></input>
                            </div>
                        </div>
                    </form> */}
                </div>
            </div>
        );
    }
}

export default EmployeeFormView;
