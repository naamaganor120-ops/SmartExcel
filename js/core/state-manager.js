/**
 * StateManager - Simple page-level state container using the observer pattern.
 *
 * Provides reactive state management for each page. Listeners registered via on()
 * are notified whenever the corresponding state key is updated via set().
 *
 * Usage:
 *   StateManager.init({ isLoading: false, error: null });
 *   StateManager.on('isLoading', (value) => toggleSpinner(value));
 *   StateManager.set('isLoading', true);
 *   StateManager.get('isLoading'); // true
 *   StateManager.get(); // { isLoading: true, error: null }
 */
var StateManager = {
  /** @private Internal state store */
  _state: {},

  /** @private Listeners map: key → callback[] */
  _listeners: {},

  /**
   * Initialize (or reset) state for a page.
   * Clears all previous state and listeners, then sets the provided initial state.
   * @param {Object} initialState - Key/value pairs to set as initial state
   */
  init: function init(initialState) {
    this._state = {};
    this._listeners = {};

    if (initialState && typeof initialState === 'object') {
      var keys = Object.keys(initialState);
      for (var i = 0; i < keys.length; i++) {
        this._state[keys[i]] = initialState[keys[i]];
      }
    }
  },

  /**
   * Get the current state or a specific key's value.
   * @param {string} [key] - Optional state key. If omitted, returns the full state object.
   * @returns {any} The value for the given key, or a shallow copy of the full state.
   */
  get: function get(key) {
    if (typeof key === 'undefined' || key === null) {
      // Return a shallow copy to prevent direct mutation
      var copy = {};
      var keys = Object.keys(this._state);
      for (var i = 0; i < keys.length; i++) {
        copy[keys[i]] = this._state[keys[i]];
      }
      return copy;
    }
    return this._state[key];
  },

  /**
   * Update a state key and notify all registered listeners for that key.
   * @param {string} key - The state key to update
   * @param {any} value - The new value
   */
  set: function set(key, value) {
    var oldValue = this._state[key];
    this._state[key] = value;

    // Notify listeners registered for this key
    if (this._listeners[key] && this._listeners[key].length > 0) {
      for (var i = 0; i < this._listeners[key].length; i++) {
        try {
          this._listeners[key][i](value, oldValue, key);
        } catch (e) {
          // Prevent one failing listener from breaking others
          if (typeof console !== 'undefined' && console.error) {
            console.error('StateManager: listener error for key "' + key + '":', e);
          }
        }
      }
    }
  },

  /**
   * Subscribe to state changes for a specific key.
   * The callback is invoked whenever set() is called for that key.
   * @param {string} key - The state key to watch
   * @param {Function} callback - Function called with (newValue, oldValue, key)
   * @returns {Function} Unsubscribe function - call it to remove the listener
   */
  on: function on(key, callback) {
    if (typeof callback !== 'function') {
      throw new Error('StateManager.on: callback must be a function');
    }

    if (!this._listeners[key]) {
      this._listeners[key] = [];
    }

    this._listeners[key].push(callback);

    // Return an unsubscribe function for cleanup
    var listeners = this._listeners;
    return function unsubscribe() {
      var list = listeners[key];
      if (list) {
        var index = list.indexOf(callback);
        if (index !== -1) {
          list.splice(index, 1);
        }
      }
    };
  }
};
