import React, { Component } from 'react';
import { withFormik } from "formik";
import Yup from "yup";

const DEPARTMENT_NAMES = ["WATER MGMNT", "POLICE", "GENERAL SERVICES", "CITY COUNCIL", "STREETS & SAN", "OEMC", "AVIATION", "FIRE", "FAMILY & SUPPORT", "IPRA", "PUBLIC LIBRARY", "BUSINESS AFFAIRS", "TRANSPORTN", "HEALTH", "MAYOR'S OFFICE", "LAW", "FINANCE", "CULTURAL AFFAIRS", "COMMUNITY DEVELOPMENT", "BUILDINGS", "ANIMAL CONTRL", "CITY CLERK", "BOARD OF ELECTION", "INSPECTOR GEN", "TREASURER", "DISABILITIES", "HUMAN RESOURCES", "DoIT", "BUDGET & MGMT", "PROCUREMENT", "HUMAN RELATIONS", "BOARD OF ETHICS", "POLICE BOARD", "ADMIN HEARNG", "LICENSE APPL COMM"];

// class EmployeeFormView extends Component { }

const EmployeeFormView = () => {
    <div>
        <input
            autoFocus
            required
            type="text"
            name="firstName"
            placeholder="ex: Afua"
            onChange={this.handleChange}
            value={firstName}
        />
    </div>
}

const AddEmployeeForm = withFormik({

})(EmployeeFormView)

// const oldStuff = (
//     <form onSubmit={this.handleSubmit}>
//         <div>
//             <label>
//                 First name:
//                 <input
//                     autoFocus
//                     required
//                     type="text"
//                     name="firstName"
//                     placeholder="ex: Afua"
//                     onChange={this.handleChange}
//                     value={firstName}
//                 />
//             </label>
//         </div>
//         <div>
//             <label>
//                 Last name:
//                 <input
//                     required
//                     type="text"
//                     name="lastName"
//                     placeholder="ex: Takashiro"
//                     onChange={this.handleChange}
//                     value={lastName}
//                 />
//             </label>
//         </div>
//         <div>
//             <label>
//                 Middle initial:
//                 <input
//                     type="text"
//                     name="middleInitial"
//                     placeholder="ex: Q"
//                     onChange={this.handleChange}
//                     value={middleInitial}
//                 />
//             </label>
//         </div>
//         <div>
//
//             <label>
//                 Department:
//                 <select value={department} onChange={this.handleChange}>
//                     {departmentSelectOptions}
//                 </select>
//             </label>
//         </div>
//         <div>
//             <label>
//                 Job Title:
//                 <input
//                     required
//                     type="text"
//                     name="jobTitle"
//                     placeholder="ex: Police Officer"
//                     onChange={this.handleChange}
//                     value={jobTitle}
//                 />
//             </label>
//         </div>
//         <div>
//             <label>
//                 Salary:
//                 <input
//                     required
//                     type="text"
//                     name="salary"
//                     placeholder="ex: 90744.00"
//                     onChange={this.handleChange}
//                     value={salary}
//                 />
//             </label>
//         </div>
//         <div>
//             <input type="submit" value="Add Employee" />
//         </div>
//     </form>
// )

export default EmployeeFormView;
