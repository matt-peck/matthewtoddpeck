const axios = require("axios");

const { CU_API_TOKEN } = process.env;

const fetchGoals = () => {
  const config = {
    method: "GET",
    mode: "cors",
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
    console.log("fetching goals...");
    const goals = await fetchGoals();
    console.log("goals fetched!");

    return {
      statusCode: 200,
      body: JSON.stringify(goals.data)
    };
  } catch (err) {
    console.log("error fetching goals", err);
    return {
      statusCode: 400,
      body: "something happened wrong"
    };
  }
};
