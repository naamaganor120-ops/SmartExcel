/**
 * CleaningEngine - Applies selected cleaning operations to a dataset.
 *
 * @typedef {Object} CleaningOptions
 * @property {boolean} removeDuplicates
 * @property {boolean} removeEmptyRows
 * @property {boolean} trimSpaces
 * @property {boolean} standardizeFormats
 * @property {boolean} detectMissingValues
 * @property {boolean} fixDateFormats
 */

/**
 * @typedef {Object} CleaningResult
 * @property {Object[]} cleanedData - The cleaned dataset
 * @property {number} originalRowCount - Row count before cleaning
 * @property {number} cleanedRowCount - Row count after cleaning
 * @property {Object} issuesFound - { duplicates, emptyRows, trimmed, dateFixed, missingValues, formatFixed }
 */

var CleaningEngine = {
  /**
   * Apply selected cleaning operations to a dataset.
   * @param {Object[]} data - Raw row data
   * @param {CleaningOptions} options - Which cleaning actions to perform
   * @returns {CleaningResult}
   */
  clean: function (data, options) {
    if (!Array.isArray(data)) {
      data = [];
    }
    if (!options || typeof options !== 'object') {
      options = {};
    }

    var originalRowCount = data.length;
    var currentData = data.map(function (row) {
      return Object.assign({}, row);
    });

    var issuesFound = {
      duplicates: 0,
      emptyRows: 0,
      trimmed: 0,
      dateFixed: 0,
      missingValues: 0,
      formatFixed: 0,
    };

    if (options.removeDuplicates) {
      var dupResult = CleaningEngine.removeDuplicates(currentData);
      currentData = dupResult.data;
      issuesFound.duplicates = dupResult.removed;
    }

    if (options.removeEmptyRows) {
      var emptyResult = CleaningEngine.removeEmptyRows(currentData);
      currentData = emptyResult.data;
      issuesFound.emptyRows = emptyResult.removed;
    }

    if (options.trimSpaces) {
      var trimResult = CleaningEngine.trimSpaces(currentData);
      currentData = trimResult.data;
      issuesFound.trimmed = trimResult.trimmed;
    }

    if (options.standardizeFormats) {
      var formatResult = CleaningEngine.standardizeFormats(currentData);
      currentData = formatResult.data;
      issuesFound.formatFixed = formatResult.fixed;
    }

    if (options.detectMissingValues) {
      var missingResult = CleaningEngine.detectMissingValues(currentData);
      currentData = missingResult.data;
      issuesFound.missingValues = missingResult.missingCount;
    }

    if (options.fixDateFormats) {
      var dateResult = CleaningEngine.fixDateFormats(currentData);
      currentData = dateResult.data;
      issuesFound.dateFixed = dateResult.fixed;
    }

    return {
      cleanedData: currentData,
      originalRowCount: originalRowCount,
      cleanedRowCount: currentData.length,
      issuesFound: issuesFound,
    };
  },

  /**
   * Remove duplicate rows based on all columns (JSON serialization).
   * @param {Object[]} data
   * @returns {{ data: Object[], removed: number }}
   */
  removeDuplicates: function (data) {
    var seen = {};
    var result = [];
    var removed = 0;

    for (var i = 0; i < data.length; i++) {
      var key = JSON.stringify(data[i]);
      if (seen[key]) {
        removed++;
      } else {
        seen[key] = true;
        result.push(data[i]);
      }
    }

    return { data: result, removed: removed };
  },

  /**
   * Remove rows where ALL values are null, undefined, empty string, or whitespace-only.
   * @param {Object[]} data
   * @returns {{ data: Object[], removed: number }}
   */
  removeEmptyRows: function (data) {
    var result = [];
    var removed = 0;

    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var keys = Object.keys(row);
      var allEmpty = true;

      for (var j = 0; j < keys.length; j++) {
        var value = row[keys[j]];
        if (value !== null && value !== undefined) {
          var strValue = String(value).trim();
          if (strValue !== '') {
            allEmpty = false;
            break;
          }
        }
      }

      if (allEmpty) {
        removed++;
      } else {
        result.push(row);
      }
    }

    return { data: result, removed: removed };
  },

  /**
   * Trim leading/trailing whitespace from all string values.
   * @param {Object[]} data
   * @returns {{ data: Object[], trimmed: number }}
   */
  trimSpaces: function (data) {
    var trimmed = 0;
    var result = [];

    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var newRow = {};
      var keys = Object.keys(row);

      for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        var value = row[key];

        if (typeof value === 'string') {
          var trimmedValue = value.trim();
          if (trimmedValue !== value) {
            trimmed++;
          }
          newRow[key] = trimmedValue;
        } else {
          newRow[key] = value;
        }
      }

      result.push(newRow);
    }

    return { data: result, trimmed: trimmed };
  },

  /**
   * Standardize text formats: title case for text fields, normalize phone patterns.
   * @param {Object[]} data
   * @returns {{ data: Object[], fixed: number }}
   */
  standardizeFormats: function (data) {
    var fixed = 0;
    var result = [];

    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var newRow = {};
      var keys = Object.keys(row);

      for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        var value = row[key];

        if (typeof value === 'string' && value.trim() !== '') {
          var newValue = value;

          // Try to normalize phone number patterns (digits, dashes, spaces, parens, plus)
          if (CleaningEngine._isPhoneLike(value)) {
            var normalized = CleaningEngine._normalizePhone(value);
            if (normalized !== value) {
              newValue = normalized;
              fixed++;
            }
          } else if (CleaningEngine._isTextValue(value)) {
            // Apply title case to text fields
            var titleCased = CleaningEngine._toTitleCase(value);
            if (titleCased !== value) {
              newValue = titleCased;
              fixed++;
            }
          }

          newRow[key] = newValue;
        } else {
          newRow[key] = value;
        }
      }

      result.push(newRow);
    }

    return { data: result, fixed: fixed };
  },

  /**
   * Detect cells with missing/null/empty values. Count them but don't modify data.
   * @param {Object[]} data
   * @returns {{ data: Object[], missingCount: number }}
   */
  detectMissingValues: function (data) {
    var missingCount = 0;

    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var keys = Object.keys(row);

      for (var j = 0; j < keys.length; j++) {
        var value = row[keys[j]];
        if (value === null || value === undefined || value === '') {
          missingCount++;
        }
      }
    }

    return { data: data, missingCount: missingCount };
  },

  /**
   * Normalize date formats to YYYY-MM-DD.
   * Detects patterns: DD/MM/YYYY, MM-DD-YYYY, YYYY/MM/DD, Excel serial numbers.
   * @param {Object[]} data
   * @returns {{ data: Object[], fixed: number }}
   */
  fixDateFormats: function (data) {
    var fixed = 0;
    var result = [];

    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var newRow = {};
      var keys = Object.keys(row);

      for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        var value = row[key];
        var dateResult = CleaningEngine._tryParseDate(value);

        if (dateResult !== null) {
          if (dateResult !== String(value)) {
            newRow[key] = dateResult;
            fixed++;
          } else {
            newRow[key] = value;
          }
        } else {
          newRow[key] = value;
        }
      }

      result.push(newRow);
    }

    return { data: result, fixed: fixed };
  },

  // ====== Private helper methods ======

  /**
   * Check if a string looks like a phone number.
   * @private
   */
  _isPhoneLike: function (value) {
    // Contains mostly digits with optional separators like -, (, ), +, spaces
    var cleaned = value.replace(/[\s\-\(\)\+\.]/g, '');
    return /^\d{7,15}$/.test(cleaned) && /[\d]/.test(value) && /[\s\-\(\)\+\.]/.test(value);
  },

  /**
   * Normalize phone number to a standard format: digits separated by dashes.
   * @private
   */
  _normalizePhone: function (value) {
    var digits = value.replace(/[^\d]/g, '');
    // Format as groups: for 10 digits -> XXX-XXX-XXXX, otherwise just return cleaned digits with dashes
    if (digits.length === 10) {
      return digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
    } else if (digits.length === 11 && digits[0] === '1') {
      return '1-' + digits.slice(1, 4) + '-' + digits.slice(4, 7) + '-' + digits.slice(7);
    }
    // For other lengths, just group by threes
    return digits.replace(/(\d{3})(?=\d)/g, '$1-');
  },

  /**
   * Check if a value is a text field (not a number, not a date-like pattern).
   * @private
   */
  _isTextValue: function (value) {
    // If it's purely numeric or looks like a date, skip it
    if (/^\d+(\.\d+)?$/.test(value.trim())) {
      return false;
    }
    if (CleaningEngine._tryParseDate(value) !== null) {
      return false;
    }
    // Has at least one letter
    return /[a-zA-Z]/.test(value);
  },

  /**
   * Convert string to title case (capitalize first letter of each word).
   * @private
   */
  _toTitleCase: function (value) {
    return value.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  },

  /**
   * Try to parse a value as a date and return YYYY-MM-DD format.
   * Returns null if not a recognizable date.
   * @private
   */
  _tryParseDate: function (value) {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    var strValue = String(value).trim();

    // Already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(strValue)) {
      return strValue;
    }

    // Excel serial number (number between ~1 and ~60000+)
    if (/^\d+$/.test(strValue)) {
      var num = parseInt(strValue, 10);
      // Excel serial dates: day 1 = Jan 1, 1900. Valid range roughly 1-2958465
      if (num >= 1 && num <= 2958465) {
        var date = CleaningEngine._excelSerialToDate(num);
        if (date) {
          return date;
        }
      }
      return null;
    }

    // DD/MM/YYYY or DD-MM-YYYY
    var ddmmyyyy = strValue.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (ddmmyyyy) {
      var day = parseInt(ddmmyyyy[1], 10);
      var month = parseInt(ddmmyyyy[2], 10);
      var year = parseInt(ddmmyyyy[3], 10);

      // Determine if it's DD/MM/YYYY or MM/DD/YYYY
      // If first number > 12, it must be DD/MM/YYYY
      if (day > 12 && month <= 12) {
        // DD/MM/YYYY
        if (CleaningEngine._isValidDate(year, month, day)) {
          return CleaningEngine._formatDate(year, month, day);
        }
      } else if (month > 12 && day <= 12) {
        // MM/DD/YYYY (month is actually day, day is month)
        if (CleaningEngine._isValidDate(year, day, month)) {
          return CleaningEngine._formatDate(year, day, month);
        }
      } else {
        // Ambiguous - assume DD/MM/YYYY (more common internationally)
        if (CleaningEngine._isValidDate(year, month, day)) {
          return CleaningEngine._formatDate(year, month, day);
        }
      }
    }

    // YYYY/MM/DD
    var yyyymmdd = strValue.match(/^(\d{4})[\/](\d{1,2})[\/](\d{1,2})$/);
    if (yyyymmdd) {
      var y = parseInt(yyyymmdd[1], 10);
      var m = parseInt(yyyymmdd[2], 10);
      var d = parseInt(yyyymmdd[3], 10);
      if (CleaningEngine._isValidDate(y, m, d)) {
        return CleaningEngine._formatDate(y, m, d);
      }
    }

    // MM-DD-YYYY (explicit with dash, and first part <= 12)
    var mmddyyyy = strValue.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    if (mmddyyyy) {
      var mm = parseInt(mmddyyyy[1], 10);
      var dd = parseInt(mmddyyyy[2], 10);
      var yy = parseInt(mmddyyyy[3], 10);
      // Already handled above in the DD/MM/YYYY branch since pattern is the same
      // This won't trigger separately because the regex above already matched
    }

    return null;
  },

  /**
   * Convert Excel serial number to YYYY-MM-DD string.
   * @private
   */
  _excelSerialToDate: function (serial) {
    // Excel incorrectly treats 1900 as a leap year (serial 60 = Feb 29, 1900 which doesn't exist)
    // Adjust for this bug: serial numbers > 60 are off by one day
    if (serial > 60) {
      serial--;
    }

    // Day 1 = January 1, 1900
    var baseDate = new Date(1900, 0, 1);
    var resultDate = new Date(baseDate.getTime() + (serial - 1) * 24 * 60 * 60 * 1000);

    var year = resultDate.getFullYear();
    var month = resultDate.getMonth() + 1;
    var day = resultDate.getDate();

    if (year < 1900 || year > 9999) {
      return null;
    }

    return CleaningEngine._formatDate(year, month, day);
  },

  /**
   * Validate a date.
   * @private
   */
  _isValidDate: function (year, month, day) {
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > 9999) return false;

    var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // Leap year check
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      daysInMonth[1] = 29;
    }

    return day <= daysInMonth[month - 1];
  },

  /**
   * Format a date as YYYY-MM-DD.
   * @private
   */
  _formatDate: function (year, month, day) {
    var m = month < 10 ? '0' + month : '' + month;
    var d = day < 10 ? '0' + day : '' + day;
    return year + '-' + m + '-' + d;
  },
};

// Module exports for testability
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CleaningEngine;
}
