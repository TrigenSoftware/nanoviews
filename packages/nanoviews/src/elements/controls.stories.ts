import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { fn } from 'storybook/test'
import { effect$ } from '../component/effect.js'
import { for_ } from '../flow/for.js'
import {
  Indeterminate,
  input,
  textarea,
  select,
  option
} from './controls.js'

const meta: Meta<{
  value?: string
  values?: string[]
  options?: string[]
  checked?: boolean | typeof Indeterminate
  files?: File[]
  onChange?(value: unknown): void
}> = {
  title: 'Elements/Controls'
}

export default meta

export const TextInput: StoryObj<{
  value: string
  onChange(value: unknown): void
}> = {
  args: {
    onChange: fn(),
    value: 'Hello, world!'
  },
  render({ onChange, value }) {
    if (onChange && value) {
      effect$((warmup) => {
        const v = value()

        if (!warmup) {
          onChange(v)
        }
      })
    }

    return (
      input({
        type: 'text',
        value
      })
    )
  }
}

export const Textarea: StoryObj<{
  value: string
  onChange(value: unknown): void
}> = {
  args: {
    onChange: fn(),
    value: 'Hello, world!'
  },
  render({ onChange, value }) {
    if (onChange && value) {
      effect$((warmup) => {
        const v = value()

        if (!warmup) {
          onChange(v)
        }
      })
    }

    return (
      textarea({
        value
      })()
    )
  }
}

export const Select: StoryObj<{
  value: string
  onChange(value: unknown): void
}> = {
  argTypes: {
    value: {
      control: 'radio',
      options: [
        'red',
        'green',
        'blue'
      ]
    }
  },
  args: {
    onChange: fn(),
    value: 'green'
  },
  render({ onChange, value }) {
    if (onChange && value) {
      effect$((warmup) => {
        const v = value()

        if (!warmup) {
          onChange(v)
        }
      })
    }

    return (
      select({
        value
      })(
        option({
          value: 'red'
        })('Red'),
        option({
          value: 'green'
        })('Green'),
        option({
          value: 'blue'
        })('Blue')
      )
    )
  }
}

export const MultipleSelect: StoryObj<{
  values: string[]
  onChange(value: unknown): void
}> = {
  argTypes: {
    values: {
      control: 'check',
      options: [
        'red',
        'green',
        'blue'
      ]
    }
  },
  args: {
    onChange: fn(),
    values: ['green']
  },
  render({ onChange, values }) {
    if (onChange && values) {
      effect$((warmup) => {
        const v = values()

        if (!warmup) {
          onChange(v)
        }
      })
    }

    return (
      select({
        multiple: true,
        value: values
      })(
        option({
          value: 'red'
        })('Red'),
        option({
          value: 'green'
        })('Green'),
        option({
          value: 'blue'
        })('Blue')
      )
    )
  }
}

export const DynamicOptions: StoryObj<{
  value: string
  options: string[]
  onChange(value: unknown): void
}> = {
  args: {
    onChange: fn(),
    value: 'green',
    options: [
      'red',
      'green',
      'blue'
    ]
  },
  render({ onChange, value, options }) {
    if (onChange && value) {
      effect$((warmup) => {
        const v = value()

        if (!warmup) {
          onChange(v)
        }
      })
    }

    return (
      select({
        value
      })(
        for_(options)($color => option({
          value: $color
        })($color))
      )
    )
  }
}

export const Checkbox: StoryObj<{
  checked: boolean | typeof Indeterminate
  onChange(value: unknown): void
}> = {
  argTypes: {
    checked: {
      control: 'inline-radio',
      options: [
        true,
        false,
        Indeterminate
      ]
    }
  },
  args: {
    onChange: fn(),
    checked: true
  },
  render({ onChange, checked }) {
    if (onChange && checked) {
      effect$((warmup) => {
        const v = checked()

        if (!warmup) {
          onChange(v)
        }
      })
    }

    return (
      input({
        type: 'checkbox',
        checked
      })
    )
  }
}

export const Files: StoryObj<{
  files: File[]
  onChange(value: unknown): void
}> = {
  args: {
    onChange: fn(),
    files: []
  },
  render({ onChange, files }) {
    if (onChange && files) {
      effect$((warmup) => {
        const v = files()

        if (!warmup) {
          onChange(v)
        }
      })
    }

    return (
      input({
        type: 'file',
        value: files
      })
    )
  }
}
