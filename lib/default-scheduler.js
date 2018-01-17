// If the scheduler is not customized via `etch.setScheduler`, an instance of
// this class will be used to schedule updates to the document. The
// `updateDocument` method accepts functions to be run at some point in the
// future, then runs them on the next animation frame.
export default class DefaultScheduler {
  constructor () {
    this._updateRequests = []
    this._readRequests = []
    this._pendingAnimationFrame = null
    this._performUpdates = this._performUpdates.bind(this)
  }

  // Enqueues functions that write to the DOM to be performed on the next
  // animation frame. Functions passed to this method should *never* read from
  // the DOM, because that could cause synchronous reflows.
  updateDocument (fn) {
    this._updateRequests.push(fn)
    if (!this._pendingAnimationFrame) {
      this._pendingAnimationFrame = window.requestAnimationFrame(this._performUpdates)
    }
  }

  readDocument (fn) {
    this._readRequests.push(fn)
    if (!this._pendingAnimationFrame) {
      this._pendingAnimationFrame = window.requestAnimationFrame(this._performUpdates)
    }
  }

  // Returns a promise that will resolve at the end of the next update cycle,
  // after all the functions passed to `updateDocument` and `updateDocumentSync`
  // have been run.
  getNextUpdatePromise () {
    if (!this._nextUpdatePromise) {
      this._nextUpdatePromise = new Promise(resolve => {
        this._resolveNextUpdatePromise = resolve
      })
    }
    return this._nextUpdatePromise
  }

  // Performs all the pending document updates. If running these update
  // functions causes *more* updates to be enqueued, they are run synchronously
  // in this update cycle without waiting for another frame.
  _performUpdates () {
    while (this._updateRequests.length > 0) {
      this._updateRequests.shift()()
    }

    // We don't clear the pending frame until all update requests are processed.
    // This ensures updates requested within other updates are processed in the
    // current frame.
    this._pendingAnimationFrame = null

    // Now that updates are processed, we can perform all pending document reads
    // without the risk of interleaving them with writes and causing layout
    // thrashing.
    while (this._readRequests.length > 0) {
      this._readRequests.shift()()
    }

    if (this._nextUpdatePromise) {
      let resolveNextUpdatePromise = this._resolveNextUpdatePromise
      this._nextUpdatePromise = null
      this._resolveNextUpdatePromise = null
      resolveNextUpdatePromise()
    }
  }
}
