import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { TextInput } from '../TextInput'
import { FormGroup } from './FormGroup'

const meta: Meta<{
  label: string
  description: string
}> = {
  title: 'UIKit/FormGroup',
  argTypes: {
    label: {
      control: 'text'
    },
    description: {
      control: 'text'
    }
  },
  args: {
    label: 'Job title',
    description: 'As it is written in the job posting'
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render(props) {
    return (
      FormGroup({
        ...props,
        controlId: 'title'
      })(
        TextInput({
          id: 'title',
          placeholder: 'Product manager'
        })
      )
    )
  }
}
