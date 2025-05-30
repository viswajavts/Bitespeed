import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    service: 'Bitespeed Identity Reconciliation',
    version: '1.0.0',
    description: 'Link multiple contacts into a unified customer identity',
    endpoints: {
      identify: 'POST /identify',
      health: 'GET /health'
    },
    repository: 'https://github.com/viswajavts/Bitespeed',
    timestamp: new Date().toISOString()
  });
});

export default router;
