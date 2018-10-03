import React, { Component } from 'react';
import { Formik, Field, Form, ErrorMessage, } from "formik";
import * as Yup from "yup";
import { Button, Alert, } from 'react-bootstrap';
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
                        message : "Successfully added employee!",
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
                        messageType : "warning",
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

        const renderForm = ({ values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                            validateField,
        }) => (
            <Form>
                <div className="form-group">
                    <div className="form-field">
                        <label htmlFor="firstName">First Name</label>
                        <Field className="form-control" name="firstName" placeholder="ex: Afua"/>
                    </div>
                    { touched.firstName && errors.firstName && <Alert bsStyle="warning">{errors.firstName}</Alert>}
                </div>

                <div className="form-group">
                    <div className="form-field">
                        <label htmlFor="lastName">Last Name</label>
                        <Field name="lastName" className="form-control" placeholder="ex: Takashiro"/>
                    </div>
                    { touched.lastName && errors.lastName && <Alert bsStyle="warning">{errors.lastName}</Alert>}
                </div>

                <div className="form-group">
                    <div className="form-field">
                        <label htmlFor="middleInitial">Middle Initial</label>
                        <Field name="middleInitial" className="form-control" placeholder="ex: Q"/>
                    </div>
                    { touched.middleInitial && errors.middleInitial && <Alert bsStyle="warning">{errors.middleInitial}</Alert> }
                </div>

                <div className="form-group">
                    <div className="form-field">
                        <label htmlFor="department">Department</label>
                        <Field name="department" className="form-control" placeholder="Choose Department" component='select'>
                            {departmentSelectOptions}
                        </Field>
                    </div>
                    { touched.department && errors.department && <Alert bsStyle="warning">{errors.department}</Alert> }
                </div>

                <div className="form-group">
                    <div className="form-field">
                        <label htmlFor="jobTitle">Job Title</label>
                        <Field name="jobTitle" className="form-control" placeholder="ex: Officer"/>
                    </div>
                    { touched.jobTitle && errors.jobTitle && <Alert bsStyle="warning">{errors.jobTitle}</Alert> }
                </div>

                <div className="form-group">
                    <div className="form-field">
                        <label htmlFor="salary">Salary</label>
                        <Field name="salary" className="form-control" placeholder="ex: 89000.00" validate={validateSalary}/>
                    </div>
                    { touched.salary && errors.salary && <Alert bsStyle="warning">{errors.salary}</Alert> }
                </div>

                <Button type="submit" disabled={isSubmitting}>
                    { isSubmitting ? "Submitting..." : "Add employee" }
                </Button>
            </Form>
        )

        const { message, messageType } = this.state;

        return (
            <div className="form-view-container">
                <h2>Add New Employee</h2>
                { message && <Alert bsStyle={messageType}>{message}</Alert> }
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
