const cors = require('cors')
// const axios = require('axios')
// const { Op } = require('sequelize')
const models = require('../../models/primary')
// const objectUtil = require('../../controllers/utilities/object')
const whitelist = [
  /chrome-extension:\/\/[a-z]*$/,
  /http:\/\/localhost:[\d]*/,
  /https:\/\/notes\.g5marketingcloud\.com/
]
// const crsSync = require('../../controllers/jobs/crsSync')
const annCntlr = require('../../controllers/annotation')
const corsOpts = {
  origin: (origin, callback) => {
    if (whitelist.some(pattern => pattern.test(origin)) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

module.exports = (app) => {
  app.options('/api/v1/note', cors(corsOpts))

  // Creates Note
  app.post('/api/v1/note', cors(corsOpts), async (req, res) => {
    try {
      const note = await annCntlr.createNote(req)
      res.json(note)
    } catch (e) {
      res.status(500).send(e.message)
    }
  })

  app.put('/api/v1/note/:id', async (req, res) => {
    const { id } = req.params
    const { body } = req
    const update = await models.annotation.updateNote(id, body)
    res.json(update)
  })

  // Gets Users Notes
  app.get('/api/v1/notes', async (req, res) => {
    const { query } = req
    const notes = await models.annotation.findByQuery(query)
    res.json(notes)
  })

  // Deletes Notes
  app.delete('/api/v1/notes/:id', async (req, res) => {
    try {
      await models.annotation.destroy({
        where: {
          id: req.params.id
        }
      })
      res.sendStatus(200)
    } catch (e) {
      res.status(500).send(e.message)
    }
  })

  // Gets Strategists
  app.get('/api/v1/strategists', async (req, res) => {
    try {
      const strategists = await annCntlr.getStrategists()
      res.json(strategists)
    } catch (e) {
      res.status(400).send(e.message)
    }
  })

  // app.get('/api/v1/crs/sync', async (req, res) => {
  //   const response = await axios.get('http://localhost:3009/api/annotation')
  //   console.log(response)
  //   crsSync(response.data)
  //   res.json(response.data)
  // })
}
