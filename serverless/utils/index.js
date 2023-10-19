module.exports = {
  getNowInISOFormat: () => {
    return new Date(Date.now()).toISOString()
  },

  getDateDaysAgoInIsoFormat: (daysAgo) => {
    var dt = new Date(Date.now())
    dt.setDate(dt.getDate() - daysAgo);
    return dt.toISOString()
  },

  getQueryParam: (key, event) => {
    if (event.queryStringParameters &&
          event.queryStringParameters[key]) {
      return event.queryStringParameters[key]
    } else {
      return null
    }
  }
}
