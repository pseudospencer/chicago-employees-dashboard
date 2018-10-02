import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';

const TABLE_VIEW = 0;
const DETAIL_VIEW = 1;
const FORM_VIEW = 2;

const NavComponent = (props) => {
    const { handleNavAddEmployee, handleNavViewEmployees, currentView } = props;

    const activeKey = currentView == TABLE_VIEW || currentView == DETAIL_VIEW ? 1 : 2;
    return(
        <Nav bsStyle="tabs" activeKey={activeKey}>
            <NavItem eventKey={1} onClick={handleNavViewEmployees}>
                View Employees
            </NavItem>
            <NavItem eventKey={2} onClick={handleNavAddEmployee}>
                Add Employee
            </NavItem>
        </Nav>
    )
}

export default NavComponent;
