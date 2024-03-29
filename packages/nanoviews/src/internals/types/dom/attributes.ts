/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as CSS from 'csstype'
import type { ValueOrStore } from '../common.js'
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
  defaultChecked?: ValueOrStore<boolean | undefined>
  defaultValue?: ValueOrStore<string | number | readonly string[] | undefined>
  suppressContentEditableWarning?: ValueOrStore<boolean | undefined>
  suppressHydrationWarning?: ValueOrStore<boolean | undefined>

  // Standard HTML Attributes
  accessKey?: ValueOrStore<string | undefined>
  autoFocus?: ValueOrStore<boolean | undefined>
  class?: ValueOrStore<string | undefined>
  contentEditable?: ValueOrStore<Booleanish | 'inherit' | 'plaintext-only' | undefined>
  contextMenu?: ValueOrStore<string | undefined>
  dir?: ValueOrStore<string | undefined>
  draggable?: ValueOrStore<Booleanish | undefined>
  hidden?: ValueOrStore<boolean | undefined>
  id?: ValueOrStore<string | undefined>
  lang?: ValueOrStore<string | undefined>
  nonce?: ValueOrStore<string | undefined>
  slot?: ValueOrStore<string | undefined>
  spellCheck?: ValueOrStore<Booleanish | undefined>
  style?: ValueOrStore<string | undefined>
  tabIndex?: ValueOrStore<number | undefined>
  title?: ValueOrStore<string | undefined>
  translate?: ValueOrStore<'yes' | 'no' | undefined>

  // Unknown
  radioGroup?: ValueOrStore<string | undefined> // <command>, <menuitem>

  // WAI-ARIA
  role?: ValueOrStore<AriaRole | undefined>

  // RDFa Attributes
  about?: ValueOrStore<string | undefined>
  content?: ValueOrStore<string | undefined>
  datatype?: ValueOrStore<string | undefined>
  inlist?: ValueOrStore<any>
  prefix?: ValueOrStore<string | undefined>
  property?: ValueOrStore<string | undefined>
  rel?: ValueOrStore<string | undefined>
  resource?: ValueOrStore<string | undefined>
  rev?: ValueOrStore<string | undefined>
  typeof?: ValueOrStore<string | undefined>
  vocab?: ValueOrStore<string | undefined>

  // Non-standard Attributes
  autoCapitalize?: ValueOrStore<string | undefined>
  autoCorrect?: ValueOrStore<string | undefined>
  autoSave?: ValueOrStore<string | undefined>
  color?: ValueOrStore<string | undefined>
  itemProp?: ValueOrStore<string | undefined>
  itemScope?: ValueOrStore<boolean | undefined>
  itemType?: ValueOrStore<string | undefined>
  itemID?: ValueOrStore<string | undefined>
  itemRef?: ValueOrStore<string | undefined>
  results?: ValueOrStore<number | undefined>
  security?: ValueOrStore<string | undefined>
  unselectable?: ValueOrStore<'on' | 'off' | undefined>

  // Living Standard
  /**
   * Hints at the type of data that might be entered by the user while editing the element or its contents
   * @see {@link https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute}
   */
  inputMode?: ValueOrStore<'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search' | undefined>
  /**
   * Specify that a standard HTML element should behave like a defined custom built-in element
   * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is}
   */
  is?: ValueOrStore<string | undefined>

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
  href?: ValueOrStore<string | undefined>
  hrefLang?: ValueOrStore<string | undefined>
  media?: ValueOrStore<string | undefined>
  ping?: ValueOrStore<string | undefined>
  target?: ValueOrStore<HTMLAttributeAnchorTarget | undefined>
  type?: ValueOrStore<string | undefined>
  referrerPolicy?: ValueOrStore<HTMLAttributeReferrerPolicy | undefined>
}

export interface AudioHTMLAttributes<T extends HTMLElement> extends MediaHTMLAttributes<T> {}

export interface AreaHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  alt?: ValueOrStore<string | undefined>
  coords?: ValueOrStore<string | undefined>
  download?: ValueOrStore<any>
  href?: ValueOrStore<string | undefined>
  hrefLang?: ValueOrStore<string | undefined>
  media?: ValueOrStore<string | undefined>
  referrerPolicy?: ValueOrStore<HTMLAttributeReferrerPolicy | undefined>
  shape?: ValueOrStore<string | undefined>
  target?: ValueOrStore<string | undefined>
}

export interface BaseHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  href?: ValueOrStore<string | undefined>
  target?: ValueOrStore<string | undefined>
}

export interface BlockquoteHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  cite?: ValueOrStore<string | undefined>
}

export interface ButtonHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  disabled?: ValueOrStore<boolean | undefined>
  form?: ValueOrStore<string | undefined>
  formAction?: ValueOrStore<string | undefined>
  formEncType?: ValueOrStore<string | undefined>
  formMethod?: ValueOrStore<string | undefined>
  formNoValidate?: ValueOrStore<boolean | undefined>
  formTarget?: ValueOrStore<string | undefined>
  name?: ValueOrStore<string | undefined>
  type?: ValueOrStore<'submit' | 'reset' | 'button' | undefined>
  value?: ValueOrStore<string | readonly string[] | number | undefined>
}

export interface CanvasHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  height?: ValueOrStore<number | string | undefined>
  width?: ValueOrStore<number | string | undefined>
}

export interface ColHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  span?: ValueOrStore<number | undefined>
  width?: ValueOrStore<number | string | undefined>
}

export interface ColgroupHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  span?: ValueOrStore<number | undefined>
}

export interface DataHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  value?: ValueOrStore<string | readonly string[] | number | undefined>
}

export interface DetailsHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  open?: ValueOrStore<boolean | undefined>
  onToggle?: TargetEventHandler<T> | undefined
  name?: ValueOrStore<string | undefined>
}

export interface DelHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  cite?: ValueOrStore<string | undefined>
  dateTime?: ValueOrStore<string | undefined>
}

export interface DialogHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  onCancel?: TargetEventHandler<T> | undefined
  onClose?: TargetEventHandler<T> | undefined
  open?: ValueOrStore<boolean | undefined>
}

export interface EmbedHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  height?: ValueOrStore<number | string | undefined>
  src?: ValueOrStore<string | undefined>
  type?: ValueOrStore<string | undefined>
  width?: ValueOrStore<number | string | undefined>
}

export interface FieldsetHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  disabled?: ValueOrStore<boolean | undefined>
  form?: ValueOrStore<string | undefined>
  name?: ValueOrStore<string | undefined>
}

export interface FormHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  acceptCharset?: ValueOrStore<string | undefined>
  action?: ValueOrStore<string | undefined>
  autoComplete?: ValueOrStore<string | undefined>
  encType?: ValueOrStore<string | undefined>
  method?: ValueOrStore<string | undefined>
  name?: ValueOrStore<string | undefined>
  noValidate?: ValueOrStore<boolean | undefined>
  target?: ValueOrStore<string | undefined>
}

export interface HtmlHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  manifest?: ValueOrStore<string | undefined>
}

export interface IframeHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  allow?: ValueOrStore<string | undefined>
  allowFullScreen?: ValueOrStore<boolean | undefined>
  allowTransparency?: ValueOrStore<boolean | undefined>
  /** @deprecated */
  frameBorder?: ValueOrStore<number | string | undefined>
  height?: ValueOrStore<number | string | undefined>
  loading?: ValueOrStore<'eager' | 'lazy' | undefined>
  /** @deprecated */
  marginHeight?: ValueOrStore<number | undefined>
  /** @deprecated */
  marginWidth?: ValueOrStore<number | undefined>
  name?: ValueOrStore<string | undefined>
  referrerPolicy?: ValueOrStore<HTMLAttributeReferrerPolicy | undefined>
  sandbox?: ValueOrStore<string | undefined>
  /** @deprecated */
  scrolling?: ValueOrStore<string | undefined>
  seamless?: ValueOrStore<boolean | undefined>
  src?: ValueOrStore<string | undefined>
  srcDoc?: ValueOrStore<string | undefined>
  width?: ValueOrStore<number | string | undefined>
}

export interface ImgHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  alt?: ValueOrStore<string | undefined>
  crossOrigin?: ValueOrStore<CrossOrigin>
  decoding?: ValueOrStore<'async' | 'auto' | 'sync' | undefined>
  fetchPriority?: ValueOrStore<'high' | 'low' | 'auto'>
  height?: ValueOrStore<number | string | undefined>
  loading?: ValueOrStore<'eager' | 'lazy' | undefined>
  referrerPolicy?: ValueOrStore<HTMLAttributeReferrerPolicy | undefined>
  sizes?: ValueOrStore<string | undefined>
  src?: ValueOrStore<string | undefined>
  srcSet?: ValueOrStore<string | undefined>
  useMap?: ValueOrStore<string | undefined>
  width?: ValueOrStore<number | string | undefined>
}

export interface InsHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  cite?: ValueOrStore<string | undefined>
  dateTime?: ValueOrStore<string | undefined>
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
  accept?: ValueOrStore<string | undefined>
  alt?: ValueOrStore<string | undefined>
  autoComplete?: ValueOrStore<HTMLInputAutoCompleteAttribute | undefined>
  capture?: ValueOrStore<boolean | 'user' | 'environment' | undefined> // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
  checked?: ValueOrStore<boolean | undefined>
  disabled?: ValueOrStore<boolean | undefined>
  enterKeyHint?: ValueOrStore<'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send' | undefined>
  form?: ValueOrStore<string | undefined>
  formAction?: ValueOrStore<string | undefined>
  formEncType?: ValueOrStore<string | undefined>
  formMethod?: ValueOrStore<string | undefined>
  formNoValidate?: ValueOrStore<boolean | undefined>
  formTarget?: ValueOrStore<string | undefined>
  height?: ValueOrStore<number | string | undefined>
  list?: ValueOrStore<string | undefined>
  max?: ValueOrStore<number | string | undefined>
  maxLength?: ValueOrStore<number | undefined>
  min?: ValueOrStore<number | string | undefined>
  minLength?: ValueOrStore<number | undefined>
  multiple?: ValueOrStore<boolean | undefined>
  name?: ValueOrStore<string | undefined>
  pattern?: ValueOrStore<string | undefined>
  placeholder?: ValueOrStore<string | undefined>
  readOnly?: ValueOrStore<boolean | undefined>
  required?: ValueOrStore<boolean | undefined>
  size?: ValueOrStore<number | undefined>
  src?: ValueOrStore<string | undefined>
  step?: ValueOrStore<number | string | undefined>
  type?: ValueOrStore<HTMLInputTypeAttribute | undefined>
  value?: ValueOrStore<string | readonly string[] | number | undefined>
  width?: ValueOrStore<number | string | undefined>

  onChange?: ChangeEventHandler<T> | undefined
}

export interface KeygenHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  challenge?: ValueOrStore<string | undefined>
  disabled?: ValueOrStore<boolean | undefined>
  form?: ValueOrStore<string | undefined>
  keyType?: ValueOrStore<string | undefined>
  keyParams?: ValueOrStore<string | undefined>
  name?: ValueOrStore<string | undefined>
}

export interface LabelHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  form?: ValueOrStore<string | undefined>
  htmlFor?: ValueOrStore<string | undefined>
}

export interface LiHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  value?: ValueOrStore<string | readonly string[] | number | undefined>
}

export interface LinkHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  as?: ValueOrStore<string | undefined>
  crossOrigin?: ValueOrStore<CrossOrigin>
  fetchPriority?: ValueOrStore<'high' | 'low' | 'auto'>
  href?: ValueOrStore<string | undefined>
  hrefLang?: ValueOrStore<string | undefined>
  integrity?: ValueOrStore<string | undefined>
  media?: ValueOrStore<string | undefined>
  imageSrcSet?: ValueOrStore<string | undefined>
  imageSizes?: ValueOrStore<string | undefined>
  referrerPolicy?: ValueOrStore<HTMLAttributeReferrerPolicy | undefined>
  sizes?: ValueOrStore<string | undefined>
  type?: ValueOrStore<string | undefined>
  charSet?: ValueOrStore<string | undefined>
}

export interface MapHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  name?: ValueOrStore<string | undefined>
}

export interface MenuHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  type?: ValueOrStore<string | undefined>
}

export interface MediaHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  autoPlay?: ValueOrStore<boolean | undefined>
  controls?: ValueOrStore<boolean | undefined>
  controlsList?: ValueOrStore<string | undefined>
  crossOrigin?: ValueOrStore<CrossOrigin>
  loop?: ValueOrStore<boolean | undefined>
  mediaGroup?: ValueOrStore<string | undefined>
  muted?: ValueOrStore<boolean | undefined>
  playsInline?: ValueOrStore<boolean | undefined>
  preload?: ValueOrStore<string | undefined>
  src?: ValueOrStore<string | undefined>
}

export interface MetaHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  charSet?: ValueOrStore<string | undefined>
  content?: ValueOrStore<string | undefined>
  httpEquiv?: ValueOrStore<string | undefined>
  media?: ValueOrStore<string | undefined>
  name?: ValueOrStore<string | undefined>
}

export interface MeterHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  form?: ValueOrStore<string | undefined>
  high?: ValueOrStore<number | undefined>
  low?: ValueOrStore<number | undefined>
  max?: ValueOrStore<number | string | undefined>
  min?: ValueOrStore<number | string | undefined>
  optimum?: ValueOrStore<number | undefined>
  value?: ValueOrStore<string | readonly string[] | number | undefined>
}

export interface QuoteHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  cite?: ValueOrStore<string | undefined>
}

export interface ObjectHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  classID?: ValueOrStore<string | undefined>
  data?: ValueOrStore<string | undefined>
  form?: ValueOrStore<string | undefined>
  height?: ValueOrStore<number | string | undefined>
  name?: ValueOrStore<string | undefined>
  type?: ValueOrStore<string | undefined>
  useMap?: ValueOrStore<string | undefined>
  width?: ValueOrStore<number | string | undefined>
  wmode?: ValueOrStore<string | undefined>
}

export interface OlHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  reversed?: ValueOrStore<boolean | undefined>
  start?: ValueOrStore<number | undefined>
  type?: ValueOrStore<'1' | 'a' | 'A' | 'i' | 'I' | undefined>
}

export interface OptgroupHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  disabled?: ValueOrStore<boolean | undefined>
  label?: ValueOrStore<string | undefined>
}

export interface OptionHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  disabled?: ValueOrStore<boolean | undefined>
  label?: ValueOrStore<string | undefined>
  selected?: ValueOrStore<boolean | undefined>
  value?: ValueOrStore<string | readonly string[] | number | undefined>
}

export interface OutputHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  form?: ValueOrStore<string | undefined>
  htmlFor?: ValueOrStore<string | undefined>
  name?: ValueOrStore<string | undefined>
}

export interface ParamHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  name?: ValueOrStore<string | undefined>
  value?: ValueOrStore<string | readonly string[] | number | undefined>
}

export interface ProgressHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  max?: ValueOrStore<number | string | undefined>
  value?: ValueOrStore<string | readonly string[] | number | undefined>
}

export interface SlotHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  name?: ValueOrStore<string | undefined>
}

export interface ScriptHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  async?: ValueOrStore<boolean | undefined>
  /** @deprecated */
  charSet?: ValueOrStore<string | undefined>
  crossOrigin?: ValueOrStore<CrossOrigin>
  defer?: ValueOrStore<boolean | undefined>
  integrity?: ValueOrStore<string | undefined>
  noModule?: ValueOrStore<boolean | undefined>
  referrerPolicy?: ValueOrStore<HTMLAttributeReferrerPolicy | undefined>
  src?: ValueOrStore<string | undefined>
  type?: ValueOrStore<string | undefined>
}

export interface SelectHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  autoComplete?: ValueOrStore<string | undefined>
  disabled?: ValueOrStore<boolean | undefined>
  form?: ValueOrStore<string | undefined>
  multiple?: ValueOrStore<boolean | undefined>
  name?: ValueOrStore<string | undefined>
  required?: ValueOrStore<boolean | undefined>
  size?: ValueOrStore<number | undefined>
  value?: ValueOrStore<string | readonly string[] | number | undefined>
  onChange?: ChangeEventHandler<T> | undefined
}

export interface SourceHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  height?: ValueOrStore<number | string | undefined>
  media?: ValueOrStore<string | undefined>
  sizes?: ValueOrStore<string | undefined>
  src?: ValueOrStore<string | undefined>
  srcSet?: ValueOrStore<string | undefined>
  type?: ValueOrStore<string | undefined>
  width?: ValueOrStore<number | string | undefined>
}

export interface StyleHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  media?: ValueOrStore<string | undefined>
  scoped?: ValueOrStore<boolean | undefined>
  type?: ValueOrStore<string | undefined>
}

export interface TableHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  align?: ValueOrStore<'left' | 'center' | 'right' | undefined>
  bgcolor?: ValueOrStore<string | undefined>
  border?: ValueOrStore<number | undefined>
  cellPadding?: ValueOrStore<number | string | undefined>
  cellSpacing?: ValueOrStore<number | string | undefined>
  frame?: ValueOrStore<boolean | undefined>
  rules?: ValueOrStore<'none' | 'groups' | 'rows' | 'columns' | 'all' | undefined>
  summary?: ValueOrStore<string | undefined>
  width?: ValueOrStore<number | string | undefined>
}

export interface TextareaHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  autoComplete?: ValueOrStore<string | undefined>
  cols?: ValueOrStore<number | undefined>
  dirName?: ValueOrStore<string | undefined>
  disabled?: ValueOrStore<boolean | undefined>
  form?: ValueOrStore<string | undefined>
  maxLength?: ValueOrStore<number | undefined>
  minLength?: ValueOrStore<number | undefined>
  name?: ValueOrStore<string | undefined>
  placeholder?: ValueOrStore<string | undefined>
  readOnly?: ValueOrStore<boolean | undefined>
  required?: ValueOrStore<boolean | undefined>
  rows?: ValueOrStore<number | undefined>
  value?: ValueOrStore<string | readonly string[] | number | undefined>
  wrap?: ValueOrStore<string | undefined>

  onChange?: ChangeEventHandler<T> | undefined
}

export interface TdHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  align?: ValueOrStore<'left' | 'center' | 'right' | 'justify' | 'char' | undefined>
  colSpan?: ValueOrStore<number | undefined>
  headers?: ValueOrStore<string | undefined>
  rowSpan?: ValueOrStore<number | undefined>
  scope?: ValueOrStore<string | undefined>
  abbr?: ValueOrStore<string | undefined>
  height?: ValueOrStore<number | string | undefined>
  width?: ValueOrStore<number | string | undefined>
  valign?: ValueOrStore<'top' | 'middle' | 'bottom' | 'baseline' | undefined>
}

export interface ThHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  align?: ValueOrStore<'left' | 'center' | 'right' | 'justify' | 'char' | undefined>
  colSpan?: ValueOrStore<number | undefined>
  headers?: ValueOrStore<string | undefined>
  rowSpan?: ValueOrStore<number | undefined>
  scope?: ValueOrStore<string | undefined>
  abbr?: ValueOrStore<string | undefined>
}

export interface TimeHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  dateTime?: ValueOrStore<string | undefined>
}

export interface TrackHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
  default?: ValueOrStore<boolean | undefined>
  kind?: ValueOrStore<string | undefined>
  label?: ValueOrStore<string | undefined>
  src?: ValueOrStore<string | undefined>
  srcLang?: ValueOrStore<string | undefined>
}

export interface VideoHTMLAttributes<T extends HTMLElement> extends MediaHTMLAttributes<T> {
  height?: ValueOrStore<number | string | undefined>
  playsInline?: ValueOrStore<boolean | undefined>
  poster?: ValueOrStore<string | undefined>
  width?: ValueOrStore<number | string | undefined>
  disablePictureInPicture?: ValueOrStore<boolean | undefined>
  disableRemotePlayback?: ValueOrStore<boolean | undefined>
}

// The three broad type categories are (in order of restrictiveness):
//   - "number | string"
//   - "string"
//   - union of string literals
export interface SVGAttributes<T extends Element> extends AriaAttributes, DOMAttributes<T> {
  // Attributes which also defined in HTMLAttributes
  // See comment in SVGDOMPropertyConfig.js
  class?: ValueOrStore<string | undefined>
  color?: ValueOrStore<string | undefined>
  height?: ValueOrStore<number | string | undefined>
  id?: ValueOrStore<string | undefined>
  lang?: ValueOrStore<string | undefined>
  max?: ValueOrStore<number | string | undefined>
  media?: ValueOrStore<string | undefined>
  method?: ValueOrStore<string | undefined>
  min?: ValueOrStore<number | string | undefined>
  name?: ValueOrStore<string | undefined>
  style?: ValueOrStore<string | undefined>
  target?: ValueOrStore<string | undefined>
  type?: ValueOrStore<string | undefined>
  width?: ValueOrStore<number | string | undefined>

  // Other HTML properties supported by SVG elements in browsers
  role?: ValueOrStore<AriaRole | undefined>
  tabIndex?: ValueOrStore<number | undefined>
  crossOrigin?: ValueOrStore<CrossOrigin>

  // SVG Specific attributes
  accentHeight?: ValueOrStore<number | string | undefined>
  accumulate?: ValueOrStore<'none' | 'sum' | undefined>
  additive?: ValueOrStore<'replace' | 'sum' | undefined>
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
    | undefined
  >
  allowReorder?: ValueOrStore<'no' | 'yes' | undefined>
  alphabetic?: ValueOrStore<number | string | undefined>
  amplitude?: ValueOrStore<number | string | undefined>
  arabicForm?: ValueOrStore<'initial' | 'medial' | 'terminal' | 'isolated' | undefined>
  ascent?: ValueOrStore<number | string | undefined>
  attributeName?: ValueOrStore<string | undefined>
  attributeType?: ValueOrStore<string | undefined>
  autoReverse?: ValueOrStore<Booleanish | undefined>
  azimuth?: ValueOrStore<number | string | undefined>
  baseFrequency?: ValueOrStore<number | string | undefined>
  baselineShift?: ValueOrStore<number | string | undefined>
  baseProfile?: ValueOrStore<number | string | undefined>
  bbox?: ValueOrStore<number | string | undefined>
  begin?: ValueOrStore<number | string | undefined>
  bias?: ValueOrStore<number | string | undefined>
  by?: ValueOrStore<number | string | undefined>
  calcMode?: ValueOrStore<number | string | undefined>
  capHeight?: ValueOrStore<number | string | undefined>
  clip?: ValueOrStore<number | string | undefined>
  clipPath?: ValueOrStore<string | undefined>
  clipPathUnits?: ValueOrStore<number | string | undefined>
  clipRule?: ValueOrStore<number | string | undefined>
  colorInterpolation?: ValueOrStore<number | string | undefined>
  colorInterpolationFilters?: ValueOrStore<'auto' | 'sRGB' | 'linearRGB' | 'inherit' | undefined>
  colorProfile?: ValueOrStore<number | string | undefined>
  colorRendering?: ValueOrStore<number | string | undefined>
  contentScriptType?: ValueOrStore<number | string | undefined>
  contentStyleType?: ValueOrStore<number | string | undefined>
  cursor?: ValueOrStore<number | string | undefined>
  cx?: ValueOrStore<number | string | undefined>
  cy?: ValueOrStore<number | string | undefined>
  d?: ValueOrStore<string | undefined>
  decelerate?: ValueOrStore<number | string | undefined>
  descent?: ValueOrStore<number | string | undefined>
  diffuseConstant?: ValueOrStore<number | string | undefined>
  direction?: ValueOrStore<number | string | undefined>
  display?: ValueOrStore<number | string | undefined>
  divisor?: ValueOrStore<number | string | undefined>
  dominantBaseline?: ValueOrStore<number | string | undefined>
  dur?: ValueOrStore<number | string | undefined>
  dx?: ValueOrStore<number | string | undefined>
  dy?: ValueOrStore<number | string | undefined>
  edgeMode?: ValueOrStore<number | string | undefined>
  elevation?: ValueOrStore<number | string | undefined>
  enableBackground?: ValueOrStore<number | string | undefined>
  end?: ValueOrStore<number | string | undefined>
  exponent?: ValueOrStore<number | string | undefined>
  externalResourcesRequired?: ValueOrStore<Booleanish | undefined>
  fill?: ValueOrStore<string | undefined>
  fillOpacity?: ValueOrStore<number | string | undefined>
  fillRule?: ValueOrStore<'nonzero' | 'evenodd' | 'inherit' | undefined>
  filter?: ValueOrStore<string | undefined>
  filterRes?: ValueOrStore<number | string | undefined>
  filterUnits?: ValueOrStore<number | string | undefined>
  floodColor?: ValueOrStore<number | string | undefined>
  floodOpacity?: ValueOrStore<number | string | undefined>
  focusable?: ValueOrStore<Booleanish | 'auto' | undefined>
  fontFamily?: ValueOrStore<string | undefined>
  fontSize?: ValueOrStore<number | string | undefined>
  fontSizeAdjust?: ValueOrStore<number | string | undefined>
  fontStretch?: ValueOrStore<number | string | undefined>
  fontStyle?: ValueOrStore<number | string | undefined>
  fontVariant?: ValueOrStore<number | string | undefined>
  fontWeight?: ValueOrStore<number | string | undefined>
  format?: ValueOrStore<number | string | undefined>
  fr?: ValueOrStore<number | string | undefined>
  from?: ValueOrStore<number | string | undefined>
  fx?: ValueOrStore<number | string | undefined>
  fy?: ValueOrStore<number | string | undefined>
  g1?: ValueOrStore<number | string | undefined>
  g2?: ValueOrStore<number | string | undefined>
  glyphName?: ValueOrStore<number | string | undefined>
  glyphOrientationHorizontal?: ValueOrStore<number | string | undefined>
  glyphOrientationVertical?: ValueOrStore<number | string | undefined>
  glyphRef?: ValueOrStore<number | string | undefined>
  gradientTransform?: ValueOrStore<string | undefined>
  gradientUnits?: ValueOrStore<string | undefined>
  hanging?: ValueOrStore<number | string | undefined>
  horizAdvX?: ValueOrStore<number | string | undefined>
  horizOriginX?: ValueOrStore<number | string | undefined>
  href?: ValueOrStore<string | undefined>
  ideographic?: ValueOrStore<number | string | undefined>
  imageRendering?: ValueOrStore<number | string | undefined>
  in2?: ValueOrStore<number | string | undefined>
  in?: ValueOrStore<string | undefined>
  intercept?: ValueOrStore<number | string | undefined>
  k1?: ValueOrStore<number | string | undefined>
  k2?: ValueOrStore<number | string | undefined>
  k3?: ValueOrStore<number | string | undefined>
  k4?: ValueOrStore<number | string | undefined>
  k?: ValueOrStore<number | string | undefined>
  kernelMatrix?: ValueOrStore<number | string | undefined>
  kernelUnitLength?: ValueOrStore<number | string | undefined>
  kerning?: ValueOrStore<number | string | undefined>
  keyPoints?: ValueOrStore<number | string | undefined>
  keySplines?: ValueOrStore<number | string | undefined>
  keyTimes?: ValueOrStore<number | string | undefined>
  lengthAdjust?: ValueOrStore<number | string | undefined>
  letterSpacing?: ValueOrStore<number | string | undefined>
  lightingColor?: ValueOrStore<number | string | undefined>
  limitingConeAngle?: ValueOrStore<number | string | undefined>
  local?: ValueOrStore<number | string | undefined>
  markerEnd?: ValueOrStore<string | undefined>
  markerHeight?: ValueOrStore<number | string | undefined>
  markerMid?: ValueOrStore<string | undefined>
  markerStart?: ValueOrStore<string | undefined>
  markerUnits?: ValueOrStore<number | string | undefined>
  markerWidth?: ValueOrStore<number | string | undefined>
  mask?: ValueOrStore<string | undefined>
  maskContentUnits?: ValueOrStore<number | string | undefined>
  maskUnits?: ValueOrStore<number | string | undefined>
  mathematical?: ValueOrStore<number | string | undefined>
  mode?: ValueOrStore<number | string | undefined>
  numOctaves?: ValueOrStore<number | string | undefined>
  offset?: ValueOrStore<number | string | undefined>
  opacity?: ValueOrStore<number | string | undefined>
  operator?: ValueOrStore<number | string | undefined>
  order?: ValueOrStore<number | string | undefined>
  orient?: ValueOrStore<number | string | undefined>
  orientation?: ValueOrStore<number | string | undefined>
  origin?: ValueOrStore<number | string | undefined>
  overflow?: ValueOrStore<number | string | undefined>
  overlinePosition?: ValueOrStore<number | string | undefined>
  overlineThickness?: ValueOrStore<number | string | undefined>
  paintOrder?: ValueOrStore<number | string | undefined>
  panose1?: ValueOrStore<number | string | undefined>
  path?: ValueOrStore<string | undefined>
  pathLength?: ValueOrStore<number | string | undefined>
  patternContentUnits?: ValueOrStore<string | undefined>
  patternTransform?: ValueOrStore<number | string | undefined>
  patternUnits?: ValueOrStore<string | undefined>
  pointerEvents?: ValueOrStore<number | string | undefined>
  points?: ValueOrStore<string | undefined>
  pointsAtX?: ValueOrStore<number | string | undefined>
  pointsAtY?: ValueOrStore<number | string | undefined>
  pointsAtZ?: ValueOrStore<number | string | undefined>
  preserveAlpha?: ValueOrStore<Booleanish | undefined>
  preserveAspectRatio?: ValueOrStore<string | undefined>
  primitiveUnits?: ValueOrStore<number | string | undefined>
  r?: ValueOrStore<number | string | undefined>
  radius?: ValueOrStore<number | string | undefined>
  refX?: ValueOrStore<number | string | undefined>
  refY?: ValueOrStore<number | string | undefined>
  renderingIntent?: ValueOrStore<number | string | undefined>
  repeatCount?: ValueOrStore<number | string | undefined>
  repeatDur?: ValueOrStore<number | string | undefined>
  requiredExtensions?: ValueOrStore<number | string | undefined>
  requiredFeatures?: ValueOrStore<number | string | undefined>
  restart?: ValueOrStore<number | string | undefined>
  result?: ValueOrStore<string | undefined>
  rotate?: ValueOrStore<number | string | undefined>
  rx?: ValueOrStore<number | string | undefined>
  ry?: ValueOrStore<number | string | undefined>
  scale?: ValueOrStore<number | string | undefined>
  seed?: ValueOrStore<number | string | undefined>
  shapeRendering?: ValueOrStore<number | string | undefined>
  slope?: ValueOrStore<number | string | undefined>
  spacing?: ValueOrStore<number | string | undefined>
  specularConstant?: ValueOrStore<number | string | undefined>
  specularExponent?: ValueOrStore<number | string | undefined>
  speed?: ValueOrStore<number | string | undefined>
  spreadMethod?: ValueOrStore<string | undefined>
  startOffset?: ValueOrStore<number | string | undefined>
  stdDeviation?: ValueOrStore<number | string | undefined>
  stemh?: ValueOrStore<number | string | undefined>
  stemv?: ValueOrStore<number | string | undefined>
  stitchTiles?: ValueOrStore<number | string | undefined>
  stopColor?: ValueOrStore<string | undefined>
  stopOpacity?: ValueOrStore<number | string | undefined>
  strikethroughPosition?: ValueOrStore<number | string | undefined>
  strikethroughThickness?: ValueOrStore<number | string | undefined>
  string?: ValueOrStore<number | string | undefined>
  stroke?: ValueOrStore<string | undefined>
  strokeDasharray?: ValueOrStore<string | number | undefined>
  strokeDashoffset?: ValueOrStore<string | number | undefined>
  strokeLinecap?: ValueOrStore<'butt' | 'round' | 'square' | 'inherit' | undefined>
  strokeLinejoin?: ValueOrStore<'miter' | 'round' | 'bevel' | 'inherit' | undefined>
  strokeMiterlimit?: ValueOrStore<number | string | undefined>
  strokeOpacity?: ValueOrStore<number | string | undefined>
  strokeWidth?: ValueOrStore<number | string | undefined>
  surfaceScale?: ValueOrStore<number | string | undefined>
  systemLanguage?: ValueOrStore<number | string | undefined>
  tableValues?: ValueOrStore<number | string | undefined>
  targetX?: ValueOrStore<number | string | undefined>
  targetY?: ValueOrStore<number | string | undefined>
  textAnchor?: ValueOrStore<string | undefined>
  textDecoration?: ValueOrStore<number | string | undefined>
  textLength?: ValueOrStore<number | string | undefined>
  textRendering?: ValueOrStore<number | string | undefined>
  to?: ValueOrStore<number | string | undefined>
  transform?: ValueOrStore<string | undefined>
  u1?: ValueOrStore<number | string | undefined>
  u2?: ValueOrStore<number | string | undefined>
  underlinePosition?: ValueOrStore<number | string | undefined>
  underlineThickness?: ValueOrStore<number | string | undefined>
  unicode?: ValueOrStore<number | string | undefined>
  unicodeBidi?: ValueOrStore<number | string | undefined>
  unicodeRange?: ValueOrStore<number | string | undefined>
  unitsPerEm?: ValueOrStore<number | string | undefined>
  vAlphabetic?: ValueOrStore<number | string | undefined>
  values?: ValueOrStore<string | undefined>
  vectorEffect?: ValueOrStore<number | string | undefined>
  version?: ValueOrStore<string | undefined>
  vertAdvY?: ValueOrStore<number | string | undefined>
  vertOriginX?: ValueOrStore<number | string | undefined>
  vertOriginY?: ValueOrStore<number | string | undefined>
  vHanging?: ValueOrStore<number | string | undefined>
  vIdeographic?: ValueOrStore<number | string | undefined>
  viewBox?: ValueOrStore<string | undefined>
  viewTarget?: ValueOrStore<number | string | undefined>
  visibility?: ValueOrStore<number | string | undefined>
  vMathematical?: ValueOrStore<number | string | undefined>
  widths?: ValueOrStore<number | string | undefined>
  wordSpacing?: ValueOrStore<number | string | undefined>
  writingMode?: ValueOrStore<number | string | undefined>
  x1?: ValueOrStore<number | string | undefined>
  x2?: ValueOrStore<number | string | undefined>
  x?: ValueOrStore<number | string | undefined>
  xChannelSelector?: ValueOrStore<string | undefined>
  xHeight?: ValueOrStore<number | string | undefined>
  xlinkActuate?: ValueOrStore<string | undefined>
  xlinkArcrole?: ValueOrStore<string | undefined>
  xlinkHref?: ValueOrStore<string | undefined>
  xlinkRole?: ValueOrStore<string | undefined>
  xlinkShow?: ValueOrStore<string | undefined>
  xlinkTitle?: ValueOrStore<string | undefined>
  xlinkType?: ValueOrStore<string | undefined>
  xmlBase?: ValueOrStore<string | undefined>
  xmlLang?: ValueOrStore<string | undefined>
  xmlns?: ValueOrStore<string | undefined>
  xmlnsXlink?: ValueOrStore<string | undefined>
  xmlSpace?: ValueOrStore<string | undefined>
  y1?: ValueOrStore<number | string | undefined>
  y2?: ValueOrStore<number | string | undefined>
  y?: ValueOrStore<number | string | undefined>
  yChannelSelector?: ValueOrStore<string | undefined>
  z?: ValueOrStore<number | string | undefined>
  zoomAndPan?: ValueOrStore<string | undefined>
}
