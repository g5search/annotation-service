module.exports = {
  pick,
  reject,
  split
}
/**
 * Picks keys from object
 * @param {Object} obj
 * @param {Array} keys
 * @returns {Object}
 */
function pick(obj, keys) {
  return keys.map(k => k in obj ? { [k]: obj[k] } : {})
    .reduce((res, o) => Object.assign(res, o), {})
}

/**
 * Removes Keys from object
 * @param {Object} obj
 * @param {Array} keys
 * @returns {Object}
 */
function reject(obj, keys) {
  const vkeys = Object.keys(obj)
    .filter(k => !keys.includes(k))
  return pick(obj, vkeys)
}

/**
 * Splits object into two keys: keep, discard
 * @param {Object} obj
 * @param {Array} keys
 * @returns {Object}
 */
function split(obj, group1Keys) {
  const objKeys = Object.keys(obj)
  return objKeys.reduce((prev, cur) => {
    const isKeeper = group1Keys.includes(cur) ? 'group1' : 'group2'
    prev[isKeeper][cur] = obj[cur]
    return prev
  }, { group1: {}, group2: {} })
}
