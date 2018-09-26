import React from 'react';

function TableRow(props) {

    const { id, name, department, jobTitle, focusedEmployeeId, index, handleNameClick } = props;

    const style = id === focusedEmployeeId ? {color: "red"} : {};
    return (
        <tr key={id} style={style}>
            {/* <td>{id}</td> */}
            <td onClick={ () => handleNameClick(index) }>{name}</td>
            <td>{jobTitle}</td>
            <td>{department}</td>
        </tr>
    );
}

export default TableRow;
