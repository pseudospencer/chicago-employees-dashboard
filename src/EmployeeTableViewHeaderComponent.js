import React from 'react';
import { Glyphicon, OverlayTrigger, Popover } from 'react-bootstrap';

const EmployeeTableViewHeader = (props) => {
    const popOver = (
        <Popover id="popover-positioned-bottom" title="Navigation">
            <p>Use up and down arrows to navigate through table rows.</p>
            <p>Use enter or click employee name to view employee details.</p>
        </Popover>
    );

    return (
            <h2>List of City of Chicago Employees <OverlayTrigger trigger="click" placement="bottom" overlay={popOver}><small><Glyphicon glyph="info-sign"/></small></OverlayTrigger></h2>
    );
}

export default EmployeeTableViewHeader;
