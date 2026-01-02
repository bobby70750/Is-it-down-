const axios = require("axios");

async function checkUrl(url) {
  const startTime = Date.now();

  try {
    const response = await axios.get(url, {
      timeout: 5000,           // 5 seconds
      validateStatus: () => true // DO NOT throw on non-200
    });

    const responseTime = Date.now() - startTime;

    return {
      status: "UP",
      httpCode: response.status,
      responseTime
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;

    return {
      status: "DOWN",
      httpCode: null,
      responseTime,
      error: error.message
    };
  }
}

module.exports = checkUrl;
