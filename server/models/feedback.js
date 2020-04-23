const { INTEGER, STRING } = require('sequelize')

module.exports = (sequelize) => {
  const feedback = sequelize.define('feedback', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: STRING,
      allowNull: false
    },
    type: {
      type: STRING,
      allowNull: false
    },
    comments: {
      type: STRING,
      allowNull: false
    }
  })
  return feedback
}
