import swaggerAutogen from 'swagger-autogen'

const doc = {
  info: {
    title: 'Blogging API',
    description: 'Proyecto final modulo 2 (Funval)'
  },
  host: 'localhost:3000'
}

const outputFile = './swagger-output.json'
const routes = ['./src/index.js']

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc)
