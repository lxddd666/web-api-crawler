const express = require('express');
const router = express.Router();
const crawler = require('../services/playwright');

// Start crawl (one-shot mode)
router.post('/start', async (req, res) => {
  try {
    const { url, mode, cookies, filters, waitTime, headless } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const options = {
      cookies: cookies || [],
      filters: filters || {},
      waitTime: waitTime || 10000,
      headless: headless !== undefined ? headless : true
    };

    const result = await crawler.startCrawl(url, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stop crawl
router.post('/stop', async (req, res) => {
  try {
    const result = await crawler.stopCrawl();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get status
router.get('/status', (req, res) => {
  const status = crawler.getStatus();
  res.json(status);
});

// Get all requests
router.get('/requests', (req, res) => {
  const requests = crawler.getRequests();
  res.json({ requests, total: requests.length });
});

// ============ Interactive Mode Routes ============

// Start interactive mode
router.post('/interactive/start', async (req, res) => {
  try {
    const { url, cookies, filters, headless } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const options = {
      cookies: cookies || [],
      filters: filters || {},
      headless: headless !== undefined ? headless : true
    };

    const result = await crawler.startInteractive(url, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Navigate to new URL in interactive mode
router.post('/interactive/navigate', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const result = await crawler.navigateToUrl(url);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get page links in interactive mode
router.get('/interactive/links', async (req, res) => {
  try {
    const result = await crawler.getPageLinks();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Click element in interactive mode
router.post('/interactive/click', async (req, res) => {
  try {
    const { selector } = req.body;

    if (!selector) {
      return res.status(400).json({ error: 'Selector is required' });
    }

    const result = await crawler.clickElement(selector);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get interactive status
router.get('/interactive/status', (req, res) => {
  const status = crawler.getInteractiveStatus();
  res.json(status);
});

// Close interactive mode
router.post('/interactive/close', async (req, res) => {
  try {
    const result = await crawler.closeInteractive();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
