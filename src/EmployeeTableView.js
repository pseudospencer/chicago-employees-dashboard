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
        this.divideDataIntoDisplayPages = this.divideDataIntoDisplayPages.bind(this);
        this.paginateUp = this.paginateUp.bind(this);
        this.paginateDown = this.paginateDown.bind(this);
    }
    divideDataIntoDisplayPages() {
        // takes current API data, divides into displayable page-sized chunks.
        const { pageLength } = this.state;
        const { currentData } = this.props;
        const numOfPages = Math.floor(currentData.length / pageLength);;
        const remainder = currentData.length % pageLength;
        let displayPages = [];
        let pageData;

        for (let i = 0; i < numOfPages; i++) {
            pageData = currentData.slice(pageLength * i, pageLength * (i + 1));
            displayPages = [...displayPages, pageData];
        }
        if ( remainder > 0 ) {
            pageData = currentData.slice(pageLength * numOfPages);
            displayPages = [...displayPages, pageData]
        }
        this.setState({
            displayPages: displayPages,
            maxPage: numOfPages,
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
        } else if ( currentPageNum == minPage && uiPageNum > 1 ) {
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
        this.divideDataIntoDisplayPages();
    }
    componentDidUpdate(prevProps, prevState) {
        if ( prevProps.currentData !== this.props.currentData ) {
            console.log("got new data")
            this.divideDataIntoDisplayPages();
        }
    }
    render() {
        const { displayPages, currentPageNum, maxPage, uiPageNum } = this.state;

        let rows; // NOTE: rendering table to be handled by a separate tableComponent
        if (displayPages && currentPageNum < maxPage) {

            const toTitleCase = (str) => {
                str = str.toLowerCase().split(' ');
                for (var i = 0; i < str.length; i++) {
                    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
                }
                return str.join(' ');
            };

            rows = displayPages[currentPageNum].map( item => {
                return (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{toTitleCase(item.name)}</td>
                        <td>{toTitleCase(item.department)}</td>
                    </tr>
                )
            });
            console.log("currentPageNum",  currentPageNum, "maxPage", maxPage);
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
