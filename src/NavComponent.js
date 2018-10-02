import React from 'react';

const NavComponent = (props) => {
    const { handleNavAddEmployee, handleNavViewEmployees } = props;
    return(
        <nav>
            <a href="#" onClick={handleNavViewEmployees}>View Employees</a>
            {'   '}
            <a href="#" onClick={handleNavAddEmployee}>Add Employee</a>
        </nav>
    )
}

export default NavComponent;
