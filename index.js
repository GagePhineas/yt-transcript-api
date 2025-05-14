const express = require('express');
const cors = require('cors');
const { getTranscript } = require('youtube-transcript');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/transcript', async (req, res) => {
  const { url, includeTimestamps } = req.body;
  try {
    const videoId = extractVideoId(url);
    if (!videoId) return res.status(400).json({ error: 'Invalid URL' });

    const rawTranscript = await getTranscript(videoId);
    const formatted = rawTranscript.map(entry => {
      return includeTimestamps
        ? `[${formatTime(entry.offset)}] ${entry.text}`
        : entry.text;
    }).join('\n');

    res.json({ transcript: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transcript' });
  }
});

function extractVideoId(url) {
  const regex = /(?:v=|youtu.be\/)([\\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
