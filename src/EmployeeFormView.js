import React, { Component } from 'react';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import departmentNames from "./DepartmentNames"

class EmployeeFormView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message : '',
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(values, { resetForm, setSubmitting }) {
        const { firstName, lastName, middleInitial, department, jobTitle, salary } = values;

        const nameForApi = `${lastName.trim().toUpperCase()}, ${firstName.trim().toUpperCase()} ${middleInitial.trim().toUpperCase()}`.trim();
        const jobTitleForApi = jobTitle.trim().toUpperCase();
        const salaryForApi = parseFloat(salary);
        const departmentForApi = department;

        const body = {
            name : nameForApi,
            department : departmentForApi,
            employee_annual_salary : salaryForApi,
            job_titles : jobTitleForApi,
        };

        const baseApiUrl = "https://dt-interviews.appspot.com/";

        fetch ( baseApiUrl, { method: 'POST', body : JSON.stringify(body), })
            .then(res => res.json())
            .then(
                result => {
                    console.log( 'Success:', JSON.stringify(result) );
                    resetForm();
                    this.setState({
                        message : "Success!",
                        messageType : "success"
                    })
                    setTimeout( () => {
                        this.setState({
                            message : "",
                            messageType : null,
                        })
                    }, 4000);
                },
                error => {
                    console.error('Error:', error);
                    this.setState({
                        message : "Error... are you sure you are connected to the internet?",
                        messageType : "failure",
                    })
                    setSubmitting(false);
                }
            )
    }

    render() {
        const departmentSelectOptions = departmentNames.map( item => {
            return (
                <option key={item} value={item}>{item}</option>
            );
        });

        const initialValues = {
            firstName: '',
            lastName: '',
            middleInitial: '',
            department: '',
            jobTitle: '',
            salary: '',
        };

        const validateSalary = value => {
            let error;
            const commaRegex = /,/

            if ( commaRegex.test(value) ) {
                error = "Please remove commas. Ex: 12,000 -> 12000";
            }
            return error;
        }

        const validationSchema = Yup.object().shape({
            firstName: Yup.string()
                .min(2, 'Too Short!')
                .max(50, 'Too Long!')
                .required("First name is required!"),
            lastName: Yup.string()
                .min(2, 'Too Short!')
                .max(50, 'Too Long!')
                .required("Last name is required!"),
            middleInitial: Yup.string(),
            department: Yup.string()
                .matches(/^(?!Select department$)/, "Please select a department")
                .required("Department is required!"),
            jobTitle: Yup.string()
                .min(2, 'Too Short!')
                .max(50, 'Too Long!')
                .required("Job title is required!"),
            salary: Yup.number()
                .positive("Must be > 0")
                .required("Salary is required!"),
        });

        const renderForm = ({ errors, touched, isSubmitting }) => (
            <Form>
                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="firstName">First Name</label>
                        <Field name="firstName" placeholder="ex: Afua"/>
                    </div>
                    <ErrorMessage name="firstName"/>
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="lastName">Last Name</label>
                        <Field name="lastName" placeholder="ex: Takashiro"/>
                    </div>
                    <ErrorMessage name="lastName"/>
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="middleInitial">Middle Initial</label>
                        <Field name="middleInitial" placeholder="ex: Q"/>
                    </div>
                    <ErrorMessage name="middleInitial"/>
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="department">Department</label>
                        <Field name="department" placeholder="Choose Department" component='select'>
                            {departmentSelectOptions}
                        </Field>
                    </div>
                    <ErrorMessage name="department"/>
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="jobTitle">Job Title</label>
                        <Field name="jobTitle" placeholder="ex: Officer"/>
                    </div>
                    <ErrorMessage name="jobTitle"/>
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="salary">Salary</label>
                        <Field name="salary" placeholder="ex: 89000.00" validate={validateSalary}/>
                    </div>
                    <ErrorMessage name="salary"/>
                </div>
                <div className="form-row">
                    <button type="submit" disabled={isSubmitting}>
                        Add employee
                    </button>
                </div>
            </Form>
        )

        const { message, messageType } = this.state;

        return (
            <div className="form-view-container">
                <h3>Add New Employee</h3>
                <div className={messageType}>
                    {message}
                </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={this.handleSubmit}
                    render={renderForm}
                />
            </div>
        );
    }
}

export default EmployeeFormView;
