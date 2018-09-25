import React from 'react';

function TableRow(props) {

    const { id, name, department, jobTitle, focusedEmployeeId, index, handleNameClick } = props;

    const toTitleCase = (str) => {
        str = str.toLowerCase().split(' ');
        for (var i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
        return str.join(' ');
    };

    const style = id === focusedEmployeeId ? {color: "blue"} : {};
    return (
        <tr key={id} style={style}>
            <td>{id}</td>
            <td onClick={ () => handleNameClick(index) }>{toTitleCase(name)}</td>
            <td>{toTitleCase(jobTitle)}</td>
            <td>{toTitleCase(department)}</td>
        </tr>
    );
}

export default TableRow;
