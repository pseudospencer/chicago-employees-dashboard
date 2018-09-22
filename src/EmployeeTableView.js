import React, { Component } from 'react';

class EmployeeTableView extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        // this.createDisplayPagesLookup();
    }
    componentDidUpdate(prevProps, prevState) {
        // console.log("EmployeeTableView componentDidUpdate");
        // if ( prevProps.currentData !== this.props.currentData ) {
        //     console.log("got new data")
        //     this.createDisplayPagesLookup();
        // }
        // const { displayPagesLookup, currentPageNum } = this.state;
        // const { focusedEmployeeId } = this.props;
        // const displayPageInfo = displayPagesLookup[currentPageNum];
        // if ( focusedEmployeeId > displayPageInfo.maxId ) {
        //     this.paginateUp();
        // }
        // if ( focusedEmployeeId < displayPageInfo.minId  && currentPageNum > 0) {
        //     this.paginateDown();
        // }

    }
    render() {
        const { displayPagesLookup, currentPageNum, maxPage, uiPageNum } = this.state;
        const { currentData, focusedEmployeeId } = this.props;

        let rows; // NOTE: rendering table to be handled by a separate tableComponent
        if (displayPagesLookup && currentPageNum < maxPage) {
            const start = displayPagesLookup[currentPageNum].startIndex;
            const end = displayPagesLookup[currentPageNum].endIndex;
            const currentPageData = currentData.slice(start, end);

            const toTitleCase = (str) => {
                str = str.toLowerCase().split(' ');
                for (var i = 0; i < str.length; i++) {
                    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
                }
                return str.join(' ');
            };
            rows = currentPageData.map( item => {
                const style = item.id === focusedEmployeeId ? {color: "blue"} : {};
                return (
                    <tr key={item.id} style={style}>
                        <td>{item.id}</td>
                        <td>{toTitleCase(item.name)}</td>
                        <td>{toTitleCase(item.department)}</td>
                    </tr>
                )
            });
            console.log("EmployeeTableView Render currentPageNum",  currentPageNum, "maxPage", maxPage);
        }
        return (
            <div id="employee-table-view">
                <h2>Employee Table View</h2>
                <p>{"TableView Page " + (uiPageNum)}</p>
                <button type="button" onClick={this.paginateDown}>Previous Page</button>
                <button type="button" onClick={this.paginateUp}>Next Page</button>
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
