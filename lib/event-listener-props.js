const EVENT_PROP_NAMES = '\
onCopy,\
onCut,\
onPaste,\
onCompositionEnd,\
onCompositionStart,\
onCompositionUpdate,\
onKeyDown,\
onKeyPress,\
onKeyUp,\
onFocus,\
onBlur,\
onChange,\
onInput,\
onSubmit,\
onClick,\
onContextMenu,\
onDrag,\
onDragEnd,\
onDragEnter,\
onDragExit,\
onDragLeave,\
onDragOver,\
onDragStart,\
onDrop,\
onMouseDown,\
onMouseEnter,\
onMouseLeave,\
onMouseMove,\
onMouseOut,\
onMouseOver,\
onMouseUp,\
onSelect,\
onTouchCancel,\
onTouchEnd,\
onTouchMove,\
onTouchStart,\
onScroll,\
onWheel,\
onAbort,\
onCanPlay,\
onCanPlayThrough,\
onDurationChange,\
onEmptied,\
onEncrypted,\
onEnded,\
onError,\
onLoadedData,\
onLoadedMetadata,\
onLoadStart,\
onPause,\
onPlay,\
onPlaying,\
onProgress,\
onRateChange,\
onSeeked,\
onSeeking,\
onStalled,\
onSuspend,\
onTimeUpdate,\
onVolumeChange,\
onWaiting,\
onLoad,\
onAnimationStart,\
onAnimationEnd,\
onAnimationIteration,\
onTransitionEnd,\
'.split(',');

// Remove the last empty element
EVENT_PROP_NAMES.pop();

const EVENT_LISTENER_PROPS = new Map(
  [].concat(
    [
      ['onDoubleClick', 'dblclick'],
      ['onDoubleClickCapture', '_dblclick'],
    ],
    EVENT_PROP_NAMES.map(propName => [propName, propName.substr(2).toLowerCase()]),
    EVENT_PROP_NAMES.map(propName => [propName + 'Capture', '_' + propName.substr(2).toLowerCase()])
  )
)

export default EVENT_LISTENER_PROPS
