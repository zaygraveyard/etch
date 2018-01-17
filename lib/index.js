import dom from './dom'
import render from './render'
import {initialize, update, updateSync, destroy, destroySync} from './component-helpers'
import {setScheduler, getScheduler} from './scheduler-assignment'

export default {
  dom, render,
  initialize, update, updateSync, destroy, destroySync,
  setScheduler, getScheduler
}
export {
  dom, render,
  initialize, update, updateSync, destroy, destroySync,
  setScheduler, getScheduler
}
