/**
 * DebugCollector - A lightweight, professional debug logging utility
 * Captures console output, errors, and environment info.
 * 
 * Usage:
 *   import DebugCollector from './debug-collector.js';
 *   const debug = new DebugCollector();
 *   debug.start();
 *   // ... later
 *   const report = debug.getReport();
 */

class DebugCollector {
  constructor(options = {}) {
    this.logs = [];
    this.maxLogs = options.maxLogs || 500;
    this.isCollecting = false;
    this.startTime = null;

    // Store original console methods
    this.originalConsole = {
      log: console.log.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      info: console.info.bind(console),
    };
  }

  /**
   * Start collecting debug information
   */
  start() {
    if (this.isCollecting) return;

    this.isCollecting = true;
    this.startTime = new Date().toISOString();
    this.logs = [];

    // Override console methods
    console.log = (...args) => this._capture('log', args);
    console.warn = (...args) => this._capture('warn', args);
    console.error = (...args) => this._capture('error', args);
    console.info = (...args) => this._capture('info', args);

    // Capture uncaught errors
    window.addEventListener('error', this._handleError);
    window.addEventListener('unhandledrejection', this._handleRejection);

    this._addLog('system', 'DebugCollector started');
  }

  /**
   * Stop collecting and restore original console
   */
  stop() {
    if (!this.isCollecting) return;

    console.log = this.originalConsole.log;
    console.warn = this.originalConsole.warn;
    console.error = this.originalConsole.error;
    console.info = this.originalConsole.info;

    window.removeEventListener('error', this._handleError);
    window.removeEventListener('unhandledrejection', this._handleRejection);

    this.isCollecting = false;
    this._addLog('system', 'DebugCollector stopped');
  }

  /**
   * Internal method to capture console calls
   */
  _capture(level, args) {
    // Still print to original console
    this.originalConsole[level](...args);

    const message = args
      .map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      })
      .join(' ');

    this._addLog(level, message);
  }

  /**
   * Handle window errors
   */
  _handleError = (event) => {
    this._addLog('error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack || null,
    });
  };

  /**
   * Handle unhandled promise rejections
   */
  _handleRejection = (event) => {
    this._addLog('error', {
      type: 'unhandledrejection',
      reason: event.reason?.message || String(event.reason),
      stack: event.reason?.stack || null,
    });
  };

  /**
   * Add a log entry
   */
  _addLog(level, message) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };

    this.logs.push(entry);

    // Keep only the latest logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  /**
   * Get full debug report
   */
  getReport() {
    return {
      collectedAt: new Date().toISOString(),
      startedAt: this.startTime,
      totalLogs: this.logs.length,
      environment: this._getEnvironmentInfo(),
      logs: this.logs,
    };
  }

  /**
   * Collect basic environment information
   */
  _getEnvironmentInfo() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Download the debug report as a JSON file
   */
  downloadReport(filename = 'debug-report.json') {
    const report = this.getReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  }

  /**
   * Clear all collected logs
   */
  clear() {
    this.logs = [];
  }
}

// Export for both ES modules and regular scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DebugCollector;
} else {
  window.DebugCollector = DebugCollector;
}

export default DebugCollector;
