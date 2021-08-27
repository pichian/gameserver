'use strict';
module.exports = class GlobError extends Error {
    constructor(type, message) {
      super(message)
      this.type = type
    }
  
    withDebug(debug) {
      this.debug = debug
      return this
    }
  }