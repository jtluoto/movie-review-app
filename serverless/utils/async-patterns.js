var WaterfallOver = function (list, iterator, callback) {
  // Keep track of the index of the next item to be processed
  var nextItemIndex = 0

  function report (stopIteration = false) {
    nextItemIndex++

    if (stopIteration || nextItemIndex === list.length) {
      callback()
    } else {
      iterator(list[nextItemIndex], report)
    }
  }

  iterator(list[0], report)
}

module.exports.WaterfallOver = WaterfallOver
