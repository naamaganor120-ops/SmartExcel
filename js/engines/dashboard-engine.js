/**
 * DashboardEngine - Generates KPIs, chart configurations, and analytics from uploaded data.
 * Auto-detects column roles and produces Chart.js-compatible visualizations.
 */
var DashboardEngine = (function () {
  // Column detection patterns
  var COLUMN_PATTERNS = {
    revenue: /revenue|amount|total|price|sales|income|sum/i,
    product: /product|item|name|description|service/i,
    date: /date|time|day|month|year|period/i,
    customer: /customer|client|buyer|user|account/i,
    quantity: /quantity|qty|count|units|sold|number/i
  };

  // Chart color palette
  var COLORS = [
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 99, 132, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 159, 64, 0.8)',
    'rgba(46, 204, 113, 0.8)',
    'rgba(231, 76, 60, 0.8)',
    'rgba(52, 152, 219, 0.8)',
    'rgba(241, 196, 15, 0.8)'
  ];

  var BORDER_COLORS = COLORS.map(function (c) {
    return c.replace('0.8', '1');
  });

  /**
   * Check if a value looks like a number (for type detection).
   */
  function isNumeric(value) {
    if (value === null || value === undefined || value === '') return false;
    var num = Number(value);
    return !isNaN(num) && isFinite(num);
  }

  /**
   * Check if a value looks like a date.
   */
  function isDateLike(value) {
    if (value === null || value === undefined || value === '') return false;
    if (value instanceof Date) return true;
    var str = String(value);
    // Common date patterns
    if (/\d{1,4}[-\/\.]\d{1,2}[-\/\.]\d{1,4}/.test(str)) return true;
    if (/\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(str)) return true;
    var parsed = Date.parse(str);
    return !isNaN(parsed) && str.length > 4;
  }

  /**
   * Format a number as currency.
   */
  function formatCurrency(value) {
    if (typeof value !== 'number' || isNaN(value)) return 'N/A';
    return '₪' + value.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  /**
   * Attempt to auto-detect column roles from headers and sample data.
   * @param {string[]} headers - Column header names
   * @param {Object[]} sampleRows - First few rows for type detection
   * @returns {{ revenue?: string, product?: string, date?: string, customer?: string, quantity?: string }}
   */
  function detectColumns(headers, sampleRows) {
    var columnMap = {};
    var assigned = {};

    if (!headers || headers.length === 0) return columnMap;

    // First pass: match by header name patterns
    headers.forEach(function (header) {
      if (!header) return;
      var headerLower = String(header).toLowerCase();

      Object.keys(COLUMN_PATTERNS).forEach(function (role) {
        if (columnMap[role]) return; // Already assigned

        if (COLUMN_PATTERNS[role].test(headerLower)) {
          // For "customer" role, prefer headers with "customer" or "client" over generic "name"
          if (role === 'customer' && /^name$/i.test(headerLower)) {
            // Skip generic "name" for customer — might be product name
            return;
          }
          // For "product" role, don't assign if it looks more like customer
          if (role === 'product' && /customer|client|buyer/i.test(headerLower)) {
            return;
          }
          columnMap[role] = header;
          assigned[header] = role;
        }
      });
    });

    // Second pass: use data types from sample rows to fill gaps
    if (sampleRows && sampleRows.length > 0) {
      headers.forEach(function (header) {
        if (!header || assigned[header]) return;

        var values = sampleRows.map(function (row) { return row[header]; }).filter(function (v) { return v !== null && v !== undefined && v !== ''; });
        if (values.length === 0) return;

        var numericCount = values.filter(isNumeric).length;
        var dateCount = values.filter(isDateLike).length;
        var numericRatio = numericCount / values.length;
        var dateRatio = dateCount / values.length;

        // If mostly dates and no date column assigned yet
        if (!columnMap.date && dateRatio > 0.5) {
          columnMap.date = header;
          assigned[header] = 'date';
        }
        // If mostly numbers and no revenue column assigned yet
        else if (!columnMap.revenue && numericRatio > 0.7) {
          // Check if values look like monetary amounts (larger numbers)
          var avg = values.reduce(function (sum, v) { return sum + Number(v); }, 0) / values.length;
          if (avg > 1) {
            columnMap.revenue = header;
            assigned[header] = 'revenue';
          }
        }
        // If mostly numbers and no quantity column assigned yet
        else if (!columnMap.quantity && numericRatio > 0.7) {
          columnMap.quantity = header;
          assigned[header] = 'quantity';
        }
      });
    }

    return columnMap;
  }

  /**
   * Calculate KPIs from data with detected columns.
   * @param {Object[]} data - Row data
   * @param {Object} columnMap - Detected column mapping
   * @returns {KPI[]}
   */
  function calculateKPIs(data, columnMap) {
    var kpis = [];

    // KPI 1: Total Revenue
    if (columnMap.revenue) {
      var totalRevenue = 0;
      data.forEach(function (row) {
        var val = Number(row[columnMap.revenue]);
        if (!isNaN(val)) totalRevenue += val;
      });
      kpis.push({
        label: 'סה"כ הכנסות',
        value: formatCurrency(totalRevenue),
        icon: '💰',
        available: true
      });
    } else {
      kpis.push({
        label: 'סה"כ הכנסות',
        value: 'N/A',
        icon: '💰',
        available: false
      });
    }

    // KPI 2: Average Transaction
    if (columnMap.revenue) {
      var total = 0;
      var count = 0;
      data.forEach(function (row) {
        var val = Number(row[columnMap.revenue]);
        if (!isNaN(val)) {
          total += val;
          count++;
        }
      });
      var avg = count > 0 ? total / count : 0;
      kpis.push({
        label: 'עסקה ממוצעת',
        value: formatCurrency(avg),
        icon: '📊',
        available: true
      });
    } else {
      kpis.push({
        label: 'עסקה ממוצעת',
        value: 'N/A',
        icon: '📊',
        available: false
      });
    }

    // KPI 3: Total Customers
    if (columnMap.customer) {
      var customers = {};
      data.forEach(function (row) {
        var val = row[columnMap.customer];
        if (val !== null && val !== undefined && val !== '') {
          customers[String(val)] = true;
        }
      });
      var customerCount = Object.keys(customers).length;
      kpis.push({
        label: 'מספר לקוחות',
        value: customerCount.toLocaleString(),
        icon: '👥',
        available: true
      });
    } else {
      kpis.push({
        label: 'מספר לקוחות',
        value: 'N/A',
        icon: '👥',
        available: false
      });
    }

    // KPI 4: Top-Selling Product
    if (columnMap.product) {
      var productMetrics = {};
      data.forEach(function (row) {
        var product = row[columnMap.product];
        if (product === null || product === undefined || product === '') return;
        var key = String(product);
        if (!productMetrics[key]) productMetrics[key] = { revenue: 0, quantity: 0 };

        if (columnMap.revenue) {
          var rev = Number(row[columnMap.revenue]);
          if (!isNaN(rev)) productMetrics[key].revenue += rev;
        }
        if (columnMap.quantity) {
          var qty = Number(row[columnMap.quantity]);
          if (!isNaN(qty)) productMetrics[key].quantity += qty;
        }
      });

      var topProduct = null;
      var topValue = -Infinity;
      Object.keys(productMetrics).forEach(function (product) {
        var val = columnMap.revenue ? productMetrics[product].revenue : productMetrics[product].quantity;
        if (val > topValue) {
          topValue = val;
          topProduct = product;
        }
      });

      kpis.push({
        label: 'מוצר מוביל',
        value: topProduct || 'N/A',
        icon: '🏆',
        available: topProduct !== null
      });
    } else {
      kpis.push({
        label: 'מוצר מוביל',
        value: 'N/A',
        icon: '🏆',
        available: false
      });
    }

    return kpis;
  }

  /**
   * Build chart configurations for Chart.js.
   */
  function buildCharts(data, columnMap) {
    var charts = [];

    // Chart 1: Revenue over time (line chart) - if date + revenue available
    if (columnMap.date && columnMap.revenue) {
      var timeData = {};
      data.forEach(function (row) {
        var dateVal = String(row[columnMap.date] || '');
        var revVal = Number(row[columnMap.revenue]);
        if (dateVal && !isNaN(revVal)) {
          if (!timeData[dateVal]) timeData[dateVal] = 0;
          timeData[dateVal] += revVal;
        }
      });

      var sortedDates = Object.keys(timeData).sort();
      if (sortedDates.length > 0) {
        charts.push({
          type: 'line',
          data: {
            labels: sortedDates,
            datasets: [{
              label: 'הכנסות לאורך זמן',
              data: sortedDates.map(function (d) { return timeData[d]; }),
              borderColor: BORDER_COLORS[0],
              backgroundColor: COLORS[0],
              fill: false,
              tension: 0.1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: { display: true, text: 'הכנסות לאורך זמן' }
            },
            scales: {
              y: { beginAtZero: true }
            }
          }
        });
      }
    }

    // Chart 2: Top products (bar chart) - if product + revenue/quantity available
    if (columnMap.product && (columnMap.revenue || columnMap.quantity)) {
      var productTotals = {};
      var metricCol = columnMap.revenue || columnMap.quantity;
      var metricLabel = columnMap.revenue ? 'הכנסות' : 'כמות';

      data.forEach(function (row) {
        var product = String(row[columnMap.product] || '');
        var val = Number(row[metricCol]);
        if (product && !isNaN(val)) {
          if (!productTotals[product]) productTotals[product] = 0;
          productTotals[product] += val;
        }
      });

      var sorted = Object.keys(productTotals).sort(function (a, b) {
        return productTotals[b] - productTotals[a];
      }).slice(0, 10);

      if (sorted.length > 0) {
        charts.push({
          type: 'bar',
          data: {
            labels: sorted,
            datasets: [{
              label: metricLabel + ' לפי מוצר',
              data: sorted.map(function (p) { return productTotals[p]; }),
              backgroundColor: COLORS.slice(0, sorted.length),
              borderColor: BORDER_COLORS.slice(0, sorted.length),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: { display: true, text: 'מוצרים מובילים' }
            },
            scales: {
              y: { beginAtZero: true }
            }
          }
        });
      }
    }

    // Chart 3: Revenue distribution (pie chart) - if product + revenue
    if (columnMap.product && columnMap.revenue) {
      var pieData = {};
      data.forEach(function (row) {
        var product = String(row[columnMap.product] || '');
        var rev = Number(row[columnMap.revenue]);
        if (product && !isNaN(rev)) {
          if (!pieData[product]) pieData[product] = 0;
          pieData[product] += rev;
        }
      });

      var pieProducts = Object.keys(pieData).sort(function (a, b) {
        return pieData[b] - pieData[a];
      }).slice(0, 8);

      if (pieProducts.length > 0) {
        charts.push({
          type: 'pie',
          data: {
            labels: pieProducts,
            datasets: [{
              data: pieProducts.map(function (p) { return pieData[p]; }),
              backgroundColor: COLORS.slice(0, pieProducts.length),
              borderColor: BORDER_COLORS.slice(0, pieProducts.length),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: { display: true, text: 'התפלגות הכנסות לפי מוצר' }
            }
          }
        });
      }
    }

    // Fallback chart: bar chart of first numeric column
    if (charts.length === 0) {
      var numericCol = null;
      var headers = data.length > 0 ? Object.keys(data[0]) : [];
      for (var i = 0; i < headers.length; i++) {
        var vals = data.slice(0, 10).map(function (row) { return row[headers[i]]; });
        if (vals.filter(isNumeric).length > vals.length * 0.5) {
          numericCol = headers[i];
          break;
        }
      }

      if (numericCol) {
        var labelCol = headers.find(function (h) { return h !== numericCol && !isNumeric(data[0][h]); }) || null;
        var labels = data.slice(0, 20).map(function (row, idx) {
          return labelCol ? String(row[labelCol] || 'שורה ' + (idx + 1)) : 'שורה ' + (idx + 1);
        });
        var values = data.slice(0, 20).map(function (row) {
          var v = Number(row[numericCol]);
          return isNaN(v) ? 0 : v;
        });

        charts.push({
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: numericCol,
              data: values,
              backgroundColor: COLORS[0],
              borderColor: BORDER_COLORS[0],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: { display: true, text: 'נתונים - ' + numericCol }
            },
            scales: {
              y: { beginAtZero: true }
            }
          }
        });
      }
    }

    return charts;
  }

  /**
   * Build top products list grouped by product, sorted descending.
   */
  function buildTopProducts(data, columnMap) {
    if (!columnMap.product) return [];

    var productMetrics = {};
    data.forEach(function (row) {
      var product = row[columnMap.product];
      if (product === null || product === undefined || product === '') return;
      var key = String(product);

      if (!productMetrics[key]) {
        productMetrics[key] = { product: key, revenue: 0, quantity: 0, transactions: 0 };
      }
      productMetrics[key].transactions++;

      if (columnMap.revenue) {
        var rev = Number(row[columnMap.revenue]);
        if (!isNaN(rev)) productMetrics[key].revenue += rev;
      }
      if (columnMap.quantity) {
        var qty = Number(row[columnMap.quantity]);
        if (!isNaN(qty)) productMetrics[key].quantity += qty;
      }
    });

    // Sort by revenue (primary) or quantity (fallback)
    var sortKey = columnMap.revenue ? 'revenue' : 'quantity';
    var products = Object.keys(productMetrics).map(function (key) {
      return productMetrics[key];
    });

    products.sort(function (a, b) {
      return b[sortKey] - a[sortKey];
    });

    return products.slice(0, 10);
  }

  /**
   * Build customer statistics.
   */
  function buildCustomerStats(data, columnMap) {
    if (!columnMap.customer) {
      return { total: 0, returning: 0, ratio: '0%' };
    }

    var customerCounts = {};
    data.forEach(function (row) {
      var customer = row[columnMap.customer];
      if (customer === null || customer === undefined || customer === '') return;
      var key = String(customer);
      if (!customerCounts[key]) customerCounts[key] = 0;
      customerCounts[key]++;
    });

    var total = Object.keys(customerCounts).length;
    var returning = Object.keys(customerCounts).filter(function (key) {
      return customerCounts[key] > 1;
    }).length;

    var ratio = total > 0 ? ((returning / total) * 100).toFixed(1) + '%' : '0%';

    return {
      total: total,
      returning: returning,
      ratio: ratio
    };
  }

  /**
   * Generate a full dashboard from uploaded data.
   * @param {Object[]} data - Parsed rows from uploaded file
   * @param {string[]} headers - Column headers
   * @returns {DashboardResult}
   */
  function generate(data, headers) {
    if (!data || data.length === 0) {
      return {
        kpis: [
          { label: 'סה"כ הכנסות', value: 'N/A', icon: '💰', available: false },
          { label: 'עסקה ממוצעת', value: 'N/A', icon: '📊', available: false },
          { label: 'מספר לקוחות', value: 'N/A', icon: '👥', available: false },
          { label: 'מוצר מוביל', value: 'N/A', icon: '🏆', available: false }
        ],
        charts: [],
        topProducts: [],
        customerStats: { total: 0, returning: 0, ratio: '0%' }
      };
    }

    // Use provided headers or extract from first row
    var effectiveHeaders = headers || (data.length > 0 ? Object.keys(data[0]) : []);

    // Detect columns from headers and sample data
    var sampleRows = data.slice(0, 10);
    var columnMap = detectColumns(effectiveHeaders, sampleRows);

    // Calculate KPIs
    var kpis = calculateKPIs(data, columnMap);

    // Build chart configurations
    var charts = buildCharts(data, columnMap);

    // Build top products list
    var topProducts = buildTopProducts(data, columnMap);

    // Build customer statistics
    var customerStats = buildCustomerStats(data, columnMap);

    return {
      kpis: kpis,
      charts: charts,
      topProducts: topProducts,
      customerStats: customerStats
    };
  }

  // Public API
  return {
    generate: generate,
    detectColumns: detectColumns,
    calculateKPIs: calculateKPIs
  };
})();

// Export for testing (Node.js / CommonJS)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DashboardEngine;
}
