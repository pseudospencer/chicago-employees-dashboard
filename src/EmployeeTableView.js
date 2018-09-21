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
            displayPages = [...displayPages, ]
        }

        this.setState({
            displayPages: displayPages,
            maxPage: numOfPages,
        });

    }
    paginateUp() {
        const { currentPageNum, uiPageNum, maxPage, minPage } = this.state;
        const { cycleDataForward } = this.props;
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
            console.log("paginateUp cycle");
            cycleDataForward();
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
        const { cycleDataBackward } = this.props;
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
            // NOTE: buggy: sometimes there's an issue caused by async nature of cycleData, where the uiPageNum can drop below 1 while still fetching data. Only happens when mashing button
            console.log("paginateDown cycle", "uiPageNum", uiPageNum);
            cycleDataBackward();
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
        let list;

        // NOTE: rendering list to be handled by a separate tableComponent
        if (displayPages && currentPageNum < maxPage) {
            list = displayPages[currentPageNum].map( item => {
                return (
                    <p key={item.id}>{item.name}, {item.id}</p>
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
                {list}
            </div>
        )
    }
}

export default EmployeeTableView;
