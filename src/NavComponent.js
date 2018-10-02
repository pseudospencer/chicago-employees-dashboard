import React from 'react';

const NavComponent = (props) => {
    const { handleNavAddEmployee, handleNavViewEmployees } = props;
    return(
        <nav>
            <a href="javascript:;" onClick={handleNavViewEmployees}>View Employees</a>
            {' '}
            <a href="javascript:;" onClick={handleNavAddEmployee}>Add Employee</a>
        </nav>
    )
}

export default NavComponent;
