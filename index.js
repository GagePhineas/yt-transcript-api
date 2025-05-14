const express = require('express');
const cors = require('cors');
const getTranscript = require('youtube-transcript');



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/transcript', async (req, res) => {
  const { url, includeTimestamps } = req.body;

  console.log('📥 Received request body:', req.body);

  if (!url || typeof url !== 'string') {
    console.log('❌ Missing or invalid "url" in request body');
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const transcript = await getTranscript(url);
    console.log('✅ Transcript fetched:', transcript?.length || 0, 'segments');

    const formatted = includeTimestamps
      ? transcript.map(t => `${t.start} - ${t.text}`).join('\n')
      : transcript.map(t => t.text).join(' ');

    res.json({ transcript: formatted });
  } catch (err) {
    console.error('❗ Error fetching transcript:', err);
    res.status(500).json({ error: 'Failed to fetch transcript' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
