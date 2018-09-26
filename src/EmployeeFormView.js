import React, { Component } from 'react';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const DEPARTMENT_NAMES = ["Select department","WATER MGMNT", "POLICE", "GENERAL SERVICES", "CITY COUNCIL", "STREETS & SAN", "OEMC", "AVIATION", "FIRE", "FAMILY & SUPPORT", "IPRA", "PUBLIC LIBRARY", "BUSINESS AFFAIRS", "TRANSPORTN", "HEALTH", "MAYOR'S OFFICE", "LAW", "FINANCE", "CULTURAL AFFAIRS", "COMMUNITY DEVELOPMENT", "BUILDINGS", "ANIMAL CONTRL", "CITY CLERK", "BOARD OF ELECTION", "INSPECTOR GEN", "TREASURER", "DISABILITIES", "HUMAN RESOURCES", "DoIT", "BUDGET & MGMT", "PROCUREMENT", "HUMAN RELATIONS", "BOARD OF ETHICS", "POLICE BOARD", "ADMIN HEARNG", "LICENSE APPL COMM"];

class EmployeeFormView extends Component {
    onSubmit(e) {
        alert("Submitted a new employee!"
        );
        e.preventDefault();
    }
    render() {
        return (
            <div>
                {newEmployeeForm}
            </div>
        );
    }
}

const departmentSelectOptions = DEPARTMENT_NAMES.map( item => {
    return (
        <option key={item} value={item}>{item}</option>
    );
});

const validationSchema = Yup.object().shape({
    firstName: Yup.string()
        .trim()
        .uppercase()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required("First name is required!"),
    lastName: Yup.string()
        .trim()
        .uppercase()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required("Last name is required!"),
    middleInitial: Yup.string()
        .trim()
        .uppercase(),
    department: Yup.string()
        .matches(/^(?!Select department$)/, "Please select a department")
        .required("Department is required!"),
    jobTitle: Yup.string()
        .trim()
        .uppercase()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required("Job title is required!"),
    salary: Yup.number()
        .positive("Must be > 0")
        .required("Salary is required!"),
});

const validateSalary = value => {
    let error;
    const commaRegex = /,/

    if ( commaRegex.test(value) ) {
        error = "Please remove commas. Ex: 12,000 -> 12000";
    }
    return error;
}

const initialValues = {
    firstName: '',
    lastName: '',
    middleInitial: '',
    department: '',
    jobTitle: '',
    salary: '',
};

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
            <button type="submit" >
                {isSubmitting ? "Working": "Add employee"}
            </button>
        </div>
    </Form>
)

const newEmployeeForm = (
    <div>
        <h3>Add New Employee</h3>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={values => {
                console.log(values);
            }}
            render={renderForm}
        />
    </div>
);

export default EmployeeFormView;
