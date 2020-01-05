const axios = require("axios");

const { CU_API_TOKEN } = process.env;

const fetchGoals = () => {
  const config = {
    method: "GET",
    mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
      Authorization: CU_API_TOKEN
    }
  };

  return axios.get(
    "https://api.clickup.com/api/v2/list/10649956/task?archived=false",
    config
  );
};

exports.handler = async (event, context) => {
  try {
    const goals = await fetchGoals();

    return {
      statusCode: 200,
      body: JSON.stringify(goals)
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: `Error: ${err}`
    };
  }
};
