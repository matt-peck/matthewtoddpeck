import React, { useEffect, useState } from "react";
import moment from "moment";
import styled from "styled-components";
import { useTable } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";

const formatDate = date => moment(date).format("MMM D");
const formatToProperCase = string => {
  return string
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

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
    <table
      {...getTableProps()}
      style={{
        backgroundColor: "#00000040",
        boxShadow: "1px 1px 10px 1px #daa52078"
      }}
    >
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
  const [readingList, updateReadingList] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/.netlify/functions/getGoals")
      .then(res => res.json())
      .then(data => {
        const formattedTasks = data.tasks.map(t => {
          const startDate = t.start_date
            ? formatDate(Number(t.start_date))
            : "";
          const progress = `${Math.round(
            t.custom_fields.find(f => f.name === "Progress").value
              .percent_complete
          )}%`;
          const rating = t.custom_fields.find(f => f.name === "Rating").value
            ? Number(t.custom_fields.find(f => f.name === "Rating").value)
            : 0;

          return {
            title: t.name,
            startDate,
            rating,
            progress,
            status: formatToProperCase(t.status.status)
          };
        });
        const sortedReadingList = sortListByStartDate(formattedTasks);
        updateReadingList(sortedReadingList);
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
        accessor: "title"
      },
      {
        Header: "Status",
        accessor: "status",
        style: {
          textAlign: "center"
        }
      },
      {
        Header: "Progress",
        accessor: "progress",
        Cell: data => {
          return (
            <div
              style={{
                backgroundColor: "darkslategray",
                height: "15px",
                borderRadius: "10px"
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: data.row.original.progress,
                  borderRadius: `10px ${
                    data.row.original.progress === "100%"
                      ? "10px 10px"
                      : "0px 0px"
                  } 10px`,
                  backgroundColor: "goldenrod"
                }}
              ></div>
            </div>
          );
        }
      },
      {
        Header: "Rating",
        accessor: "rating",
        Cell: data => {
          const offsetRatingIndex = data.row.original.rating - 1;
          const defaultRatings = [false, false, false, false, false];
          const ratedRatings = defaultRatings.map(
            (val, i) => i >= offsetRatingIndex
          );

          return (
            <div>
              {ratedRatings.map(isLightOn => (
                <FontAwesomeIcon
                  style={{
                    color: !isLightOn ? "goldenrod" : "#2f4e4f",
                    marginRight: "5px"
                  }}
                  icon={faLightbulb}
                />
              ))}
            </div>
          );
        }
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
          marginTop: "15px",
          marginBottom: "25px"
        }}
      >
        <span style={{ marginRight: "10px" }}>Powered by my tasks in</span>
        <a
          href="https://clickup.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: "white",
            padding: "7px 7px 5px 7px",
            borderRadius: "5px"
          }}
        >
          <img
            src="https://clickup.com/landing/images/logo-clickup_color.svg"
            alt="clickup"
            style={{
              height: "22px"
            }}
          />
        </a>
      </div>
    </header>
  );
};

export default ReadingListPage;
