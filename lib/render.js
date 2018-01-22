import Fragment from './fragment'
import updateProps from './update-props'
import SVG_TAGS from './svg-tags'

const isArray = Array.isArray

export default function render (virtualNode, options) {
  return _render(options, virtualNode)
}

function _render (options, virtualNode) {
  if (isArray(virtualNode)) {
    return virtualNode.map(_render.bind(null, options))
  }

  let domNode
  if (virtualNode.text != null) {
    domNode = document.createTextNode(virtualNode.text)
  } else {
    const {tag, children} = virtualNode
    let {props} = virtualNode

    if (typeof tag === 'function') {
      let ref
      if (props && props.ref) {
        ref = props.ref
      }
      const component = new tag(props || {}, children)
      virtualNode.component = component
      domNode = component.element
      if (options && options.refs && ref) {
        options.refs[ref] = component
      }
    } else if (tag === Fragment) {
      virtualNode.domNode = document.createComment('etch.fragment')
      if (children) {
        virtualNode.domNodes = _render(options, children)
      }
      return virtualNode.domNodes
    } else {
      if (SVG_TAGS.has(tag)) {
        domNode = document.createElementNS("http://www.w3.org/2000/svg", tag);
      } else {
        domNode = document.createElement(tag)
      }
      if (children) addChildren(domNode, children, options)
      if (props) updateProps(domNode, null, virtualNode, options)
    }
  }
  virtualNode.domNode = domNode
  return domNode
}

function addChildren (parent, children, options) {
  for (let i = 0; i < children.length; i++) {
    const childDomNodes = _render(options, children[i]);

    if (isArray(childDomNodes)) {
      childDomNodes.forEach(parent.appendChild, parent)
    } else {
      parent.appendChild(childDomNodes)
    }
  }
}
