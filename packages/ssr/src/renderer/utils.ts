import type { HeadDescriptor } from '@nano_kit/router'
import {
  type EmptyValue,
  get,
  isEmpty
} from '@nano_kit/store'

export function headDescriptorToHtml(descriptor: HeadDescriptor): string {
  const { tag } = descriptor
  let html = ''
  let code = ''

  if ('props' in descriptor) {
    html = `<${tag}`

    Object.entries(descriptor.props).forEach(([key, value]) => {
      const resolvedValue = get(value) as string | boolean | EmptyValue

      if (!isEmpty(resolvedValue)) {
        if (key === 'code') {
          code = String(resolvedValue)
        } else {
          html += ` ${key.toLowerCase()}="${String(resolvedValue).replace(/"/g, '\\"')}"`
        }
      }
    })

    html += ' />'

    if (tag === 'script') {
      html += `${code}</${tag}>`
    }
  }

  return html
}
