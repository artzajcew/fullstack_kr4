const express = require('express');
const app = express();

const PORT = 3002;

app.get('/', (req, res) => {
  res.json({
    message: 'Response from backup backend server',
    port: PORT,
    timestamp: new Date().toISOString(),
    server: 'SERVER-3 (BACKUP)'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', port: PORT });
});

app.listen(PORT, () => {
  console.log(`✅ Server 3 (backup) started on port ${PORT}`);
});