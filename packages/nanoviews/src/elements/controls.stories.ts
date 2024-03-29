import type { Meta, StoryObj } from '@nanoviews/storybook'
import { fn } from '@storybook/test'
import { nanoStory } from '@nanoviews/storybook'
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
  selected$
} from './controls.js'

type ValueType = string | readonly string[] | boolean | typeof Indeterminate | undefined

const meta: Meta<{
  onChange?(value: ValueType, prevValue: ValueType): void
  value?: string
  values?: string[]
  checked?: boolean | typeof Indeterminate
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
      value.listen(onChange)
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
      value.listen(onChange)
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
      value.listen(onChange)
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
      values.listen(onChange)
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
      checked.listen(onChange)
    }

    return input({
      type: 'checkbox',
      [checked$]: checked
    })
  })
}

