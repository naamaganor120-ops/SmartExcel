/**
 * Demo Data Module
 * Pre-loaded representative datasets for all service pages.
 * Used to display demo results on initial page load (Demo Mode).
 * 
 * Requirements: 16.1, 16.3, 7.4, 8.4, 9.7, 13.5, 14.5
 */

var DemoData = {
  // ─── Comparison Demo Data ───────────────────────────────────────────
  // Simulates a comparison between two customer/payment Excel files
  comparison: {
    matched: [
      { 'Customer ID': 'CUST-1001', 'Name': 'Yael Cohen', 'Email': 'yael.cohen@email.co.il', 'Amount': 1250 },
      { 'Customer ID': 'CUST-1003', 'Name': 'Avi Levy', 'Email': 'avi.levy@email.co.il', 'Amount': 890 },
      { 'Customer ID': 'CUST-1005', 'Name': 'Noa Mizrahi', 'Email': 'noa.m@email.co.il', 'Amount': 2100 },
      { 'Customer ID': 'CUST-1007', 'Name': 'Omer Katz', 'Email': 'omer.katz@email.co.il', 'Amount': 560 },
      { 'Customer ID': 'CUST-1009', 'Name': 'Tamar Ben-David', 'Email': 'tamar.bd@email.co.il', 'Amount': 1780 },
      { 'Customer ID': 'CUST-1012', 'Name': 'Eitan Shapira', 'Email': 'eitan.s@email.co.il', 'Amount': 430 }
    ],
    file1Only: [
      { 'Customer ID': 'CUST-1002', 'Name': 'David Peretz', 'Email': 'david.p@email.co.il', 'Amount': 670 },
      { 'Customer ID': 'CUST-1006', 'Name': 'Shira Goldberg', 'Email': 'shira.g@email.co.il', 'Amount': 1450 },
      { 'Customer ID': 'CUST-1010', 'Name': 'Lior Azulay', 'Email': 'lior.a@email.co.il', 'Amount': 320 }
    ],
    file2Only: [
      { 'Customer ID': 'CUST-2001', 'Name': 'Maya Friedman', 'Email': 'maya.f@email.co.il', 'Amount': 990 },
      { 'Customer ID': 'CUST-2003', 'Name': 'Ron Abergel', 'Email': 'ron.a@email.co.il', 'Amount': 1100 },
      { 'Customer ID': 'CUST-2005', 'Name': 'Hila Barak', 'Email': 'hila.b@email.co.il', 'Amount': 750 }
    ],
    duplicatesFile1: [
      { 'Customer ID': 'CUST-1001', 'Name': 'Yael Cohen', 'Email': 'yael.cohen@email.co.il', 'Amount': 1250 },
      { 'Customer ID': 'CUST-1005', 'Name': 'Noa Mizrahi', 'Email': 'noa.m@email.co.il', 'Amount': 2100 }
    ],
    duplicatesFile2: [
      { 'Customer ID': 'CUST-2001', 'Name': 'Maya Friedman', 'Email': 'maya.f@email.co.il', 'Amount': 990 }
    ],
    summary: {
      matched: 6,
      file1Only: 3,
      file2Only: 3,
      duplicates: 3
    }
  },

  // ─── Cleaning Demo Data ─────────────────────────────────────────────
  // Simulates the result of cleaning a messy supplier/contact list
  cleaning: {
    originalRowCount: 150,
    cleanedRowCount: 132,
    issuesFound: {
      duplicates: 8,
      emptyRows: 5,
      trimmed: 22,
      dateFixed: 3,
      missingValues: 12,
      formatFixed: 4
    },
    cleanedData: [
      { 'Supplier ID': 'SUP-001', 'Company': 'Tech Solutions Ltd', 'Contact': 'Moshe Rosen', 'Phone': '03-5551234', 'Date Added': '2024-01-15' },
      { 'Supplier ID': 'SUP-002', 'Company': 'Office Pro', 'Contact': 'Dana Halevi', 'Phone': '02-5559876', 'Date Added': '2024-02-03' },
      { 'Supplier ID': 'SUP-003', 'Company': 'Green Supplies', 'Contact': 'Yossi Biton', 'Phone': '04-5554321', 'Date Added': '2024-02-20' },
      { 'Supplier ID': 'SUP-004', 'Company': 'Fast Delivery Co', 'Contact': 'Anat Schwartz', 'Phone': '08-5556789', 'Date Added': '2024-03-10' },
      { 'Supplier ID': 'SUP-005', 'Company': 'Digital Media Group', 'Contact': 'Rami Gabay', 'Phone': '09-5552468', 'Date Added': '2024-03-28' },
      { 'Supplier ID': 'SUP-006', 'Company': 'SafeGuard Security', 'Contact': 'Liora Edri', 'Phone': '03-5551357', 'Date Added': '2024-04-05' }
    ]
  },

  // ─── Dashboard Demo Data ────────────────────────────────────────────
  // Simulates a monthly sales dashboard with KPIs, charts, and tables
  dashboard: {
    kpis: [
      { label: 'Total Revenue', value: '₪125,000', icon: 'revenue', available: true },
      { label: 'Average Transaction', value: '₪510', icon: 'average', available: true },
      { label: 'Total Customers', value: '245', icon: 'customers', available: true },
      { label: 'Top Product', value: 'Premium Widget', icon: 'top-product', available: true }
    ],
    charts: [
      {
        type: 'bar',
        title: 'Top Products by Revenue',
        config: {
          type: 'bar',
          data: {
            labels: ['Premium Widget', 'Basic Package', 'Pro Service', 'Starter Kit', 'Enterprise Plan'],
            datasets: [{
              label: 'Revenue (₪)',
              data: [32000, 25500, 22000, 18500, 15000],
              backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(139, 92, 246, 0.8)',
                'rgba(236, 72, 153, 0.8)'
              ],
              borderColor: [
                'rgb(59, 130, 246)',
                'rgb(16, 185, 129)',
                'rgb(245, 158, 11)',
                'rgb(139, 92, 246)',
                'rgb(236, 72, 153)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Top Products by Revenue' }
            },
            scales: {
              y: { beginAtZero: true }
            }
          }
        }
      },
      {
        type: 'line',
        title: 'Monthly Revenue Trend',
        config: {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Revenue (₪)',
              data: [18000, 21000, 19500, 24000, 22500, 20000],
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.3
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: { display: true, text: 'Monthly Revenue Trend' }
            },
            scales: {
              y: { beginAtZero: true }
            }
          }
        }
      }
    ],
    topProducts: [
      { Product: 'Premium Widget', Quantity: 64, Revenue: '₪32,000', Rank: 1 },
      { Product: 'Basic Package', Quantity: 85, Revenue: '₪25,500', Rank: 2 },
      { Product: 'Pro Service', Quantity: 44, Revenue: '₪22,000', Rank: 3 },
      { Product: 'Starter Kit', Quantity: 74, Revenue: '₪18,500', Rank: 4 },
      { Product: 'Enterprise Plan', Quantity: 15, Revenue: '₪15,000', Rank: 5 },
      { Product: 'Add-on Module', Quantity: 52, Revenue: '₪10,400', Rank: 6 },
      { Product: 'Consulting Hour', Quantity: 38, Revenue: '₪7,600', Rank: 7 },
      { Product: 'Training Session', Quantity: 22, Revenue: '₪4,400', Rank: 8 }
    ],
    customerStats: {
      total: 245,
      returning: 87,
      ratio: '35.5%'
    }
  }
};

// Export for testability (Node.js / Vitest)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DemoData;
}
