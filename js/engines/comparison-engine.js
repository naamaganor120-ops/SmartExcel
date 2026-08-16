/**
 * ComparisonEngine — Compares two parsed datasets by a selected key column.
 *
 * Provides methods to compare two Excel datasets and find duplicates within
 * a single dataset. Handles edge cases including empty datasets, missing key
 * column values, and non-existent key columns.
 *
 * @module ComparisonEngine
 */

/**
 * @typedef {Object} ComparisonResult
 * @property {Object[]} matched - Records found in both files (from file1)
 * @property {Object[]} file1Only - Records only in File 1
 * @property {Object[]} file2Only - Records only in File 2
 * @property {Object[]} duplicatesFile1 - Duplicate records in File 1
 * @property {Object[]} duplicatesFile2 - Duplicate records in File 2
 * @property {Object} summary - { matched: number, file1Only: number, file2Only: number, duplicates: number }
 */

var ComparisonEngine = {
  /**
   * Compare two datasets by a key column.
   *
   * Algorithm:
   * 1. Find duplicates within each file (records where keyColumn value appears more than once)
   * 2. Separate duplicates from unique records in each file
   * 3. For unique records:
   *    - If key exists in both file1 unique and file2 unique → matched
   *    - If key exists only in file1 unique → file1Only
   *    - If key exists only in file2 unique → file2Only
   * 4. Build summary with counts
   *
   * @param {Object[]} data1 - Rows from File 1
   * @param {Object[]} data2 - Rows from File 2
   * @param {string} keyColumn - Column name to compare on
   * @returns {ComparisonResult}
   */
  compare(data1, data2, keyColumn) {
    // Handle empty datasets
    if (!data1 || !data2) {
      return this._emptyResult();
    }

    const arr1 = Array.isArray(data1) ? data1 : [];
    const arr2 = Array.isArray(data2) ? data2 : [];

    // If both are empty, return empty result
    if (arr1.length === 0 && arr2.length === 0) {
      return this._emptyResult();
    }

    // Step 1: Find duplicates within each file
    const duplicatesFile1 = this.findDuplicates(arr1, keyColumn);
    const duplicatesFile2 = this.findDuplicates(arr2, keyColumn);

    // Step 2: Separate duplicates from unique records
    const duplicateKeys1 = this._getDuplicateKeys(arr1, keyColumn);
    const duplicateKeys2 = this._getDuplicateKeys(arr2, keyColumn);

    const unique1 = arr1.filter((row) => {
      const key = this._getKeyValue(row, keyColumn);
      return !duplicateKeys1.has(key);
    });

    const unique2 = arr2.filter((row) => {
      const key = this._getKeyValue(row, keyColumn);
      return !duplicateKeys2.has(key);
    });

    // Step 3: Partition unique records into matched, file1Only, file2Only
    const uniqueKeys2Set = new Set(unique2.map((row) => this._getKeyValue(row, keyColumn)));
    const uniqueKeys1Set = new Set(unique1.map((row) => this._getKeyValue(row, keyColumn)));

    const matched = unique1.filter((row) => {
      const key = this._getKeyValue(row, keyColumn);
      return uniqueKeys2Set.has(key);
    });

    const file1Only = unique1.filter((row) => {
      const key = this._getKeyValue(row, keyColumn);
      return !uniqueKeys2Set.has(key);
    });

    const file2Only = unique2.filter((row) => {
      const key = this._getKeyValue(row, keyColumn);
      return !uniqueKeys1Set.has(key);
    });

    // Step 4: Build summary
    const summary = {
      matched: matched.length,
      file1Only: file1Only.length,
      file2Only: file2Only.length,
      duplicates: duplicatesFile1.length + duplicatesFile2.length,
    };

    return {
      matched,
      file1Only,
      file2Only,
      duplicatesFile1,
      duplicatesFile2,
      summary,
    };
  },

  /**
   * Find duplicate values within a single dataset for a given column.
   * Returns all rows where the key column value appears more than once.
   *
   * @param {Object[]} data - Rows to check
   * @param {string} keyColumn - Column to check for duplicates
   * @returns {Object[]} - All rows that have duplicate key values (includes all instances)
   */
  findDuplicates(data, keyColumn) {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    // Group rows by their key column value
    const groups = new Map();

    for (const row of data) {
      const key = this._getKeyValue(row, keyColumn);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(row);
    }

    // Return all rows where the key value appears more than once
    const duplicates = [];
    for (const [, rows] of groups) {
      if (rows.length > 1) {
        duplicates.push(...rows);
      }
    }

    return duplicates;
  },

  /**
   * Get the set of key values that appear more than once in the dataset.
   * @private
   * @param {Object[]} data - Rows to check
   * @param {string} keyColumn - Column to check
   * @returns {Set} - Set of key values that are duplicated
   */
  _getDuplicateKeys(data, keyColumn) {
    const counts = new Map();

    for (const row of data) {
      const key = this._getKeyValue(row, keyColumn);
      counts.set(key, (counts.get(key) || 0) + 1);
    }

    const duplicateKeys = new Set();
    for (const [key, count] of counts) {
      if (count > 1) {
        duplicateKeys.add(key);
      }
    }

    return duplicateKeys;
  },

  /**
   * Extract the key value from a row, converting to string for consistent comparison.
   * Handles missing key column (returns undefined cast to string) and null/undefined values.
   * @private
   * @param {Object} row - A row object
   * @param {string} keyColumn - The column name to extract
   * @returns {string} - The key value as a string for comparison
   */
  _getKeyValue(row, keyColumn) {
    if (!row || typeof row !== 'object') {
      return String(undefined);
    }
    const value = row[keyColumn];
    // Convert to string for consistent comparison (case-sensitive)
    return String(value);
  },

  /**
   * Create an empty comparison result.
   * @private
   * @returns {ComparisonResult}
   */
  _emptyResult() {
    return {
      matched: [],
      file1Only: [],
      file2Only: [],
      duplicatesFile1: [],
      duplicatesFile2: [],
      summary: {
        matched: 0,
        file1Only: 0,
        file2Only: 0,
        duplicates: 0,
      },
    };
  },
};

// Note: Exposed as global `var ComparisonEngine` for browser usage.
// In Vitest/Node environment, import this file to make the global available.
