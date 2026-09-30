const express = require('express');
const router = express.Router();
const { getPublicCertificateDetails } = require('../services/certificateGenerationService');

router.get('/certificates/:certNo', async (req, res) => {
  try {
    const cert = await getPublicCertificateDetails(req.params.certNo);
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found or invalid' });
    }
    return res.json({ success: true, data: cert });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Public verification error', error: err.message });
  }
});

module.exports = router;
