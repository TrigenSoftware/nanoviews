import type {
  NativeEvent,
  NativeAnimationEvent,
  NativeClipboardEvent,
  NativeCompositionEvent,
  NativeDragEvent,
  NativeFocusEvent,
  NativeKeyboardEvent,
  NativeMouseEvent,
  NativeTouchEvent,
  NativePointerEvent,
  NativeTransitionEvent,
  NativeUIEvent,
  NativeWheelEvent,
  NativeCommandEvent,
  NativeContentVisibilityAutoStateChangeEvent,
  NativeFormDataEvent,
  NativePictureInPictureEvent,
  NativeSecurityPolicyViolationEvent,
  NativeToggleEvent
} from './native.js'

type TargetEvent<T extends EventTarget, E extends NativeEvent> = E & {
  target: T
}

type TargetEventExt<T extends EventTarget, E extends NativeEvent, Ext extends Record<string, unknown>> = Omit<TargetEvent<T, E>, keyof Ext> & Ext

export type Event<T extends EventTarget = EventTarget> = TargetEvent<T, NativeEvent>

export type AnimationEvent<T extends EventTarget = EventTarget> = TargetEvent<T, NativeAnimationEvent>
export type ClipboardEvent<T extends EventTarget = EventTarget> = TargetEvent<T, NativeClipboardEvent>
export type CompositionEvent<T extends EventTarget = EventTarget> = TargetEvent<T, NativeCompositionEvent>
export type DragEvent<T extends EventTarget = EventTarget> = TargetEvent<T, NativeDragEvent>
export type FocusEvent<T extends EventTarget = EventTarget> = TargetEvent<T, NativeFocusEvent>
export type FormEvent<T extends EventTarget = EventTarget> = Event<T>
export type ChangeEvent<T extends EventTarget = EventTarget> = Event<T>

export type ModifierKey =
  | 'Alt'
  | 'AltGraph'
  | 'CapsLock'
  | 'Control'
  | 'Fn'
  | 'FnLock'
  | 'Hyper'
  | 'Meta'
  | 'NumLock'
  | 'ScrollLock'
  | 'Shift'
  | 'Super'
  | 'Symbol'
  | 'SymbolLock'

export type KeyboardEvent<T extends EventTarget = EventTarget> = TargetEventExt<T, NativeKeyboardEvent, {
  getModifierState(key: ModifierKey): boolean
}>
export type MouseEvent<T extends EventTarget = EventTarget> = TargetEventExt<T, NativeMouseEvent, {
  getModifierState(key: ModifierKey): boolean
}>
export type TouchEvent<T extends EventTarget = EventTarget> = TargetEventExt<T, NativeTouchEvent, {
  getModifierState(key: ModifierKey): boolean
}>
export type PointerEvent<T extends EventTarget = EventTarget> = TargetEventExt<T, NativePointerEvent, {
  pointerType: 'mouse' | 'pen' | 'touch'
}>

export type TransitionEvent<T extends EventTarget = EventTarget> = TargetEvent<T, NativeTransitionEvent>
export type UIEvent<T extends EventTarget = EventTarget> = TargetEvent<T, NativeUIEvent>
export type WheelEvent<T extends EventTarget = EventTarget> = TargetEvent<T, NativeWheelEvent>
export type CommandEvent<T extends EventTarget = EventTarget> = TargetEvent<T, NativeCommandEvent>
export type ContentVisibilityAutoStateChangeEvent<T extends EventTarget = EventTarget> = TargetEvent<T, NativeContentVisibilityAutoStateChangeEvent>
export type FormDataEvent<T extends EventTarget = EventTarget> = TargetEvent<T, NativeFormDataEvent>
export type PictureInPictureEvent<T extends EventTarget = EventTarget> = TargetEvent<T, NativePictureInPictureEvent>
export type SecurityPolicyViolationEvent<T extends EventTarget = EventTarget> = TargetEvent<T, NativeSecurityPolicyViolationEvent>
export type ToggleEvent<T extends EventTarget = EventTarget> = TargetEvent<T, NativeToggleEvent>

export type EventHandler<E extends Event> = { bivarianceHack(event: E): void }['bivarianceHack']

export type TargetEventHandler<T extends EventTarget = EventTarget> = EventHandler<Event<T>>

export type ClipboardEventHandler<T extends EventTarget = EventTarget> = EventHandler<ClipboardEvent<T>>
export type CompositionEventHandler<T extends EventTarget = EventTarget> = EventHandler<CompositionEvent<T>>
export type DragEventHandler<T extends EventTarget = EventTarget> = EventHandler<DragEvent<T>>
export type FocusEventHandler<T extends EventTarget = EventTarget> = EventHandler<FocusEvent<T>>
export type FormEventHandler<T extends EventTarget = EventTarget> = EventHandler<FormEvent<T>>
export type ChangeEventHandler<T extends EventTarget = EventTarget> = EventHandler<ChangeEvent<T>>
export type KeyboardEventHandler<T extends EventTarget = EventTarget> = EventHandler<KeyboardEvent<T>>
export type MouseEventHandler<T extends EventTarget = EventTarget> = EventHandler<MouseEvent<T>>
export type TouchEventHandler<T extends EventTarget = EventTarget> = EventHandler<TouchEvent<T>>
export type PointerEventHandler<T extends EventTarget = EventTarget> = EventHandler<PointerEvent<T>>
export type UIEventHandler<T extends EventTarget = EventTarget> = EventHandler<UIEvent<T>>
export type WheelEventHandler<T extends EventTarget = EventTarget> = EventHandler<WheelEvent<T>>
export type AnimationEventHandler<T extends EventTarget = EventTarget> = EventHandler<AnimationEvent<T>>
export type TransitionEventHandler<T extends EventTarget = EventTarget> = EventHandler<TransitionEvent<T>>
export type CommandEventHandler<T extends EventTarget = EventTarget> = EventHandler<CommandEvent<T>>
export type ContentVisibilityAutoStateChangeEventHandler<T extends EventTarget = EventTarget> = EventHandler<ContentVisibilityAutoStateChangeEvent<T>>
export type FormDataEventHandler<T extends EventTarget = EventTarget> = EventHandler<FormDataEvent<T>>
export type PictureInPictureEventHandler<T extends EventTarget = EventTarget> = EventHandler<PictureInPictureEvent<T>>
export type SecurityPolicyViolationEventHandler<T extends EventTarget = EventTarget> = EventHandler<SecurityPolicyViolationEvent<T>>
export type ToggleEventHandler<T extends EventTarget = EventTarget> = EventHandler<ToggleEvent<T>>

export interface DOMAttributes<T extends EventTarget = EventTarget> {
  // Clipboard Events
  onCopy?: ClipboardEventHandler<T> | undefined
  onCopyCapture?: ClipboardEventHandler<T> | undefined
  onCut?: ClipboardEventHandler<T> | undefined
  onCutCapture?: ClipboardEventHandler<T> | undefined
  onPaste?: ClipboardEventHandler<T> | undefined
  onPasteCapture?: ClipboardEventHandler<T> | undefined

  // Composition Events
  onCompositionEnd?: CompositionEventHandler<T> | undefined
  onCompositionEndCapture?: CompositionEventHandler<T> | undefined
  onCompositionStart?: CompositionEventHandler<T> | undefined
  onCompositionStartCapture?: CompositionEventHandler<T> | undefined
  onCompositionUpdate?: CompositionEventHandler<T> | undefined
  onCompositionUpdateCapture?: CompositionEventHandler<T> | undefined

  // Focus Events
  onFocus?: FocusEventHandler<T> | undefined
  onFocusCapture?: FocusEventHandler<T> | undefined
  onBlur?: FocusEventHandler<T> | undefined
  onBlurCapture?: FocusEventHandler<T> | undefined
  onFocusIn?: FocusEventHandler<T> | undefined
  onFocusInCapture?: FocusEventHandler<T> | undefined
  onFocusOut?: FocusEventHandler<T> | undefined
  onFocusOutCapture?: FocusEventHandler<T> | undefined

  // Form Events
  onChange?: FormEventHandler<T> | undefined
  onChangeCapture?: FormEventHandler<T> | undefined
  onBeforeInput?: FormEventHandler<T> | undefined
  onBeforeInputCapture?: FormEventHandler<T> | undefined
  onInput?: FormEventHandler<T> | undefined
  onInputCapture?: FormEventHandler<T> | undefined
  onReset?: FormEventHandler<T> | undefined
  onResetCapture?: FormEventHandler<T> | undefined
  onSubmit?: FormEventHandler<T> | undefined
  onSubmitCapture?: FormEventHandler<T> | undefined
  onInvalid?: FormEventHandler<T> | undefined
  onInvalidCapture?: FormEventHandler<T> | undefined
  onFormData?: FormDataEventHandler<T> | undefined
  onFormDataCapture?: FormDataEventHandler<T> | undefined

  // Image Events
  onLoad?: TargetEventHandler<T> | undefined
  onLoadCapture?: TargetEventHandler<T> | undefined
  onError?: TargetEventHandler<T> | undefined // also a Media Event
  onErrorCapture?: TargetEventHandler<T> | undefined // also a Media Event

  // Keyboard Events
  onKeyDown?: KeyboardEventHandler<T> | undefined
  onKeyDownCapture?: KeyboardEventHandler<T> | undefined
  /** @deprecated */
  onKeyPress?: KeyboardEventHandler<T> | undefined
  /** @deprecated */
  onKeyPressCapture?: KeyboardEventHandler<T> | undefined
  onKeyUp?: KeyboardEventHandler<T> | undefined
  onKeyUpCapture?: KeyboardEventHandler<T> | undefined

  // Media Events
  onAbort?: TargetEventHandler<T> | undefined
  onAbortCapture?: TargetEventHandler<T> | undefined
  onCanPlay?: TargetEventHandler<T> | undefined
  onCanPlayCapture?: TargetEventHandler<T> | undefined
  onCanPlayThrough?: TargetEventHandler<T> | undefined
  onCanPlayThroughCapture?: TargetEventHandler<T> | undefined
  onCueChange?: TargetEventHandler<T> | undefined
  onCueChangeCapture?: TargetEventHandler<T> | undefined
  onDurationChange?: TargetEventHandler<T> | undefined
  onDurationChangeCapture?: TargetEventHandler<T> | undefined
  onEmptied?: TargetEventHandler<T> | undefined
  onEmptiedCapture?: TargetEventHandler<T> | undefined
  onEncrypted?: TargetEventHandler<T> | undefined
  onEncryptedCapture?: TargetEventHandler<T> | undefined
  onEnded?: TargetEventHandler<T> | undefined
  onEndedCapture?: TargetEventHandler<T> | undefined
  onLoadedData?: TargetEventHandler<T> | undefined
  onLoadedDataCapture?: TargetEventHandler<T> | undefined
  onLoadedMetadata?: TargetEventHandler<T> | undefined
  onLoadedMetadataCapture?: TargetEventHandler<T> | undefined
  onLoadStart?: TargetEventHandler<T> | undefined
  onLoadStartCapture?: TargetEventHandler<T> | undefined
  onPause?: TargetEventHandler<T> | undefined
  onPauseCapture?: TargetEventHandler<T> | undefined
  onPlay?: TargetEventHandler<T> | undefined
  onPlayCapture?: TargetEventHandler<T> | undefined
  onPlaying?: TargetEventHandler<T> | undefined
  onPlayingCapture?: TargetEventHandler<T> | undefined
  onProgress?: TargetEventHandler<T> | undefined
  onProgressCapture?: TargetEventHandler<T> | undefined
  onRateChange?: TargetEventHandler<T> | undefined
  onRateChangeCapture?: TargetEventHandler<T> | undefined
  onResize?: TargetEventHandler<T> | undefined
  onResizeCapture?: TargetEventHandler<T> | undefined
  onSeeked?: TargetEventHandler<T> | undefined
  onSeekedCapture?: TargetEventHandler<T> | undefined
  onSeeking?: TargetEventHandler<T> | undefined
  onSeekingCapture?: TargetEventHandler<T> | undefined
  onStalled?: TargetEventHandler<T> | undefined
  onStalledCapture?: TargetEventHandler<T> | undefined
  onSuspend?: TargetEventHandler<T> | undefined
  onSuspendCapture?: TargetEventHandler<T> | undefined
  onTimeUpdate?: TargetEventHandler<T> | undefined
  onTimeUpdateCapture?: TargetEventHandler<T> | undefined
  onVolumeChange?: TargetEventHandler<T> | undefined
  onVolumeChangeCapture?: TargetEventHandler<T> | undefined
  onWaiting?: TargetEventHandler<T> | undefined
  onWaitingCapture?: TargetEventHandler<T> | undefined
  onWaitingForKey?: TargetEventHandler<T> | undefined
  onWaitingForKeyCapture?: TargetEventHandler<T> | undefined

  // MouseEvents
  onAuxClick?: MouseEventHandler<T> | undefined
  onAuxClickCapture?: MouseEventHandler<T> | undefined
  onClick?: MouseEventHandler<T> | undefined
  onClickCapture?: MouseEventHandler<T> | undefined
  onContextMenu?: MouseEventHandler<T> | undefined
  onContextMenuCapture?: MouseEventHandler<T> | undefined
  onDblClick?: MouseEventHandler<T> | undefined
  onDblClickCapture?: MouseEventHandler<T> | undefined
  onDrag?: DragEventHandler<T> | undefined
  onDragCapture?: DragEventHandler<T> | undefined
  onDragEnd?: DragEventHandler<T> | undefined
  onDragEndCapture?: DragEventHandler<T> | undefined
  onDragEnter?: DragEventHandler<T> | undefined
  onDragEnterCapture?: DragEventHandler<T> | undefined
  onDragExit?: DragEventHandler<T> | undefined
  onDragExitCapture?: DragEventHandler<T> | undefined
  onDragLeave?: DragEventHandler<T> | undefined
  onDragLeaveCapture?: DragEventHandler<T> | undefined
  onDragOver?: DragEventHandler<T> | undefined
  onDragOverCapture?: DragEventHandler<T> | undefined
  onDragStart?: DragEventHandler<T> | undefined
  onDragStartCapture?: DragEventHandler<T> | undefined
  onDrop?: DragEventHandler<T> | undefined
  onDropCapture?: DragEventHandler<T> | undefined
  onMouseDown?: MouseEventHandler<T> | undefined
  onMouseDownCapture?: MouseEventHandler<T> | undefined
  onMouseEnter?: MouseEventHandler<T> | undefined
  onMouseLeave?: MouseEventHandler<T> | undefined
  onMouseMove?: MouseEventHandler<T> | undefined
  onMouseMoveCapture?: MouseEventHandler<T> | undefined
  onMouseOut?: MouseEventHandler<T> | undefined
  onMouseOutCapture?: MouseEventHandler<T> | undefined
  onMouseOver?: MouseEventHandler<T> | undefined
  onMouseOverCapture?: MouseEventHandler<T> | undefined
  onMouseUp?: MouseEventHandler<T> | undefined
  onMouseUpCapture?: MouseEventHandler<T> | undefined

  // Selection Events
  onSelect?: TargetEventHandler<T> | undefined
  onSelectCapture?: TargetEventHandler<T> | undefined
  onSelectionChange?: TargetEventHandler<T> | undefined
  onSelectionChangeCapture?: TargetEventHandler<T> | undefined
  onSelectStart?: TargetEventHandler<T> | undefined
  onSelectStartCapture?: TargetEventHandler<T> | undefined

  // Touch Events
  onTouchCancel?: TouchEventHandler<T> | undefined
  onTouchCancelCapture?: TouchEventHandler<T> | undefined
  onTouchEnd?: TouchEventHandler<T> | undefined
  onTouchEndCapture?: TouchEventHandler<T> | undefined
  onTouchMove?: TouchEventHandler<T> | undefined
  onTouchMoveCapture?: TouchEventHandler<T> | undefined
  onTouchStart?: TouchEventHandler<T> | undefined
  onTouchStartCapture?: TouchEventHandler<T> | undefined

  // Pointer Events
  onPointerDown?: PointerEventHandler<T> | undefined
  onPointerDownCapture?: PointerEventHandler<T> | undefined
  onPointerMove?: PointerEventHandler<T> | undefined
  onPointerMoveCapture?: PointerEventHandler<T> | undefined
  onPointerRawUpdate?: PointerEventHandler<T> | undefined
  onPointerRawUpdateCapture?: PointerEventHandler<T> | undefined
  onPointerUp?: PointerEventHandler<T> | undefined
  onPointerUpCapture?: PointerEventHandler<T> | undefined
  onPointerCancel?: PointerEventHandler<T> | undefined
  onPointerCancelCapture?: PointerEventHandler<T> | undefined
  onPointerEnter?: PointerEventHandler<T> | undefined
  onPointerEnterCapture?: PointerEventHandler<T> | undefined
  onPointerLeave?: PointerEventHandler<T> | undefined
  onPointerLeaveCapture?: PointerEventHandler<T> | undefined
  onPointerOver?: PointerEventHandler<T> | undefined
  onPointerOverCapture?: PointerEventHandler<T> | undefined
  onPointerOut?: PointerEventHandler<T> | undefined
  onPointerOutCapture?: PointerEventHandler<T> | undefined
  onGotPointerCapture?: PointerEventHandler<T> | undefined
  onGotPointerCaptureCapture?: PointerEventHandler<T> | undefined
  onLostPointerCapture?: PointerEventHandler<T> | undefined
  onLostPointerCaptureCapture?: PointerEventHandler<T> | undefined

  // UI Events
  onScroll?: UIEventHandler<T> | undefined
  onScrollCapture?: UIEventHandler<T> | undefined
  onScrollEnd?: TargetEventHandler<T> | undefined
  onScrollEndCapture?: TargetEventHandler<T> | undefined

  // Wheel Events
  onWheel?: WheelEventHandler<T> | undefined
  onWheelCapture?: WheelEventHandler<T> | undefined

  // Animation Events
  onAnimationStart?: AnimationEventHandler<T> | undefined
  onAnimationStartCapture?: AnimationEventHandler<T> | undefined
  onAnimationEnd?: AnimationEventHandler<T> | undefined
  onAnimationEndCapture?: AnimationEventHandler<T> | undefined
  onAnimationIteration?: AnimationEventHandler<T> | undefined
  onAnimationIterationCapture?: AnimationEventHandler<T> | undefined
  onAnimationCancel?: AnimationEventHandler<T> | undefined
  onAnimationCancelCapture?: AnimationEventHandler<T> | undefined

  // Transition Events
  onTransitionEnd?: TransitionEventHandler<T> | undefined
  onTransitionEndCapture?: TransitionEventHandler<T> | undefined
  onTransitionCancel?: TransitionEventHandler<T> | undefined
  onTransitionCancelCapture?: TransitionEventHandler<T> | undefined
  onTransitionRun?: TransitionEventHandler<T> | undefined
  onTransitionRunCapture?: TransitionEventHandler<T> | undefined
  onTransitionStart?: TransitionEventHandler<T> | undefined
  onTransitionStartCapture?: TransitionEventHandler<T> | undefined

  // Toggle Events
  onBeforeToggle?: ToggleEventHandler<T> | undefined
  onBeforeToggleCapture?: ToggleEventHandler<T> | undefined
  onToggle?: ToggleEventHandler<T> | undefined
  onToggleCapture?: ToggleEventHandler<T> | undefined

  // Command Events
  onCommand?: CommandEventHandler<T> | undefined
  onCommandCapture?: CommandEventHandler<T> | undefined

  // Dialog Events, `cancel` also fires on file inputs
  onCancel?: TargetEventHandler<T> | undefined
  onCancelCapture?: TargetEventHandler<T> | undefined
  onClose?: TargetEventHandler<T> | undefined
  onCloseCapture?: TargetEventHandler<T> | undefined

  // Find-in-page Events
  onBeforeMatch?: TargetEventHandler<T> | undefined
  onBeforeMatchCapture?: TargetEventHandler<T> | undefined

  // Fullscreen Events
  onFullscreenChange?: TargetEventHandler<T> | undefined
  onFullscreenChangeCapture?: TargetEventHandler<T> | undefined
  onFullscreenError?: TargetEventHandler<T> | undefined
  onFullscreenErrorCapture?: TargetEventHandler<T> | undefined

  // Canvas Events
  onContextLost?: TargetEventHandler<T> | undefined
  onContextLostCapture?: TargetEventHandler<T> | undefined
  onContextRestored?: TargetEventHandler<T> | undefined
  onContextRestoredCapture?: TargetEventHandler<T> | undefined

  // Shadow DOM Events
  onSlotChange?: TargetEventHandler<T> | undefined
  onSlotChangeCapture?: TargetEventHandler<T> | undefined

  // Content Visibility Events
  onContentVisibilityAutoStateChange?: ContentVisibilityAutoStateChangeEventHandler<T> | undefined
  onContentVisibilityAutoStateChangeCapture?: ContentVisibilityAutoStateChangeEventHandler<T> | undefined

  // Security Events
  onSecurityPolicyViolation?: SecurityPolicyViolationEventHandler<T> | undefined
  onSecurityPolicyViolationCapture?: SecurityPolicyViolationEventHandler<T> | undefined
}
