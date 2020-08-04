import { mount } from '@vue/test-utils'
import Octopus from '@/components/icons/octopus.vue'

describe('🐙', () => {
  test('is a Vue component', () => {
    const wrapper = mount(Octopus)
    expect(wrapper.vm).toBeTruthy()
  })

  test('that width defaults to 1em', () => {
    const wrapper = mount(Octopus)
    const width = wrapper.find('svg').element.getAttribute('width')
    expect(width).toBe('1em')
  })

  test('that path fill defaults to "currentColor"', () => {
    const wrapper = mount(Octopus)
    const color = wrapper.find('path').element.getAttribute('fill')
    expect(color).toBe('currentColor')
  })
})
