module.exports = {
  success: (result) => {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(result)
    }
  },

  error: (msg) => {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        statusCode: 500,
        error: 'Internal Server Error',
        internalError: JSON.stringify(msg)
      })
    }
  },

  badRequest: (msg) => {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        statusCode: 400,
        error: 'Bad request',
        internalError: msg
      })
    }
  },

  unauthorized: () => {
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        statusCode: 403,
        error: 'Unauthorized'
      })
    }
  }
}
