/**
 * Dashboard Page Controller
 * 
 * Manages the dashboard page lifecycle: demo rendering on load,
 * file upload/parsing, dashboard generation via DashboardEngine,
 * and rendering of KPIs, charts, tables, and customer stats.
 * 
 * Dependencies: StateManager, UIUtils, FileHandler, DashboardEngine,
 *               DemoData, DownloadUtil, Chart
 */

/* global StateManager, UIUtils, FileHandler, DashboardEngine, DemoData, DownloadUtil, Chart */

(function () {
  'use strict';

  // Track Chart.js instances for proper cleanup
  var chartInstances = [];

  // Store last dashboard result for download
  var lastDashboardResult = null;

  /**
   * Initialize the dashboard page.
   */
  function init() {
    StateManager.init({
      isLoading: false,
      parsedFile: null,
      error: null,
      dashboardGenerated: false
    });

    setupFileInput();
    setupFormSubmit();
    setupDownloadButton();
    renderDemoDashboard();
  }

  // ─── File Input ──────────────────────────────────────────────────────

  /**
   * Set up the file input change handler to validate and show file info.
   */
  function setupFileInput() {
    var fileInput = document.getElementById('dashboard-file');
    if (!fileInput) return;

    fileInput.addEventListener('change', function () {
      var fileInfoEl = document.getElementById('file-info');
      var file = fileInput.files[0];

      if (!file) {
        if (fileInfoEl) fileInfoEl.textContent = '';
        StateManager.set('parsedFile', null);
        return;
      }

      // Validate the file
      var validation = FileHandler.validate(file);
      if (!validation.valid) {
        if (fileInfoEl) {
          fileInfoEl.textContent = validation.error;
          fileInfoEl.classList.add('file-info--error');
          fileInfoEl.classList.remove('file-info--success');
        }
        StateManager.set('parsedFile', null);
        return;
      }

      // Show file info
      var sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      if (fileInfoEl) {
        fileInfoEl.textContent = file.name + ' (' + sizeMB + ' MB)';
        fileInfoEl.classList.add('file-info--success');
        fileInfoEl.classList.remove('file-info--error');
      }
    });
  }

  // ─── Form Submit ─────────────────────────────────────────────────────

  /**
   * Set up the form submission handler.
   */
  function setupFormSubmit() {
    var form = document.getElementById('dashboard-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      handleFormSubmit();
    });
  }

  /**
   * Handle the dashboard form submission.
   */
  function handleFormSubmit() {
    var fileInput = document.getElementById('dashboard-file');
    var form = document.getElementById('dashboard-form');
    var dashboardContent = document.getElementById('dashboard-content');

    UIUtils.clearErrors(form);

    // Validate that a file is selected
    if (!fileInput || !fileInput.files || !fileInput.files[0]) {
      UIUtils.showFieldError(fileInput, 'Please select an Excel file to generate the dashboard.');
      return;
    }

    var file = fileInput.files[0];

    // Validate the file
    var validation = FileHandler.validate(file);
    if (!validation.valid) {
      UIUtils.showFieldError(fileInput, validation.error);
      return;
    }

    // Show loading
    StateManager.set('isLoading', true);
    UIUtils.showLoading(dashboardContent, 'Generating dashboard...');

    // Parse and generate
    FileHandler.parse(file).then(function (parsedFile) {
      StateManager.set('parsedFile', parsedFile);

      try {
        // Generate dashboard
        var result = DashboardEngine.generate(parsedFile.rows, parsedFile.headers);
        lastDashboardResult = result;

        // Render results
        renderKPIs(result.kpis);
        renderCharts(result.charts);
        renderTopProducts(result.topProducts);
        renderCustomerStats(result.customerStats);

        // Show download button, hide demo notice
        showDownloadSection();
        hideDemoNotice();

        StateManager.set('dashboardGenerated', true);
        UIUtils.notify('Dashboard generated successfully!', 'success');
      } catch (renderError) {
        UIUtils.notify(renderError.message || 'Failed to generate dashboard. Please try again.', 'error');
      }

      StateManager.set('isLoading', false);
      UIUtils.hideLoading(dashboardContent);
    }).catch(function (error) {
      StateManager.set('isLoading', false);
      UIUtils.hideLoading(dashboardContent);
      UIUtils.notify(error.message || 'Failed to process file. Please try again.', 'error');
      UIUtils.showFieldError(fileInput, error.message || 'File could not be read. Please try a different file.');
    });
  }

  // ─── Download ────────────────────────────────────────────────────────

  /**
   * Set up the download button click handler.
   */
  function setupDownloadButton() {
    var downloadBtn = document.getElementById('download-report-btn');
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', function () {
      if (lastDashboardResult) {
        DownloadUtil.downloadDashboardReport(lastDashboardResult);
      }
    });
  }

  /**
   * Show the download section.
   */
  function showDownloadSection() {
    var section = document.getElementById('download-section');
    if (section) section.style.display = '';
  }

  /**
   * Hide the demo notice.
   */
  function hideDemoNotice() {
    var notice = document.getElementById('demo-notice');
    if (notice) notice.style.display = 'none';
  }

  // ─── Demo Dashboard ──────────────────────────────────────────────────

  /**
   * Render the demo dashboard from DemoData.dashboard.
   */
  function renderDemoDashboard() {
    var demoData = DemoData && DemoData.dashboard;
    if (!demoData) return;

    renderKPIs(demoData.kpis);
    renderDemoCharts(demoData.charts);
    renderTopProducts(demoData.topProducts);
    renderCustomerStats(demoData.customerStats);
  }

  // ─── KPI Rendering ───────────────────────────────────────────────────

  /**
   * Render KPI cards into the grid.
   * @param {Object[]} kpis - Array of KPI objects { label, value, icon, available }
   */
  function renderKPIs(kpis) {
    var grid = document.getElementById('kpi-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (!kpis || kpis.length === 0) return;

    for (var i = 0; i < kpis.length; i++) {
      var kpi = kpis[i];
      var card = document.createElement('div');
      card.className = 'kpi-card';

      if (!kpi.available) {
        card.classList.add('kpi-card--unavailable');
      }

      var iconDiv = document.createElement('div');
      iconDiv.className = 'kpi-card__icon';
      iconDiv.setAttribute('aria-hidden', 'true');
      iconDiv.textContent = getKPIIcon(kpi.icon);

      var contentDiv = document.createElement('div');
      contentDiv.className = 'kpi-card__content';

      var valueDiv = document.createElement('div');
      valueDiv.className = 'kpi-card__value';

      if (kpi.available === false) {
        valueDiv.textContent = 'N/A';
        var explanation = document.createElement('span');
        explanation.className = 'kpi-card__unavailable-text';
        explanation.textContent = ' (insufficient data)';
        valueDiv.appendChild(explanation);
      } else {
        valueDiv.textContent = kpi.value;
      }

      var labelDiv = document.createElement('div');
      labelDiv.className = 'kpi-card__label';
      labelDiv.textContent = kpi.label;

      contentDiv.appendChild(valueDiv);
      contentDiv.appendChild(labelDiv);
      card.appendChild(iconDiv);
      card.appendChild(contentDiv);
      grid.appendChild(card);
    }
  }

  /**
   * Map icon identifiers to display characters.
   */
  function getKPIIcon(icon) {
    var iconMap = {
      'revenue': '💰',
      'average': '📊',
      'customers': '👥',
      'top-product': '🏆'
    };
    return iconMap[icon] || icon || '📈';
  }

  // ─── Chart Rendering ─────────────────────────────────────────────────

  /**
   * Render charts from DashboardEngine output.
   * Destroys existing chart instances before creating new ones.
   * @param {Object[]} charts - Chart configuration objects from DashboardEngine
   */
  function renderCharts(charts) {
    destroyCharts();

    var container = document.getElementById('chart-container');
    if (!container) return;

    container.innerHTML = '';

    if (!charts || charts.length === 0) {
      var placeholder = document.createElement('p');
      placeholder.className = 'chart-placeholder';
      placeholder.textContent = 'No chart data available for the uploaded file.';
      container.appendChild(placeholder);
      return;
    }

    for (var i = 0; i < charts.length; i++) {
      var chartConfig = charts[i];
      var wrapper = document.createElement('div');
      wrapper.className = 'chart-wrapper';

      var canvas = document.createElement('canvas');
      canvas.id = 'chart-' + i;
      canvas.setAttribute('aria-label', chartConfig.options && chartConfig.options.plugins && chartConfig.options.plugins.title ? chartConfig.options.plugins.title.text : 'Chart ' + (i + 1));
      canvas.setAttribute('role', 'img');
      wrapper.appendChild(canvas);
      container.appendChild(wrapper);

      // Create Chart.js instance
      try {
        if (typeof Chart !== 'undefined') {
          var instance = new Chart(canvas.getContext('2d'), {
            type: chartConfig.type,
            data: chartConfig.data,
            options: chartConfig.options || {}
          });
          chartInstances.push(instance);
        }
      } catch (e) {
        // Chart.js might be a stub in testing; graceful fallback
        var fallback = document.createElement('p');
        fallback.className = 'chart-placeholder';
        fallback.textContent = 'Chart visualization unavailable.';
        wrapper.appendChild(fallback);
      }
    }
  }

  /**
   * Render demo charts from DemoData (uses .config format).
   * @param {Object[]} demoCharts - Demo chart objects with .config property
   */
  function renderDemoCharts(demoCharts) {
    destroyCharts();

    var container = document.getElementById('chart-container');
    if (!container) return;

    container.innerHTML = '';

    if (!demoCharts || demoCharts.length === 0) return;

    for (var i = 0; i < demoCharts.length; i++) {
      var chartData = demoCharts[i];
      var config = chartData.config || chartData;

      var wrapper = document.createElement('div');
      wrapper.className = 'chart-wrapper';

      var canvas = document.createElement('canvas');
      canvas.id = 'demo-chart-' + i;
      canvas.setAttribute('aria-label', chartData.title || 'Demo chart ' + (i + 1));
      canvas.setAttribute('role', 'img');
      wrapper.appendChild(canvas);
      container.appendChild(wrapper);

      // Create Chart.js instance
      try {
        if (typeof Chart !== 'undefined') {
          var instance = new Chart(canvas.getContext('2d'), config);
          chartInstances.push(instance);
        }
      } catch (e) {
        // Graceful fallback for missing Chart.js
        var fallback = document.createElement('p');
        fallback.className = 'chart-placeholder';
        fallback.textContent = chartData.title || 'Chart visualization unavailable.';
        wrapper.appendChild(fallback);
      }
    }
  }

  /**
   * Destroy all existing Chart.js instances.
   */
  function destroyCharts() {
    for (var i = 0; i < chartInstances.length; i++) {
      try {
        if (chartInstances[i] && typeof chartInstances[i].destroy === 'function') {
          chartInstances[i].destroy();
        }
      } catch (e) {
        // Ignore destroy errors
      }
    }
    chartInstances = [];
  }

  // ─── Top Products Table ──────────────────────────────────────────────

  /**
   * Render the top products data table.
   * @param {Object[]} products - Array of product row objects
   */
  function renderTopProducts(products) {
    var container = document.getElementById('top-products-table');
    if (!container) return;

    if (!products || products.length === 0) {
      container.innerHTML = '<p class="no-data">No product data available.</p>';
      return;
    }

    // Get headers from the first row's keys
    var headers = Object.keys(products[0]);

    UIUtils.renderTable(container, headers, products, {
      sortable: true,
      maxRows: 10,
      scrollable: true
    });
  }

  // ─── Customer Stats ──────────────────────────────────────────────────

  /**
   * Render customer statistics.
   * @param {Object} stats - { total, returning, ratio }
   */
  function renderCustomerStats(stats) {
    var container = document.getElementById('customer-stats');
    if (!container) return;

    if (!stats) {
      container.innerHTML = '<p class="no-data">No customer data available.</p>';
      return;
    }

    container.innerHTML = '';

    var statsGrid = document.createElement('div');
    statsGrid.className = 'stats-grid';

    // Total customers
    var totalStat = createStatCard('Total Customers', stats.total != null ? stats.total.toLocaleString() : '0', '👥');
    statsGrid.appendChild(totalStat);

    // Returning customers
    var returningStat = createStatCard('Returning Customers', stats.returning != null ? stats.returning.toLocaleString() : '0', '🔄');
    statsGrid.appendChild(returningStat);

    // Return ratio
    var ratioStat = createStatCard('Return Ratio', stats.ratio || '0%', '📈');
    statsGrid.appendChild(ratioStat);

    container.appendChild(statsGrid);
  }

  /**
   * Create a stat card element.
   * @param {string} label
   * @param {string} value
   * @param {string} icon
   * @returns {HTMLElement}
   */
  function createStatCard(label, value, icon) {
    var card = document.createElement('div');
    card.className = 'stat-card';

    var iconEl = document.createElement('span');
    iconEl.className = 'stat-card__icon';
    iconEl.setAttribute('aria-hidden', 'true');
    iconEl.textContent = icon;

    var valueEl = document.createElement('div');
    valueEl.className = 'stat-card__value';
    valueEl.textContent = value;

    var labelEl = document.createElement('div');
    labelEl.className = 'stat-card__label';
    labelEl.textContent = label;

    card.appendChild(iconEl);
    card.appendChild(valueEl);
    card.appendChild(labelEl);

    return card;
  }

  // ─── Initialize ──────────────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
