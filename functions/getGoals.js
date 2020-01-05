const axios = require("axios");

const { CU_API_TOKEN } = process.env;

const fetchGoals = () => {
  console.log("fetchGoals called!");

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

exports.handler = async (event, context, callback) => {
  try {
    console.log("trying fetchGoals()...");
    const goals = await fetchGoals();

    console.log("goals fetched!", goals);

    return callback(null, {
      status: 200,
      body: JSON.stringify(goals.data)
    });
  } catch (err) {
    console.log("error", err);

    return {
      statusCode: 400,
      body: `Error: ${err}`
    };
  }
};
