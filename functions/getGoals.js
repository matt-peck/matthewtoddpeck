const fetch = require("node-fetch");

const { CU_API_TOKEN } = process.env;

const fetchGoals = () => {
  const config = {
    method: "GET",
    // mode: 'cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      Authorization: CU_API_TOKEN
    }
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *client
    // body: JSON.stringify(data) // body data type must match "Content-Type" header
  };

  return {
    config,
    msg: "Hello World"
  };
  // return fetch(
  //   "https://api.clickup.com/api/v2/list/10649956/task?archived=false",
  //   config
  // );
};

exports.handler = async (event, context) => {
  try {
    const goals = await fetchGoals();

    return {
      statusCode: 200,
      body: goals
    };
  } catch (err) {
    return {
      statusCode: 200,
      body: err
    };
  }
};
