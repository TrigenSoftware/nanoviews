import * as CSS from 'csstype'
import type {
  ValueOrStore,
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
  defaultChecked?: ValueOrStore<boolean | EmptyValue>
  defaultValue?: ValueOrStore<string | number | readonly string[] | EmptyValue>
  suppressContentEditableWarning?: ValueOrStore<boolean | EmptyValue>
  suppressHydrationWarning?: ValueOrStore<boolean | EmptyValue>

  // Standard HTML Attributes
  accessKey?: ValueOrStore<string | EmptyValue>
  autoFocus?: ValueOrStore<boolean | EmptyValue>
  class?: ValueOrStore<string | EmptyValue>
  contentEditable?: ValueOrStore<Booleanish | 'inherit' | 'plaintext-only' | EmptyValue>
  contextMenu?: ValueOrStore<string | EmptyValue>
  dir?: ValueOrStore<string | EmptyValue>
  draggable?: ValueOrStore<Booleanish | EmptyValue>
  hidden?: ValueOrStore<boolean | EmptyValue>
  id?: ValueOrStore<string | EmptyValue>
  lang?: ValueOrStore<string | EmptyValue>
  nonce?: ValueOrStore<string | EmptyValue>
  slot?: ValueOrStore<string | EmptyValue>
  spellCheck?: ValueOrStore<Booleanish | EmptyValue>
  style?: ValueOrStore<string | EmptyValue>
  tabIndex?: ValueOrStore<number | EmptyValue>
  title?: ValueOrStore<string | EmptyValue>
  translate?: ValueOrStore<'yes' | 'no' | EmptyValue>

  // Unknown
  radioGroup?: ValueOrStore<string | EmptyValue> // <command>, <menuitem>

  // WAI-ARIA
  role?: ValueOrStore<AriaRole | EmptyValue>

  // RDFa Attributes
  about?: ValueOrStore<string | EmptyValue>
  content?: ValueOrStore<string | EmptyValue>
  datatype?: ValueOrStore<string | EmptyValue>
  inlist?: ValueOrStore<any>
  prefix?: ValueOrStore<string | EmptyValue>
  property?: ValueOrStore<string | EmptyValue>
  rel?: ValueOrStore<string | EmptyValue>
  resource?: ValueOrStore<string | EmptyValue>
  rev?: ValueOrStore<string | EmptyValue>
  typeof?: ValueOrStore<string | EmptyValue>
  vocab?: ValueOrStore<string | EmptyValue>

  // Non-standard Attributes
  autoCapitalize?: ValueOrStore<string | EmptyValue>
  autoCorrect?: ValueOrStore<string | EmptyValue>
  autoSave?: ValueOrStore<string | EmptyValue>
  color?: ValueOrStore<string | EmptyValue>
  itemProp?: ValueOrStore<string | EmptyValue>
  itemScope?: ValueOrStore<boolean | EmptyValue>
  itemType?: ValueOrStore<string | EmptyValue>
  itemID?: ValueOrStore<string | EmptyValue>
  itemRef?: ValueOrStore<string | EmptyValue>
  results?: ValueOrStore<number | EmptyValue>
  security?: ValueOrStore<string | EmptyValue>
  unselectable?: ValueOrStore<'on' | 'off' | EmptyValue>

  // Living Standard
  /**
   * Hints at the type of data that might be entered by the user while editing the element or its contents
   * @see {@link https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute}
   */
  inputMode?: ValueOrStore<'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search' | EmptyValue>
  /**
   * Specify that a standard HTML element should behave like a defined custom built-in element
   * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is}
   */
  is?: ValueOrStore<string | EmptyValue>

  /**
   * Data attributes
   */
  [key: `data-${string}`]: ValueOrStore<unknown>
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
  | (string & {})

export interface AnchorHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  download?: ValueOrStore<any>
  href?: ValueOrStore<string | EmptyValue>
  hrefLang?: ValueOrStore<string | EmptyValue>
  media?: ValueOrStore<string | EmptyValue>
  ping?: ValueOrStore<string | EmptyValue>
  target?: ValueOrStore<HTMLAttributeAnchorTarget | EmptyValue>
  type?: ValueOrStore<string | EmptyValue>
  referrerPolicy?: ValueOrStore<HTMLAttributeReferrerPolicy | EmptyValue>
}

export interface AudioHTMLAttributes<T extends HTMLElement> extends MediaHTMLAttributes<T> {}

export interface AreaHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  alt?: ValueOrStore<string | EmptyValue>
  coords?: ValueOrStore<string | EmptyValue>
  download?: ValueOrStore<any>
  href?: ValueOrStore<string | EmptyValue>
  hrefLang?: ValueOrStore<string | EmptyValue>
  media?: ValueOrStore<string | EmptyValue>
  referrerPolicy?: ValueOrStore<HTMLAttributeReferrerPolicy | EmptyValue>
  shape?: ValueOrStore<string | EmptyValue>
  target?: ValueOrStore<string | EmptyValue>
}

export interface BaseHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  href?: ValueOrStore<string | EmptyValue>
  target?: ValueOrStore<string | EmptyValue>
}

export interface BlockquoteHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  cite?: ValueOrStore<string | EmptyValue>
}

export interface ButtonHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  disabled?: ValueOrStore<boolean | EmptyValue>
  form?: ValueOrStore<string | EmptyValue>
  formAction?: ValueOrStore<string | EmptyValue>
  formEncType?: ValueOrStore<string | EmptyValue>
  formMethod?: ValueOrStore<string | EmptyValue>
  formNoValidate?: ValueOrStore<boolean | EmptyValue>
  formTarget?: ValueOrStore<string | EmptyValue>
  name?: ValueOrStore<string | EmptyValue>
  type?: ValueOrStore<'submit' | 'reset' | 'button' | EmptyValue>
  value?: ValueOrStore<string | readonly string[] | number | EmptyValue>
}

export interface CanvasHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  height?: ValueOrStore<number | string | EmptyValue>
  width?: ValueOrStore<number | string | EmptyValue>
}

export interface ColHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  span?: ValueOrStore<number | EmptyValue>
  width?: ValueOrStore<number | string | EmptyValue>
}

export interface ColgroupHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  span?: ValueOrStore<number | EmptyValue>
}

export interface DataHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  value?: ValueOrStore<string | readonly string[] | number | EmptyValue>
}

export interface DetailsHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  open?: ValueOrStore<boolean | EmptyValue>
  onToggle?: TargetEventHandler<T> | EmptyValue
  name?: ValueOrStore<string | EmptyValue>
}

export interface DelHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  cite?: ValueOrStore<string | EmptyValue>
  dateTime?: ValueOrStore<string | EmptyValue>
}

export interface DialogHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  onCancel?: TargetEventHandler<T> | EmptyValue
  onClose?: TargetEventHandler<T> | EmptyValue
  open?: ValueOrStore<boolean | EmptyValue>
}

export interface EmbedHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  height?: ValueOrStore<number | string | EmptyValue>
  src?: ValueOrStore<string | EmptyValue>
  type?: ValueOrStore<string | EmptyValue>
  width?: ValueOrStore<number | string | EmptyValue>
}

export interface FieldsetHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  disabled?: ValueOrStore<boolean | EmptyValue>
  form?: ValueOrStore<string | EmptyValue>
  name?: ValueOrStore<string | EmptyValue>
}

export interface FormHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  acceptCharset?: ValueOrStore<string | EmptyValue>
  action?: ValueOrStore<string | EmptyValue>
  autoComplete?: ValueOrStore<string | EmptyValue>
  encType?: ValueOrStore<string | EmptyValue>
  method?: ValueOrStore<string | EmptyValue>
  name?: ValueOrStore<string | EmptyValue>
  noValidate?: ValueOrStore<boolean | EmptyValue>
  target?: ValueOrStore<string | EmptyValue>
}

export interface HtmlHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  manifest?: ValueOrStore<string | EmptyValue>
}

export interface IframeHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  allow?: ValueOrStore<string | EmptyValue>
  allowFullScreen?: ValueOrStore<boolean | EmptyValue>
  allowTransparency?: ValueOrStore<boolean | EmptyValue>
  /** @deprecated */
  frameBorder?: ValueOrStore<number | string | EmptyValue>
  height?: ValueOrStore<number | string | EmptyValue>
  loading?: ValueOrStore<'eager' | 'lazy' | EmptyValue>
  /** @deprecated */
  marginHeight?: ValueOrStore<number | EmptyValue>
  /** @deprecated */
  marginWidth?: ValueOrStore<number | EmptyValue>
  name?: ValueOrStore<string | EmptyValue>
  referrerPolicy?: ValueOrStore<HTMLAttributeReferrerPolicy | EmptyValue>
  sandbox?: ValueOrStore<string | EmptyValue>
  /** @deprecated */
  scrolling?: ValueOrStore<string | EmptyValue>
  seamless?: ValueOrStore<boolean | EmptyValue>
  src?: ValueOrStore<string | EmptyValue>
  srcDoc?: ValueOrStore<string | EmptyValue>
  width?: ValueOrStore<number | string | EmptyValue>
}

export interface ImgHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  alt?: ValueOrStore<string | EmptyValue>
  crossOrigin?: ValueOrStore<CrossOrigin>
  decoding?: ValueOrStore<'async' | 'auto' | 'sync' | EmptyValue>
  fetchPriority?: ValueOrStore<'high' | 'low' | 'auto'>
  height?: ValueOrStore<number | string | EmptyValue>
  loading?: ValueOrStore<'eager' | 'lazy' | EmptyValue>
  referrerPolicy?: ValueOrStore<HTMLAttributeReferrerPolicy | EmptyValue>
  sizes?: ValueOrStore<string | EmptyValue>
  src?: ValueOrStore<string | EmptyValue>
  srcSet?: ValueOrStore<string | EmptyValue>
  useMap?: ValueOrStore<string | EmptyValue>
  width?: ValueOrStore<number | string | EmptyValue>
}

export interface InsHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  cite?: ValueOrStore<string | EmptyValue>
  dateTime?: ValueOrStore<string | EmptyValue>
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
  | (string & {})

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
export type HTMLInputAutoCompleteAttribute = AutoFill | (string & {})

export interface InputHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  accept?: ValueOrStore<string | EmptyValue>
  alt?: ValueOrStore<string | EmptyValue>
  autoComplete?: ValueOrStore<HTMLInputAutoCompleteAttribute | EmptyValue>
  capture?: ValueOrStore<boolean | 'user' | 'environment' | EmptyValue> // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
  checked?: ValueOrStore<boolean | EmptyValue>
  disabled?: ValueOrStore<boolean | EmptyValue>
  enterKeyHint?: ValueOrStore<'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send' | EmptyValue>
  form?: ValueOrStore<string | EmptyValue>
  formAction?: ValueOrStore<string | EmptyValue>
  formEncType?: ValueOrStore<string | EmptyValue>
  formMethod?: ValueOrStore<string | EmptyValue>
  formNoValidate?: ValueOrStore<boolean | EmptyValue>
  formTarget?: ValueOrStore<string | EmptyValue>
  height?: ValueOrStore<number | string | EmptyValue>
  list?: ValueOrStore<string | EmptyValue>
  max?: ValueOrStore<number | string | EmptyValue>
  maxLength?: ValueOrStore<number | EmptyValue>
  min?: ValueOrStore<number | string | EmptyValue>
  minLength?: ValueOrStore<number | EmptyValue>
  multiple?: ValueOrStore<boolean | EmptyValue>
  name?: ValueOrStore<string | EmptyValue>
  pattern?: ValueOrStore<string | EmptyValue>
  placeholder?: ValueOrStore<string | EmptyValue>
  readOnly?: ValueOrStore<boolean | EmptyValue>
  required?: ValueOrStore<boolean | EmptyValue>
  size?: ValueOrStore<number | EmptyValue>
  src?: ValueOrStore<string | EmptyValue>
  step?: ValueOrStore<number | string | EmptyValue>
  type?: ValueOrStore<HTMLInputTypeAttribute | EmptyValue>
  value?: ValueOrStore<string | readonly string[] | number | EmptyValue>
  width?: ValueOrStore<number | string | EmptyValue>

  onChange?: ChangeEventHandler<T> | undefined
}

export interface KeygenHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  challenge?: ValueOrStore<string | EmptyValue>
  disabled?: ValueOrStore<boolean | EmptyValue>
  form?: ValueOrStore<string | EmptyValue>
  keyType?: ValueOrStore<string | EmptyValue>
  keyParams?: ValueOrStore<string | EmptyValue>
  name?: ValueOrStore<string | EmptyValue>
}

export interface LabelHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  form?: ValueOrStore<string | EmptyValue>
  for?: ValueOrStore<string | EmptyValue>
}

export interface LiHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  value?: ValueOrStore<string | readonly string[] | number | EmptyValue>
}

export interface LinkHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  as?: ValueOrStore<string | EmptyValue>
  crossOrigin?: ValueOrStore<CrossOrigin>
  fetchPriority?: ValueOrStore<'high' | 'low' | 'auto'>
  href?: ValueOrStore<string | EmptyValue>
  hrefLang?: ValueOrStore<string | EmptyValue>
  integrity?: ValueOrStore<string | EmptyValue>
  media?: ValueOrStore<string | EmptyValue>
  imageSrcSet?: ValueOrStore<string | EmptyValue>
  imageSizes?: ValueOrStore<string | EmptyValue>
  referrerPolicy?: ValueOrStore<HTMLAttributeReferrerPolicy | EmptyValue>
  sizes?: ValueOrStore<string | EmptyValue>
  type?: ValueOrStore<string | EmptyValue>
  charSet?: ValueOrStore<string | EmptyValue>
}

export interface MapHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  name?: ValueOrStore<string | EmptyValue>
}

export interface MenuHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  type?: ValueOrStore<string | EmptyValue>
}

export interface MediaHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  autoPlay?: ValueOrStore<boolean | EmptyValue>
  controls?: ValueOrStore<boolean | EmptyValue>
  controlsList?: ValueOrStore<string | EmptyValue>
  crossOrigin?: ValueOrStore<CrossOrigin>
  loop?: ValueOrStore<boolean | EmptyValue>
  mediaGroup?: ValueOrStore<string | EmptyValue>
  muted?: ValueOrStore<boolean | EmptyValue>
  playsInline?: ValueOrStore<boolean | EmptyValue>
  preload?: ValueOrStore<string | EmptyValue>
  src?: ValueOrStore<string | EmptyValue>
}

export interface MetaHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  charSet?: ValueOrStore<string | EmptyValue>
  content?: ValueOrStore<string | EmptyValue>
  httpEquiv?: ValueOrStore<string | EmptyValue>
  media?: ValueOrStore<string | EmptyValue>
  name?: ValueOrStore<string | EmptyValue>
}

export interface MeterHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  form?: ValueOrStore<string | EmptyValue>
  high?: ValueOrStore<number | EmptyValue>
  low?: ValueOrStore<number | EmptyValue>
  max?: ValueOrStore<number | string | EmptyValue>
  min?: ValueOrStore<number | string | EmptyValue>
  optimum?: ValueOrStore<number | EmptyValue>
  value?: ValueOrStore<string | readonly string[] | number | EmptyValue>
}

export interface QuoteHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  cite?: ValueOrStore<string | EmptyValue>
}

export interface ObjectHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  classID?: ValueOrStore<string | EmptyValue>
  data?: ValueOrStore<string | EmptyValue>
  form?: ValueOrStore<string | EmptyValue>
  height?: ValueOrStore<number | string | EmptyValue>
  name?: ValueOrStore<string | EmptyValue>
  type?: ValueOrStore<string | EmptyValue>
  useMap?: ValueOrStore<string | EmptyValue>
  width?: ValueOrStore<number | string | EmptyValue>
  wmode?: ValueOrStore<string | EmptyValue>
}

export interface OlHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  reversed?: ValueOrStore<boolean | EmptyValue>
  start?: ValueOrStore<number | EmptyValue>
  type?: ValueOrStore<'1' | 'a' | 'A' | 'i' | 'I' | EmptyValue>
}

export interface OptgroupHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  disabled?: ValueOrStore<boolean | EmptyValue>
  label?: ValueOrStore<string | EmptyValue>
}

export interface OptionHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  disabled?: ValueOrStore<boolean | EmptyValue>
  label?: ValueOrStore<string | EmptyValue>
  selected?: ValueOrStore<boolean | EmptyValue>
  value?: ValueOrStore<string | readonly string[] | number | EmptyValue>
}

export interface OutputHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  form?: ValueOrStore<string | EmptyValue>
  for?: ValueOrStore<string | EmptyValue>
  name?: ValueOrStore<string | EmptyValue>
}

export interface ParamHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  name?: ValueOrStore<string | EmptyValue>
  value?: ValueOrStore<string | readonly string[] | number | EmptyValue>
}

export interface ProgressHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  max?: ValueOrStore<number | string | EmptyValue>
  value?: ValueOrStore<string | readonly string[] | number | EmptyValue>
}

export interface SlotHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  name?: ValueOrStore<string | EmptyValue>
}

export interface ScriptHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  async?: ValueOrStore<boolean | EmptyValue>
  /** @deprecated */
  charSet?: ValueOrStore<string | EmptyValue>
  crossOrigin?: ValueOrStore<CrossOrigin>
  defer?: ValueOrStore<boolean | EmptyValue>
  integrity?: ValueOrStore<string | EmptyValue>
  noModule?: ValueOrStore<boolean | EmptyValue>
  referrerPolicy?: ValueOrStore<HTMLAttributeReferrerPolicy | EmptyValue>
  src?: ValueOrStore<string | EmptyValue>
  type?: ValueOrStore<string | EmptyValue>
}

export interface SelectHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  autoComplete?: ValueOrStore<string | EmptyValue>
  disabled?: ValueOrStore<boolean | EmptyValue>
  form?: ValueOrStore<string | EmptyValue>
  multiple?: ValueOrStore<boolean | EmptyValue>
  name?: ValueOrStore<string | EmptyValue>
  required?: ValueOrStore<boolean | EmptyValue>
  size?: ValueOrStore<number | EmptyValue>
  value?: ValueOrStore<string | readonly string[] | number | EmptyValue>
  onChange?: ChangeEventHandler<T> | undefined
}

export interface SourceHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  height?: ValueOrStore<number | string | EmptyValue>
  media?: ValueOrStore<string | EmptyValue>
  sizes?: ValueOrStore<string | EmptyValue>
  src?: ValueOrStore<string | EmptyValue>
  srcSet?: ValueOrStore<string | EmptyValue>
  type?: ValueOrStore<string | EmptyValue>
  width?: ValueOrStore<number | string | EmptyValue>
}

export interface StyleHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  media?: ValueOrStore<string | EmptyValue>
  scoped?: ValueOrStore<boolean | EmptyValue>
  type?: ValueOrStore<string | EmptyValue>
}

export interface TableHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  align?: ValueOrStore<'left' | 'center' | 'right' | EmptyValue>
  bgcolor?: ValueOrStore<string | EmptyValue>
  border?: ValueOrStore<number | EmptyValue>
  cellPadding?: ValueOrStore<number | string | EmptyValue>
  cellSpacing?: ValueOrStore<number | string | EmptyValue>
  frame?: ValueOrStore<boolean | EmptyValue>
  rules?: ValueOrStore<'none' | 'groups' | 'rows' | 'columns' | 'all' | EmptyValue>
  summary?: ValueOrStore<string | EmptyValue>
  width?: ValueOrStore<number | string | EmptyValue>
}

export interface TextareaHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  autoComplete?: ValueOrStore<string | EmptyValue>
  cols?: ValueOrStore<number | EmptyValue>
  dirName?: ValueOrStore<string | EmptyValue>
  disabled?: ValueOrStore<boolean | EmptyValue>
  form?: ValueOrStore<string | EmptyValue>
  maxLength?: ValueOrStore<number | EmptyValue>
  minLength?: ValueOrStore<number | EmptyValue>
  name?: ValueOrStore<string | EmptyValue>
  placeholder?: ValueOrStore<string | EmptyValue>
  readOnly?: ValueOrStore<boolean | EmptyValue>
  required?: ValueOrStore<boolean | EmptyValue>
  rows?: ValueOrStore<number | EmptyValue>
  value?: ValueOrStore<string | readonly string[] | number | EmptyValue>
  wrap?: ValueOrStore<string | EmptyValue>

  onChange?: ChangeEventHandler<T> | undefined
}

export interface TdHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  align?: ValueOrStore<'left' | 'center' | 'right' | 'justify' | 'char' | EmptyValue>
  colSpan?: ValueOrStore<number | EmptyValue>
  headers?: ValueOrStore<string | EmptyValue>
  rowSpan?: ValueOrStore<number | EmptyValue>
  scope?: ValueOrStore<string | EmptyValue>
  abbr?: ValueOrStore<string | EmptyValue>
  height?: ValueOrStore<number | string | EmptyValue>
  width?: ValueOrStore<number | string | EmptyValue>
  valign?: ValueOrStore<'top' | 'middle' | 'bottom' | 'baseline' | EmptyValue>
}

export interface ThHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  align?: ValueOrStore<'left' | 'center' | 'right' | 'justify' | 'char' | EmptyValue>
  colSpan?: ValueOrStore<number | EmptyValue>
  headers?: ValueOrStore<string | EmptyValue>
  rowSpan?: ValueOrStore<number | EmptyValue>
  scope?: ValueOrStore<string | EmptyValue>
  abbr?: ValueOrStore<string | EmptyValue>
}

export interface TimeHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  dateTime?: ValueOrStore<string | EmptyValue>
}

export interface TrackHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  default?: ValueOrStore<boolean | EmptyValue>
  kind?: ValueOrStore<string | EmptyValue>
  label?: ValueOrStore<string | EmptyValue>
  src?: ValueOrStore<string | EmptyValue>
  srcLang?: ValueOrStore<string | EmptyValue>
}

export interface VideoHTMLAttributes<T extends HTMLElement> extends MediaHTMLAttributes<T> {
  height?: ValueOrStore<number | string | EmptyValue>
  playsInline?: ValueOrStore<boolean | EmptyValue>
  poster?: ValueOrStore<string | EmptyValue>
  width?: ValueOrStore<number | string | EmptyValue>
  disablePictureInPicture?: ValueOrStore<boolean | EmptyValue>
  disableRemotePlayback?: ValueOrStore<boolean | EmptyValue>
}

// The three broad type categories are (in order of restrictiveness):
//   - "number | string"
//   - "string"
//   - union of string literals
export interface SVGAttributes<T extends Element> extends AriaAttributes, DOMAttributes<T> {
  // Attributes which also defined in HTMLAttributes
  // See comment in SVGDOMPropertyConfig.js
  class?: ValueOrStore<string | EmptyValue>
  color?: ValueOrStore<string | EmptyValue>
  height?: ValueOrStore<number | string | EmptyValue>
  id?: ValueOrStore<string | EmptyValue>
  lang?: ValueOrStore<string | EmptyValue>
  max?: ValueOrStore<number | string | EmptyValue>
  media?: ValueOrStore<string | EmptyValue>
  method?: ValueOrStore<string | EmptyValue>
  min?: ValueOrStore<number | string | EmptyValue>
  name?: ValueOrStore<string | EmptyValue>
  style?: ValueOrStore<string | EmptyValue>
  target?: ValueOrStore<string | EmptyValue>
  type?: ValueOrStore<string | EmptyValue>
  width?: ValueOrStore<number | string | EmptyValue>

  // Other HTML properties supported by SVG elements in browsers
  role?: ValueOrStore<AriaRole | EmptyValue>
  tabIndex?: ValueOrStore<number | EmptyValue>
  crossOrigin?: ValueOrStore<CrossOrigin>

  // SVG Specific attributes
  accentHeight?: ValueOrStore<number | string | EmptyValue>
  accumulate?: ValueOrStore<'none' | 'sum' | EmptyValue>
  additive?: ValueOrStore<'replace' | 'sum' | EmptyValue>
  alignmentBaseline?: ValueOrStore<
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
  allowReorder?: ValueOrStore<'no' | 'yes' | EmptyValue>
  alphabetic?: ValueOrStore<number | string | EmptyValue>
  amplitude?: ValueOrStore<number | string | EmptyValue>
  arabicForm?: ValueOrStore<'initial' | 'medial' | 'terminal' | 'isolated' | EmptyValue>
  ascent?: ValueOrStore<number | string | EmptyValue>
  attributeName?: ValueOrStore<string | EmptyValue>
  attributeType?: ValueOrStore<string | EmptyValue>
  autoReverse?: ValueOrStore<Booleanish | EmptyValue>
  azimuth?: ValueOrStore<number | string | EmptyValue>
  baseFrequency?: ValueOrStore<number | string | EmptyValue>
  baselineShift?: ValueOrStore<number | string | EmptyValue>
  baseProfile?: ValueOrStore<number | string | EmptyValue>
  bbox?: ValueOrStore<number | string | EmptyValue>
  begin?: ValueOrStore<number | string | EmptyValue>
  bias?: ValueOrStore<number | string | EmptyValue>
  by?: ValueOrStore<number | string | EmptyValue>
  calcMode?: ValueOrStore<number | string | EmptyValue>
  capHeight?: ValueOrStore<number | string | EmptyValue>
  clip?: ValueOrStore<number | string | EmptyValue>
  clipPath?: ValueOrStore<string | EmptyValue>
  clipPathUnits?: ValueOrStore<number | string | EmptyValue>
  clipRule?: ValueOrStore<number | string | EmptyValue>
  colorInterpolation?: ValueOrStore<number | string | EmptyValue>
  colorInterpolationFilters?: ValueOrStore<'auto' | 'sRGB' | 'linearRGB' | 'inherit' | EmptyValue>
  colorProfile?: ValueOrStore<number | string | EmptyValue>
  colorRendering?: ValueOrStore<number | string | EmptyValue>
  contentScriptType?: ValueOrStore<number | string | EmptyValue>
  contentStyleType?: ValueOrStore<number | string | EmptyValue>
  cursor?: ValueOrStore<number | string | EmptyValue>
  cx?: ValueOrStore<number | string | EmptyValue>
  cy?: ValueOrStore<number | string | EmptyValue>
  d?: ValueOrStore<string | EmptyValue>
  decelerate?: ValueOrStore<number | string | EmptyValue>
  descent?: ValueOrStore<number | string | EmptyValue>
  diffuseConstant?: ValueOrStore<number | string | EmptyValue>
  direction?: ValueOrStore<number | string | EmptyValue>
  display?: ValueOrStore<number | string | EmptyValue>
  divisor?: ValueOrStore<number | string | EmptyValue>
  dominantBaseline?: ValueOrStore<number | string | EmptyValue>
  dur?: ValueOrStore<number | string | EmptyValue>
  dx?: ValueOrStore<number | string | EmptyValue>
  dy?: ValueOrStore<number | string | EmptyValue>
  edgeMode?: ValueOrStore<number | string | EmptyValue>
  elevation?: ValueOrStore<number | string | EmptyValue>
  enableBackground?: ValueOrStore<number | string | EmptyValue>
  end?: ValueOrStore<number | string | EmptyValue>
  exponent?: ValueOrStore<number | string | EmptyValue>
  externalResourcesRequired?: ValueOrStore<Booleanish | EmptyValue>
  fill?: ValueOrStore<string | EmptyValue>
  fillOpacity?: ValueOrStore<number | string | EmptyValue>
  fillRule?: ValueOrStore<'nonzero' | 'evenodd' | 'inherit' | EmptyValue>
  filter?: ValueOrStore<string | EmptyValue>
  filterRes?: ValueOrStore<number | string | EmptyValue>
  filterUnits?: ValueOrStore<number | string | EmptyValue>
  floodColor?: ValueOrStore<number | string | EmptyValue>
  floodOpacity?: ValueOrStore<number | string | EmptyValue>
  focusable?: ValueOrStore<Booleanish | 'auto' | EmptyValue>
  fontFamily?: ValueOrStore<string | EmptyValue>
  fontSize?: ValueOrStore<number | string | EmptyValue>
  fontSizeAdjust?: ValueOrStore<number | string | EmptyValue>
  fontStretch?: ValueOrStore<number | string | EmptyValue>
  fontStyle?: ValueOrStore<number | string | EmptyValue>
  fontVariant?: ValueOrStore<number | string | EmptyValue>
  fontWeight?: ValueOrStore<number | string | EmptyValue>
  format?: ValueOrStore<number | string | EmptyValue>
  fr?: ValueOrStore<number | string | EmptyValue>
  from?: ValueOrStore<number | string | EmptyValue>
  fx?: ValueOrStore<number | string | EmptyValue>
  fy?: ValueOrStore<number | string | EmptyValue>
  g1?: ValueOrStore<number | string | EmptyValue>
  g2?: ValueOrStore<number | string | EmptyValue>
  glyphName?: ValueOrStore<number | string | EmptyValue>
  glyphOrientationHorizontal?: ValueOrStore<number | string | EmptyValue>
  glyphOrientationVertical?: ValueOrStore<number | string | EmptyValue>
  glyphRef?: ValueOrStore<number | string | EmptyValue>
  gradientTransform?: ValueOrStore<string | EmptyValue>
  gradientUnits?: ValueOrStore<string | EmptyValue>
  hanging?: ValueOrStore<number | string | EmptyValue>
  horizAdvX?: ValueOrStore<number | string | EmptyValue>
  horizOriginX?: ValueOrStore<number | string | EmptyValue>
  href?: ValueOrStore<string | EmptyValue>
  ideographic?: ValueOrStore<number | string | EmptyValue>
  imageRendering?: ValueOrStore<number | string | EmptyValue>
  in2?: ValueOrStore<number | string | EmptyValue>
  in?: ValueOrStore<string | EmptyValue>
  intercept?: ValueOrStore<number | string | EmptyValue>
  k1?: ValueOrStore<number | string | EmptyValue>
  k2?: ValueOrStore<number | string | EmptyValue>
  k3?: ValueOrStore<number | string | EmptyValue>
  k4?: ValueOrStore<number | string | EmptyValue>
  k?: ValueOrStore<number | string | EmptyValue>
  kernelMatrix?: ValueOrStore<number | string | EmptyValue>
  kernelUnitLength?: ValueOrStore<number | string | EmptyValue>
  kerning?: ValueOrStore<number | string | EmptyValue>
  keyPoints?: ValueOrStore<number | string | EmptyValue>
  keySplines?: ValueOrStore<number | string | EmptyValue>
  keyTimes?: ValueOrStore<number | string | EmptyValue>
  lengthAdjust?: ValueOrStore<number | string | EmptyValue>
  letterSpacing?: ValueOrStore<number | string | EmptyValue>
  lightingColor?: ValueOrStore<number | string | EmptyValue>
  limitingConeAngle?: ValueOrStore<number | string | EmptyValue>
  local?: ValueOrStore<number | string | EmptyValue>
  markerEnd?: ValueOrStore<string | EmptyValue>
  markerHeight?: ValueOrStore<number | string | EmptyValue>
  markerMid?: ValueOrStore<string | EmptyValue>
  markerStart?: ValueOrStore<string | EmptyValue>
  markerUnits?: ValueOrStore<number | string | EmptyValue>
  markerWidth?: ValueOrStore<number | string | EmptyValue>
  mask?: ValueOrStore<string | EmptyValue>
  maskContentUnits?: ValueOrStore<number | string | EmptyValue>
  maskUnits?: ValueOrStore<number | string | EmptyValue>
  mathematical?: ValueOrStore<number | string | EmptyValue>
  mode?: ValueOrStore<number | string | EmptyValue>
  numOctaves?: ValueOrStore<number | string | EmptyValue>
  offset?: ValueOrStore<number | string | EmptyValue>
  opacity?: ValueOrStore<number | string | EmptyValue>
  operator?: ValueOrStore<number | string | EmptyValue>
  order?: ValueOrStore<number | string | EmptyValue>
  orient?: ValueOrStore<number | string | EmptyValue>
  orientation?: ValueOrStore<number | string | EmptyValue>
  origin?: ValueOrStore<number | string | EmptyValue>
  overflow?: ValueOrStore<number | string | EmptyValue>
  overlinePosition?: ValueOrStore<number | string | EmptyValue>
  overlineThickness?: ValueOrStore<number | string | EmptyValue>
  paintOrder?: ValueOrStore<number | string | EmptyValue>
  panose1?: ValueOrStore<number | string | EmptyValue>
  path?: ValueOrStore<string | EmptyValue>
  pathLength?: ValueOrStore<number | string | EmptyValue>
  patternContentUnits?: ValueOrStore<string | EmptyValue>
  patternTransform?: ValueOrStore<number | string | EmptyValue>
  patternUnits?: ValueOrStore<string | EmptyValue>
  pointerEvents?: ValueOrStore<number | string | EmptyValue>
  points?: ValueOrStore<string | EmptyValue>
  pointsAtX?: ValueOrStore<number | string | EmptyValue>
  pointsAtY?: ValueOrStore<number | string | EmptyValue>
  pointsAtZ?: ValueOrStore<number | string | EmptyValue>
  preserveAlpha?: ValueOrStore<Booleanish | EmptyValue>
  preserveAspectRatio?: ValueOrStore<string | EmptyValue>
  primitiveUnits?: ValueOrStore<number | string | EmptyValue>
  r?: ValueOrStore<number | string | EmptyValue>
  radius?: ValueOrStore<number | string | EmptyValue>
  refX?: ValueOrStore<number | string | EmptyValue>
  refY?: ValueOrStore<number | string | EmptyValue>
  renderingIntent?: ValueOrStore<number | string | EmptyValue>
  repeatCount?: ValueOrStore<number | string | EmptyValue>
  repeatDur?: ValueOrStore<number | string | EmptyValue>
  requiredExtensions?: ValueOrStore<number | string | EmptyValue>
  requiredFeatures?: ValueOrStore<number | string | EmptyValue>
  restart?: ValueOrStore<number | string | EmptyValue>
  result?: ValueOrStore<string | EmptyValue>
  rotate?: ValueOrStore<number | string | EmptyValue>
  rx?: ValueOrStore<number | string | EmptyValue>
  ry?: ValueOrStore<number | string | EmptyValue>
  scale?: ValueOrStore<number | string | EmptyValue>
  seed?: ValueOrStore<number | string | EmptyValue>
  shapeRendering?: ValueOrStore<number | string | EmptyValue>
  slope?: ValueOrStore<number | string | EmptyValue>
  spacing?: ValueOrStore<number | string | EmptyValue>
  specularConstant?: ValueOrStore<number | string | EmptyValue>
  specularExponent?: ValueOrStore<number | string | EmptyValue>
  speed?: ValueOrStore<number | string | EmptyValue>
  spreadMethod?: ValueOrStore<string | EmptyValue>
  startOffset?: ValueOrStore<number | string | EmptyValue>
  stdDeviation?: ValueOrStore<number | string | EmptyValue>
  stemh?: ValueOrStore<number | string | EmptyValue>
  stemv?: ValueOrStore<number | string | EmptyValue>
  stitchTiles?: ValueOrStore<number | string | EmptyValue>
  stopColor?: ValueOrStore<string | EmptyValue>
  stopOpacity?: ValueOrStore<number | string | EmptyValue>
  strikethroughPosition?: ValueOrStore<number | string | EmptyValue>
  strikethroughThickness?: ValueOrStore<number | string | EmptyValue>
  string?: ValueOrStore<number | string | EmptyValue>
  stroke?: ValueOrStore<string | EmptyValue>
  strokeDasharray?: ValueOrStore<string | number | EmptyValue>
  strokeDashoffset?: ValueOrStore<string | number | EmptyValue>
  strokeLinecap?: ValueOrStore<'butt' | 'round' | 'square' | 'inherit' | EmptyValue>
  strokeLinejoin?: ValueOrStore<'miter' | 'round' | 'bevel' | 'inherit' | EmptyValue>
  strokeMiterlimit?: ValueOrStore<number | string | EmptyValue>
  strokeOpacity?: ValueOrStore<number | string | EmptyValue>
  strokeWidth?: ValueOrStore<number | string | EmptyValue>
  surfaceScale?: ValueOrStore<number | string | EmptyValue>
  systemLanguage?: ValueOrStore<number | string | EmptyValue>
  tableValues?: ValueOrStore<number | string | EmptyValue>
  targetX?: ValueOrStore<number | string | EmptyValue>
  targetY?: ValueOrStore<number | string | EmptyValue>
  textAnchor?: ValueOrStore<string | EmptyValue>
  textDecoration?: ValueOrStore<number | string | EmptyValue>
  textLength?: ValueOrStore<number | string | EmptyValue>
  textRendering?: ValueOrStore<number | string | EmptyValue>
  to?: ValueOrStore<number | string | EmptyValue>
  transform?: ValueOrStore<string | EmptyValue>
  u1?: ValueOrStore<number | string | EmptyValue>
  u2?: ValueOrStore<number | string | EmptyValue>
  underlinePosition?: ValueOrStore<number | string | EmptyValue>
  underlineThickness?: ValueOrStore<number | string | EmptyValue>
  unicode?: ValueOrStore<number | string | EmptyValue>
  unicodeBidi?: ValueOrStore<number | string | EmptyValue>
  unicodeRange?: ValueOrStore<number | string | EmptyValue>
  unitsPerEm?: ValueOrStore<number | string | EmptyValue>
  vAlphabetic?: ValueOrStore<number | string | EmptyValue>
  values?: ValueOrStore<string | EmptyValue>
  vectorEffect?: ValueOrStore<number | string | EmptyValue>
  version?: ValueOrStore<string | EmptyValue>
  vertAdvY?: ValueOrStore<number | string | EmptyValue>
  vertOriginX?: ValueOrStore<number | string | EmptyValue>
  vertOriginY?: ValueOrStore<number | string | EmptyValue>
  vHanging?: ValueOrStore<number | string | EmptyValue>
  vIdeographic?: ValueOrStore<number | string | EmptyValue>
  viewBox?: ValueOrStore<string | EmptyValue>
  viewTarget?: ValueOrStore<number | string | EmptyValue>
  visibility?: ValueOrStore<number | string | EmptyValue>
  vMathematical?: ValueOrStore<number | string | EmptyValue>
  widths?: ValueOrStore<number | string | EmptyValue>
  wordSpacing?: ValueOrStore<number | string | EmptyValue>
  writingMode?: ValueOrStore<number | string | EmptyValue>
  x1?: ValueOrStore<number | string | EmptyValue>
  x2?: ValueOrStore<number | string | EmptyValue>
  x?: ValueOrStore<number | string | EmptyValue>
  xChannelSelector?: ValueOrStore<string | EmptyValue>
  xHeight?: ValueOrStore<number | string | EmptyValue>
  xlinkActuate?: ValueOrStore<string | EmptyValue>
  xlinkArcrole?: ValueOrStore<string | EmptyValue>
  xlinkHref?: ValueOrStore<string | EmptyValue>
  xlinkRole?: ValueOrStore<string | EmptyValue>
  xlinkShow?: ValueOrStore<string | EmptyValue>
  xlinkTitle?: ValueOrStore<string | EmptyValue>
  xlinkType?: ValueOrStore<string | EmptyValue>
  xmlBase?: ValueOrStore<string | EmptyValue>
  xmlLang?: ValueOrStore<string | EmptyValue>
  xmlns?: ValueOrStore<string | EmptyValue>
  xmlnsXlink?: ValueOrStore<string | EmptyValue>
  xmlSpace?: ValueOrStore<string | EmptyValue>
  y1?: ValueOrStore<number | string | EmptyValue>
  y2?: ValueOrStore<number | string | EmptyValue>
  y?: ValueOrStore<number | string | EmptyValue>
  yChannelSelector?: ValueOrStore<string | EmptyValue>
  z?: ValueOrStore<number | string | EmptyValue>
  zoomAndPan?: ValueOrStore<string | EmptyValue>
}
