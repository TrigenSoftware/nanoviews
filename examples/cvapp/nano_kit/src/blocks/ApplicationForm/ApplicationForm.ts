import {
  and,
  computed,
  not,
  or,
  record,
  signal,
  text,
  when,
  pick
} from 'nanoviews/store'
import {
  h1,
  component$,
  effect$,
  if_
} from 'nanoviews'
import { abort } from '@nano_kit/query'
import type { ApplicationDraft } from '~/services/application.types'
import typography from '~/uikit/typography.module.css'
import { MAX_DETAILS_LENGTH } from '~/constants'
import { formValidity$ } from '~/uikit/hooks'
import { Button } from '~/uikit/Button'
import {
  type FormProps,
  Form
} from '~/uikit/Form'
import { SubHeader } from '~/uikit/SubHeader'
import { FormGroup } from '~/uikit/FormGroup'
import { TextArea } from '~/uikit/TextArea'
import { TextInput } from '~/uikit/TextInput'
import { ErrorMessage } from '~/uikit/ErrorMessage'
import { navigation } from '~/stores/router'
import {
  $currentApplication,
  $upsertApplicationError,
  $upsertApplicationLoading,
  upsertApplication
} from '~/stores/application'
import { shouldPreventTransition } from './utils'
import styles from './ApplicationForm.module.css'

export interface ApplicationFormProps extends Omit<FormProps, 'onSubmit'> {
  onSubmit?: () => void
}

const EMPTY_DRAFT = {
  title: '',
  company: '',
  skills: '',
  details: '',
  letter: ''
}

export const ApplicationForm = component$(({
  class: className,
  onSubmit,
  ...props
}: ApplicationFormProps) => {
  const $form = signal<HTMLFormElement | null>(null)
  const $formData = record(signal<ApplicationDraft>(EMPTY_DRAFT))
  const $isValid = formValidity$($form, $formData)
  const $title = computed(() => [$formData.$title(), $formData.$company()].filter(v => v.trim()).join(', '))
  let upsertTask: Promise<unknown> | null = null
  const onSubmitCallback = (event: Event) => {
    event.preventDefault()

    if (!$upsertApplicationLoading()) {
      onSubmit?.()
      upsertTask = upsertApplication($formData())
    }
  }

  effect$(() => {
    $formData($currentApplication() ?? EMPTY_DRAFT)
  })

  effect$(() => {
    const originalTransition = navigation.transition
    // Read when asked, so the guard is set once
    const shouldPrevent = () => $upsertApplicationLoading() || shouldPreventTransition($currentApplication(), $formData())

    navigation.transition = (proceed, nextLocation, prevLocation) => {
      if (
        prevLocation.route === 'newApplication' && nextLocation?.route === 'application'
        || !shouldPrevent()
        // oxlint-disable-next-line eslint/no-alert
        || confirm('You have unsaved changes. Are you sure you want to leave this page?')
      ) {
        if (upsertTask) {
          abort(upsertTask)
        }

        proceed(nextLocation)
      }
    }

    window.onbeforeunload = (event) => {
      if (shouldPrevent()) {
        event.preventDefault()
        // oxlint-disable-next-line typescript/no-deprecated
        event.returnValue = ''
      }
    }

    return () => {
      navigation.transition = originalTransition
      window.onbeforeunload = null
    }
  })

  return Form({
    'ref': $form,
    'class': [styles.root, className],
    'onSubmit': onSubmitCallback,
    'aria-busy': $upsertApplicationLoading,
    ...props
  })(
    SubHeader({
      title: h1({
        class: [typography.h2, and(not($title), styles.titlePlaceholder)]
      })(
        or($title, 'New application')
      )
    }),
    FormGroup({
      label: 'Job title',
      controlId: 'title'
    })(
      TextInput({
        id: 'title',
        name: 'title',
        placeholder: 'Product manager',
        maxLength: 25,
        value: $formData.$title,
        required: true,
        autoComplete: 'on'
      })
    ),
    FormGroup({
      label: 'Company',
      controlId: 'company'
    })(
      TextInput({
        id: 'company',
        name: 'company',
        placeholder: 'Apple',
        maxLength: 25,
        value: $formData.$company,
        required: true,
        autoComplete: 'on'
      })
    ),
    FormGroup({
      label: 'I am good at...',
      controlId: 'skills'
    })(
      TextInput({
        id: 'skills',
        name: 'skills',
        placeholder: 'HTML, CSS and doing things in time',
        maxLength: 50,
        value: $formData.$skills,
        required: true,
        autoComplete: 'on'
      })
    ),
    FormGroup({
      label: 'Additional details',
      controlId: 'details',
      description: text`${pick($formData.$details, 'length')}/${MAX_DETAILS_LENGTH}`
    })(
      TextArea({
        'class': styles.textarea,
        'id': 'details',
        'name': 'details',
        'placeholder': 'Describe why you are a great fit or paste your bio',
        'maxLength': MAX_DETAILS_LENGTH,
        'value': $formData.$details,
        'required': true,
        'autoComplete': 'on',
        'aria-describedby': 'details-description'
      })
    ),
    Button({
      type: 'submit',
      variant: () => ($formData.$id() ? 'default' : 'primary'),
      size: 'lg',
      disabled: not($isValid),
      icon: when($upsertApplicationLoading, 'flower', when($formData.$id, 'retry'))
    })(
      when($upsertApplicationLoading, null, when($formData.$id, 'Try Again', 'Generate Now'))
    ),
    if_($upsertApplicationError)(
      $error => ErrorMessage()(
        $error
      )
    )
  )
})
