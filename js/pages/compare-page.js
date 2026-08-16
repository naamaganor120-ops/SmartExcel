/**
 * Compare Page Controller
 * Handles file uploads, column selection, comparison execution, and result rendering
 * for the Compare Excel Files page.
 *
 * Dependencies: StateManager, UIUtils, FileHandler, ComparisonEngine, DemoData, DownloadUtil
 *
 * Requirements: 3.1-3.7, 7.1-7.5, 11.4, 11.6, 11.8, 13.1-13.3, 16.3, 16.4, 17.1, 20.2
 */
(function () {
  'use strict';

  // Parsed file data for each upload slot
  var parsedFile1 = null;
  var parsedFile2 = null;

  // Last comparison result (for download)
  var lastComparisonResult = null;

  // DOM element references (populated in init)
  var els = {};

  /**
   * Initialize DOM references.
   */
  function cacheElements() {
    els.form = document.getElementById('compare-form');
    els.file1Input = document.getElementById('file1-input');
    els.file2Input = document.getElementById('file2-input');
    els.file1DropArea = document.getElementById('file1-drop-area');
    els.file2DropArea = document.getElementById('file2-drop-area');
    els.file1Info = document.getElementById('file1-info');
    els.file2Info = document.getElementById('file2-info');
    els.columnSelect = document.getElementById('column-select');
    els.submitBtn = document.getElementById('compare-submit-btn');
    els.demoNotice = document.getElementById('demo-notice');
    els.demoDismissBtn = document.getElementById('demo-dismiss-btn');
    els.resultsSection = document.getElementById('results-section');
    els.resultsSummary = document.getElementById('results-summary');
    els.resultsTableContainer = document.getElementById('results-table-container');
    els.downloadBtn = document.getElementById('download-btn');
    els.summaryMatched = document.getElementById('summary-matched');
    els.summaryFile1Only = document.getElementById('summary-file1only');
    els.summaryFile2Only = document.getElementById('summary-file2only');
    els.summaryDuplicates = document.getElementById('summary-duplicates');
  }

  /**
   * Render demo comparison data on page load.
   */
  function renderDemoData() {
    var demo = DemoData.comparison;
    var combinedRows = buildCombinedRows(demo);
    var headers = getCombinedHeaders(combinedRows);

    UIUtils.renderTable(els.resultsTableContainer, headers, combinedRows, {
      scrollable: true,
      sortable: true,
      statusColumn: 'Status'
    });

    // Update summary with demo data
    updateSummary(demo.summary);
  }

  /**
   * Build combined rows array from comparison result, adding a Status column.
   */
  function buildCombinedRows(result) {
    var rows = [];

    var matched = result.matched || [];
    var file1Only = result.file1Only || [];
    var file2Only = result.file2Only || [];
    var duplicatesFile1 = result.duplicatesFile1 || [];
    var duplicatesFile2 = result.duplicatesFile2 || [];

    for (var i = 0; i < matched.length; i++) {
      var row = copyRow(matched[i]);
      row['Status'] = 'Matched';
      rows.push(row);
    }
    for (var j = 0; j < file1Only.length; j++) {
      var row1 = copyRow(file1Only[j]);
      row1['Status'] = 'File 1 Only';
      rows.push(row1);
    }
    for (var k = 0; k < file2Only.length; k++) {
      var row2 = copyRow(file2Only[k]);
      row2['Status'] = 'File 2 Only';
      rows.push(row2);
    }
    for (var d1 = 0; d1 < duplicatesFile1.length; d1++) {
      var rowD1 = copyRow(duplicatesFile1[d1]);
      rowD1['Status'] = 'Duplicate';
      rows.push(rowD1);
    }
    for (var d2 = 0; d2 < duplicatesFile2.length; d2++) {
      var rowD2 = copyRow(duplicatesFile2[d2]);
      rowD2['Status'] = 'Duplicate';
      rows.push(rowD2);
    }

    return rows;
  }

  /**
   * Get headers from combined rows (ensuring Status is last).
   */
  function getCombinedHeaders(rows) {
    if (rows.length === 0) return ['Status'];
    var keys = Object.keys(rows[0]);
    // Move Status to end
    var statusIdx = keys.indexOf('Status');
    if (statusIdx > -1) {
      keys.splice(statusIdx, 1);
      keys.push('Status');
    }
    return keys;
  }

  /**
   * Shallow copy a row object.
   */
  function copyRow(obj) {
    var copy = {};
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      copy[keys[i]] = obj[keys[i]];
    }
    return copy;
  }

  /**
   * Update summary display.
   */
  function updateSummary(summary) {
    els.summaryMatched.textContent = summary.matched || 0;
    els.summaryFile1Only.textContent = summary.file1Only || 0;
    els.summaryFile2Only.textContent = summary.file2Only || 0;
    els.summaryDuplicates.textContent = summary.duplicates || 0;
  }

  /**
   * Handle file selection for a given slot (1 or 2).
   */
  function handleFileSelect(file, slot) {
    var validation = FileHandler.validate(file);
    var infoEl = slot === 1 ? els.file1Info : els.file2Info;
    var dropArea = slot === 1 ? els.file1DropArea : els.file2DropArea;

    if (!validation.valid) {
      infoEl.textContent = validation.error;
      infoEl.className = 'file-upload__info file-upload__info--error';
      dropArea.classList.remove('file-upload__area--has-file');
      if (slot === 1) parsedFile1 = null;
      else parsedFile2 = null;
      updateColumnSelector();
      return;
    }

    // Show file info
    var sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    infoEl.textContent = file.name + ' (' + sizeMB + ' MB)';
    infoEl.className = 'file-upload__info';
    dropArea.classList.add('file-upload__area--has-file');

    // Parse the file
    FileHandler.parse(file).then(function (parsed) {
      if (slot === 1) parsedFile1 = parsed;
      else parsedFile2 = parsed;
      updateColumnSelector();
    }).catch(function (err) {
      infoEl.textContent = err.message;
      infoEl.className = 'file-upload__info file-upload__info--error';
      dropArea.classList.remove('file-upload__area--has-file');
      if (slot === 1) parsedFile1 = null;
      else parsedFile2 = null;
      updateColumnSelector();
    });
  }

  /**
   * Update the column selector based on parsed files.
   * Populate with common headers when both files are parsed.
   */
  function updateColumnSelector() {
    var select = els.columnSelect;

    if (!parsedFile1 || !parsedFile2) {
      select.disabled = true;
      select.innerHTML = '<option value="">-- Upload both files first --</option>';
      return;
    }

    // Find common headers
    var headers1 = parsedFile1.headers;
    var headers2 = parsedFile2.headers;
    var common = [];

    for (var i = 0; i < headers1.length; i++) {
      if (headers2.indexOf(headers1[i]) !== -1) {
        common.push(headers1[i]);
      }
    }

    if (common.length === 0) {
      select.disabled = true;
      select.innerHTML = '<option value="">-- No common columns found --</option>';
      return;
    }

    select.disabled = false;
    select.innerHTML = '<option value="">-- Select a column --</option>';
    for (var j = 0; j < common.length; j++) {
      var option = document.createElement('option');
      option.value = common[j];
      option.textContent = common[j];
      select.appendChild(option);
    }
  }

  /**
   * Handle form submission — run comparison.
   */
  function handleSubmit(e) {
    e.preventDefault();
    UIUtils.clearErrors(els.form);

    // Validate: both files uploaded
    var hasErrors = false;

    if (!parsedFile1) {
      UIUtils.showFieldError(els.file1Input, 'Please upload File 1.');
      hasErrors = true;
    }
    if (!parsedFile2) {
      UIUtils.showFieldError(els.file2Input, 'Please upload File 2.');
      hasErrors = true;
    }

    var selectedColumn = els.columnSelect.value;
    if (!selectedColumn) {
      UIUtils.showFieldError(els.columnSelect, 'Please select a comparison column.');
      hasErrors = true;
    }

    if (hasErrors) return;

    // Show loading
    UIUtils.showLoading(els.resultsSection, 'Comparing files...');

    // Use setTimeout to allow the loading overlay to render
    setTimeout(function () {
      try {
        var result = ComparisonEngine.compare(parsedFile1.rows, parsedFile2.rows, selectedColumn);
        lastComparisonResult = result;

        // Build combined rows for display
        var combinedRows = buildCombinedRows(result);
        var headers = getCombinedHeaders(combinedRows);

        UIUtils.renderTable(els.resultsTableContainer, headers, combinedRows, {
          scrollable: true,
          sortable: true,
          statusColumn: 'Status'
        });

        // Update summary
        updateSummary(result.summary);

        // Hide demo notice, show download button
        if (els.demoNotice) {
          els.demoNotice.style.display = 'none';
        }
        els.downloadBtn.style.display = '';

        // Store result in StateManager
        if (typeof StateManager !== 'undefined' && StateManager.set) {
          StateManager.set('comparisonResult', result);
        }
      } catch (err) {
        UIUtils.notify('Comparison failed: ' + err.message, 'error');
      } finally {
        UIUtils.hideLoading(els.resultsSection);
      }
    }, 50);
  }

  /**
   * Handle download button click.
   */
  function handleDownload() {
    if (!lastComparisonResult) {
      UIUtils.notify('No comparison results to download.', 'warning');
      return;
    }
    DownloadUtil.downloadComparisonResult(lastComparisonResult);
  }

  /**
   * Set up drag-and-drop behavior for a drop area.
   */
  function setupDragDrop(dropArea, fileInput, slot) {
    dropArea.addEventListener('dragover', function (e) {
      e.preventDefault();
      dropArea.classList.add('file-upload__area--dragover');
    });

    dropArea.addEventListener('dragleave', function () {
      dropArea.classList.remove('file-upload__area--dragover');
    });

    dropArea.addEventListener('drop', function (e) {
      e.preventDefault();
      dropArea.classList.remove('file-upload__area--dragover');
      var files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files[0], slot);
      }
    });

    // Click on drop area triggers file input
    dropArea.addEventListener('click', function (e) {
      if (e.target !== fileInput) {
        fileInput.click();
      }
    });

    // Keyboard: Enter/Space triggers file input
    dropArea.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInput.click();
      }
    });
  }

  /**
   * Bind all event listeners.
   */
  function bindEvents() {
    // File inputs
    els.file1Input.addEventListener('change', function () {
      if (this.files && this.files[0]) {
        handleFileSelect(this.files[0], 1);
      }
    });

    els.file2Input.addEventListener('change', function () {
      if (this.files && this.files[0]) {
        handleFileSelect(this.files[0], 2);
      }
    });

    // Drag and drop
    setupDragDrop(els.file1DropArea, els.file1Input, 1);
    setupDragDrop(els.file2DropArea, els.file2Input, 2);

    // Form submit
    els.form.addEventListener('submit', handleSubmit);

    // Download button
    els.downloadBtn.addEventListener('click', handleDownload);

    // Demo dismiss
    if (els.demoDismissBtn) {
      els.demoDismissBtn.addEventListener('click', function () {
        if (els.demoNotice) {
          els.demoNotice.style.display = 'none';
        }
      });
    }
  }

  /**
   * Initialize the compare page.
   */
  function init() {
    cacheElements();

    // Verify required elements exist
    if (!els.form || !els.resultsTableContainer) return;

    bindEvents();
    renderDemoData();
  }

  // Run on DOMContentLoaded or immediately if DOM is already ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
