exports.handler = async event => {
  const subject = event.queryStringParameters.name || "World";
  const key = process.env.CU_API_KEY;
  return {
    statusCode: 200,
    body: `Hello ${subject} ${key}!`
  };
};
