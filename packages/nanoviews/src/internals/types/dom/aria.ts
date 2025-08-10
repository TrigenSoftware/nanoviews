import type { ValueOrAccessor } from 'kida'
import type { EmptyValue } from '../common.js'
import type { Booleanish } from './common.js'

// All the WAI-ARIA 1.1 role attribute values from https://www.w3.org/TR/wai-aria-1.1/#role_definitions
export type AriaRole =
  | 'alert'
  | 'alertdialog'
  | 'application'
  | 'article'
  | 'banner'
  | 'button'
  | 'cell'
  | 'checkbox'
  | 'columnheader'
  | 'combobox'
  | 'complementary'
  | 'contentinfo'
  | 'definition'
  | 'dialog'
  | 'directory'
  | 'document'
  | 'feed'
  | 'figure'
  | 'form'
  | 'grid'
  | 'gridcell'
  | 'group'
  | 'heading'
  | 'img'
  | 'link'
  | 'list'
  | 'listbox'
  | 'listitem'
  | 'log'
  | 'main'
  | 'marquee'
  | 'math'
  | 'menu'
  | 'menubar'
  | 'menuitem'
  | 'menuitemcheckbox'
  | 'menuitemradio'
  | 'navigation'
  | 'none'
  | 'note'
  | 'option'
  | 'presentation'
  | 'progressbar'
  | 'radio'
  | 'radiogroup'
  | 'region'
  | 'row'
  | 'rowgroup'
  | 'rowheader'
  | 'scrollbar'
  | 'search'
  | 'searchbox'
  | 'separator'
  | 'slider'
  | 'spinbutton'
  | 'status'
  | 'switch'
  | 'tab'
  | 'table'
  | 'tablist'
  | 'tabpanel'
  | 'term'
  | 'textbox'
  | 'timer'
  | 'toolbar'
  | 'tooltip'
  | 'tree'
  | 'treegrid'
  | 'treeitem'
  | string & {}

// All the WAI-ARIA 1.1 attributes from https://www.w3.org/TR/wai-aria-1.1/
export interface AriaAttributes {
  /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
  'aria-activedescendant'?: ValueOrAccessor<string | EmptyValue>
  /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
  'aria-atomic'?: ValueOrAccessor<Booleanish | EmptyValue>
  /**
   * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
   * presented if they are made.
   */
  'aria-autocomplete'?: ValueOrAccessor<'none' | 'inline' | 'list' | 'both' | EmptyValue>
  /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
  /**
   * Defines a string value that labels the current element, which is intended to be converted into Braille.
   * @see aria-label.
   */
  'aria-braillelabel'?: ValueOrAccessor<string | EmptyValue>
  /**
   * Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille.
   * @see aria-roledescription.
   */
  'aria-brailleroledescription'?: ValueOrAccessor<string | EmptyValue>
  'aria-busy'?: ValueOrAccessor<Booleanish | EmptyValue>
  /**
   * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
   * @see aria-pressed @see aria-selected.
   */
  'aria-checked'?: ValueOrAccessor<boolean | 'false' | 'mixed' | 'true' | EmptyValue>
  /**
   * Defines the total number of columns in a table, grid, or treegrid.
   * @see aria-colindex.
   */
  'aria-colcount'?: ValueOrAccessor<number | EmptyValue>
  /**
   * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
   * @see aria-colcount @see aria-colspan.
   */
  'aria-colindex'?: ValueOrAccessor<number | EmptyValue>
  /**
   * Defines a human readable text alternative of aria-colindex.
   * @see aria-rowindextext.
   */
  'aria-colindextext'?: ValueOrAccessor<string | EmptyValue>
  /**
   * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
   * @see aria-colindex @see aria-rowspan.
   */
  'aria-colspan'?: ValueOrAccessor<number | EmptyValue>
  /**
   * Identifies the element (or elements) whose contents or presence are controlled by the current element.
   * @see aria-owns.
   */
  'aria-controls'?: ValueOrAccessor<string | EmptyValue>
  /** Indicates the element that represents the current item within a container or set of related elements. */
  'aria-current'?: ValueOrAccessor<boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time' | EmptyValue>
  /**
   * Identifies the element (or elements) that describes the object.
   * @see aria-labelledby
   */
  'aria-describedby'?: ValueOrAccessor<string | EmptyValue>
  /**
   * Defines a string value that describes or annotates the current element.
   * @see related aria-describedby.
   */
  'aria-description'?: ValueOrAccessor<string | EmptyValue>
  /**
   * Identifies the element that provides a detailed, extended description for the object.
   * @see aria-describedby.
   */
  'aria-details'?: ValueOrAccessor<string | EmptyValue>
  /**
   * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
   * @see aria-hidden @see aria-readonly.
   */
  'aria-disabled'?: ValueOrAccessor<Booleanish | EmptyValue>
  /**
   * Indicates what functions can be performed when a dragged object is released on the drop target.
   * @deprecated in ARIA 1.1
   */
  'aria-dropeffect'?: ValueOrAccessor<'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup' | EmptyValue>
  /**
   * Identifies the element that provides an error message for the object.
   * @see aria-invalid @see aria-describedby.
   */
  'aria-errormessage'?: ValueOrAccessor<string | EmptyValue>
  /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
  'aria-expanded'?: ValueOrAccessor<Booleanish | EmptyValue>
  /**
   * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
   * allows assistive technology to override the general default of reading in document source order.
   */
  'aria-flowto'?: ValueOrAccessor<string | EmptyValue>
  /**
   * Indicates an element's "grabbed" state in a drag-and-drop operation.
   * @deprecated in ARIA 1.1
   */
  'aria-grabbed'?: ValueOrAccessor<Booleanish | EmptyValue>
  /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
  'aria-haspopup'?: ValueOrAccessor<boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | EmptyValue>
  /**
   * Indicates whether the element is exposed to an accessibility API.
   * @see aria-disabled.
   */
  'aria-hidden'?: ValueOrAccessor<Booleanish | EmptyValue>
  /**
   * Indicates the entered value does not conform to the format expected by the application.
   * @see aria-errormessage.
   */
  'aria-invalid'?: ValueOrAccessor<boolean | 'false' | 'true' | 'grammar' | 'spelling' | EmptyValue>
  /** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
  'aria-keyshortcuts'?: ValueOrAccessor<string | EmptyValue>
  /**
   * Defines a string value that labels the current element.
   * @see aria-labelledby.
   */
  'aria-label'?: ValueOrAccessor<string | EmptyValue>
  /**
   * Identifies the element (or elements) that labels the current element.
   * @see aria-describedby.
   */
  'aria-labelledby'?: ValueOrAccessor<string | EmptyValue>
  /** Defines the hierarchical level of an element within a structure. */
  'aria-level'?: ValueOrAccessor<number | EmptyValue>
  /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
  'aria-live'?: ValueOrAccessor<'off' | 'assertive' | 'polite' | EmptyValue>
  /** Indicates whether an element is modal when displayed. */
  'aria-modal'?: ValueOrAccessor<Booleanish | EmptyValue>
  /** Indicates whether a text box accepts multiple lines of input or only a single line. */
  'aria-multiline'?: ValueOrAccessor<Booleanish | EmptyValue>
  /** Indicates that the user may select more than one item from the current selectable descendants. */
  'aria-multiselectable'?: ValueOrAccessor<Booleanish | EmptyValue>
  /** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
  'aria-orientation'?: ValueOrAccessor<'horizontal' | 'vertical' | EmptyValue>
  /**
   * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
   * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
   * @see aria-controls.
   */
  'aria-owns'?: ValueOrAccessor<string | EmptyValue>
  /**
   * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
   * A hint could be a sample value or a brief description of the expected format.
   */
  'aria-placeholder'?: ValueOrAccessor<string | EmptyValue>
  /**
   * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
   * @see aria-setsize.
   */
  'aria-posinset'?: ValueOrAccessor<number | EmptyValue>
  /**
   * Indicates the current "pressed" state of toggle buttons.
   * @see aria-checked @see aria-selected.
   */
  'aria-pressed'?: ValueOrAccessor<boolean | 'false' | 'mixed' | 'true' | EmptyValue>
  /**
   * Indicates that the element is not editable, but is otherwise operable.
   * @see aria-disabled.
   */
  'aria-readonly'?: ValueOrAccessor<Booleanish | EmptyValue>
  /**
   * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
   * @see aria-atomic.
   */
  'aria-relevant'?: ValueOrAccessor<
    | 'additions'
    | 'additions removals'
    | 'additions text'
    | 'all'
    | 'removals'
    | 'removals additions'
    | 'removals text'
    | 'text'
    | 'text additions'
    | 'text removals'
    | EmptyValue
  >
  /** Indicates that user input is required on the element before a form may be submitted. */
  'aria-required'?: ValueOrAccessor<Booleanish | EmptyValue>
  /** Defines a human-readable, author-localized description for the role of an element. */
  'aria-roledescription'?: ValueOrAccessor<string | EmptyValue>
  /**
   * Defines the total number of rows in a table, grid, or treegrid.
   * @see aria-rowindex.
   */
  'aria-rowcount'?: ValueOrAccessor<number | EmptyValue>
  /**
   * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
   * @see aria-rowcount @see aria-rowspan.
   */
  'aria-rowindex'?: ValueOrAccessor<number | EmptyValue>
  /**
   * Defines a human readable text alternative of aria-rowindex.
   * @see aria-colindextext.
   */
  'aria-rowindextext'?: ValueOrAccessor<string | EmptyValue>
  /**
   * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
   * @see aria-rowindex @see aria-colspan.
   */
  'aria-rowspan'?: ValueOrAccessor<number | EmptyValue>
  /**
   * Indicates the current "selected" state of various widgets.
   * @see aria-checked @see aria-pressed.
   */
  'aria-selected'?: ValueOrAccessor<Booleanish | EmptyValue>
  /**
   * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
   * @see aria-posinset.
   */
  'aria-setsize'?: ValueOrAccessor<number | EmptyValue>
  /** Indicates if items in a table or grid are sorted in ascending or descending order. */
  'aria-sort'?: ValueOrAccessor<'none' | 'ascending' | 'descending' | 'other' | EmptyValue>
  /** Defines the maximum allowed value for a range widget. */
  'aria-valuemax'?: ValueOrAccessor<number | EmptyValue>
  /** Defines the minimum allowed value for a range widget. */
  'aria-valuemin'?: ValueOrAccessor<number | EmptyValue>
  /**
   * Defines the current value for a range widget.
   * @see aria-valuetext.
   */
  'aria-valuenow'?: ValueOrAccessor<number | EmptyValue>
  /** Defines the human readable text alternative of aria-valuenow for a range widget. */
  'aria-valuetext'?: ValueOrAccessor<string | EmptyValue>
}
