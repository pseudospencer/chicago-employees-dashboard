import React from 'react';

function TableRow(props) {

    const { id, name, department, jobTitle, focusedEmployeeId, index, handleNameClick } = props;

    const style = id === focusedEmployeeId ? {color: "red"} : {};
    const activeRow = id === focusedEmployeeId ? "info" : '';
    return (
        <tr key={id} className={activeRow}>
            <td onClick={ () => handleNameClick(index) }>{name}</td>
            <td>{jobTitle}</td>
            <td>{department}</td>
        </tr>
    );
}

export default TableRow;
