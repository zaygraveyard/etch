import EVENT_LISTENER_PROPS from './event-listener-props'
import SVG_TAGS from './svg-tags'
import SVG_ATTRIBUTE_TRANSLATIONS from './svg-attribute-translations'

const EMPTY = ''

export default function (domNode, oldVirtualNode, newVirtualNode, options) {
  const oldProps = oldVirtualNode && oldVirtualNode.props
  const newProps = newVirtualNode.props

  let refs, listenerContext
  if (options) {
    refs = options.refs
    listenerContext = options.listenerContext
  }
  updateProps(domNode, oldVirtualNode, oldProps, newVirtualNode, newProps)
  if (refs) updateRef(domNode, oldProps && oldProps.ref, newProps && newProps.ref, refs)
  updateEventListeners(domNode, oldVirtualNode, newVirtualNode, listenerContext)
}

// Using var to avoid "Unsupported phi use of variable" deoptimization in Chrome 56
function updateProps (domNode, oldVirtualNode, oldProps, newVirtualNode, newProps) {
  if (oldProps) {
    for (var name in oldProps) {
      if (name === 'ref' || name === 'on') continue
      if (EVENT_LISTENER_PROPS.has(name)) continue
      if (!newProps || !(name in newProps)) {
        if (name === 'dataset') {
          updateProps(domNode.dataset, null, oldProps && oldProps.dataset, null, null)
        } else if (name !== 'innerHTML' && oldVirtualNode && SVG_TAGS.has(oldVirtualNode.tag)) {
          domNode.removeAttribute(SVG_ATTRIBUTE_TRANSLATIONS.get(name) || name)
        } else {
          // Clear property for objects that don't support deletion (e.g. style
          // or className). If we used null instead of an empty string, the DOM
          // could sometimes stringify the value and mistakenly assign 'null'.
          domNode[name] = EMPTY
          delete domNode[name]
        }
      }
    }
  }

  if (newProps) {
    for (var name in newProps) {
      if (name === 'ref' || name === 'on') continue
      if (EVENT_LISTENER_PROPS.has(name)) continue
      var oldValue = oldProps && oldProps[name]
      var newValue = newProps[name]
      if (name === 'dataset') {
        updateNestedProps(domNode.dataset, oldValue, newValue, false)
      } else if (name === 'style' && typeof newValue !== 'string') {
        if (typeof oldValue === 'string') {
          domNode.style = ''
          oldValue = null
        }
        updateNestedProps(domNode.style, oldValue, newValue, true)
      } else if (name === 'attributes') {
        updateAttributes(domNode, oldValue, newValue)
      } else if (
        name === 'value' &&
        newVirtualNode && (
          newVirtualNode.tag === 'input' ||
          newVirtualNode.tag === 'select'
        )
      ) {
        // Do not update `value` of an `input` unless it differs.
        // Every change will reset the cursor position.
        if (domNode[name] !== newValue) {
          domNode[name] = newValue
        }
      } else if (newValue !== oldValue) {
        if (name !== 'innerHTML' && newVirtualNode && SVG_TAGS.has(newVirtualNode.tag)) {
          domNode.setAttribute(SVG_ATTRIBUTE_TRANSLATIONS.get(name) || name, newValue)
        } else {
          domNode[name] = newValue
        }
      }
    }
  }
}

function updateNestedProps (domProps, oldProps, newProps, isStyleObject) {
  if (oldProps) {
    for (var name in oldProps) {
      if (!newProps || !(name in newProps)) {
        if (isStyleObject) {
          domProps[name] = EMPTY
        } else {
          delete domProps[name]
        }
      }
    }
  }

  if (newProps) {
    for (var name in newProps) {
      const oldValue = oldProps && oldProps[name]
      const newValue = newProps[name]
      if (newValue !== oldValue) {
        domProps[name] = newValue
      }
    }
  }
}

function updateAttributes (domNode, oldAttributes, newAttributes) {
  if (oldAttributes) {
    for (var name in oldAttributes) {
      if (!newAttributes || !(name in newAttributes)) {
        domNode.removeAttribute(name)
      }
    }
  }

  if (newAttributes) {
    for (var name in newAttributes) {
      const oldValue = oldAttributes && oldAttributes[name]
      const newValue = newAttributes[name]
      if (newValue !== oldValue) {
        domNode.setAttribute(name, newValue)
      }
    }
  }
}

function updateRef (domNode, oldRefName, newRefName, refs) {
  if (newRefName !== oldRefName) {
    if (oldRefName && refs[oldRefName] === domNode) delete refs[oldRefName]
    if (newRefName) refs[newRefName] = domNode
  }
}

function updateEventListeners (domNode, oldVirtualNode, newVirtualNode, listenerContext) {
  const oldListeners = oldVirtualNode && oldVirtualNode.props && oldVirtualNode.props.on
  const newListeners = newVirtualNode.props && newVirtualNode.props.on

  for (const eventName in oldListeners) {
    if (!(newListeners && eventName in newListeners)) {
      let listenerToRemove
      if (oldVirtualNode && oldVirtualNode._boundListeners && oldVirtualNode._boundListeners[eventName]) {
        listenerToRemove = oldVirtualNode._boundListeners[eventName]
      } else {
        listenerToRemove = oldListeners[eventName]
      }
      const capturing = eventName.startsWith('_');
      domNode.removeEventListener(capturing ? eventName.substr(1) : eventName, listenerToRemove, capturing)
    }
  }

  for (const eventName in newListeners) {
    const oldListener = oldListeners && oldListeners[eventName]
    const newListener = newListeners[eventName]

    if (newListener !== oldListener) {
      if (oldListener) {
        let listenerToRemove
        if (oldVirtualNode && oldVirtualNode._boundListeners && oldVirtualNode._boundListeners[eventName]) {
          listenerToRemove = oldVirtualNode._boundListeners[eventName]
        } else {
          listenerToRemove = oldListener
        }
        const capturing = eventName.startsWith('_');
        domNode.removeEventListener(capturing ? eventName.substr(1) : eventName, listenerToRemove, capturing)
      }
      if (newListener) {
        let listenerToAdd
        if (listenerContext) {
          listenerToAdd = newListener.bind(listenerContext)
          if (!newVirtualNode._boundListeners) newVirtualNode._boundListeners = {}
          newVirtualNode._boundListeners[eventName] = listenerToAdd
        } else {
          listenerToAdd = newListener
        }
        const capturing = eventName.startsWith('_');
        domNode.addEventListener(capturing ? eventName.substr(1) : eventName, listenerToAdd, capturing)
      }
    }
  }
}
