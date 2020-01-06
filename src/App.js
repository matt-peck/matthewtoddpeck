import React, { useEffect, useState } from "react";
import moment from "moment";
import styled from "styled-components";
import { useTable } from "react-table";

const formatDate = date => moment(date).format("MMM D");

const sortListByStartDate = list => {
  return list.sort((a, b) => {
    const momentA = new moment(a.start_date);
    const momentB = new moment(b.start_date);

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
                console.log({ cell, props: cell.getCellProps() });
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
  const [readingList, updateReadingList] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useEffect called");

    fetch("/.netlify/functions/getGoals")
      .then(res => res.json())
      .then(data => {
        updateReadingList(sortListByStartDate(data.tasks));
        setLoading(false);
      })
      .catch(err => console.log(err));
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        accessor: (row, rowIndex) => rowIndex + 1
      },
      {
        Header: "Book Title",
        accessor: "name"
      },
      {
        Header: "Start Date",
        accessor: row => row.start_date && formatDate(Number(row.start_date))
      },
      {
        Header: "Progress",
        accessor: row => row.custom_fields[0].value.percent_complete
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
    </header>
  );
};

export default ReadingListPage;
