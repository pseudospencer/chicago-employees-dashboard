import React, { Component } from 'react';

const DEBUG_STATEMENTS = true;

class EmployeeTableView extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }
    componentDidUpdate(prevProps, prevState) {
    }
    render() {
        const { currentData, table, focusedEmployee, incrementTablePage, decrementTablePage } = this.props;
        let rows;

        if (DEBUG_STATEMENTS) {
            console.log("should create table: ", table.displayPagesLookup, table.currentPage, table.maxPage, table.currentPage <= table.maxPage);
        }

        if (table.displayPagesLookup && table.currentPage <= table.maxPage) {
            const start = table.displayPagesLookup[table.currentPage].startIndex;
            const end = table.displayPagesLookup[table.currentPage].endIndex;
            const currentPageData = currentData.slice(start, end);

            if (DEBUG_STATEMENTS) {
                console.log("Creating table: curr page =", table.currentPage, "displayPagesLookup =", table.displayPagesLookup,  "start", start, "end", end, "currentPageData");
            }
            const toTitleCase = (str) => {
                str = str.toLowerCase().split(' ');
                for (var i = 0; i < str.length; i++) {
                    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
                }
                return str.join(' ');
            };
            rows = currentPageData.map( item => {
                const style = item.id === focusedEmployee.id ? {color: "blue"} : {};
                return (
                    <tr key={item.id} style={style}>
                        <td>{item.id}</td>
                        <td>{toTitleCase(item.name)}</td>
                        <td>{toTitleCase(item.department)}</td>
                    </tr>
                )
            });
            if (DEBUG_STATEMENTS) {
                console.log("EmployeeTableView Render currentPage",  table.currentPage, "maxPage", table.maxPage);
            }
        }
        return(
            <div id="employee-table-view">
                <h2>Employee Table View</h2>
                <p>{"TableView Page " + (table.uiPage)}</p>
                <button type="button" onClick={decrementTablePage}>Previous Page</button>
                <button type="button" onClick={incrementTablePage}>Next Page</button>
                <div className='table-wrapper'>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Department</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default EmployeeTableView;
