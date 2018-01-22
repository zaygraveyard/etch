const hasSymbol = typeof Symbol === 'function' && Symbol.for;
export default const Fragment = hasSymbol ? Symbol.for('etch.fragment') : 0xeacb
