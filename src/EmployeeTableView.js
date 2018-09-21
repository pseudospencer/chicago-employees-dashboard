import React, { Component } from 'react';

class EmployeeTableView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageLength : 25,
            minPage : 0,
            maxPage : 0,
            currentPageNum : 0,
            uiPageNum: 1,
        };
        this.createDisplayPagesLookup = this.createDisplayPagesLookup.bind(this);
        this.paginateUp = this.paginateUp.bind(this);
        this.paginateDown = this.paginateDown.bind(this);
    }
    createDisplayPagesLookup() {
        const { pageLength } = this.state;
        const { currentData } = this.props;
        const numOfPages = Math.floor(currentData.length / pageLength);;
        const remainder = currentData.length % pageLength;
        let displayPagesLookup = [];
        let startIndex;
        let endIndex;
        let minId;
        let maxId;

        for (let i = 0; i < numOfPages; i++) {
            startIndex = pageLength * i;
            endIndex = pageLength * (i + 1);
            minId = currentData[startIndex].id;
            maxId = currentData[endIndex - 1].id;
            displayPagesLookup = [...displayPagesLookup,
                    {
                        startIndex: startIndex,
                        endIndex: endIndex,
                        minId: minId,
                        maxId: maxId,
                    }
                ];
        }
        if ( remainder > 0 ) {
            startIndex = pageLength * numOfPages;
            endIndex = currentData.length;
            minId = currentData[startIndex].id;
            maxId = currentData[endIndex - 1].id;
            displayPagesLookup = [...displayPagesLookup,
                    {
                        startIndex: startIndex,
                        endIndex: endIndex,
                        minId: minId,
                        maxId: maxId,
                    }
                ];
        }
        this.setState({
            maxPage: numOfPages,
            displayPagesLookup: displayPagesLookup,
        });
    }
    paginateUp() {
        const { currentPageNum, uiPageNum, maxPage, minPage } = this.state;
        const { incrementData } = this.props;
        let newPage;
        let newUiPage;

        if ( currentPageNum < maxPage - 1 ) {
            console.log("paginateUp");
            newPage = currentPageNum + 1;
            newUiPage = uiPageNum + 1;

            this.setState({
                currentPageNum : newPage,
                uiPageNum: newUiPage,
            });
        } else {
            console.log("paginateUp increment");
            incrementData();
            newPage = minPage;
            newUiPage = uiPageNum + 1;

            this.setState({
                currentPageNum : newPage,
                uiPageNum: newUiPage,
            });
        }

    }
    paginateDown() {
        const { currentPageNum, uiPageNum, maxPage, minPage } = this.state;
        const { decrementData } = this.props;
        let newPage;
        let newUiPage;
        if ( currentPageNum > minPage && uiPageNum > 1 ) {
            console.log("paginateDown", "uiPageNum", uiPageNum);
            newPage = currentPageNum - 1;
            newUiPage = uiPageNum - 1;

            this.setState({
                currentPageNum : newPage,
                uiPageNum: newUiPage,
            });
        } else if ( currentPageNum <= minPage && uiPageNum > 1 ) {
            console.log("paginateDown decrement", "uiPageNum", uiPageNum);
            decrementData();
            newPage = maxPage;
            newUiPage = uiPageNum - 1;

            this.setState({
                currentPageNum : newPage,
                uiPageNum: newUiPage,
            });
        } else {
            // do nothing
        }
    }
    componentDidMount() {
        this.createDisplayPagesLookup();
    }
    componentDidUpdate(prevProps, prevState) {
        console.log("EmployeeTableView componentDidUpdate");
        if ( prevProps.currentData !== this.props.currentData ) {
            console.log("got new data")
            this.createDisplayPagesLookup();
        }
        const { displayPagesLookup, currentPageNum } = this.state;
        const { focusedEmployeeId } = this.props;
        const displayPageInfo = displayPagesLookup[currentPageNum];
        if ( focusedEmployeeId > displayPageInfo.maxId ) {
            this.paginateUp();
        }
        if ( focusedEmployeeId < displayPageInfo.minId  && currentPageNum > 0) {
            this.paginateDown();
        }

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
