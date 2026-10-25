import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import {
  not,
  pick,
  record,
  signal,
  text
} from 'nanoviews/store'
import { formValidity$ } from '../hooks'
import { Button } from '../Button'
import { FormGroup } from '../FormGroup'
import { TextArea } from '../TextArea'
import { TextInput } from '../TextInput'
import { Form } from './Form'

const MAX_DETAILS_LENGTH = 1200
const meta: Meta = {
  title: 'UIKit/Form'
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render() {
    const $form = signal<HTMLFormElement | null>(null)
    const $data = record(signal({
      title: '',
      details: ''
    }))
    // The submit button waits for every required field
    const $valid = formValidity$($form, $data)
    const onSubmitCallback = (event: Event) => {
      event.preventDefault()
    }

    return (
      Form({
        ref: $form,
        onSubmit: onSubmitCallback
      })(
        FormGroup({
          label: 'Job title',
          controlId: 'title'
        })(
          TextInput({
            id: 'title',
            placeholder: 'Product manager',
            value: $data.$title,
            required: true
          })
        ),
        FormGroup({
          label: 'Additional details',
          controlId: 'details',
          description: text`${pick($data.$details, 'length')}/${MAX_DETAILS_LENGTH}`
        })(
          TextArea({
            id: 'details',
            rows: 6,
            placeholder: 'Describe why you are a great fit or paste your bio',
            maxLength: MAX_DETAILS_LENGTH,
            value: $data.$details,
            required: true,
            'aria-describedby': 'details-description'
          })
        ),
        Button({
          type: 'submit',
          variant: 'primary',
          size: 'lg',
          disabled: not($valid)
        })(
          'Generate Now'
        )
      )
    )
  }
}
