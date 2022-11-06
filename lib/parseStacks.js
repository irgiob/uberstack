const groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const parseStacks = function(yabaiData) {
  // get all windows in current space grouped by stack
  const data = groupBy(
    JSON.parse(yabaiData)
      .filter(x => !x['is-minimized'] || x.frame.w != 1 || !x['is-visible'])
      .map(x => ({ ...x, stack: JSON.stringify(x.frame) })),
    'stack'
  )

  // filter out all stacks of one
  const stacks = Object.keys(data)
    .filter((key) => data[key].length > 1)
    .reduce((obj, key) => {
        return Object.assign(obj, {
          [key]: data[key]
        })
  }, {})

  return stacks
}

export default parseStacks