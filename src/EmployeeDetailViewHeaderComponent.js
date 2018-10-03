import React from 'react';
import { Glyphicon, OverlayTrigger, Popover } from 'react-bootstrap';

const EmployeeDetailViewHeader = (props) => {
    const popOver = (
        <Popover id="popover-positioned-bottom" title="Navigation">
            <p>Use up and down arrows to navigate through employees.</p>
            <p>Use enter or click "Back to table" to return to table view with current employee selected.</p>
        </Popover>
    );

    return (
            <h2>Employee Details <OverlayTrigger trigger="click" placement="bottom" overlay={popOver}><small><Glyphicon glyph="info-sign"/></small></OverlayTrigger></h2>
    );
}

export default EmployeeDetailViewHeader;
