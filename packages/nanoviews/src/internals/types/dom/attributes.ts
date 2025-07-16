import type * as CSS from 'csstype'
import type {
  ValueOrSignal,
  EmptyValue
} from '../common.js'
import type {
  Booleanish,
  CrossOrigin
} from './common.js'
import type {
  AriaRole,
  AriaAttributes
} from './aria.js'
import type {
  DOMAttributes,
  TargetEventHandler,
  ChangeEventHandler
} from './events.js'

export interface CSSProperties extends CSS.Properties<string | number> {
  /**
   * The index signature was removed to enable closed typing for style
   * using CSSType. You're able to use type assertion or module augmentation
   * to add properties or an index signature of your own.
   *
   * For examples and more information, visit:
   * https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
   */
}

export interface HTMLAttributes<T extends Node = Node> extends AriaAttributes, DOMAttributes<T> {
  // React-specific Attributes
  defaultChecked?: ValueOrSignal<boolean | EmptyValue>
  defaultValue?: ValueOrSignal<string | number | readonly string[] | EmptyValue>
  suppressContentEditableWarning?: ValueOrSignal<boolean | EmptyValue>
  suppressHydrationWarning?: ValueOrSignal<boolean | EmptyValue>

  // Standard HTML Attributes
  accessKey?: ValueOrSignal<string | EmptyValue>
  autoFocus?: ValueOrSignal<boolean | EmptyValue>
  class?: ValueOrSignal<string | EmptyValue>
  contentEditable?: ValueOrSignal<Booleanish | 'inherit' | 'plaintext-only' | EmptyValue>
  contextMenu?: ValueOrSignal<string | EmptyValue>
  dir?: ValueOrSignal<string | EmptyValue>
  draggable?: ValueOrSignal<Booleanish | EmptyValue>
  hidden?: ValueOrSignal<boolean | EmptyValue>
  id?: ValueOrSignal<string | EmptyValue>
  lang?: ValueOrSignal<string | EmptyValue>
  nonce?: ValueOrSignal<string | EmptyValue>
  slot?: ValueOrSignal<string | EmptyValue>
  spellCheck?: ValueOrSignal<Booleanish | EmptyValue>
  style?: ValueOrSignal<string | EmptyValue>
  tabIndex?: ValueOrSignal<number | EmptyValue>
  title?: ValueOrSignal<string | EmptyValue>
  translate?: ValueOrSignal<'yes' | 'no' | EmptyValue>

  // Unknown
  radioGroup?: ValueOrSignal<string | EmptyValue> // <command>, <menuitem>

  // WAI-ARIA
  role?: ValueOrSignal<AriaRole | EmptyValue>

  // RDFa Attributes
  about?: ValueOrSignal<string | EmptyValue>
  content?: ValueOrSignal<string | EmptyValue>
  datatype?: ValueOrSignal<string | EmptyValue>
  inlist?: ValueOrSignal<any>
  prefix?: ValueOrSignal<string | EmptyValue>
  property?: ValueOrSignal<string | EmptyValue>
  rel?: ValueOrSignal<string | EmptyValue>
  resource?: ValueOrSignal<string | EmptyValue>
  rev?: ValueOrSignal<string | EmptyValue>
  typeof?: ValueOrSignal<string | EmptyValue>
  vocab?: ValueOrSignal<string | EmptyValue>

  // Non-standard Attributes
  autoCapitalize?: ValueOrSignal<string | EmptyValue>
  autoCorrect?: ValueOrSignal<string | EmptyValue>
  autoSave?: ValueOrSignal<string | EmptyValue>
  color?: ValueOrSignal<string | EmptyValue>
  itemProp?: ValueOrSignal<string | EmptyValue>
  itemScope?: ValueOrSignal<boolean | EmptyValue>
  itemType?: ValueOrSignal<string | EmptyValue>
  itemID?: ValueOrSignal<string | EmptyValue>
  itemRef?: ValueOrSignal<string | EmptyValue>
  results?: ValueOrSignal<number | EmptyValue>
  security?: ValueOrSignal<string | EmptyValue>
  unselectable?: ValueOrSignal<'on' | 'off' | EmptyValue>

  // Living Standard
  /**
   * Hints at the type of data that might be entered by the user while editing the element or its contents
   * @see {@link https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute}
   */
  inputMode?: ValueOrSignal<'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search' | EmptyValue>
  /**
   * Specify that a standard HTML element should behave like a defined custom built-in element
   * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is}
   */
  is?: ValueOrSignal<string | EmptyValue>

  /**
   * Data attributes
   */
  [key: `data-${string}`]: ValueOrSignal<unknown>
}

export type HTMLAttributeReferrerPolicy =
  | ''
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url'

export type HTMLAttributeAnchorTarget =
  | '_self'
  | '_blank'
  | '_parent'
  | '_top'
  | string & {}

export interface AnchorHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  download?: ValueOrSignal<any>
  href?: ValueOrSignal<string | EmptyValue>
  hrefLang?: ValueOrSignal<string | EmptyValue>
  media?: ValueOrSignal<string | EmptyValue>
  ping?: ValueOrSignal<string | EmptyValue>
  target?: ValueOrSignal<HTMLAttributeAnchorTarget | EmptyValue>
  type?: ValueOrSignal<string | EmptyValue>
  referrerPolicy?: ValueOrSignal<HTMLAttributeReferrerPolicy | EmptyValue>
}

export interface AudioHTMLAttributes<T extends HTMLElement> extends MediaHTMLAttributes<T> {}

export interface AreaHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  alt?: ValueOrSignal<string | EmptyValue>
  coords?: ValueOrSignal<string | EmptyValue>
  download?: ValueOrSignal<any>
  href?: ValueOrSignal<string | EmptyValue>
  hrefLang?: ValueOrSignal<string | EmptyValue>
  media?: ValueOrSignal<string | EmptyValue>
  referrerPolicy?: ValueOrSignal<HTMLAttributeReferrerPolicy | EmptyValue>
  shape?: ValueOrSignal<string | EmptyValue>
  target?: ValueOrSignal<string | EmptyValue>
}

export interface BaseHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  href?: ValueOrSignal<string | EmptyValue>
  target?: ValueOrSignal<string | EmptyValue>
}

export interface BlockquoteHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  cite?: ValueOrSignal<string | EmptyValue>
}

export interface ButtonHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  disabled?: ValueOrSignal<boolean | EmptyValue>
  form?: ValueOrSignal<string | EmptyValue>
  formAction?: ValueOrSignal<string | EmptyValue>
  formEncType?: ValueOrSignal<string | EmptyValue>
  formMethod?: ValueOrSignal<string | EmptyValue>
  formNoValidate?: ValueOrSignal<boolean | EmptyValue>
  formTarget?: ValueOrSignal<string | EmptyValue>
  name?: ValueOrSignal<string | EmptyValue>
  type?: ValueOrSignal<'submit' | 'reset' | 'button' | EmptyValue>
  value?: ValueOrSignal<string | readonly string[] | number | EmptyValue>
}

export interface CanvasHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  height?: ValueOrSignal<number | string | EmptyValue>
  width?: ValueOrSignal<number | string | EmptyValue>
}

export interface ColHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  span?: ValueOrSignal<number | EmptyValue>
  width?: ValueOrSignal<number | string | EmptyValue>
}

export interface ColgroupHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  span?: ValueOrSignal<number | EmptyValue>
}

export interface DataHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  value?: ValueOrSignal<string | readonly string[] | number | EmptyValue>
}

export interface DetailsHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  open?: ValueOrSignal<boolean | EmptyValue>
  onToggle?: TargetEventHandler<T> | EmptyValue
  name?: ValueOrSignal<string | EmptyValue>
}

export interface DelHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  cite?: ValueOrSignal<string | EmptyValue>
  dateTime?: ValueOrSignal<string | EmptyValue>
}

export interface DialogHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  onCancel?: TargetEventHandler<T> | EmptyValue
  onClose?: TargetEventHandler<T> | EmptyValue
  open?: ValueOrSignal<boolean | EmptyValue>
}

export interface EmbedHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  height?: ValueOrSignal<number | string | EmptyValue>
  src?: ValueOrSignal<string | EmptyValue>
  type?: ValueOrSignal<string | EmptyValue>
  width?: ValueOrSignal<number | string | EmptyValue>
}

export interface FieldsetHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  disabled?: ValueOrSignal<boolean | EmptyValue>
  form?: ValueOrSignal<string | EmptyValue>
  name?: ValueOrSignal<string | EmptyValue>
}

export interface FormHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  acceptCharset?: ValueOrSignal<string | EmptyValue>
  action?: ValueOrSignal<string | EmptyValue>
  autoComplete?: ValueOrSignal<string | EmptyValue>
  encType?: ValueOrSignal<string | EmptyValue>
  method?: ValueOrSignal<string | EmptyValue>
  name?: ValueOrSignal<string | EmptyValue>
  noValidate?: ValueOrSignal<boolean | EmptyValue>
  target?: ValueOrSignal<string | EmptyValue>
}

export interface HtmlHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  manifest?: ValueOrSignal<string | EmptyValue>
}

export interface IframeHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  allow?: ValueOrSignal<string | EmptyValue>
  allowFullScreen?: ValueOrSignal<boolean | EmptyValue>
  allowTransparency?: ValueOrSignal<boolean | EmptyValue>
  /** @deprecated */
  frameBorder?: ValueOrSignal<number | string | EmptyValue>
  height?: ValueOrSignal<number | string | EmptyValue>
  loading?: ValueOrSignal<'eager' | 'lazy' | EmptyValue>
  /** @deprecated */
  marginHeight?: ValueOrSignal<number | EmptyValue>
  /** @deprecated */
  marginWidth?: ValueOrSignal<number | EmptyValue>
  name?: ValueOrSignal<string | EmptyValue>
  referrerPolicy?: ValueOrSignal<HTMLAttributeReferrerPolicy | EmptyValue>
  sandbox?: ValueOrSignal<string | EmptyValue>
  /** @deprecated */
  scrolling?: ValueOrSignal<string | EmptyValue>
  seamless?: ValueOrSignal<boolean | EmptyValue>
  src?: ValueOrSignal<string | EmptyValue>
  srcDoc?: ValueOrSignal<string | EmptyValue>
  width?: ValueOrSignal<number | string | EmptyValue>
}

export interface ImgHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  alt?: ValueOrSignal<string | EmptyValue>
  crossOrigin?: ValueOrSignal<CrossOrigin>
  decoding?: ValueOrSignal<'async' | 'auto' | 'sync' | EmptyValue>
  fetchPriority?: ValueOrSignal<'high' | 'low' | 'auto'>
  height?: ValueOrSignal<number | string | EmptyValue>
  loading?: ValueOrSignal<'eager' | 'lazy' | EmptyValue>
  referrerPolicy?: ValueOrSignal<HTMLAttributeReferrerPolicy | EmptyValue>
  sizes?: ValueOrSignal<string | EmptyValue>
  src?: ValueOrSignal<string | EmptyValue>
  srcSet?: ValueOrSignal<string | EmptyValue>
  useMap?: ValueOrSignal<string | EmptyValue>
  width?: ValueOrSignal<number | string | EmptyValue>
}

export interface InsHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  cite?: ValueOrSignal<string | EmptyValue>
  dateTime?: ValueOrSignal<string | EmptyValue>
}

export type HTMLInputTypeAttribute =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week'
  | string & {}

export type AutoFillAddressKind = 'billing' | 'shipping'
export type AutoFillBase = '' | 'off' | 'on'
export type AutoFillContactField =
  | 'email'
  | 'tel'
  | 'tel-area-code'
  | 'tel-country-code'
  | 'tel-extension'
  | 'tel-local'
  | 'tel-local-prefix'
  | 'tel-local-suffix'
  | 'tel-national'
export type AutoFillContactKind = 'home' | 'mobile' | 'work'
export type AutoFillCredentialField = 'webauthn'
export type AutoFillNormalField =
  | 'additional-name'
  | 'address-level1'
  | 'address-level2'
  | 'address-level3'
  | 'address-level4'
  | 'address-line1'
  | 'address-line2'
  | 'address-line3'
  | 'bday-day'
  | 'bday-month'
  | 'bday-year'
  | 'cc-csc'
  | 'cc-exp'
  | 'cc-exp-month'
  | 'cc-exp-year'
  | 'cc-family-name'
  | 'cc-given-name'
  | 'cc-name'
  | 'cc-number'
  | 'cc-type'
  | 'country'
  | 'country-name'
  | 'current-password'
  | 'family-name'
  | 'given-name'
  | 'honorific-prefix'
  | 'honorific-suffix'
  | 'name'
  | 'new-password'
  | 'one-time-code'
  | 'organization'
  | 'postal-code'
  | 'street-address'
  | 'transaction-amount'
  | 'transaction-currency'
  | 'username'
export type OptionalPrefixToken<T extends string> = `${T} ` | ''
export type OptionalPostfixToken<T extends string> = ` ${T}` | ''
export type AutoFillField = AutoFillNormalField | `${OptionalPrefixToken<AutoFillContactKind>}${AutoFillContactField}`
export type AutoFillSection = `section-${string}`
export type AutoFill =
  | AutoFillBase
  | `${OptionalPrefixToken<AutoFillSection>}${OptionalPrefixToken<
      AutoFillAddressKind
  >}${AutoFillField}${OptionalPostfixToken<AutoFillCredentialField>}`
export type HTMLInputAutoCompleteAttribute = AutoFill | string & {}

export interface InputHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  accept?: ValueOrSignal<string | EmptyValue>
  alt?: ValueOrSignal<string | EmptyValue>
  autoComplete?: ValueOrSignal<HTMLInputAutoCompleteAttribute | EmptyValue>
  capture?: ValueOrSignal<boolean | 'user' | 'environment' | EmptyValue> // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
  checked?: ValueOrSignal<boolean | EmptyValue>
  disabled?: ValueOrSignal<boolean | EmptyValue>
  enterKeyHint?: ValueOrSignal<'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send' | EmptyValue>
  form?: ValueOrSignal<string | EmptyValue>
  formAction?: ValueOrSignal<string | EmptyValue>
  formEncType?: ValueOrSignal<string | EmptyValue>
  formMethod?: ValueOrSignal<string | EmptyValue>
  formNoValidate?: ValueOrSignal<boolean | EmptyValue>
  formTarget?: ValueOrSignal<string | EmptyValue>
  height?: ValueOrSignal<number | string | EmptyValue>
  list?: ValueOrSignal<string | EmptyValue>
  max?: ValueOrSignal<number | string | EmptyValue>
  maxLength?: ValueOrSignal<number | EmptyValue>
  min?: ValueOrSignal<number | string | EmptyValue>
  minLength?: ValueOrSignal<number | EmptyValue>
  multiple?: ValueOrSignal<boolean | EmptyValue>
  name?: ValueOrSignal<string | EmptyValue>
  pattern?: ValueOrSignal<string | EmptyValue>
  placeholder?: ValueOrSignal<string | EmptyValue>
  readOnly?: ValueOrSignal<boolean | EmptyValue>
  required?: ValueOrSignal<boolean | EmptyValue>
  size?: ValueOrSignal<number | EmptyValue>
  src?: ValueOrSignal<string | EmptyValue>
  step?: ValueOrSignal<number | string | EmptyValue>
  type?: ValueOrSignal<HTMLInputTypeAttribute | EmptyValue>
  value?: ValueOrSignal<string | readonly string[] | number | EmptyValue>
  width?: ValueOrSignal<number | string | EmptyValue>

  onChange?: ChangeEventHandler<T> | undefined
}

export interface KeygenHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  challenge?: ValueOrSignal<string | EmptyValue>
  disabled?: ValueOrSignal<boolean | EmptyValue>
  form?: ValueOrSignal<string | EmptyValue>
  keyType?: ValueOrSignal<string | EmptyValue>
  keyParams?: ValueOrSignal<string | EmptyValue>
  name?: ValueOrSignal<string | EmptyValue>
}

export interface LabelHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  form?: ValueOrSignal<string | EmptyValue>
  for?: ValueOrSignal<string | EmptyValue>
}

export interface LiHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  value?: ValueOrSignal<string | readonly string[] | number | EmptyValue>
}

export interface LinkHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  as?: ValueOrSignal<string | EmptyValue>
  crossOrigin?: ValueOrSignal<CrossOrigin>
  fetchPriority?: ValueOrSignal<'high' | 'low' | 'auto'>
  href?: ValueOrSignal<string | EmptyValue>
  hrefLang?: ValueOrSignal<string | EmptyValue>
  integrity?: ValueOrSignal<string | EmptyValue>
  media?: ValueOrSignal<string | EmptyValue>
  imageSrcSet?: ValueOrSignal<string | EmptyValue>
  imageSizes?: ValueOrSignal<string | EmptyValue>
  referrerPolicy?: ValueOrSignal<HTMLAttributeReferrerPolicy | EmptyValue>
  sizes?: ValueOrSignal<string | EmptyValue>
  type?: ValueOrSignal<string | EmptyValue>
  charSet?: ValueOrSignal<string | EmptyValue>
}

export interface MapHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  name?: ValueOrSignal<string | EmptyValue>
}

export interface MenuHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  type?: ValueOrSignal<string | EmptyValue>
}

export interface MediaHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  autoPlay?: ValueOrSignal<boolean | EmptyValue>
  controls?: ValueOrSignal<boolean | EmptyValue>
  controlsList?: ValueOrSignal<string | EmptyValue>
  crossOrigin?: ValueOrSignal<CrossOrigin>
  loop?: ValueOrSignal<boolean | EmptyValue>
  mediaGroup?: ValueOrSignal<string | EmptyValue>
  muted?: ValueOrSignal<boolean | EmptyValue>
  playsInline?: ValueOrSignal<boolean | EmptyValue>
  preload?: ValueOrSignal<string | EmptyValue>
  src?: ValueOrSignal<string | EmptyValue>
}

export interface MetaHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  charSet?: ValueOrSignal<string | EmptyValue>
  content?: ValueOrSignal<string | EmptyValue>
  httpEquiv?: ValueOrSignal<string | EmptyValue>
  media?: ValueOrSignal<string | EmptyValue>
  name?: ValueOrSignal<string | EmptyValue>
}

export interface MeterHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  form?: ValueOrSignal<string | EmptyValue>
  high?: ValueOrSignal<number | EmptyValue>
  low?: ValueOrSignal<number | EmptyValue>
  max?: ValueOrSignal<number | string | EmptyValue>
  min?: ValueOrSignal<number | string | EmptyValue>
  optimum?: ValueOrSignal<number | EmptyValue>
  value?: ValueOrSignal<string | readonly string[] | number | EmptyValue>
}

export interface QuoteHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  cite?: ValueOrSignal<string | EmptyValue>
}

export interface ObjectHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  classID?: ValueOrSignal<string | EmptyValue>
  data?: ValueOrSignal<string | EmptyValue>
  form?: ValueOrSignal<string | EmptyValue>
  height?: ValueOrSignal<number | string | EmptyValue>
  name?: ValueOrSignal<string | EmptyValue>
  type?: ValueOrSignal<string | EmptyValue>
  useMap?: ValueOrSignal<string | EmptyValue>
  width?: ValueOrSignal<number | string | EmptyValue>
  wmode?: ValueOrSignal<string | EmptyValue>
}

export interface OlHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  reversed?: ValueOrSignal<boolean | EmptyValue>
  start?: ValueOrSignal<number | EmptyValue>
  type?: ValueOrSignal<'1' | 'a' | 'A' | 'i' | 'I' | EmptyValue>
}

export interface OptgroupHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  disabled?: ValueOrSignal<boolean | EmptyValue>
  label?: ValueOrSignal<string | EmptyValue>
}

export interface OptionHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  disabled?: ValueOrSignal<boolean | EmptyValue>
  label?: ValueOrSignal<string | EmptyValue>
  selected?: ValueOrSignal<boolean | EmptyValue>
  value?: ValueOrSignal<string | readonly string[] | number | EmptyValue>
}

export interface OutputHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  form?: ValueOrSignal<string | EmptyValue>
  for?: ValueOrSignal<string | EmptyValue>
  name?: ValueOrSignal<string | EmptyValue>
}

export interface ParamHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  name?: ValueOrSignal<string | EmptyValue>
  value?: ValueOrSignal<string | readonly string[] | number | EmptyValue>
}

export interface ProgressHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  max?: ValueOrSignal<number | string | EmptyValue>
  value?: ValueOrSignal<string | readonly string[] | number | EmptyValue>
}

export interface SlotHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  name?: ValueOrSignal<string | EmptyValue>
}

export interface ScriptHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  async?: ValueOrSignal<boolean | EmptyValue>
  /** @deprecated */
  charSet?: ValueOrSignal<string | EmptyValue>
  crossOrigin?: ValueOrSignal<CrossOrigin>
  defer?: ValueOrSignal<boolean | EmptyValue>
  integrity?: ValueOrSignal<string | EmptyValue>
  noModule?: ValueOrSignal<boolean | EmptyValue>
  referrerPolicy?: ValueOrSignal<HTMLAttributeReferrerPolicy | EmptyValue>
  src?: ValueOrSignal<string | EmptyValue>
  type?: ValueOrSignal<string | EmptyValue>
}

export interface SelectHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  autoComplete?: ValueOrSignal<string | EmptyValue>
  disabled?: ValueOrSignal<boolean | EmptyValue>
  form?: ValueOrSignal<string | EmptyValue>
  multiple?: ValueOrSignal<boolean | EmptyValue>
  name?: ValueOrSignal<string | EmptyValue>
  required?: ValueOrSignal<boolean | EmptyValue>
  size?: ValueOrSignal<number | EmptyValue>
  value?: ValueOrSignal<string | readonly string[] | number | EmptyValue>
  onChange?: ChangeEventHandler<T> | undefined
}

export interface SourceHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  height?: ValueOrSignal<number | string | EmptyValue>
  media?: ValueOrSignal<string | EmptyValue>
  sizes?: ValueOrSignal<string | EmptyValue>
  src?: ValueOrSignal<string | EmptyValue>
  srcSet?: ValueOrSignal<string | EmptyValue>
  type?: ValueOrSignal<string | EmptyValue>
  width?: ValueOrSignal<number | string | EmptyValue>
}

export interface StyleHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  media?: ValueOrSignal<string | EmptyValue>
  scoped?: ValueOrSignal<boolean | EmptyValue>
  type?: ValueOrSignal<string | EmptyValue>
}

export interface TableHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  align?: ValueOrSignal<'left' | 'center' | 'right' | EmptyValue>
  bgcolor?: ValueOrSignal<string | EmptyValue>
  border?: ValueOrSignal<number | EmptyValue>
  cellPadding?: ValueOrSignal<number | string | EmptyValue>
  cellSpacing?: ValueOrSignal<number | string | EmptyValue>
  frame?: ValueOrSignal<boolean | EmptyValue>
  rules?: ValueOrSignal<'none' | 'groups' | 'rows' | 'columns' | 'all' | EmptyValue>
  summary?: ValueOrSignal<string | EmptyValue>
  width?: ValueOrSignal<number | string | EmptyValue>
}

export interface TextareaHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  autoComplete?: ValueOrSignal<string | EmptyValue>
  cols?: ValueOrSignal<number | EmptyValue>
  dirName?: ValueOrSignal<string | EmptyValue>
  disabled?: ValueOrSignal<boolean | EmptyValue>
  form?: ValueOrSignal<string | EmptyValue>
  maxLength?: ValueOrSignal<number | EmptyValue>
  minLength?: ValueOrSignal<number | EmptyValue>
  name?: ValueOrSignal<string | EmptyValue>
  placeholder?: ValueOrSignal<string | EmptyValue>
  readOnly?: ValueOrSignal<boolean | EmptyValue>
  required?: ValueOrSignal<boolean | EmptyValue>
  rows?: ValueOrSignal<number | EmptyValue>
  value?: ValueOrSignal<string | readonly string[] | number | EmptyValue>
  wrap?: ValueOrSignal<string | EmptyValue>

  onChange?: ChangeEventHandler<T> | undefined
}

export interface TdHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  align?: ValueOrSignal<'left' | 'center' | 'right' | 'justify' | 'char' | EmptyValue>
  colSpan?: ValueOrSignal<number | EmptyValue>
  headers?: ValueOrSignal<string | EmptyValue>
  rowSpan?: ValueOrSignal<number | EmptyValue>
  scope?: ValueOrSignal<string | EmptyValue>
  abbr?: ValueOrSignal<string | EmptyValue>
  height?: ValueOrSignal<number | string | EmptyValue>
  width?: ValueOrSignal<number | string | EmptyValue>
  valign?: ValueOrSignal<'top' | 'middle' | 'bottom' | 'baseline' | EmptyValue>
}

export interface ThHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  align?: ValueOrSignal<'left' | 'center' | 'right' | 'justify' | 'char' | EmptyValue>
  colSpan?: ValueOrSignal<number | EmptyValue>
  headers?: ValueOrSignal<string | EmptyValue>
  rowSpan?: ValueOrSignal<number | EmptyValue>
  scope?: ValueOrSignal<string | EmptyValue>
  abbr?: ValueOrSignal<string | EmptyValue>
}

export interface TimeHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  dateTime?: ValueOrSignal<string | EmptyValue>
}

export interface TrackHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  default?: ValueOrSignal<boolean | EmptyValue>
  kind?: ValueOrSignal<string | EmptyValue>
  label?: ValueOrSignal<string | EmptyValue>
  src?: ValueOrSignal<string | EmptyValue>
  srcLang?: ValueOrSignal<string | EmptyValue>
}

export interface VideoHTMLAttributes<T extends HTMLElement> extends MediaHTMLAttributes<T> {
  height?: ValueOrSignal<number | string | EmptyValue>
  playsInline?: ValueOrSignal<boolean | EmptyValue>
  poster?: ValueOrSignal<string | EmptyValue>
  width?: ValueOrSignal<number | string | EmptyValue>
  disablePictureInPicture?: ValueOrSignal<boolean | EmptyValue>
  disableRemotePlayback?: ValueOrSignal<boolean | EmptyValue>
}

// The three broad type categories are (in order of restrictiveness):
//   - "number | string"
//   - "string"
//   - union of string literals
export interface SVGAttributes<T extends Element> extends AriaAttributes, DOMAttributes<T> {
  // Attributes which also defined in HTMLAttributes
  // See comment in SVGDOMPropertyConfig.js
  class?: ValueOrSignal<string | EmptyValue>
  color?: ValueOrSignal<string | EmptyValue>
  height?: ValueOrSignal<number | string | EmptyValue>
  id?: ValueOrSignal<string | EmptyValue>
  lang?: ValueOrSignal<string | EmptyValue>
  max?: ValueOrSignal<number | string | EmptyValue>
  media?: ValueOrSignal<string | EmptyValue>
  method?: ValueOrSignal<string | EmptyValue>
  min?: ValueOrSignal<number | string | EmptyValue>
  name?: ValueOrSignal<string | EmptyValue>
  style?: ValueOrSignal<string | EmptyValue>
  target?: ValueOrSignal<string | EmptyValue>
  type?: ValueOrSignal<string | EmptyValue>
  width?: ValueOrSignal<number | string | EmptyValue>

  // Other HTML properties supported by SVG elements in browsers
  role?: ValueOrSignal<AriaRole | EmptyValue>
  tabIndex?: ValueOrSignal<number | EmptyValue>
  crossOrigin?: ValueOrSignal<CrossOrigin>

  // SVG Specific attributes
  accentHeight?: ValueOrSignal<number | string | EmptyValue>
  accumulate?: ValueOrSignal<'none' | 'sum' | EmptyValue>
  additive?: ValueOrSignal<'replace' | 'sum' | EmptyValue>
  alignmentBaseline?: ValueOrSignal<
    | 'auto'
    | 'baseline'
    | 'before-edge'
    | 'text-before-edge'
    | 'middle'
    | 'central'
    | 'after-edge'
    | 'text-after-edge'
    | 'ideographic'
    | 'alphabetic'
    | 'hanging'
    | 'mathematical'
    | 'inherit'
    | EmptyValue
  >
  allowReorder?: ValueOrSignal<'no' | 'yes' | EmptyValue>
  alphabetic?: ValueOrSignal<number | string | EmptyValue>
  amplitude?: ValueOrSignal<number | string | EmptyValue>
  arabicForm?: ValueOrSignal<'initial' | 'medial' | 'terminal' | 'isolated' | EmptyValue>
  ascent?: ValueOrSignal<number | string | EmptyValue>
  attributeName?: ValueOrSignal<string | EmptyValue>
  attributeType?: ValueOrSignal<string | EmptyValue>
  autoReverse?: ValueOrSignal<Booleanish | EmptyValue>
  azimuth?: ValueOrSignal<number | string | EmptyValue>
  baseFrequency?: ValueOrSignal<number | string | EmptyValue>
  baselineShift?: ValueOrSignal<number | string | EmptyValue>
  baseProfile?: ValueOrSignal<number | string | EmptyValue>
  bbox?: ValueOrSignal<number | string | EmptyValue>
  begin?: ValueOrSignal<number | string | EmptyValue>
  bias?: ValueOrSignal<number | string | EmptyValue>
  by?: ValueOrSignal<number | string | EmptyValue>
  calcMode?: ValueOrSignal<number | string | EmptyValue>
  capHeight?: ValueOrSignal<number | string | EmptyValue>
  clip?: ValueOrSignal<number | string | EmptyValue>
  clipPath?: ValueOrSignal<string | EmptyValue>
  clipPathUnits?: ValueOrSignal<number | string | EmptyValue>
  clipRule?: ValueOrSignal<number | string | EmptyValue>
  colorInterpolation?: ValueOrSignal<number | string | EmptyValue>
  colorInterpolationFilters?: ValueOrSignal<'auto' | 'sRGB' | 'linearRGB' | 'inherit' | EmptyValue>
  colorProfile?: ValueOrSignal<number | string | EmptyValue>
  colorRendering?: ValueOrSignal<number | string | EmptyValue>
  contentScriptType?: ValueOrSignal<number | string | EmptyValue>
  contentStyleType?: ValueOrSignal<number | string | EmptyValue>
  cursor?: ValueOrSignal<number | string | EmptyValue>
  cx?: ValueOrSignal<number | string | EmptyValue>
  cy?: ValueOrSignal<number | string | EmptyValue>
  d?: ValueOrSignal<string | EmptyValue>
  decelerate?: ValueOrSignal<number | string | EmptyValue>
  descent?: ValueOrSignal<number | string | EmptyValue>
  diffuseConstant?: ValueOrSignal<number | string | EmptyValue>
  direction?: ValueOrSignal<number | string | EmptyValue>
  display?: ValueOrSignal<number | string | EmptyValue>
  divisor?: ValueOrSignal<number | string | EmptyValue>
  dominantBaseline?: ValueOrSignal<number | string | EmptyValue>
  dur?: ValueOrSignal<number | string | EmptyValue>
  dx?: ValueOrSignal<number | string | EmptyValue>
  dy?: ValueOrSignal<number | string | EmptyValue>
  edgeMode?: ValueOrSignal<number | string | EmptyValue>
  elevation?: ValueOrSignal<number | string | EmptyValue>
  enableBackground?: ValueOrSignal<number | string | EmptyValue>
  end?: ValueOrSignal<number | string | EmptyValue>
  exponent?: ValueOrSignal<number | string | EmptyValue>
  externalResourcesRequired?: ValueOrSignal<Booleanish | EmptyValue>
  fill?: ValueOrSignal<string | EmptyValue>
  fillOpacity?: ValueOrSignal<number | string | EmptyValue>
  fillRule?: ValueOrSignal<'nonzero' | 'evenodd' | 'inherit' | EmptyValue>
  filter?: ValueOrSignal<string | EmptyValue>
  filterRes?: ValueOrSignal<number | string | EmptyValue>
  filterUnits?: ValueOrSignal<number | string | EmptyValue>
  floodColor?: ValueOrSignal<number | string | EmptyValue>
  floodOpacity?: ValueOrSignal<number | string | EmptyValue>
  focusable?: ValueOrSignal<Booleanish | 'auto' | EmptyValue>
  fontFamily?: ValueOrSignal<string | EmptyValue>
  fontSize?: ValueOrSignal<number | string | EmptyValue>
  fontSizeAdjust?: ValueOrSignal<number | string | EmptyValue>
  fontStretch?: ValueOrSignal<number | string | EmptyValue>
  fontStyle?: ValueOrSignal<number | string | EmptyValue>
  fontVariant?: ValueOrSignal<number | string | EmptyValue>
  fontWeight?: ValueOrSignal<number | string | EmptyValue>
  format?: ValueOrSignal<number | string | EmptyValue>
  fr?: ValueOrSignal<number | string | EmptyValue>
  from?: ValueOrSignal<number | string | EmptyValue>
  fx?: ValueOrSignal<number | string | EmptyValue>
  fy?: ValueOrSignal<number | string | EmptyValue>
  g1?: ValueOrSignal<number | string | EmptyValue>
  g2?: ValueOrSignal<number | string | EmptyValue>
  glyphName?: ValueOrSignal<number | string | EmptyValue>
  glyphOrientationHorizontal?: ValueOrSignal<number | string | EmptyValue>
  glyphOrientationVertical?: ValueOrSignal<number | string | EmptyValue>
  glyphRef?: ValueOrSignal<number | string | EmptyValue>
  gradientTransform?: ValueOrSignal<string | EmptyValue>
  gradientUnits?: ValueOrSignal<string | EmptyValue>
  hanging?: ValueOrSignal<number | string | EmptyValue>
  horizAdvX?: ValueOrSignal<number | string | EmptyValue>
  horizOriginX?: ValueOrSignal<number | string | EmptyValue>
  href?: ValueOrSignal<string | EmptyValue>
  ideographic?: ValueOrSignal<number | string | EmptyValue>
  imageRendering?: ValueOrSignal<number | string | EmptyValue>
  in2?: ValueOrSignal<number | string | EmptyValue>
  in?: ValueOrSignal<string | EmptyValue>
  intercept?: ValueOrSignal<number | string | EmptyValue>
  k1?: ValueOrSignal<number | string | EmptyValue>
  k2?: ValueOrSignal<number | string | EmptyValue>
  k3?: ValueOrSignal<number | string | EmptyValue>
  k4?: ValueOrSignal<number | string | EmptyValue>
  k?: ValueOrSignal<number | string | EmptyValue>
  kernelMatrix?: ValueOrSignal<number | string | EmptyValue>
  kernelUnitLength?: ValueOrSignal<number | string | EmptyValue>
  kerning?: ValueOrSignal<number | string | EmptyValue>
  keyPoints?: ValueOrSignal<number | string | EmptyValue>
  keySplines?: ValueOrSignal<number | string | EmptyValue>
  keyTimes?: ValueOrSignal<number | string | EmptyValue>
  lengthAdjust?: ValueOrSignal<number | string | EmptyValue>
  letterSpacing?: ValueOrSignal<number | string | EmptyValue>
  lightingColor?: ValueOrSignal<number | string | EmptyValue>
  limitingConeAngle?: ValueOrSignal<number | string | EmptyValue>
  local?: ValueOrSignal<number | string | EmptyValue>
  markerEnd?: ValueOrSignal<string | EmptyValue>
  markerHeight?: ValueOrSignal<number | string | EmptyValue>
  markerMid?: ValueOrSignal<string | EmptyValue>
  markerStart?: ValueOrSignal<string | EmptyValue>
  markerUnits?: ValueOrSignal<number | string | EmptyValue>
  markerWidth?: ValueOrSignal<number | string | EmptyValue>
  mask?: ValueOrSignal<string | EmptyValue>
  maskContentUnits?: ValueOrSignal<number | string | EmptyValue>
  maskUnits?: ValueOrSignal<number | string | EmptyValue>
  mathematical?: ValueOrSignal<number | string | EmptyValue>
  mode?: ValueOrSignal<number | string | EmptyValue>
  numOctaves?: ValueOrSignal<number | string | EmptyValue>
  offset?: ValueOrSignal<number | string | EmptyValue>
  opacity?: ValueOrSignal<number | string | EmptyValue>
  operator?: ValueOrSignal<number | string | EmptyValue>
  order?: ValueOrSignal<number | string | EmptyValue>
  orient?: ValueOrSignal<number | string | EmptyValue>
  orientation?: ValueOrSignal<number | string | EmptyValue>
  origin?: ValueOrSignal<number | string | EmptyValue>
  overflow?: ValueOrSignal<number | string | EmptyValue>
  overlinePosition?: ValueOrSignal<number | string | EmptyValue>
  overlineThickness?: ValueOrSignal<number | string | EmptyValue>
  paintOrder?: ValueOrSignal<number | string | EmptyValue>
  panose1?: ValueOrSignal<number | string | EmptyValue>
  path?: ValueOrSignal<string | EmptyValue>
  pathLength?: ValueOrSignal<number | string | EmptyValue>
  patternContentUnits?: ValueOrSignal<string | EmptyValue>
  patternTransform?: ValueOrSignal<number | string | EmptyValue>
  patternUnits?: ValueOrSignal<string | EmptyValue>
  pointerEvents?: ValueOrSignal<number | string | EmptyValue>
  points?: ValueOrSignal<string | EmptyValue>
  pointsAtX?: ValueOrSignal<number | string | EmptyValue>
  pointsAtY?: ValueOrSignal<number | string | EmptyValue>
  pointsAtZ?: ValueOrSignal<number | string | EmptyValue>
  preserveAlpha?: ValueOrSignal<Booleanish | EmptyValue>
  preserveAspectRatio?: ValueOrSignal<string | EmptyValue>
  primitiveUnits?: ValueOrSignal<number | string | EmptyValue>
  r?: ValueOrSignal<number | string | EmptyValue>
  radius?: ValueOrSignal<number | string | EmptyValue>
  refX?: ValueOrSignal<number | string | EmptyValue>
  refY?: ValueOrSignal<number | string | EmptyValue>
  renderingIntent?: ValueOrSignal<number | string | EmptyValue>
  repeatCount?: ValueOrSignal<number | string | EmptyValue>
  repeatDur?: ValueOrSignal<number | string | EmptyValue>
  requiredExtensions?: ValueOrSignal<number | string | EmptyValue>
  requiredFeatures?: ValueOrSignal<number | string | EmptyValue>
  restart?: ValueOrSignal<number | string | EmptyValue>
  result?: ValueOrSignal<string | EmptyValue>
  rotate?: ValueOrSignal<number | string | EmptyValue>
  rx?: ValueOrSignal<number | string | EmptyValue>
  ry?: ValueOrSignal<number | string | EmptyValue>
  scale?: ValueOrSignal<number | string | EmptyValue>
  seed?: ValueOrSignal<number | string | EmptyValue>
  shapeRendering?: ValueOrSignal<number | string | EmptyValue>
  slope?: ValueOrSignal<number | string | EmptyValue>
  spacing?: ValueOrSignal<number | string | EmptyValue>
  specularConstant?: ValueOrSignal<number | string | EmptyValue>
  specularExponent?: ValueOrSignal<number | string | EmptyValue>
  speed?: ValueOrSignal<number | string | EmptyValue>
  spreadMethod?: ValueOrSignal<string | EmptyValue>
  startOffset?: ValueOrSignal<number | string | EmptyValue>
  stdDeviation?: ValueOrSignal<number | string | EmptyValue>
  stemh?: ValueOrSignal<number | string | EmptyValue>
  stemv?: ValueOrSignal<number | string | EmptyValue>
  stitchTiles?: ValueOrSignal<number | string | EmptyValue>
  stopColor?: ValueOrSignal<string | EmptyValue>
  stopOpacity?: ValueOrSignal<number | string | EmptyValue>
  strikethroughPosition?: ValueOrSignal<number | string | EmptyValue>
  strikethroughThickness?: ValueOrSignal<number | string | EmptyValue>
  string?: ValueOrSignal<number | string | EmptyValue>
  stroke?: ValueOrSignal<string | EmptyValue>
  strokeDasharray?: ValueOrSignal<string | number | EmptyValue>
  strokeDashoffset?: ValueOrSignal<string | number | EmptyValue>
  strokeLinecap?: ValueOrSignal<'butt' | 'round' | 'square' | 'inherit' | EmptyValue>
  strokeLinejoin?: ValueOrSignal<'miter' | 'round' | 'bevel' | 'inherit' | EmptyValue>
  strokeMiterlimit?: ValueOrSignal<number | string | EmptyValue>
  strokeOpacity?: ValueOrSignal<number | string | EmptyValue>
  strokeWidth?: ValueOrSignal<number | string | EmptyValue>
  surfaceScale?: ValueOrSignal<number | string | EmptyValue>
  systemLanguage?: ValueOrSignal<number | string | EmptyValue>
  tableValues?: ValueOrSignal<number | string | EmptyValue>
  targetX?: ValueOrSignal<number | string | EmptyValue>
  targetY?: ValueOrSignal<number | string | EmptyValue>
  textAnchor?: ValueOrSignal<string | EmptyValue>
  textDecoration?: ValueOrSignal<number | string | EmptyValue>
  textLength?: ValueOrSignal<number | string | EmptyValue>
  textRendering?: ValueOrSignal<number | string | EmptyValue>
  to?: ValueOrSignal<number | string | EmptyValue>
  transform?: ValueOrSignal<string | EmptyValue>
  u1?: ValueOrSignal<number | string | EmptyValue>
  u2?: ValueOrSignal<number | string | EmptyValue>
  underlinePosition?: ValueOrSignal<number | string | EmptyValue>
  underlineThickness?: ValueOrSignal<number | string | EmptyValue>
  unicode?: ValueOrSignal<number | string | EmptyValue>
  unicodeBidi?: ValueOrSignal<number | string | EmptyValue>
  unicodeRange?: ValueOrSignal<number | string | EmptyValue>
  unitsPerEm?: ValueOrSignal<number | string | EmptyValue>
  vAlphabetic?: ValueOrSignal<number | string | EmptyValue>
  values?: ValueOrSignal<string | EmptyValue>
  vectorEffect?: ValueOrSignal<number | string | EmptyValue>
  version?: ValueOrSignal<string | EmptyValue>
  vertAdvY?: ValueOrSignal<number | string | EmptyValue>
  vertOriginX?: ValueOrSignal<number | string | EmptyValue>
  vertOriginY?: ValueOrSignal<number | string | EmptyValue>
  vHanging?: ValueOrSignal<number | string | EmptyValue>
  vIdeographic?: ValueOrSignal<number | string | EmptyValue>
  viewBox?: ValueOrSignal<string | EmptyValue>
  viewTarget?: ValueOrSignal<number | string | EmptyValue>
  visibility?: ValueOrSignal<number | string | EmptyValue>
  vMathematical?: ValueOrSignal<number | string | EmptyValue>
  widths?: ValueOrSignal<number | string | EmptyValue>
  wordSpacing?: ValueOrSignal<number | string | EmptyValue>
  writingMode?: ValueOrSignal<number | string | EmptyValue>
  x1?: ValueOrSignal<number | string | EmptyValue>
  x2?: ValueOrSignal<number | string | EmptyValue>
  x?: ValueOrSignal<number | string | EmptyValue>
  xChannelSelector?: ValueOrSignal<string | EmptyValue>
  xHeight?: ValueOrSignal<number | string | EmptyValue>
  xlinkActuate?: ValueOrSignal<string | EmptyValue>
  xlinkArcrole?: ValueOrSignal<string | EmptyValue>
  xlinkHref?: ValueOrSignal<string | EmptyValue>
  xlinkRole?: ValueOrSignal<string | EmptyValue>
  xlinkShow?: ValueOrSignal<string | EmptyValue>
  xlinkTitle?: ValueOrSignal<string | EmptyValue>
  xlinkType?: ValueOrSignal<string | EmptyValue>
  xmlBase?: ValueOrSignal<string | EmptyValue>
  xmlLang?: ValueOrSignal<string | EmptyValue>
  xmlns?: ValueOrSignal<string | EmptyValue>
  xmlnsXlink?: ValueOrSignal<string | EmptyValue>
  xmlSpace?: ValueOrSignal<string | EmptyValue>
  y1?: ValueOrSignal<number | string | EmptyValue>
  y2?: ValueOrSignal<number | string | EmptyValue>
  y?: ValueOrSignal<number | string | EmptyValue>
  yChannelSelector?: ValueOrSignal<string | EmptyValue>
  z?: ValueOrSignal<number | string | EmptyValue>
  zoomAndPan?: ValueOrSignal<string | EmptyValue>
}
