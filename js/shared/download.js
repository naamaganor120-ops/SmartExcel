/**
 * DownloadUtil Module
 * 
 * Provides utility functions to trigger browser file downloads from generated Blobs.
 * Validates file blobs before downloading and shows error notifications on failure.
 * Supports .xlsx and .csv output formats via FileHandler.generateFile().
 * 
 * Dependencies:
 * - FileHandler (js/core/file-handler.js) for generating file blobs
 * - UIUtils (js/core/ui-utils.js) for error notifications
 * 
 * @module DownloadUtil
 */

/* global FileHandler, UIUtils */

var DownloadUtil = {

  /**
   * Trigger a browser download from a Blob.
   * Validates the blob is present and has content before downloading.
   * Shows an error notification if the blob is invalid.
   * 
   * @param {Blob} blob - The file blob to download
   * @param {string} fileName - The desired download file name
   * @returns {boolean} True if download was triggered, false if validation failed
   */
  downloadFile: function downloadFile(blob, fileName) {
    // Validate blob is not null/undefined
    if (!blob) {
      UIUtils.notify('Download failed: file is unavailable. Please try again.', 'error');
      return false;
    }

    // Validate blob has content (size > 0)
    if (!blob.size || blob.size <= 0) {
      UIUtils.notify('Download failed: file appears to be empty or corrupted.', 'error');
      return false;
    }

    // Create a temporary object URL for the blob
    var url = URL.createObjectURL(blob);

    // Create a hidden anchor element and trigger the download
    var anchor = document.createElement('a');
    anchor.style.display = 'none';
    anchor.href = url;
    anchor.download = fileName || 'download.xlsx';
    document.body.appendChild(anchor);
    anchor.click();

    // Clean up: remove anchor and revoke URL after a short delay
    setTimeout(function() {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }, 150);

    return true;
  },

  /**
   * Download comparison results as an Excel file.
   * Combines all comparison categories into a single dataset with a "Status" column.
   * 
   * @param {Object} result - ComparisonResult object from ComparisonEngine
   * @param {Object[]} result.matched - Records found in both files
   * @param {Object[]} result.file1Only - Records only in File 1
   * @param {Object[]} result.file2Only - Records only in File 2
   * @param {Object[]} result.duplicatesFile1 - Duplicate records in File 1
   * @param {Object[]} result.duplicatesFile2 - Duplicate records in File 2
   * @returns {boolean} True if download was triggered, false on failure
   */
  downloadComparisonResult: function downloadComparisonResult(result) {
    if (!result) {
      UIUtils.notify('Download failed: no comparison results available.', 'error');
      return false;
    }

    try {
      // Combine all categories with a Status column
      var combinedData = [];

      var categories = [
        { rows: result.matched || [], status: 'Matched' },
        { rows: result.file1Only || [], status: 'File 1 Only' },
        { rows: result.file2Only || [], status: 'File 2 Only' },
        { rows: result.duplicatesFile1 || [], status: 'Duplicate' },
        { rows: result.duplicatesFile2 || [], status: 'Duplicate' }
      ];

      for (var c = 0; c < categories.length; c++) {
        var category = categories[c];
        for (var r = 0; r < category.rows.length; r++) {
          var row = category.rows[r];
          // Create a new object with Status as the first property
          var newRow = { Status: category.status };
          var keys = Object.keys(row);
          for (var k = 0; k < keys.length; k++) {
            newRow[keys[k]] = row[keys[k]];
          }
          combinedData.push(newRow);
        }
      }

      if (combinedData.length === 0) {
        UIUtils.notify('Download failed: no data to export.', 'error');
        return false;
      }

      var blob = FileHandler.generateFile(combinedData, 'comparison-results.xlsx', 'xlsx');
      return DownloadUtil.downloadFile(blob, 'comparison-results.xlsx');
    } catch (error) {
      UIUtils.notify('Download failed: unable to generate file. Please try again.', 'error');
      return false;
    }
  },

  /**
   * Download cleaned data as an Excel file.
   * 
   * @param {Object[]} cleanedData - Array of cleaned row objects from CleaningEngine
   * @returns {boolean} True if download was triggered, false on failure
   */
  downloadCleanedFile: function downloadCleanedFile(cleanedData) {
    if (!cleanedData || !Array.isArray(cleanedData) || cleanedData.length === 0) {
      UIUtils.notify('Download failed: no cleaned data available.', 'error');
      return false;
    }

    try {
      var blob = FileHandler.generateFile(cleanedData, 'cleaned-data.xlsx', 'xlsx');
      return DownloadUtil.downloadFile(blob, 'cleaned-data.xlsx');
    } catch (error) {
      UIUtils.notify('Download failed: unable to generate file. Please try again.', 'error');
      return false;
    }
  },

  /**
   * Download dashboard report as an Excel file.
   * Creates a sheet from the topProducts data in the dashboard result.
   * 
   * @param {Object} dashboardResult - DashboardResult object from DashboardEngine
   * @param {Object[]} dashboardResult.topProducts - Top-selling products table data
   * @returns {boolean} True if download was triggered, false on failure
   */
  downloadDashboardReport: function downloadDashboardReport(dashboardResult) {
    if (!dashboardResult) {
      UIUtils.notify('Download failed: no dashboard data available.', 'error');
      return false;
    }

    var topProducts = dashboardResult.topProducts;
    if (!topProducts || !Array.isArray(topProducts) || topProducts.length === 0) {
      UIUtils.notify('Download failed: no product data available to export.', 'error');
      return false;
    }

    try {
      var blob = FileHandler.generateFile(topProducts, 'dashboard-report.xlsx', 'xlsx');
      return DownloadUtil.downloadFile(blob, 'dashboard-report.xlsx');
    } catch (error) {
      UIUtils.notify('Download failed: unable to generate report. Please try again.', 'error');
      return false;
    }
  }
};

// Support both browser global and module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DownloadUtil;
}
