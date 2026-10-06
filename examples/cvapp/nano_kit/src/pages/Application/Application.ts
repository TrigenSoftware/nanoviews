import { signal } from 'nanoviews/store'
import {
  section,
  component$
} from 'nanoviews'
import { ApplicationForm } from '~/blocks/ApplicationForm'
import { ApplicationLetter } from '~/blocks/ApplicationLetter'
import styles from './Application.module.css'

const VIRTUAL_KEYBOARD_HIDE_TIMEOUT = 800

export const Application = component$(() => {
  const $letter = signal<HTMLElement | null>(null)
  const onSubmitCallback = () => {
    setTimeout(() => {
      $letter()?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }, VIRTUAL_KEYBOARD_HIDE_TIMEOUT)
  }

  return section({
    class: styles.root
  })(
    ApplicationForm({
      onSubmit: onSubmitCallback
    }),
    ApplicationLetter({
      ref: $letter
    })
  )
})
