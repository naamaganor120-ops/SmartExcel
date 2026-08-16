/**
 * SmartExcel — About & Contact Page Controller
 * Handles contact form validation and real submission via Formspree.
 *
 * Features:
 * - Email validation on blur (inline error for invalid format)
 * - Required field validation on form submit
 * - Real email delivery via Formspree (naama9824@gmail.com)
 * - Localized success/error messages (Hebrew + English)
 * - Form reset after successful submission
 */
(function () {
  'use strict';

  var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // FormSubmit.co endpoint — delivers to naama9824@gmail.com
  // No API keys needed — uses email hash for security
  var FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/naama9824@gmail.com';

  /**
   * Get a translated string using the I18n module if available.
   * Falls back to the provided default string.
   * @param {string} key - Translation key
   * @param {string} fallback - Fallback text
   * @returns {string}
   */
  function t(key, fallback) {
    if (typeof I18n !== 'undefined' && typeof I18n.t === 'function') {
      var translated = I18n.t(key);
      // I18n.t returns the key itself if not found
      return translated !== key ? translated : fallback;
    }
    return fallback;
  }

  /**
   * Validate email format and show inline error if invalid.
   * @param {HTMLInputElement} emailField - The email input element
   * @returns {boolean} true if valid or empty, false if invalid format
   */
  function validateEmailFormat(emailField) {
    var value = emailField.value.trim();
    // Only validate format if there's a value
    if (value && !EMAIL_REGEX.test(value)) {
      UIUtils.showFieldError(emailField, t('validation.email', 'Please enter a valid email address'));
      return false;
    }
    return true;
  }

  /**
   * Clear the error state for a specific field.
   * @param {HTMLElement} field - The input element to clear errors from
   */
  function clearFieldError(field) {
    var parent = field.parentElement;
    if (parent) {
      parent.classList.remove('form-group--error');
    }
    var errorEl = field.nextElementSibling;
    if (errorEl && errorEl.classList.contains('form-error')) {
      errorEl.parentNode.removeChild(errorEl);
    }
  }

  /**
   * Set up email validation on blur.
   * @param {HTMLInputElement} emailField - The email input element
   */
  function setupEmailBlurValidation(emailField) {
    emailField.addEventListener('blur', function () {
      clearFieldError(emailField);
      validateEmailFormat(emailField);
    });
  }

  /**
   * Submit form data to FormSubmit.co.
   * @param {Object} data - Form field values
   * @returns {Promise<{ok: boolean}>}
   */
  function sendToFormspree(data) {
    return fetch(FORMSUBMIT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(function (response) {
      return { ok: response.ok };
    });
  }

  /**
   * Handle contact form submission.
   * Validates fields, sends data to Formspree, shows localized feedback.
   * @param {Event} e - The submit event
   * @param {HTMLFormElement} form - The contact form element
   */
  function handleFormSubmit(e, form) {
    e.preventDefault();

    // Clear all previous errors
    UIUtils.clearErrors(form);

    // Hide previous success/error banners
    var successEl = document.getElementById('contact-success');
    var errorEl = document.getElementById('contact-error');
    if (successEl) successEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'none';

    var fullnameField = form.querySelector('#fullname');
    var emailField = form.querySelector('#email');
    var phoneField = form.querySelector('#phone');
    var subjectField = form.querySelector('#subject');
    var messageField = form.querySelector('#message');

    var isValid = true;

    // Validate required fields with localized messages
    if (!fullnameField.value.trim()) {
      UIUtils.showFieldError(fullnameField, t('validation.required', 'This field is required'));
      isValid = false;
    }

    if (!emailField.value.trim()) {
      UIUtils.showFieldError(emailField, t('validation.required', 'This field is required'));
      isValid = false;
    } else if (!EMAIL_REGEX.test(emailField.value.trim())) {
      UIUtils.showFieldError(emailField, t('validation.email', 'Please enter a valid email address'));
      isValid = false;
    }

    if (!subjectField.value.trim()) {
      UIUtils.showFieldError(subjectField, t('validation.required', 'This field is required'));
      isValid = false;
    }

    if (!messageField.value.trim()) {
      UIUtils.showFieldError(messageField, t('validation.required', 'This field is required'));
      isValid = false;
    }

    if (!isValid) return;

    // Disable submit button and show sending state
    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = t('about.form.sending', 'Sending...');
    }

    // Build form data payload for FormSubmit.co
    var payload = {
      name: fullnameField.value.trim(),
      email: emailField.value.trim(),
      phone: phoneField ? phoneField.value.trim() : '',
      subject: subjectField.value.trim(),
      message: messageField.value.trim(),
      _subject: 'SmartExcel Contact: ' + subjectField.value.trim(),
      _captcha: false,
      _template: 'table'
    };

    // Send to FormSubmit.co
    sendToFormspree(payload)
      .then(function (result) {
        if (result.ok) {
          // Show success message
          if (successEl) {
            successEl.textContent = t('about.form.success', 'Thank you! Your message has been received.');
            successEl.style.display = 'block';
          }
          UIUtils.notify(t('about.form.success', 'Thank you! Your message has been received.'), 'success');
          form.reset();
        } else {
          // Show error message
          if (errorEl) {
            errorEl.textContent = t('about.form.error', 'Failed to send message. Please try again.');
            errorEl.style.display = 'block';
          }
          UIUtils.notify(t('about.form.error', 'Failed to send message. Please try again.'), 'error');
        }
      })
      .catch(function () {
        // Network or unexpected error
        if (errorEl) {
          errorEl.textContent = t('about.form.error', 'Failed to send message. Please try again.');
          errorEl.style.display = 'block';
        }
        UIUtils.notify(t('about.form.error', 'Failed to send message. Please try again.'), 'error');
      })
      .finally(function () {
        // Restore submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = t('about.form.submit', 'Send Message');
        }
      });
  }

  /**
   * Initialize about page interactions.
   */
  function init() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var emailField = form.querySelector('#email');

    // Set up email blur validation
    if (emailField) {
      setupEmailBlurValidation(emailField);
    }

    // Set up form submit handler
    form.addEventListener('submit', function (e) {
      handleFormSubmit(e, form);
    });
  }

  // Run on DOMContentLoaded or immediately if DOM is already ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
