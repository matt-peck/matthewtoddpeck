import React, { useEffect, useState } from "react";
import moment from "moment";
import styled from "styled-components";
import { useTable } from "react-table";

const formatDate = date => moment(date).format("MMM D");

const sortListByStartDate = list => {
  return list.sort((a, b) => {
    const momentA = new moment(a.startDate);
    const momentB = new moment(b.startDate);

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
};

const Styles = styled.div`
  padding: 1rem;

  table {
    margin: 0 auto;
    border-spacing: 0;
    border: 1px solid white;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid white;
      border-right: 1px solid white;

      :first-child {
        text-align: center;
      }

      :last-child {
        border-right: 0;
      }
    }
  }
`;

const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data
  });

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const ReadingListPage = () => {
  const [readingList, updateReadingList] = useState([
    { title: "", startDate: "", progress: "" },
    { title: "", startDate: "", progress: "" },
    { title: "", startDate: "", progress: "" },
    { title: "", startDate: "", progress: "" },
    { title: "", startDate: "", progress: "" },
    { title: "", startDate: "", progress: "" },
    { title: "", startDate: "", progress: "" },
    { title: "", startDate: "", progress: "" },
    { title: "", startDate: "", progress: "" }
  ]);
  const [isLoading, setLoading] = useState(false);

  // useEffect(() => {
  //   fetch("/.netlify/functions/getGoals")
  //     .then(res => res.json())
  //     .then(data => {
  //       const formattedTasks = data.tasks.map(t => {
  //         const startDate = t.start_date
  //           ? formatDate(Number(t.start_date))
  //           : "";
  //         return {
  //           title: t.name,
  //           startDate,
  //           progress: `${Math.round(
  //             t.custom_fields[0].value.percent_complete
  //           )}%`
  //         };
  //       });
  //       const sortedReadingList = sortListByStartDate(formattedTasks);
  //       updateReadingList(sortedReadingList);
  //       setLoading(false);
  //     })
  //     .catch(err => console.log(err));
  // }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        accessor: (row, rowIndex) => rowIndex + 1
      },
      {
        Header: "Book Title",
        accessor: "title"
      },
      {
        Header: "Start Date",
        accessor: "startDate"
      },
      {
        Header: "Progress",
        accessor: "progress",
        className: "progress"
      }
    ],
    []
  );

  return (
    <header className="App-header">
      <h1>2020 Reading List</h1>
      {isLoading ? (
        <div style={{ textAlign: "center" }}>Loading...</div>
      ) : (
        <Styles>
          <Table columns={columns} data={readingList} />
        </Styles>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "15px"
        }}
      >
        <span style={{ marginRight: "10px" }}>Powered by my tasks in</span>
        <a
          href="https://clickup.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://clickup.com/landing/images/logo-clickup_color.svg"
            alt="clickup"
            style={{
              // display: "block",
              height: "25px"
            }}
          />
        </a>
      </div>
    </header>
  );
};

export default ReadingListPage;
