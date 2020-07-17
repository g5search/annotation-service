module.exports = {
  pick,
  reject,
  split,
  renameKeys,
  groupBy,
  groupByObjectKey,
  tuckPrimaryKey,
  objectToArray,
  arrayToObject,
  chunk,
  nullToFalse,
  nullStringtoNull
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
function split(obj, keys) {
  const objKeys = Object.keys(obj)
  return objKeys.reduce((prev, cur) => {
    const isKeeper = keys.includes(cur) ? 'keep' : 'discard'
    prev[isKeeper][cur] = obj[cur]
    return prev
  }, { keep: {}, discard: {} })
}

/**
 * Renames Keys in object
 * @param {Array} keysMap
 * @param {Object} obj
 * @returns {Object}
 */
function renameKeys(keysMap, obj) {
  return Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || key]: obj[key] }
    }),
    {}
  )
}

/**
 * Groups array of objects by key
 * @param {String} key
 * @param {Array} array
 * @returns {Array}
 */
function groupBy(key, array) {
  return array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key]
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj)
    return objectsByKeyValue
  }, {})
}
/**
 *
 *
 * @param {*} key
 * @param {*} array
 * @returns
 */
function groupByObjectKey(key, array) {
  return array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key]
    objectsByKeyValue[value] = { ...(objectsByKeyValue[value] || {}), ...obj }
    return objectsByKeyValue
  }, {})
}

/**
 * @param {Object} obj
 * @param {String} primaryKeyName
 * @returns
 */
function tuckPrimaryKey(obj, primaryKeyName) {
  const finalArray = []
  const keys = Object.keys(obj)
  keys.forEach((key) => {
    const tucked = {}
    if (typeof obj[key] === 'object') {
      const tuckedKeys = Object.keys(obj[key])
      tucked[primaryKeyName] = key
      tuckedKeys.forEach((tuckedKey) => {
        tucked[tuckedKey] = obj[key][tuckedKey]
      })
    } else {
      tucked[primaryKeyName] = obj[key]
    }
    finalArray.push(tucked)
  })
  return finalArray
}

function objectToArray(data, targetProp) {
  const insert = []
  Object.keys(data).forEach((key) => {
    insert.push(key)
    insert.push(data[key][targetProp])
  })
  return insert
}
/**
 * Create an object with even indexes are keys and odds are values
 *
 * @param {*} arr
 * @returns
 */
function arrayToObject(arr) {
  const obj = {}
  if (!arr) return obj
  for (let i = 0; i < arr.length; i++) {
    const key = arr[i]
    const value = arr[++i]
    obj[key] = value
  }
  return obj
}
/**
 * Chunk an array into smaller arrays
 *
 * @param {*} array
 * @param {*} size
 * @returns
 */
function chunk(array, size) {
  const chunkedArr = []
  let index = 0
  while (index < array.length) {
    chunkedArr.push(array.slice(index, size + index))
    index += size
  }
  return chunkedArr
}

function nullToFalse(data) {
  const returnObject = {}
  Object.keys(data).forEach((key) => {
    const newValue = data[key] == null ? false : data[key]
    returnObject[key] = newValue
  })
  return returnObject
}
function nullStringtoNull(data) {
  const returnObject = {}
  Object.keys(data).forEach((key) => {
    const value = data[key] === 'null' ? null : data[key]
    returnObject[key] = value
  })
  return returnObject
}
