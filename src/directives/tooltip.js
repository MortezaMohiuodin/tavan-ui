import app from '../main'
import { createVNode, render } from 'vue'
import { VTooltip } from 'vuetify/components/VTooltip'


let tooltips = []

const tooltip = {
  beforeUnmount: (el, binding) => {
    const tooltip = tooltips.find(tooltip => tooltip.el === el)
    if (tooltip) {
      render(null, el)
    }
  },
  mounted: (el, binding) => {
    const { value, modifiers } = binding
    const { start = false, bottom = false, end = false } = modifiers

    let location = 'top'
    if (start) location = 'left'
    else if (end) location = 'right'
    else if (bottom) location = 'bottom'

    /**
     * applies `cursor: help` on the hovered element if no cursor logic is applied
     */
    // if (!el.className.match(/cursor-/) && !el.style.cursor) el.style.cursor = 'help'
    let vNode = createVNode(
      VTooltip,
      {
        activator: el,
        location,
        maxWidth : 400,
        openDelay : 1000,
        contentClass : 'tw-text-sm tw-text-justify tw-rtl !tw-p-3 !tw-leading-relaxed',
      },
      () => [value],
    )

    vNode.appContext = app._context
    render(vNode, el)

    tooltips.push({ el })
  },
}

export default tooltip
