# Models

We currently use Sequelize for our ORM and our schemas are for Postgres databases.

Add files containing table schemas to generate that table in the attached app database.

Extend the functionality of your ORM by adding model `hooks` and `prototypes` in their respective folders.

``` js
// import datatypes from the Sequelize library
const { INTEGER, STRING, TEXT, REAL, JSONB, BOOLEAN, DATE } = require('sequelize)

module.exports = (sequelize) => {
  return sequelize.define('table_name', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    column_name_1: { type: INTEGER },
    column_name_2: { type: STRING },
    column_name_3: { type: DATE }
  })
}
```

## Docs

[Sequelize v5 Documentation](https://sequelize.org/v5/)
