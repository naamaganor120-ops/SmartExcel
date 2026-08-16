/**
 * FileHandler Module
 * 
 * Responsible for all file I/O operations: validation, reading/parsing Excel files,
 * and generating downloadable files. Uses SheetJS (XLSX) for Excel operations.
 * 
 * @module FileHandler
 */

/* global XLSX */

var FileHandler = {
  /** Allowed file extensions (case-insensitive) */
  ALLOWED_EXTENSIONS: ['.xlsx', '.xls'],

  /** Maximum file size in bytes (10MB) */
  MAX_FILE_SIZE: 10 * 1024 * 1024,

  /**
   * Validate a File object before processing.
   * Checks that the file exists, has a valid extension, and is within size limits.
   * 
   * @param {File} file - The file to validate
   * @returns {{ valid: boolean, error?: string }} Validation result
   */
  validate: function(file) {
    // Check file is not null/undefined
    if (!file) {
      return { valid: false, error: 'No file selected. Please choose a file to upload.' };
    }

    // Check file has a name
    if (!file.name) {
      return { valid: false, error: 'Invalid file: file name is missing.' };
    }

    // Extract extension (case-insensitive)
    var fileName = file.name;
    var dotIndex = fileName.lastIndexOf('.');
    if (dotIndex === -1) {
      return { valid: false, error: 'Invalid file type. Please upload an Excel file (.xlsx or .xls).' };
    }

    var extension = fileName.substring(dotIndex).toLowerCase();
    if (this.ALLOWED_EXTENSIONS.indexOf(extension) === -1) {
      return { valid: false, error: 'Invalid file type "' + extension + '". Please upload an Excel file (.xlsx or .xls).' };
    }

    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      var sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return { valid: false, error: 'File is too large (' + sizeMB + 'MB). Maximum allowed size is 10MB.' };
    }

    return { valid: true };
  },

  /**
   * Read and parse an Excel file into structured data.
   * Returns a Promise that resolves with parsed file data including headers and row objects.
   * 
   * @param {File} file - The Excel file to parse
   * @returns {Promise<{fileName: string, fileSize: number, headers: string[], rows: Object[], rowCount: number}>}
   */
  parse: function(file) {
    var self = this;

    return new Promise(function(resolve, reject) {
      // Validate before parsing
      var validation = self.validate(file);
      if (!validation.valid) {
        reject(new Error(validation.error));
        return;
      }

      var reader = new FileReader();

      reader.onload = function(e) {
        try {
          var data = new Uint8Array(e.target.result);
          var workbook = XLSX.read(data, { type: 'array' });

          // Get the first sheet
          if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
            reject(new Error('The file contains no worksheets.'));
            return;
          }

          var firstSheetName = workbook.SheetNames[0];
          var sheet = workbook.Sheets[firstSheetName];

          if (!sheet || !sheet['!ref']) {
            reject(new Error('The worksheet is empty.'));
            return;
          }

          // Extract headers from the first row
          var rows = XLSX.utils.sheet_to_json(sheet);
          var headers = rows.length > 0 ? Object.keys(rows[0]) : [];

          resolve({
            fileName: file.name,
            fileSize: file.size,
            headers: headers,
            rows: rows,
            rowCount: rows.length
          });
        } catch (error) {
          reject(new Error('Failed to parse file: ' + error.message));
        }
      };

      reader.onerror = function() {
        reject(new Error('Failed to read file. The file may be corrupted or unreadable.'));
      };

      reader.readAsArrayBuffer(file);
    });
  },

  /**
   * Generate a downloadable file from data.
   * Creates an Excel (.xlsx) or CSV (.csv) Blob from an array of row objects.
   * 
   * @param {Object[]} data - Array of row objects to write
   * @param {string} fileName - Desired file name (used for reference, not embedded in blob)
   * @param {'xlsx'|'csv'} [format='xlsx'] - Output format
   * @returns {Blob} A Blob containing the generated file data
   */
  generateFile: function(data, fileName, format) {
    if (format === undefined || format === null) {
      format = 'xlsx';
    }

    if (!data || !Array.isArray(data)) {
      throw new Error('Data must be a non-empty array of objects.');
    }

    if (data.length === 0) {
      throw new Error('Cannot generate file from empty data.');
    }

    // Create workbook and sheet
    var workbook = XLSX.utils.book_new();
    var sheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');

    if (format === 'csv') {
      // Generate CSV
      var csvString = XLSX.utils.sheet_to_csv(sheet);
      return new Blob([csvString], {
        type: 'text/csv;charset=utf-8;'
      });
    }

    // Generate XLSX
    var xlsxData = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    return new Blob([xlsxData], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  }
};

// Support both browser global and module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FileHandler;
}
