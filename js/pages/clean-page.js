/**
 * SmartExcel — Clean Page Controller
 * Handles file upload, cleaning option selection, validation,
 * engine execution, results display, and download.
 *
 * Global dependencies: StateManager, UIUtils, FileHandler, CleaningEngine, DemoData, DownloadUtil
 */
(function () {
  'use strict';

  /* global StateManager, UIUtils, FileHandler, CleaningEngine, DemoData, DownloadUtil */

  var parsedFileData = null;
  var cleanedResult = null;

  // DOM references (resolved in init)
  var form;
  var fileInput;
  var fileInfo;
  var checkboxes;
  var resultsSection;
  var resultsSummary;
  var downloadBtn;
  var previewTable;
  var demoNotice;

  /**
   * Render a cleaning results summary into the summary container.
   * @param {Object} result - CleaningResult object (or demo shape)
   */
  function renderSummary(result) {
    var html = '<ul class="summary-list">';
    html += '<li><strong>Original rows:</strong> ' + result.originalRowCount + '</li>';
    html += '<li><strong>Cleaned rows:</strong> ' + result.cleanedRowCount + '</li>';

    var issues = result.issuesFound;
    if (issues.duplicates > 0) {
      html += '<li>Duplicates removed: ' + issues.duplicates + '</li>';
    }
    if (issues.emptyRows > 0) {
      html += '<li>Empty rows removed: ' + issues.emptyRows + '</li>';
    }
    if (issues.trimmed > 0) {
      html += '<li>Spaces trimmed: ' + issues.trimmed + '</li>';
    }
    if (issues.dateFixed > 0) {
      html += '<li>Dates fixed: ' + issues.dateFixed + '</li>';
    }
    if (issues.missingValues > 0) {
      html += '<li>Missing values detected: ' + issues.missingValues + '</li>';
    }
    if (issues.formatFixed > 0) {
      html += '<li>Formats standardized: ' + issues.formatFixed + '</li>';
    }

    html += '</ul>';
    resultsSummary.innerHTML = html;
  }

  /**
   * Render a preview table of the first N rows of cleaned data.
   * @param {Object[]} data - Cleaned row objects
   * @param {number} [maxRows=10] - Maximum rows to display
   */
  function renderPreview(data, maxRows) {
    maxRows = maxRows || 10;
    if (!data || data.length === 0) {
      previewTable.innerHTML = '<p>No data to preview.</p>';
      return;
    }

    var headers = Object.keys(data[0]);
    var rows = data.slice(0, maxRows);

    UIUtils.renderTable(previewTable, headers, rows, {
      scrollable: true,
      maxRows: maxRows
    });
  }

  /**
   * Display demo data on initial page load.
   */
  function showDemoResults() {
    var demo = DemoData.cleaning;
    renderSummary(demo);
    renderPreview(demo.cleanedData, 10);
  }

  /**
   * Handle file input change event - validate and parse file.
   */
  function handleFileChange() {
    var file = fileInput.files[0];
    if (!file) {
      fileInfo.textContent = '';
      parsedFileData = null;
      return;
    }

    // Validate file type
    var validation = FileHandler.validate(file);
    if (!validation.valid) {
      UIUtils.showFieldError(fileInput, validation.error);
      fileInfo.textContent = '';
      parsedFileData = null;
      return;
    }

    // Show file name
    var sizeMB = (file.size / 1024).toFixed(1);
    fileInfo.textContent = file.name + ' (' + sizeMB + ' KB)';

    // Parse the file
    FileHandler.parse(file).then(function (result) {
      parsedFileData = result;
    }).catch(function (err) {
      UIUtils.showFieldError(fileInput, err.message);
      parsedFileData = null;
      fileInfo.textContent = '';
    });
  }

  /**
   * Validate the form before submission.
   * @returns {boolean} True if valid, false otherwise
   */
  function validateForm() {
    UIUtils.clearErrors(form);
    var valid = true;

    // Check file is uploaded
    if (!parsedFileData) {
      UIUtils.showFieldError(fileInput, 'Please upload an Excel file (.xlsx or .xls).');
      valid = false;
    }

    // Check at least one option is selected
    var anyChecked = false;
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        anyChecked = true;
        break;
      }
    }

    if (!anyChecked) {
      var fieldset = form.querySelector('fieldset');
      var legend = fieldset.querySelector('legend');
      UIUtils.showFieldError(legend || fieldset, 'Please select at least one cleaning option.');
      valid = false;
    }

    return valid;
  }

  /**
   * Handle form submission - validate, run cleaning, show results.
   * @param {Event} e - Submit event
   */
  function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Build CleaningOptions from checkboxes
    var options = {};
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        options[checkboxes[i].value] = true;
      }
    }

    // Show loading
    UIUtils.showLoading(resultsSection, 'Cleaning your data...');

    // Use setTimeout to allow the loading overlay to render
    setTimeout(function () {
      try {
        // Run cleaning engine
        cleanedResult = CleaningEngine.clean(parsedFileData.rows, options);

        // Display results
        renderSummary(cleanedResult);
        renderPreview(cleanedResult.cleanedData, 10);

        // Show download button
        downloadBtn.style.display = '';

        // Hide demo notice
        demoNotice.style.display = 'none';
      } catch (err) {
        UIUtils.notify('Cleaning failed: ' + (err.message || 'An unexpected error occurred.'), 'error');
        resultsSummary.innerHTML = '';

        // Display error message with retry control (Requirement 8.5)
        var errorContainer = document.createElement('div');
        errorContainer.className = 'results-error';
        errorContainer.setAttribute('role', 'alert');

        var errorMsg = document.createElement('p');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Failed to clean the file. Please check your file and try again.';

        var retryBtn = document.createElement('button');
        retryBtn.className = 'btn btn--secondary results-error__retry';
        retryBtn.setAttribute('type', 'button');
        retryBtn.textContent = 'Retry';
        retryBtn.addEventListener('click', function () {
          // Re-dispatch the form submit event for retry without page reload
          var submitEvent = new Event('submit', { cancelable: true });
          form.dispatchEvent(submitEvent);
        });

        errorContainer.appendChild(errorMsg);
        errorContainer.appendChild(retryBtn);
        resultsSummary.appendChild(errorContainer);

        downloadBtn.style.display = 'none';
      }

      // Hide loading
      UIUtils.hideLoading(resultsSection);
    }, 50);
  }

  /**
   * Handle download button click.
   */
  function handleDownload() {
    if (cleanedResult && cleanedResult.cleanedData) {
      DownloadUtil.downloadCleanedFile(cleanedResult.cleanedData);
    }
  }

  /**
   * Initialize the clean page controller.
   */
  function init() {
    form = document.getElementById('clean-form');
    fileInput = document.getElementById('clean-file-input');
    fileInfo = document.getElementById('clean-file-info');
    checkboxes = form.querySelectorAll('input[name="cleanOption"]');
    resultsSection = document.querySelector('.results-section');
    resultsSummary = document.querySelector('.results-summary');
    downloadBtn = document.querySelector('.download-btn');
    previewTable = document.querySelector('.preview-table');
    demoNotice = document.querySelector('.demo-notice');

    // Show demo data on load
    showDemoResults();

    // Event listeners
    fileInput.addEventListener('change', handleFileChange);
    form.addEventListener('submit', handleSubmit);
    downloadBtn.addEventListener('click', handleDownload);
  }

  // Run on DOMContentLoaded or immediately if DOM is already ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
