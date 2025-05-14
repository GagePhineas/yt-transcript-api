const express = require('express');
const cors = require('cors');
const { getTranscript } = require('youtube-transcript');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/transcript', async (req, res) => {
  const { url, includeTimestamps } = req.body;

  try {
    const transcript = await getTranscript(url);

    const formatted = includeTimestamps
      ? transcript.map(t => `${t.start} - ${t.text}`).join('\n')
      : transcript.map(t => t.text).join(' ');

    res.json({ transcript: formatted });
  } catch (err) {
    console.error('Transcript error:', err);
    res.status(500).json({ error: 'Failed to fetch transcript' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
