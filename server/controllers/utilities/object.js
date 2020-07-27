module.exports = {
  pick,
  reject,
  split,
  group
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
/**
 *
 *
 * @param {*} groups
 * @param {*} obj
 * @returns
 */
function group(groups, obj) {
  const keys = Object.keys(groups)
  if (keys.length > 0) {
    const groupData = {}
    const allGroups = []
    for (let i = 0; i < keys.length; i++) {
      const key = groups[keys[i]]
      for (let j = 0; j < key.length; j++) {
        if (Array.isArray(key[j])) {
          allGroups.push(key[j][0])
        } else {
          allGroups.push(key[j])
        }
      }
      groupData[keys[i]] = pickAndRename(obj, groups[keys[i]])
    }
    const { group2: noGroup } = split(obj, allGroups)
    return {
      ...groupData,
      noGroup
    }
  }
  return Object.keys(groups).map(k => ({ k: {} })).reduce((res, o) => Object.assign(res, o), {})
}
/**
 * Picks keys from object
 * @param {Object} obj
 * @param {Array} keys
 * @returns {Object}
 */
function pickAndRename(obj, keys) {
  return keys.map((k) => {
    if (Array.isArray(k)) {
      return k[0] in obj ? { [k[1]]: obj[k[0]] } : {}
    }
    return k in obj ? { [k]: obj[k] } : {}
  }).reduce((res, o) => Object.assign(res, o), {})
}
