const corsOrigin = '*';

module.exports = {
  generateResponse: (code, payload) => {
    return {
      statusCode: code,
      headers: {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Headers': 'x-requested-with',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(payload)
    }
  },
  generateError: (code, err) => {
    console.log(err);
    return {
      statusCode: code,
      headers: {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Headers': 'x-requested-with',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(err)
    }
  }
};
