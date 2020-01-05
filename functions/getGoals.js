const { CU_API_TOKEN } = process.env;

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: "hello world"
  };
};
