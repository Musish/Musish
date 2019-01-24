const fs = require('fs');

module.exports = {
  landing(event, context, callback) {
    const content = fs.readFileSync(`${__dirname}/landing.txt`, 'utf8');

    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
      body: content,
    };

    callback(null, response);
  },
};
