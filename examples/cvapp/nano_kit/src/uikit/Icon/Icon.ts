import {
  type Signalish,
  text
} from 'nanoviews/store'
import { component$ } from 'nanoviews'
import {
  type Attributes,
  svg,
  use
} from 'nanoviews/svg'
import spriteUrl from '~/assets/sprite.svg?no-inline'

export type IconName = 'copy' | 'flower' | 'home' | 'plus' | 'retry' | 'trash' | 'check'

export interface IconProps extends Attributes<'svg'> {
  name: Signalish<IconName>
}

export const Icon = component$(({
  name,
  ...props
}: IconProps) => svg({
  'aria-hidden': 'true',
  ...props
})(
  use({
    href: text`${spriteUrl}#${name}`
  })
))
