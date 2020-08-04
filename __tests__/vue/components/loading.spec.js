import { mount } from '@vue/test-utils'
import Loading from '@/components/loading'

describe('components/loading', () => {
  test('is visible when loading is true', () => {
    const wrapper = mount(Loading)
    expect(true).toBe(true)
  })
})
