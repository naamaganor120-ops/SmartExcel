/**
 * SmartExcel — Internationalization (i18n) Module
 * Provides Hebrew/English translation support with RTL/LTR switching.
 * Persists language choice in localStorage.
 */
var I18n = (function() {
  'use strict';

  var translations = {
    en: {
      // Navigation
      'nav.home': 'Home',
      'nav.compare': 'Compare',
      'nav.clean': 'Clean',
      'nav.dashboard': 'Dashboard',
      'nav.about': 'About & Contact',
      'nav.brand': 'SmartExcel',

      // Home page
      'home.hero.title': 'Work Smarter with Your Excel Files',
      'home.hero.description': 'SmartExcel helps you compare, clean, and analyze spreadsheets directly in your browser. No installs, no technical expertise required \u2014 just fast, professional results.',
      'home.hero.cta.compare': 'Compare Files',
      'home.hero.cta.clean': 'Clean Data',
      'home.benefits.title': 'Why SmartExcel?',
      'home.benefits.noExpertise.title': 'No Technical Expertise Needed',
      'home.benefits.noExpertise.desc': 'Intuitive interface designed for everyone. Upload your file, choose an action, and get results \u2014 no formulas or macros required.',
      'home.benefits.browser.title': 'Works in Your Browser',
      'home.benefits.browser.desc': 'No software to install or accounts to create. Everything runs securely in your browser \u2014 your data never leaves your device.',
      'home.benefits.fast.title': 'Results in Seconds',
      'home.benefits.fast.desc': 'Powerful processing engine delivers instant results. Compare thousands of rows or clean entire datasets in moments.',
      'home.benefits.professional.title': 'Professional Output',
      'home.benefits.professional.desc': 'Export clean, formatted results ready for reports, presentations, or further analysis. Download as Excel with one click.',
      'home.howItWorks.title': 'How It Works',
      'home.howItWorks.step1.title': '1. Upload Your File',
      'home.howItWorks.step1.desc': 'Drag and drop your Excel or CSV files. We support .xlsx, .xls, and .csv formats.',
      'home.howItWorks.step2.title': '2. Choose Your Action',
      'home.howItWorks.step2.desc': 'Compare two files, clean your data, or generate a visual dashboard \u2014 pick what you need.',
      'home.howItWorks.step3.title': '3. Get Instant Results',
      'home.howItWorks.step3.desc': 'View your results immediately and download professional Excel reports with one click.',
      'home.services.title': 'Our Services',
      'home.services.compare.title': 'Compare Excel Files',
      'home.services.compare.desc': 'Find matches, differences, and duplicates between two spreadsheets. Perfect for reconciliation and auditing.',
      'home.services.compare.btn': 'Start Comparing',
      'home.services.clean.title': 'Clean Excel Data',
      'home.services.clean.desc': 'Remove duplicates, fix formatting, trim whitespace, and standardize your data automatically.',
      'home.services.clean.btn': 'Start Cleaning',
      'home.services.dashboard.title': 'Visual Dashboard',
      'home.services.dashboard.desc': 'Upload your data and get instant visual charts and KPI summaries to understand trends at a glance.',
      'home.services.dashboard.btn': 'View Dashboard',

      // Compare page
      'compare.title': 'Compare Excel Files',
      'compare.description': 'Upload two Excel files and select a key column to compare them. SmartExcel will identify matching records, records unique to each file, and duplicates.',
      'compare.file1': 'File 1',
      'compare.file2': 'File 2',
      'compare.chooseFile': 'Choose file',
      'compare.dragHere': 'or drag it here',
      'compare.fileHint': 'Accepts .xlsx, .xls (max 10MB)',
      'compare.columnLabel': 'Comparison Column',
      'compare.columnPlaceholder': '-- Upload both files first --',
      'compare.columnHint': 'Select the column used to match records between files.',
      'compare.submitBtn': 'Compare Files',
      'compare.demo': 'Demo Mode: Results are simulated for demonstration purposes. Upload your own files to see real comparison results.',
      'compare.results': 'Results',
      'compare.matched': 'Matched',
      'compare.file1Only': 'File 1 Only',
      'compare.file2Only': 'File 2 Only',
      'compare.duplicates': 'Duplicates',
      'compare.download': 'Download Results',

      // Clean page
      'clean.title': 'Clean Excel Files',
      'clean.description': 'Upload your Excel file and choose cleaning options to automatically remove errors, duplicates, and inconsistencies from your data.',
      'clean.fileLabel': 'Upload Excel File',
      'clean.optionsLegend': 'Cleaning Options',
      'clean.option.duplicates': 'Remove duplicates',
      'clean.option.emptyRows': 'Remove empty rows',
      'clean.option.trimSpaces': 'Trim unnecessary spaces',
      'clean.option.standardize': 'Standardize data formats',
      'clean.option.missingValues': 'Detect missing values',
      'clean.option.fixDates': 'Fix date formats',
      'clean.submitBtn': 'Clean File',
      'clean.demo': 'Demo Mode: Results are simulated for demonstration purposes. Upload your own file to see real cleaning results.',
      'clean.results.title': 'Results Summary',
      'clean.download': 'Download Cleaned File',

      // Dashboard page
      'dashboard.title': 'Business Dashboard',
      'dashboard.description': 'Upload your Excel file to generate an interactive business dashboard with KPIs, charts, and analytics.',
      'dashboard.fileLabel': 'Upload Excel File',
      'dashboard.submitBtn': 'Generate Dashboard',
      'dashboard.demo': 'Demo Mode: Results are simulated for demonstration purposes. Upload your own file to see real dashboard analytics.',
      'dashboard.customerStats': 'Customer Statistics',
      'dashboard.topProducts': 'Top Products',
      'dashboard.download': 'Download Report',

      // About page
      'about.title': 'About & Contact',
      'about.heading': 'About SmartExcel',
      'about.description1': 'SmartExcel is a web-based platform designed to help individuals and small businesses work with Excel files quickly, accurately, and without requiring advanced technical skills. Our goal is to eliminate the hours spent on repetitive spreadsheet tasks \u2014 comparing lists, removing duplicates, cleaning messy data, and building summary reports \u2014 so you can focus on what matters most.',
      'about.description2': 'Many people struggle with Excel formulas, pivot tables, and VBA macros. SmartExcel solves this by providing a simple browser-based interface where you upload your files, choose an action, and receive professional results in seconds.',
      'about.features.title': 'Key Features',
      'about.features.1': 'Compare two Excel files and instantly see matches, differences, and duplicates',
      'about.features.2': 'Clean and organize messy data \u2014 remove duplicates, empty rows, and extra spaces',
      'about.features.3': 'Generate dashboards with KPI cards and charts from raw data',
      'about.features.4': 'No software installation required \u2014 works entirely in the browser',
      'about.features.5': 'Accessible to non-technical users with a clean, intuitive interface',
      'about.contact.title': 'Contact Us',
      'about.form.fullname': 'Full Name',
      'about.form.email': 'Email Address',
      'about.form.phone': 'Phone Number',
      'about.form.subject': 'Subject',
      'about.form.message': 'Message',
      'about.form.submit': 'Send Message',
      'about.form.sending': 'Sending...',
      'about.form.success': 'Thank you! Your message has been sent successfully.',
      'about.form.error': 'Failed to send message. Please try again.',
      'about.form.fullnamePlaceholder': 'Enter your full name',
      'about.form.emailPlaceholder': 'Enter your email address',
      'about.form.phonePlaceholder': 'Enter your phone number (optional)',
      'about.form.subjectPlaceholder': 'Enter the subject',
      'about.form.messagePlaceholder': 'Write your message here',

      // Validation
      'validation.required': 'This field is required',
      'validation.email': 'Please enter a valid email address',
      'validation.file': 'Please upload an Excel file (.xlsx or .xls).',
      'validation.column': 'Please select a comparison column.',
      'validation.option': 'Please select at least one cleaning option.',
      'validation.bothFiles': 'Please upload File 1.',
      'validation.bothFiles2': 'Please upload File 2.',

      // Footer
      'footer.brand': 'SmartExcel',
      'footer.desc': 'Smart Excel file processing tools \u2014 compare, clean, and analyze your spreadsheets directly in the browser.',
      'footer.services': 'Services',
      'footer.info': 'Info',
      'footer.about': 'About',
      'footer.contact': 'Contact',
      'footer.compare': 'Compare Files',
      'footer.clean': 'Clean Data',
      'footer.dashboard': 'Dashboard',
      'footer.copyright': '\u00a9 {year} SmartExcel. All rights reserved.',

      // Language
      'lang.switch': '\u05e2\u05d1\u05e8\u05d9\u05ea'
    },
    he: {
      // Navigation
      'nav.home': '\u05d3\u05e3 \u05d4\u05d1\u05d9\u05ea',
      'nav.compare': '\u05d4\u05e9\u05d5\u05d5\u05d0\u05d4',
      'nav.clean': '\u05e0\u05d9\u05e7\u05d5\u05d9',
      'nav.dashboard': '\u05d3\u05e9\u05d1\u05d5\u05e8\u05d3',
      'nav.about': '\u05d0\u05d5\u05d3\u05d5\u05ea \u05d5\u05e6\u05d5\u05e8 \u05e7\u05e9\u05e8',
      'nav.brand': 'SmartExcel',

      // Home page
      'home.hero.title': '\u05e2\u05d1\u05d3\u05d5 \u05d7\u05db\u05dd \u05d9\u05d5\u05ea\u05e8 \u05e2\u05dd \u05e7\u05d1\u05e6\u05d9 \u05d4\u05d0\u05e7\u05e1\u05dc \u05e9\u05dc\u05db\u05dd',
      'home.hero.description': 'SmartExcel \u05de\u05d0\u05e4\u05e9\u05e8 \u05dc\u05db\u05dd \u05dc\u05d4\u05e9\u05d5\u05d5\u05ea, \u05dc\u05e0\u05e7\u05d5\u05ea \u05d5\u05dc\u05e0\u05ea\u05d7 \u05d2\u05d9\u05dc\u05d9\u05d5\u05e0\u05d5\u05ea \u05d0\u05dc\u05e7\u05d8\u05e8\u05d5\u05e0\u05d9\u05d9\u05dd \u05d9\u05e9\u05d9\u05e8\u05d5\u05ea \u05d1\u05d3\u05e4\u05d3\u05e4\u05df. \u05dc\u05dc\u05d0 \u05d4\u05ea\u05e7\u05e0\u05d5\u05ea, \u05dc\u05dc\u05d0 \u05d9\u05d3\u05e2 \u05d8\u05db\u05e0\u05d9 \u2014 \u05e8\u05e7 \u05ea\u05d5\u05e6\u05d0\u05d5\u05ea \u05de\u05d4\u05d9\u05e8\u05d5\u05ea \u05d5\u05de\u05e7\u05e6\u05d5\u05e2\u05d9\u05d5\u05ea.',
      'home.hero.cta.compare': '\u05d4\u05e9\u05d5\u05d5\u05d0\u05ea \u05e7\u05d1\u05e6\u05d9\u05dd',
      'home.hero.cta.clean': '\u05e0\u05d9\u05e7\u05d5\u05d9 \u05e0\u05ea\u05d5\u05e0\u05d9\u05dd',
      'home.benefits.title': '\u05dc\u05de\u05d4 SmartExcel?',
      'home.benefits.noExpertise.title': '\u05dc\u05dc\u05d0 \u05d9\u05d3\u05e2 \u05d8\u05db\u05e0\u05d9',
      'home.benefits.noExpertise.desc': '\u05de\u05de\u05e9\u05e7 \u05d0\u05d9\u05e0\u05d8\u05d5\u05d0\u05d9\u05d8\u05d9\u05d1\u05d9 \u05e9\u05de\u05ea\u05d0\u05d9\u05dd \u05dc\u05db\u05d5\u05dc\u05dd. \u05d4\u05e2\u05dc\u05d5 \u05e7\u05d5\u05d1\u05e5, \u05d1\u05d7\u05e8\u05d5 \u05e4\u05e2\u05d5\u05dc\u05d4 \u05d5\u05e7\u05d1\u05dc\u05d5 \u05ea\u05d5\u05e6\u05d0\u05d5\u05ea \u2014 \u05dc\u05dc\u05d0 \u05e0\u05d5\u05e1\u05d7\u05d0\u05d5\u05ea \u05d0\u05d5 \u05de\u05d0\u05e7\u05e8\u05d5.',
      'home.benefits.browser.title': '\u05e2\u05d5\u05d1\u05d3 \u05d1\u05d3\u05e4\u05d3\u05e4\u05df',
      'home.benefits.browser.desc': '\u05d0\u05d9\u05df \u05e6\u05d5\u05e8\u05da \u05dc\u05d4\u05ea\u05e7\u05d9\u05df \u05ea\u05d5\u05db\u05e0\u05d4 \u05d0\u05d5 \u05dc\u05d9\u05e6\u05d5\u05e8 \u05d7\u05e9\u05d1\u05d5\u05df. \u05d4\u05db\u05dc \u05e8\u05e5 \u05d1\u05e6\u05d5\u05e8\u05d4 \u05de\u05d0\u05d5\u05d1\u05d8\u05d7\u05ea \u05d1\u05d3\u05e4\u05d3\u05e4\u05df \u2014 \u05d4\u05e0\u05ea\u05d5\u05e0\u05d9\u05dd \u05e9\u05dc\u05db\u05dd \u05e0\u05e9\u05d0\u05e8\u05d9\u05dd \u05d1\u05de\u05db\u05e9\u05d9\u05e8 \u05e9\u05dc\u05db\u05dd.',
      'home.benefits.fast.title': '\u05ea\u05d5\u05e6\u05d0\u05d5\u05ea \u05d1\u05e9\u05e0\u05d9\u05d5\u05ea',
      'home.benefits.fast.desc': '\u05de\u05e0\u05d5\u05e2 \u05e2\u05d9\u05d1\u05d5\u05d3 \u05d7\u05d6\u05e7 \u05e9\u05de\u05e1\u05e4\u05e7 \u05ea\u05d5\u05e6\u05d0\u05d5\u05ea \u05de\u05d9\u05d9\u05d3\u05d9\u05d5\u05ea. \u05d4\u05e9\u05d5\u05d5 \u05d0\u05dc\u05e4\u05d9 \u05e9\u05d5\u05e8\u05d5\u05ea \u05d0\u05d5 \u05e0\u05e7\u05d5 \u05de\u05d0\u05d2\u05e8\u05d9 \u05e0\u05ea\u05d5\u05e0\u05d9\u05dd \u05e9\u05dc\u05de\u05d9\u05dd \u05d1\u05e8\u05d2\u05e2.',
      'home.benefits.professional.title': '\u05e4\u05dc\u05d8 \u05de\u05e7\u05e6\u05d5\u05e2\u05d9',
      'home.benefits.professional.desc': '\u05d9\u05d9\u05e6\u05d5\u05d0 \u05ea\u05d5\u05e6\u05d0\u05d5\u05ea \u05e0\u05e7\u05d9\u05d5\u05ea \u05d5\u05de\u05e2\u05d5\u05e6\u05d1\u05d5\u05ea, \u05de\u05d5\u05db\u05e0\u05d5\u05ea \u05dc\u05d3\u05d5\u05d7\u05d5\u05ea, \u05de\u05e6\u05d2\u05d5\u05ea \u05d0\u05d5 \u05e0\u05d9\u05ea\u05d5\u05d7 \u05e0\u05d5\u05e1\u05e3. \u05d4\u05d5\u05e8\u05d3\u05d4 \u05db\u05d0\u05e7\u05e1\u05dc \u05d1\u05dc\u05d7\u05d9\u05e6\u05d4 \u05d0\u05d7\u05ea.',
      'home.howItWorks.title': '\u05d0\u05d9\u05da \u05d6\u05d4 \u05e2\u05d5\u05d1\u05d3',
      'home.howItWorks.step1.title': '1. \u05d4\u05e2\u05dc\u05d5 \u05d0\u05ea \u05d4\u05e7\u05d5\u05d1\u05e5',
      'home.howItWorks.step1.desc': '\u05d2\u05e8\u05e8\u05d5 \u05d5\u05e9\u05d7\u05e8\u05e8\u05d5 \u05e7\u05d1\u05e6\u05d9 \u05d0\u05e7\u05e1\u05dc. \u05d0\u05e0\u05d7\u05e0\u05d5 \u05ea\u05d5\u05de\u05db\u05d9\u05dd \u05d1\u05e4\u05d5\u05e8\u05de\u05d8\u05d9\u05dd xlsx. \u05d5-xls.',
      'home.howItWorks.step2.title': '2. \u05d1\u05d7\u05e8\u05d5 \u05e4\u05e2\u05d5\u05dc\u05d4',
      'home.howItWorks.step2.desc': '\u05d4\u05e9\u05d5\u05d5 \u05e9\u05e0\u05d9 \u05e7\u05d1\u05e6\u05d9\u05dd, \u05e0\u05e7\u05d5 \u05e0\u05ea\u05d5\u05e0\u05d9\u05dd, \u05d0\u05d5 \u05e6\u05e8\u05d5 \u05d3\u05e9\u05d1\u05d5\u05e8\u05d3 \u05d5\u05d9\u05d6\u05d5\u05d0\u05dc\u05d9 \u2014 \u05d1\u05d7\u05e8\u05d5 \u05de\u05d4 \u05e9\u05d0\u05ea\u05dd \u05e6\u05e8\u05d9\u05db\u05d9\u05dd.',
      'home.howItWorks.step3.title': '3. \u05e7\u05d1\u05dc\u05d5 \u05ea\u05d5\u05e6\u05d0\u05d5\u05ea \u05de\u05d9\u05d9\u05d3\u05d9\u05d5\u05ea',
      'home.howItWorks.step3.desc': '\u05e6\u05e4\u05d5 \u05d1\u05ea\u05d5\u05e6\u05d0\u05d5\u05ea \u05de\u05d9\u05d3 \u05d5\u05d4\u05d5\u05e8\u05d9\u05d3\u05d5 \u05d3\u05d5\u05d7\u05d5\u05ea \u05d0\u05e7\u05e1\u05dc \u05de\u05e7\u05e6\u05d5\u05e2\u05d9\u05d9\u05dd \u05d1\u05dc\u05d7\u05d9\u05e6\u05d4 \u05d0\u05d7\u05ea.',
      'home.services.title': '\u05d4\u05e9\u05d9\u05e8\u05d5\u05ea\u05d9\u05dd \u05e9\u05dc\u05e0\u05d5',
      'home.services.compare.title': '\u05d4\u05e9\u05d5\u05d5\u05d0\u05ea \u05e7\u05d1\u05e6\u05d9 \u05d0\u05e7\u05e1\u05dc',
      'home.services.compare.desc': '\u05de\u05e6\u05d0\u05d5 \u05d4\u05ea\u05d0\u05de\u05d5\u05ea, \u05d4\u05d1\u05d3\u05dc\u05d9\u05dd \u05d5\u05db\u05e4\u05d9\u05dc\u05d5\u05d9\u05d5\u05ea \u05d1\u05d9\u05df \u05e9\u05e0\u05d9 \u05d2\u05d9\u05dc\u05d9\u05d5\u05e0\u05d5\u05ea. \u05de\u05d5\u05e9\u05dc\u05dd \u05dc\u05d4\u05ea\u05d0\u05de\u05d5\u05ea \u05d5\u05d1\u05e7\u05e8\u05d4.',
      'home.services.compare.btn': '\u05d4\u05ea\u05d7\u05d9\u05dc\u05d5 \u05dc\u05d4\u05e9\u05d5\u05d5\u05ea',
      'home.services.clean.title': '\u05e0\u05d9\u05e7\u05d5\u05d9 \u05e0\u05ea\u05d5\u05e0\u05d9 \u05d0\u05e7\u05e1\u05dc',
      'home.services.clean.desc': '\u05d4\u05e1\u05d9\u05e8\u05d5 \u05db\u05e4\u05d9\u05dc\u05d5\u05d9\u05d5\u05ea, \u05ea\u05e7\u05e0\u05d5 \u05e2\u05d9\u05e6\u05d5\u05d1, \u05d7\u05ea\u05db\u05d5 \u05e8\u05d5\u05d5\u05d7\u05d9\u05dd \u05de\u05d9\u05d5\u05ea\u05e8\u05d9\u05dd \u05d5\u05ea\u05e7\u05e0\u05d5 \u05d0\u05ea \u05d4\u05e0\u05ea\u05d5\u05e0\u05d9\u05dd \u05d1\u05d0\u05d5\u05e4\u05df \u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9.',
      'home.services.clean.btn': '\u05d4\u05ea\u05d7\u05d9\u05dc\u05d5 \u05dc\u05e0\u05e7\u05d5\u05ea',
      'home.services.dashboard.title': '\u05d3\u05e9\u05d1\u05d5\u05e8\u05d3 \u05d5\u05d9\u05d6\u05d5\u05d0\u05dc\u05d9',
      'home.services.dashboard.desc': '\u05d4\u05e2\u05dc\u05d5 \u05e0\u05ea\u05d5\u05e0\u05d9\u05dd \u05d5\u05e7\u05d1\u05dc\u05d5 \u05d2\u05e8\u05e4\u05d9\u05dd \u05d5\u05ea\u05e7\u05e6\u05d9\u05e8\u05d9 KPI \u05de\u05d9\u05d9\u05d3\u05d9\u05d9\u05dd \u05db\u05d3\u05d9 \u05dc\u05d4\u05d1\u05d9\u05df \u05de\u05d2\u05de\u05d5\u05ea \u05d1\u05de\u05d1\u05d8 \u05d0\u05d7\u05d3.',
      'home.services.dashboard.btn': '\u05e6\u05e4\u05d5 \u05d1\u05d3\u05e9\u05d1\u05d5\u05e8\u05d3',

      // Compare page
      'compare.title': '\u05d4\u05e9\u05d5\u05d5\u05d0\u05ea \u05e7\u05d1\u05e6\u05d9 \u05d0\u05e7\u05e1\u05dc',
      'compare.description': '\u05d4\u05e2\u05dc\u05d5 \u05e9\u05e0\u05d9 \u05e7\u05d1\u05e6\u05d9 \u05d0\u05e7\u05e1\u05dc \u05d5\u05d1\u05d7\u05e8\u05d5 \u05e2\u05de\u05d5\u05d3\u05ea \u05de\u05e4\u05ea\u05d7 \u05dc\u05d4\u05e9\u05d5\u05d5\u05d0\u05d4. SmartExcel \u05d9\u05d6\u05d4\u05d4 \u05e8\u05e9\u05d5\u05de\u05d5\u05ea \u05ea\u05d5\u05d0\u05de\u05d5\u05ea, \u05e8\u05e9\u05d5\u05de\u05d5\u05ea \u05d9\u05d9\u05d7\u05d5\u05d3\u05d9\u05d5\u05ea \u05dc\u05db\u05dc \u05e7\u05d5\u05d1\u05e5 \u05d5\u05db\u05e4\u05d9\u05dc\u05d5\u05d9\u05d5\u05ea.',
      'compare.file1': '\u05e7\u05d5\u05d1\u05e5 1',
      'compare.file2': '\u05e7\u05d5\u05d1\u05e5 2',
      'compare.chooseFile': '\u05d1\u05d7\u05e8\u05d5 \u05e7\u05d5\u05d1\u05e5',
      'compare.dragHere': '\u05d0\u05d5 \u05d2\u05e8\u05e8\u05d5 \u05dc\u05db\u05d0\u05df',
      'compare.fileHint': '\u05de\u05e7\u05d1\u05dc xlsx. \u05d5-xls. (\u05e2\u05d3 10MB)',
      'compare.columnLabel': '\u05e2\u05de\u05d5\u05d3\u05ea \u05d4\u05e9\u05d5\u05d5\u05d0\u05d4',
      'compare.columnPlaceholder': '-- \u05d4\u05e2\u05dc\u05d5 \u05d0\u05ea \u05e9\u05e0\u05d9 \u05d4\u05e7\u05d1\u05e6\u05d9\u05dd \u05e7\u05d5\u05d3\u05dd --',
      'compare.columnHint': '\u05d1\u05d7\u05e8\u05d5 \u05d0\u05ea \u05d4\u05e2\u05de\u05d5\u05d3\u05d4 \u05e9\u05ea\u05e9\u05de\u05e9 \u05dc\u05d4\u05ea\u05d0\u05de\u05ea \u05e8\u05e9\u05d5\u05de\u05d5\u05ea \u05d1\u05d9\u05df \u05d4\u05e7\u05d1\u05e6\u05d9\u05dd.',
      'compare.submitBtn': '\u05d4\u05e9\u05d5\u05d5 \u05e7\u05d1\u05e6\u05d9\u05dd',
      'compare.demo': '\u05de\u05e6\u05d1 \u05d4\u05d3\u05d2\u05de\u05d4: \u05d4\u05ea\u05d5\u05e6\u05d0\u05d5\u05ea \u05de\u05d3\u05d5\u05de\u05d5\u05ea \u05dc\u05de\u05d8\u05e8\u05d5\u05ea \u05d4\u05e6\u05d2\u05d4. \u05d4\u05e2\u05dc\u05d5 \u05e7\u05d1\u05e6\u05d9\u05dd \u05e9\u05dc\u05db\u05dd \u05db\u05d3\u05d9 \u05dc\u05e8\u05d0\u05d5\u05ea \u05ea\u05d5\u05e6\u05d0\u05d5\u05ea \u05d0\u05de\u05d9\u05ea\u05d9\u05d5\u05ea.',
      'compare.results': '\u05ea\u05d5\u05e6\u05d0\u05d5\u05ea',
      'compare.matched': '\u05ea\u05d5\u05d0\u05de\u05d9\u05dd',
      'compare.file1Only': '\u05e7\u05d5\u05d1\u05e5 1 \u05d1\u05dc\u05d1\u05d3',
      'compare.file2Only': '\u05e7\u05d5\u05d1\u05e5 2 \u05d1\u05dc\u05d1\u05d3',
      'compare.duplicates': '\u05db\u05e4\u05d9\u05dc\u05d5\u05d9\u05d5\u05ea',
      'compare.download': '\u05d4\u05d5\u05e8\u05d3\u05ea \u05ea\u05d5\u05e6\u05d0\u05d5\u05ea',

      // Clean page
      'clean.title': '\u05e0\u05d9\u05e7\u05d5\u05d9 \u05e7\u05d1\u05e6\u05d9 \u05d0\u05e7\u05e1\u05dc',
      'clean.description': '\u05d4\u05e2\u05dc\u05d5 \u05e7\u05d5\u05d1\u05e5 \u05d0\u05e7\u05e1\u05dc \u05d5\u05d1\u05d7\u05e8\u05d5 \u05d0\u05e4\u05e9\u05e8\u05d5\u05d9\u05d5\u05ea \u05e0\u05d9\u05e7\u05d5\u05d9 \u05dc\u05d4\u05e1\u05e8\u05d4 \u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9\u05ea \u05e9\u05dc \u05e9\u05d2\u05d9\u05d0\u05d5\u05ea, \u05db\u05e4\u05d9\u05dc\u05d5\u05d9\u05d5\u05ea \u05d5\u05d7\u05d5\u05e1\u05e8 \u05e2\u05e7\u05d1\u05d9\u05d5\u05ea \u05d1\u05e0\u05ea\u05d5\u05e0\u05d9\u05dd.',
      'clean.fileLabel': '\u05d4\u05e2\u05dc\u05d0\u05ea \u05e7\u05d5\u05d1\u05e5 \u05d0\u05e7\u05e1\u05dc',
      'clean.optionsLegend': '\u05d0\u05e4\u05e9\u05e8\u05d5\u05d9\u05d5\u05ea \u05e0\u05d9\u05e7\u05d5\u05d9',
      'clean.option.duplicates': '\u05d4\u05e1\u05e8\u05ea \u05db\u05e4\u05d9\u05dc\u05d5\u05d9\u05d5\u05ea',
      'clean.option.emptyRows': '\u05d4\u05e1\u05e8\u05ea \u05e9\u05d5\u05e8\u05d5\u05ea \u05e8\u05d9\u05e7\u05d5\u05ea',
      'clean.option.trimSpaces': '\u05d7\u05d9\u05ea\u05d5\u05da \u05e8\u05d5\u05d5\u05d7\u05d9\u05dd \u05de\u05d9\u05d5\u05ea\u05e8\u05d9\u05dd',
      'clean.option.standardize': '\u05ea\u05e7\u05e0\u05d5\u05df \u05e4\u05d5\u05e8\u05de\u05d8\u05d9\u05dd',
      'clean.option.missingValues': '\u05d6\u05d9\u05d4\u05d5\u05d9 \u05e2\u05e8\u05db\u05d9\u05dd \u05d7\u05e1\u05e8\u05d9\u05dd',
      'clean.option.fixDates': '\u05ea\u05d9\u05e7\u05d5\u05df \u05e4\u05d5\u05e8\u05de\u05d8 \u05ea\u05d0\u05e8\u05d9\u05db\u05d9\u05dd',
      'clean.submitBtn': '\u05e0\u05e7\u05d5 \u05e7\u05d5\u05d1\u05e5',
      'clean.demo': '\u05de\u05e6\u05d1 \u05d4\u05d3\u05d2\u05de\u05d4: \u05d4\u05ea\u05d5\u05e6\u05d0\u05d5\u05ea \u05de\u05d3\u05d5\u05de\u05d5\u05ea \u05dc\u05de\u05d8\u05e8\u05d5\u05ea \u05d4\u05e6\u05d2\u05d4. \u05d4\u05e2\u05dc\u05d5 \u05e7\u05d5\u05d1\u05e5 \u05e9\u05dc\u05db\u05dd \u05db\u05d3\u05d9 \u05dc\u05e8\u05d0\u05d5\u05ea \u05ea\u05d5\u05e6\u05d0\u05d5\u05ea \u05e0\u05d9\u05e7\u05d5\u05d9 \u05d0\u05de\u05d9\u05ea\u05d9\u05d5\u05ea.',
      'clean.results.title': '\u05e1\u05d9\u05db\u05d5\u05dd \u05ea\u05d5\u05e6\u05d0\u05d5\u05ea',
      'clean.download': '\u05d4\u05d5\u05e8\u05d3\u05ea \u05e7\u05d5\u05d1\u05e5 \u05de\u05e0\u05d5\u05e7\u05d4',

      // Dashboard page
      'dashboard.title': '\u05d3\u05e9\u05d1\u05d5\u05e8\u05d3 \u05e2\u05e1\u05e7\u05d9',
      'dashboard.description': '\u05d4\u05e2\u05dc\u05d5 \u05e7\u05d5\u05d1\u05e5 \u05d0\u05e7\u05e1\u05dc \u05dc\u05d9\u05e6\u05d9\u05e8\u05ea \u05d3\u05e9\u05d1\u05d5\u05e8\u05d3 \u05e2\u05e1\u05e7\u05d9 \u05d0\u05d9\u05e0\u05d8\u05e8\u05d0\u05e7\u05d8\u05d9\u05d1\u05d9 \u05e2\u05dd \u05de\u05d3\u05d3\u05d9 KPI, \u05d2\u05e8\u05e4\u05d9\u05dd \u05d5\u05e0\u05d9\u05ea\u05d5\u05d7\u05d9\u05dd.',
      'dashboard.fileLabel': '\u05d4\u05e2\u05dc\u05d0\u05ea \u05e7\u05d5\u05d1\u05e5 \u05d0\u05e7\u05e1\u05dc',
      'dashboard.submitBtn': '\u05d9\u05e6\u05d9\u05e8\u05ea \u05d3\u05e9\u05d1\u05d5\u05e8\u05d3',
      'dashboard.demo': '\u05de\u05e6\u05d1 \u05d4\u05d3\u05d2\u05de\u05d4: \u05d4\u05ea\u05d5\u05e6\u05d0\u05d5\u05ea \u05de\u05d3\u05d5\u05de\u05d5\u05ea \u05dc\u05de\u05d8\u05e8\u05d5\u05ea \u05d4\u05e6\u05d2\u05d4. \u05d4\u05e2\u05dc\u05d5 \u05e7\u05d5\u05d1\u05e5 \u05e9\u05dc\u05db\u05dd \u05db\u05d3\u05d9 \u05dc\u05e8\u05d0\u05d5\u05ea \u05e0\u05d9\u05ea\u05d5\u05d7 \u05d0\u05de\u05d9\u05ea\u05d9.',
      'dashboard.customerStats': '\u05e1\u05d8\u05d8\u05d9\u05e1\u05d8\u05d9\u05e7\u05d5\u05ea \u05dc\u05e7\u05d5\u05d7\u05d5\u05ea',
      'dashboard.topProducts': '\u05de\u05d5\u05e6\u05e8\u05d9\u05dd \u05de\u05d5\u05d1\u05d9\u05dc\u05d9\u05dd',
      'dashboard.download': '\u05d4\u05d5\u05e8\u05d3\u05ea \u05d3\u05d5\u05d7',

      // About page
      'about.title': '\u05d0\u05d5\u05d3\u05d5\u05ea \u05d5\u05e6\u05d5\u05e8 \u05e7\u05e9\u05e8',
      'about.heading': '\u05d0\u05d5\u05d3\u05d5\u05ea SmartExcel',
      'about.description1': 'SmartExcel \u05d4\u05d9\u05d0 \u05e4\u05dc\u05d8\u05e4\u05d5\u05e8\u05de\u05d4 \u05de\u05d1\u05d5\u05e1\u05e1\u05ea \u05d0\u05d9\u05e0\u05d8\u05e8\u05e0\u05d8 \u05e9\u05e0\u05d5\u05e2\u05d3\u05d4 \u05dc\u05e2\u05d6\u05d5\u05e8 \u05dc\u05d9\u05d7\u05d9\u05d3\u05d9\u05dd \u05d5\u05dc\u05e2\u05e1\u05e7\u05d9\u05dd \u05e7\u05d8\u05e0\u05d9\u05dd \u05dc\u05e2\u05d1\u05d5\u05d3 \u05e2\u05dd \u05e7\u05d1\u05e6\u05d9 \u05d0\u05e7\u05e1\u05dc \u05d1\u05de\u05d4\u05d9\u05e8\u05d5\u05ea, \u05d1\u05d3\u05d9\u05d5\u05e7 \u05d5\u05dc\u05dc\u05d0 \u05e6\u05d5\u05e8\u05da \u05d1\u05d9\u05d3\u05e2 \u05d8\u05db\u05e0\u05d9 \u05de\u05ea\u05e7\u05d3\u05dd. \u05d4\u05de\u05d8\u05e8\u05d4 \u05e9\u05dc\u05e0\u05d5 \u05d4\u05d9\u05d0 \u05dc\u05d7\u05e1\u05d5\u05da \u05e9\u05e2\u05d5\u05ea \u05e9\u05dc \u05e2\u05d1\u05d5\u05d3\u05d4 \u05d7\u05d5\u05d6\u05e8\u05ea \u05e2\u05dc \u05d2\u05d9\u05dc\u05d9\u05d5\u05e0\u05d5\u05ea \u2014 \u05d4\u05e9\u05d5\u05d5\u05d0\u05ea \u05e8\u05e9\u05d9\u05de\u05d5\u05ea, \u05d4\u05e1\u05e8\u05ea \u05db\u05e4\u05d9\u05dc\u05d5\u05d9\u05d5\u05ea, \u05e0\u05d9\u05e7\u05d5\u05d9 \u05e0\u05ea\u05d5\u05e0\u05d9\u05dd \u05de\u05d1\u05d5\u05dc\u05d2\u05e0\u05d9\u05dd \u05d5\u05d1\u05e0\u05d9\u05d9\u05ea \u05d3\u05d5\u05d7\u05d5\u05ea \u05e1\u05d9\u05db\u05d5\u05dd.',
      'about.description2': '\u05d0\u05e0\u05e9\u05d9\u05dd \u05e8\u05d1\u05d9\u05dd \u05de\u05ea\u05e7\u05e9\u05d9\u05dd \u05e2\u05dd \u05e0\u05d5\u05e1\u05d7\u05d0\u05d5\u05ea \u05d0\u05e7\u05e1\u05dc, \u05d8\u05d1\u05dc\u05d0\u05d5\u05ea \u05e6\u05d9\u05e8 \u05d5\u05de\u05d0\u05e7\u05e8\u05d5. SmartExcel \u05e4\u05d5\u05ea\u05e8 \u05d0\u05ea \u05d6\u05d4 \u05e2\u05dd \u05de\u05de\u05e9\u05e7 \u05e4\u05e9\u05d5\u05d8 \u05de\u05d1\u05d5\u05e1\u05e1 \u05d3\u05e4\u05d3\u05e4\u05df \u2014 \u05d4\u05e2\u05dc\u05d5 \u05e7\u05d1\u05e6\u05d9\u05dd, \u05d1\u05d7\u05e8\u05d5 \u05e4\u05e2\u05d5\u05dc\u05d4 \u05d5\u05e7\u05d1\u05dc\u05d5 \u05ea\u05d5\u05e6\u05d0\u05d5\u05ea \u05de\u05e7\u05e6\u05d5\u05e2\u05d9\u05d5\u05ea \u05ea\u05d5\u05da \u05e9\u05e0\u05d9\u05d5\u05ea.',
      'about.features.title': '\u05ea\u05db\u05d5\u05e0\u05d5\u05ea \u05e2\u05d9\u05e7\u05e8\u05d9\u05d5\u05ea',
      'about.features.1': '\u05d4\u05e9\u05d5\u05d5\u05d0\u05ea \u05e9\u05e0\u05d9 \u05e7\u05d1\u05e6\u05d9 \u05d0\u05e7\u05e1\u05dc \u05d5\u05d6\u05d9\u05d4\u05d5\u05d9 \u05de\u05d9\u05d9\u05d3\u05d9 \u05e9\u05dc \u05d4\u05ea\u05d0\u05de\u05d5\u05ea, \u05d4\u05d1\u05d3\u05dc\u05d9\u05dd \u05d5\u05db\u05e4\u05d9\u05dc\u05d5\u05d9\u05d5\u05ea',
      'about.features.2': '\u05e0\u05d9\u05e7\u05d5\u05d9 \u05d5\u05d0\u05e8\u05d2\u05d5\u05df \u05e0\u05ea\u05d5\u05e0\u05d9\u05dd \u2014 \u05d4\u05e1\u05e8\u05ea \u05db\u05e4\u05d9\u05dc\u05d5\u05d9\u05d5\u05ea, \u05e9\u05d5\u05e8\u05d5\u05ea \u05e8\u05d9\u05e7\u05d5\u05ea \u05d5\u05e8\u05d5\u05d5\u05d7\u05d9\u05dd \u05de\u05d9\u05d5\u05ea\u05e8\u05d9\u05dd',
      'about.features.3': '\u05d9\u05e6\u05d9\u05e8\u05ea \u05d3\u05e9\u05d1\u05d5\u05e8\u05d3 \u05e2\u05dd \u05db\u05e8\u05d8\u05d9\u05e1\u05d9 KPI \u05d5\u05d2\u05e8\u05e4\u05d9\u05dd \u05de\u05e0\u05ea\u05d5\u05e0\u05d9\u05dd \u05d2\u05d5\u05dc\u05de\u05d9\u05d9\u05dd',
      'about.features.4': '\u05dc\u05dc\u05d0 \u05d4\u05ea\u05e7\u05e0\u05ea \u05ea\u05d5\u05db\u05e0\u05d4 \u2014 \u05e2\u05d5\u05d1\u05d3 \u05dc\u05d2\u05de\u05e8\u05d9 \u05d1\u05d3\u05e4\u05d3\u05e4\u05df',
      'about.features.5': '\u05e0\u05d2\u05d9\u05e9 \u05dc\u05de\u05e9\u05ea\u05de\u05e9\u05d9\u05dd \u05dc\u05d0 \u05d8\u05db\u05e0\u05d9\u05d9\u05dd \u05e2\u05dd \u05de\u05de\u05e9\u05e7 \u05e0\u05e7\u05d9 \u05d5\u05d0\u05d9\u05e0\u05d8\u05d5\u05d0\u05d9\u05d8\u05d9\u05d1\u05d9',
      'about.contact.title': '\u05e6\u05e8\u05d5 \u05e7\u05e9\u05e8',
      'about.form.fullname': '\u05e9\u05dd \u05de\u05dc\u05d0',
      'about.form.email': '\u05db\u05ea\u05d5\u05d1\u05ea \u05d0\u05d9\u05de\u05d9\u05d9\u05dc',
      'about.form.phone': '\u05de\u05e1\u05e4\u05e8 \u05d8\u05dc\u05e4\u05d5\u05df',
      'about.form.subject': '\u05e0\u05d5\u05e9\u05d0',
      'about.form.message': '\u05d4\u05d5\u05d3\u05e2\u05d4',
      'about.form.submit': '\u05e9\u05dc\u05d9\u05d7\u05ea \u05d4\u05d5\u05d3\u05e2\u05d4',
      'about.form.sending': '\u05e9\u05d5\u05dc\u05d7...',
      'about.form.success': '\u05ea\u05d5\u05d3\u05d4! \u05d4\u05d4\u05d5\u05d3\u05e2\u05d4 \u05e9\u05dc\u05db\u05dd \u05e0\u05e9\u05dc\u05d7\u05d4 \u05d1\u05d4\u05e6\u05dc\u05d7\u05d4.',
      'about.form.error': '\u05e9\u05dc\u05d9\u05d7\u05ea \u05d4\u05d4\u05d5\u05d3\u05e2\u05d4 \u05e0\u05db\u05e9\u05dc\u05d4. \u05e0\u05d0 \u05dc\u05e0\u05e1\u05d5\u05ea \u05e9\u05d5\u05d1.',
      'about.form.fullnamePlaceholder': '\u05d4\u05d6\u05d9\u05e0\u05d5 \u05d0\u05ea \u05e9\u05de\u05db\u05dd \u05d4\u05de\u05dc\u05d0',
      'about.form.emailPlaceholder': '\u05d4\u05d6\u05d9\u05e0\u05d5 \u05db\u05ea\u05d5\u05d1\u05ea \u05d0\u05d9\u05de\u05d9\u05d9\u05dc',
      'about.form.phonePlaceholder': '\u05d4\u05d6\u05d9\u05e0\u05d5 \u05de\u05e1\u05e4\u05e8 \u05d8\u05dc\u05e4\u05d5\u05df (\u05d0\u05d5\u05e4\u05e6\u05d9\u05d5\u05e0\u05dc\u05d9)',
      'about.form.subjectPlaceholder': '\u05d4\u05d6\u05d9\u05e0\u05d5 \u05d0\u05ea \u05d4\u05e0\u05d5\u05e9\u05d0',
      'about.form.messagePlaceholder': '\u05db\u05ea\u05d1\u05d5 \u05d0\u05ea \u05d4\u05d4\u05d5\u05d3\u05e2\u05d4 \u05e9\u05dc\u05db\u05dd \u05db\u05d0\u05df',

      // Validation
      'validation.required': '\u05e9\u05d3\u05d4 \u05d7\u05d5\u05d1\u05d4',
      'validation.email': '\u05e0\u05d0 \u05dc\u05d4\u05d6\u05d9\u05df \u05db\u05ea\u05d5\u05d1\u05ea \u05d0\u05d9\u05de\u05d9\u05d9\u05dc \u05ea\u05e7\u05d9\u05e0\u05d4',
      'validation.file': '\u05e0\u05d0 \u05dc\u05d4\u05e2\u05dc\u05d5\u05ea \u05e7\u05d5\u05d1\u05e5 \u05d0\u05e7\u05e1\u05dc (xlsx. \u05d0\u05d5 xls.)',
      'validation.column': '\u05e0\u05d0 \u05dc\u05d1\u05d7\u05d5\u05e8 \u05e2\u05de\u05d5\u05d3\u05ea \u05d4\u05e9\u05d5\u05d5\u05d0\u05d4',
      'validation.option': '\u05e0\u05d0 \u05dc\u05d1\u05d7\u05d5\u05e8 \u05dc\u05e4\u05d7\u05d5\u05ea \u05d0\u05e4\u05e9\u05e8\u05d5\u05ea \u05e0\u05d9\u05e7\u05d5\u05d9 \u05d0\u05d7\u05ea',
      'validation.bothFiles': '\u05e0\u05d0 \u05dc\u05d4\u05e2\u05dc\u05d5\u05ea \u05e7\u05d5\u05d1\u05e5 1.',
      'validation.bothFiles2': '\u05e0\u05d0 \u05dc\u05d4\u05e2\u05dc\u05d5\u05ea \u05e7\u05d5\u05d1\u05e5 2.',

      // Footer
      'footer.brand': 'SmartExcel',
      'footer.desc': '\u05db\u05dc\u05d9 \u05e2\u05d9\u05d1\u05d5\u05d3 \u05e7\u05d1\u05e6\u05d9 \u05d0\u05e7\u05e1\u05dc \u05d7\u05db\u05de\u05d9\u05dd \u2014 \u05d4\u05e9\u05d5\u05d5\u05d0\u05d4, \u05e0\u05d9\u05e7\u05d5\u05d9 \u05d5\u05e0\u05d9\u05ea\u05d5\u05d7 \u05d2\u05d9\u05dc\u05d9\u05d5\u05e0\u05d5\u05ea \u05d0\u05dc\u05e7\u05d8\u05e8\u05d5\u05e0\u05d9\u05d9\u05dd \u05d9\u05e9\u05d9\u05e8\u05d5\u05ea \u05d1\u05d3\u05e4\u05d3\u05e4\u05df.',
      'footer.services': '\u05e9\u05d9\u05e8\u05d5\u05ea\u05d9\u05dd',
      'footer.info': '\u05de\u05d9\u05d3\u05e2',
      'footer.about': '\u05d0\u05d5\u05d3\u05d5\u05ea',
      'footer.contact': '\u05e6\u05d5\u05e8 \u05e7\u05e9\u05e8',
      'footer.compare': '\u05d4\u05e9\u05d5\u05d5\u05d0\u05ea \u05e7\u05d1\u05e6\u05d9\u05dd',
      'footer.clean': '\u05e0\u05d9\u05e7\u05d5\u05d9 \u05e0\u05ea\u05d5\u05e0\u05d9\u05dd',
      'footer.dashboard': '\u05d3\u05e9\u05d1\u05d5\u05e8\u05d3',
      'footer.copyright': '\u00a9 {year} SmartExcel. \u05db\u05dc \u05d4\u05d6\u05db\u05d5\u05d9\u05d5\u05ea \u05e9\u05de\u05d5\u05e8\u05d5\u05ea.',

      // Language
      'lang.switch': 'English'
    }
  };

  var currentLang = 'en';

  /**
   * Initialize i18n — load saved language and apply.
   */
  function init() {
    var saved = localStorage.getItem('smartexcel-lang');
    if (saved === 'he' || saved === 'en') {
      currentLang = saved;
    }
    applyLanguage();
  }

  /**
   * Set language and persist choice.
   * @param {string} lang - 'en' or 'he'
   */
  function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'he') return;
    currentLang = lang;
    localStorage.setItem('smartexcel-lang', lang);
    applyLanguage();
  }

  /**
   * Toggle between English and Hebrew.
   */
  function toggle() {
    setLanguage(currentLang === 'en' ? 'he' : 'en');
  }

  /**
   * Get translation for a key.
   * @param {string} key - Translation key
   * @returns {string} Translated string or key if not found
   */
  function t(key) {
    return (translations[currentLang] && translations[currentLang][key]) || key;
  }

  /**
   * Get current language code.
   * @returns {string} 'en' or 'he'
   */
  function getLang() {
    return currentLang;
  }

  /**
   * Apply current language to the page — update dir, lang, and all translated elements.
   */
  function applyLanguage() {
    // Set HTML direction and lang attribute
    document.documentElement.setAttribute('dir', currentLang === 'he' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLang);

    // Translate all elements with data-i18n attribute
    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
      var key = elements[i].getAttribute('data-i18n');
      var attr = elements[i].getAttribute('data-i18n-attr');
      if (attr) {
        elements[i].setAttribute(attr, t(key));
      } else {
        elements[i].textContent = t(key);
      }
    }

    // Translate placeholders
    var placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    for (var j = 0; j < placeholders.length; j++) {
      var pKey = placeholders[j].getAttribute('data-i18n-placeholder');
      placeholders[j].setAttribute('placeholder', t(pKey));
    }

    // Update language switch button text
    var switchBtns = document.querySelectorAll('[data-i18n-switch]');
    for (var k = 0; k < switchBtns.length; k++) {
      switchBtns[k].textContent = t('lang.switch');
    }

    // Handle dynamic year in copyright
    var copyrightEls = document.querySelectorAll('[data-i18n-copyright]');
    for (var c = 0; c < copyrightEls.length; c++) {
      var tmpl = t('footer.copyright');
      copyrightEls[c].textContent = tmpl.replace('{year}', new Date().getFullYear());
    }

    // Dispatch custom event for page controllers to respond
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: currentLang } }));
  }

  return {
    init: init,
    setLanguage: setLanguage,
    toggle: toggle,
    t: t,
    getLang: getLang,
    applyLanguage: applyLanguage
  };
})();
