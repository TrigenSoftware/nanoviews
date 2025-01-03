import type { Meta, StoryObj } from '@nanoviews/storybook'
import { fn } from '@storybook/test'
import { nanoStory } from '@nanoviews/storybook'
import { listen } from 'kida'
import {
  input,
  textarea,
  select,
  option
} from './elements.js'
import {
  value$,
  Indeterminate,
  checked$,
  selected$,
  files$
} from './controls.js'

const meta: Meta<{
  onChange?(value: unknown, prevValue: unknown): void
  value?: string
  values?: string[]
  checked?: boolean | typeof Indeterminate
  files?: File[]
}> = {
  title: 'Elements/Effect Attributes/Controls'
}

export default meta

type Story = StoryObj<typeof meta>

export const TextInput: Story = {
  args: {
    onChange: fn(),
    value: 'Hello, world!'
  },
  render: nanoStory(({ onChange, value }) => {
    if (onChange && value) {
      listen(value, onChange)
    }

    return input({
      type: 'text',
      [value$]: value
    })
  })
}

export const Textarea: Story = {
  args: {
    onChange: fn(),
    value: 'Hello, world!'
  },
  render: nanoStory(({ onChange, value }) => {
    if (onChange && value) {
      listen(value, onChange)
    }

    return textarea({
      [value$]: value
    })()
  })
}

export const Select: Story = {
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
  render: nanoStory(({ onChange, value }) => {
    if (onChange && value) {
      listen(value, onChange)
    }

    return select({
      [selected$]: value
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
  })
}

export const MultipleSelect: Story = {
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
  render: nanoStory(({ onChange, values }) => {
    if (onChange && values) {
      listen(values, onChange)
    }

    return select({
      [selected$]: values
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
  })
}

export const Checkbox: Story = {
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
  render: nanoStory(({ onChange, checked }) => {
    if (onChange && checked) {
      listen(checked, onChange)
    }

    return input({
      type: 'checkbox',
      [checked$]: checked
    })
  })
}

export const Files: Story = {
  args: {
    onChange: fn(),
    files: []
  },
  render: nanoStory(({ onChange, files }) => {
    if (onChange && files) {
      listen(files, onChange)
    }

    return input({
      type: 'file',
      [files$]: files
    })
  })
}
