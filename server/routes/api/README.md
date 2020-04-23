# API Route Modules

We've created a semi-automatic methodology for adding routes to this app.

> TODO: Include the directory path in these nested routes. Currently, files in the API folder are handled the same as files in the routes directory.

## New Module File Template

Routes are written for Express.js. Hand the express `app` to the exported function.

``` js

module.exports = (app) => {
  app.get('', () => {})
  app.post('', () => {})
  // etc
}

```
