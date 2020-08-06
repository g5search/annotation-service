const models = require('../../../../server/models')
jest.setTimeout(30000)
describe('Annotation Prototypes', () => {
  describe('Update Note', () => {
    test('Where is Provided', async () => {
      try {
        const note = await models.annotation.updateNote(1, {})
        console.log(note)
        expect(note).rejects.toMatch('error')
      } catch (error) {
        console.log(error)
        expect(error).toMatch('error')
      }
    })
  })
})
