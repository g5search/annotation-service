const cors = require('cors')
const axios = require('axios')
const models = require('../../models')
const whitelist = [
  /chrome-extension:\/\/[a-z]*$/,
  /http:\/\/localhost:[\d]*/,
  /https:\/\/notes\.g5marketingcloud\.com/
]
const crsSync = require('../../controllers/jobs/crsSync')
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

  // Updates Note
  app.put('/api/v1/note/:id', (req, res) => {
    try {
      annCntlr.updateNote(req, res)
    } catch (e) {
      res.status(500).send(e.message)
    }
  })

  // Gets Users Notes
  app.get('/api/v1/notes', async (req, res) => {
    try {
      const mappedNotes = await annCntlr.getNotes(req, res)
      res.json(mappedNotes)
    } catch (e) {
      res.status(400).send(e.message)
    }
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

  app.get('/api/v1/crs/sync', async (req, res) => {
    const response = await axios.get('http://localhost:9541/api/annotation')
    crsSync(response.data)
    res.json(response.data)
  })
}
