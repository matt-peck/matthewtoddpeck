import React, { Component } from "react";
import moment from "moment";
import readingList from "./data/readingList.json";

const formatDate = date => moment(date).format("MMM D");

const ReadingListItem = props => {
  return (
    <div className="book">
      {props.title}
      {props.start && (
        <span className="start">Started - {formatDate(props.start)}</span>
      )}
    </div>
  );
};

class App extends Component {
  async componentDidMount() {
    const goals = await fetch("/.netlify/functions/getGoals");
    console.log({ goals });
  }

  render() {
    const sortedReadingList = readingList.sort((a, b) => {
      const momentA = new moment(a.start);
      const momentB = new moment(b.start);

      if (momentA.isValid() && momentB.isValid()) {
        return momentA.diff(momentB);
      }

      if (momentA.isValid() && !momentB.isValid()) {
        return -1;
      }

      if (!momentA.isValid() && momentB.isValid()) {
        return 1;
      }

      if (!momentA.isValid() && !momentB.isValid()) {
        return 0;
      }
    });

    return (
      <header className="App-header">
        <h1>2020 Reading List</h1>
        {sortedReadingList.map(item => (
          <ReadingListItem
            key={item.title}
            title={item.title}
            start={item.start}
          />
        ))}
      </header>
    );
  }
}

export default App;
