/**
 * UIUtils - DOM manipulation helpers for common UI patterns.
 *
 * Provides loading spinners, toast notifications, inline validation errors,
 * and dynamic table rendering with sorting, scrolling, and pagination.
 *
 * Usage:
 *   UIUtils.showLoading(container, 'Loading data...');
 *   UIUtils.hideLoading(container);
 *   UIUtils.notify('File uploaded successfully', 'success');
 *   UIUtils.showFieldError(inputEl, 'This field is required');
 *   UIUtils.clearErrors(formEl);
 *   UIUtils.renderTable(container, headers, rows, { scrollable: true, sortable: true });
 */
var UIUtils = {

  /**
   * Show a loading spinner overlay inside a container.
   * @param {HTMLElement} container - The element to overlay with a spinner
   * @param {string} [message='Processing...'] - Message to display below the spinner
   */
  showLoading: function showLoading(container, message) {
    if (!container) return;

    message = message || 'Processing...';

    // Remove any existing overlay first
    UIUtils.hideLoading(container);

    // Ensure container can position the overlay
    var position = window.getComputedStyle(container).position;
    if (position === 'static' || position === '') {
      container.style.position = 'relative';
    }

    var overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');

    var spinner = document.createElement('div');
    spinner.className = 'spinner';

    var msgEl = document.createElement('p');
    msgEl.className = 'loading-overlay__message';
    msgEl.textContent = message;

    overlay.appendChild(spinner);
    overlay.appendChild(msgEl);
    container.appendChild(overlay);
  },

  /**
   * Hide the loading spinner overlay from a container.
   * @param {HTMLElement} container - The element containing the overlay
   */
  hideLoading: function hideLoading(container) {
    if (!container) return;

    var overlay = container.querySelector('.loading-overlay');
    if (overlay) {
      container.removeChild(overlay);
    }
  },

  /**
   * Display a toast notification.
   * @param {string} message - Notification text
   * @param {'success'|'error'|'info'|'warning'} [type='info'] - Notification type
   * @param {number} [duration=4000] - Auto-dismiss duration in milliseconds
   */
  notify: function notify(message, type, duration) {
    type = type || 'info';
    duration = typeof duration === 'number' ? duration : 4000;

    // Get or create the toast container
    var toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      toastContainer.setAttribute('aria-live', 'polite');
      toastContainer.setAttribute('aria-atomic', 'false');
      document.body.appendChild(toastContainer);
    }

    // Create toast element
    var toast = document.createElement('div');
    toast.className = 'toast toast--' + type;
    toast.setAttribute('role', 'alert');

    // Icon based on type
    var iconMap = {
      success: '\u2713',
      error: '\u2717',
      warning: '\u26A0',
      info: '\u2139'
    };

    var icon = document.createElement('span');
    icon.className = 'toast__icon';
    icon.textContent = iconMap[type] || iconMap.info;
    icon.setAttribute('aria-hidden', 'true');

    var msgEl = document.createElement('span');
    msgEl.className = 'toast__message';
    msgEl.textContent = message;

    var closeBtn = document.createElement('button');
    closeBtn.className = 'toast__close';
    closeBtn.setAttribute('type', 'button');
    closeBtn.setAttribute('aria-label', 'Close notification');
    closeBtn.textContent = '\u00D7';
    closeBtn.addEventListener('click', function () {
      UIUtils._dismissToast(toast);
    });

    toast.appendChild(icon);
    toast.appendChild(msgEl);
    toast.appendChild(closeBtn);
    toastContainer.appendChild(toast);

    // Auto-dismiss after duration
    if (duration > 0) {
      var timerId = setTimeout(function () {
        UIUtils._dismissToast(toast);
      }, duration);
      toast._timerId = timerId;
    }
  },

  /**
   * Remove a toast element from the DOM.
   * @private
   * @param {HTMLElement} toast - The toast element to remove
   */
  _dismissToast: function _dismissToast(toast) {
    if (!toast || !toast.parentNode) return;

    if (toast._timerId) {
      clearTimeout(toast._timerId);
    }

    toast.classList.add('toast--dismissing');
    // Allow CSS animation to complete before removing
    setTimeout(function () {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  },

  /**
   * Show an inline validation error on a form field.
   * @param {HTMLElement} field - The input/select element with an error
   * @param {string} message - Error message to display
   */
  showFieldError: function showFieldError(field, message) {
    if (!field) return;

    var parent = field.parentElement;
    if (parent) {
      parent.classList.add('form-group--error');
    }

    // Look for an existing error element after the field
    var existingError = field.nextElementSibling;
    if (existingError && existingError.classList.contains('form-error')) {
      existingError.textContent = message;
      return;
    }

    // Create new error element
    var errorEl = document.createElement('span');
    errorEl.className = 'form-error';
    errorEl.setAttribute('role', 'alert');
    errorEl.textContent = message;

    // Insert after the field
    if (field.nextSibling) {
      field.parentNode.insertBefore(errorEl, field.nextSibling);
    } else {
      field.parentNode.appendChild(errorEl);
    }
  },

  /**
   * Clear all validation errors from a form.
   * @param {HTMLElement} form - The form or container element
   */
  clearErrors: function clearErrors(form) {
    if (!form) return;

    // Remove all .form-error elements
    var errors = form.querySelectorAll('.form-error');
    for (var i = 0; i < errors.length; i++) {
      errors[i].parentNode.removeChild(errors[i]);
    }

    // Remove .form-group--error classes
    var errorGroups = form.querySelectorAll('.form-group--error');
    for (var j = 0; j < errorGroups.length; j++) {
      errorGroups[j].classList.remove('form-group--error');
    }
  },

  /**
   * Render a data table into a container.
   * @param {HTMLElement} container - The element to render the table into
   * @param {string[]} headers - Column header names
   * @param {Object[]} rows - Array of row objects (header → value)
   * @param {Object} [options={}] - Rendering options
   * @param {boolean} [options.scrollable] - Wrap table in scrollable container
   * @param {number} [options.maxRows] - Maximum rows to show initially
   * @param {boolean} [options.sortable] - Enable column header click sorting
   * @param {string} [options.statusColumn] - Column name for status badge styling
   */
  renderTable: function renderTable(container, headers, rows, options) {
    if (!container) return;

    options = options || {};
    container.innerHTML = '';

    // Store reference data for sorting
    var allRows = rows.slice();
    var visibleCount = options.maxRows ? Math.min(options.maxRows, allRows.length) : allRows.length;
    var sortState = { column: null, ascending: true };

    // Create wrapper if scrollable
    var wrapper;
    if (options.scrollable) {
      wrapper = document.createElement('div');
      wrapper.className = 'data-table__wrapper';
      container.appendChild(wrapper);
    } else {
      wrapper = container;
    }

    // Build table
    var table = document.createElement('table');
    table.className = 'data-table';

    // Table head
    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');

    for (var h = 0; h < headers.length; h++) {
      var th = document.createElement('th');
      th.textContent = headers[h];
      th.setAttribute('scope', 'col');

      if (options.sortable) {
        th.classList.add('data-table__sortable');
        th.setAttribute('tabindex', '0');
        th.setAttribute('aria-sort', 'none');
        th.setAttribute('role', 'columnheader');
        (function (colName, thEl) {
          var handleSort = function () {
            UIUtils._sortTable(table, allRows, headers, colName, sortState, options, container, visibleCount);
          };
          thEl.addEventListener('click', handleSort);
          thEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSort();
            }
          });
        })(headers[h], th);
      }

      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Table body
    var tbody = document.createElement('tbody');
    UIUtils._renderRows(tbody, headers, allRows, visibleCount, options);
    table.appendChild(tbody);

    wrapper.appendChild(table);

    // Show more button if maxRows is set and there are more rows
    if (options.maxRows && allRows.length > options.maxRows) {
      var showMoreBtn = document.createElement('button');
      showMoreBtn.className = 'data-table__show-more';
      showMoreBtn.setAttribute('type', 'button');
      showMoreBtn.textContent = 'Show more (' + (allRows.length - visibleCount) + ' remaining)';
      showMoreBtn.addEventListener('click', function () {
        // Show all rows
        var tbodyEl = table.querySelector('tbody');
        tbodyEl.innerHTML = '';
        UIUtils._renderRows(tbodyEl, headers, allRows, allRows.length, options);
        showMoreBtn.parentNode.removeChild(showMoreBtn);
      });
      container.appendChild(showMoreBtn);
    }
  },

  /**
   * Render row elements into a tbody.
   * @private
   */
  _renderRows: function _renderRows(tbody, headers, rows, count, options) {
    for (var i = 0; i < count && i < rows.length; i++) {
      var tr = document.createElement('tr');
      for (var j = 0; j < headers.length; j++) {
        var td = document.createElement('td');
        var cellValue = rows[i][headers[j]];
        var displayValue = cellValue != null ? String(cellValue) : '';

        // Apply status badge if this is the status column
        if (options.statusColumn && headers[j] === options.statusColumn) {
          var badge = document.createElement('span');
          badge.className = 'badge ' + UIUtils._getBadgeClass(displayValue);
          badge.textContent = displayValue;
          td.appendChild(badge);
        } else {
          td.textContent = displayValue;
        }

        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  },

  /**
   * Get the appropriate badge CSS class based on status value.
   * Uses both text AND color to meet accessibility requirement 20.6.
   * @private
   * @param {string} value - The status text
   * @returns {string} CSS class name
   */
  _getBadgeClass: function _getBadgeClass(value) {
    var normalized = (value || '').toLowerCase().trim();

    if (normalized === 'matched') return 'badge--matched';
    if (normalized === 'file 1 only') return 'badge--file1';
    if (normalized === 'file 2 only') return 'badge--file2';
    if (normalized === 'duplicate') return 'badge--duplicate';

    return 'badge--default';
  },

  /**
   * Sort table rows by a column and re-render.
   * @private
   */
  _sortTable: function _sortTable(table, allRows, headers, colName, sortState, options, container, visibleCount) {
    // Toggle sort direction
    if (sortState.column === colName) {
      sortState.ascending = !sortState.ascending;
    } else {
      sortState.column = colName;
      sortState.ascending = true;
    }

    // Sort rows
    allRows.sort(function (a, b) {
      var valA = a[colName];
      var valB = b[colName];

      // Handle null/undefined
      if (valA == null && valB == null) return 0;
      if (valA == null) return sortState.ascending ? -1 : 1;
      if (valB == null) return sortState.ascending ? 1 : -1;

      // Numeric comparison if both are numbers
      var numA = Number(valA);
      var numB = Number(valB);
      if (!isNaN(numA) && !isNaN(numB)) {
        return sortState.ascending ? numA - numB : numB - numA;
      }

      // String comparison
      var strA = String(valA).toLowerCase();
      var strB = String(valB).toLowerCase();
      if (strA < strB) return sortState.ascending ? -1 : 1;
      if (strA > strB) return sortState.ascending ? 1 : -1;
      return 0;
    });

    // Update aria-sort on headers
    var ths = table.querySelectorAll('th');
    for (var i = 0; i < ths.length; i++) {
      if (ths[i].textContent === colName) {
        ths[i].setAttribute('aria-sort', sortState.ascending ? 'ascending' : 'descending');
      } else {
        ths[i].setAttribute('aria-sort', 'none');
      }
    }

    // Re-render body
    var tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    // Determine how many to show
    var showCount = visibleCount;
    var showMoreBtn = container.querySelector('.data-table__show-more');
    if (!showMoreBtn) {
      showCount = allRows.length;
    }

    UIUtils._renderRows(tbody, headers, allRows, showCount, options);
  }
};

// Export for testability in Node.js/Vitest environments
if (typeof module !== 'undefined') module.exports = UIUtils;
