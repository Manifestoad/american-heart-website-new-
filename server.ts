import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON and URL parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Route for ElevenLabs Text-to-Speech Proxy
  app.get("/api/tts", async (req, res) => {
    const text = req.query.text as string;
    const voiceId = (req.query.voiceId as string) || process.env.ELEVEN_LABS_VOICE_ID || "2EiwW627naMzbI9AnT4b"; // Defaults to Clyde (premium old southern narrator)

    if (!text) {
      return res.status(400).json({ error: "Missing 'text' query parameter" });
    }

    let apiKey = process.env.ELEVEN_LABS_API_KEY;
    if (apiKey) {
      apiKey = apiKey.trim().replace(/^['"]|['"]$/g, "").trim();
      const masked = apiKey.length > 8 
        ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` 
        : "***";
      console.log(`[ElevenLabs API] Key sanitized. Raw length: ${process.env.ELEVEN_LABS_API_KEY?.length}, Sanitized length: ${apiKey.length}, Masked: ${masked}`);
    }

    if (!apiKey) {
      console.warn("ElevenLabs key is not set. Falling back to local browser TTS.");
      return res.status(412).json({ error: "ELEVEN_LABS_API_KEY is missing on the server. Please define it in your AI Studio secrets." });
    }

    try {
      const makeRequest = async (keyToUse: string) => {
        return fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": keyToUse,
          },
          body: JSON.stringify({
            text: text,
            model_id: "eleven_turbo_v2_5", // turbo v2_5 is low-latency, responsive, and high quality
            voice_settings: {
              stability: 0.50,
              similarity_boost: 0.85,
              style: 0.15,
              use_speaker_boost: true
            }
          })
        });
      };

      let response = await makeRequest(apiKey);

      // Self-healing: if the key failed with 401 Unauthorized, and it starts with a typical prefix like "sk_" or "sk-",
      // try stripping that prefix and retrying, in case the user accidentally prepended/copied the prefix from another service.
      if (response.status === 401 && (apiKey.startsWith("sk_") || apiKey.startsWith("sk-"))) {
        const strippedKey = apiKey.replace(/^(sk_|sk-)/, "");
        console.log(`[ElevenLabs API] Retry attempt: 401 received with sk_ prefix. Trying stripped key: ${strippedKey.slice(0, 4)}...${strippedKey.slice(-4)}`);
        const retryResponse = await makeRequest(strippedKey);
        if (retryResponse.ok) {
          response = retryResponse;
          console.log(`[ElevenLabs API] Auto-heal success! The stripped key without prefix worked.`);
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("ElevenLabs proxy error response:", response.status, errorText);
        return res.status(response.status).json({ error: `ElevenLabs API error: ${errorText}` });
      }

      const audioBuffer = await response.arrayBuffer();

      // Return the raw audio/mpeg audio stream
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "public, max-age=86400"); // Cache audio results
      res.send(Buffer.from(audioBuffer));
    } catch (error: any) {
      console.error("Failed to proxy TTS request to ElevenLabs:", error);
      res.status(500).json({ error: error.message || "Failed to process speech synthesis" });
    }
  });

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", hasElevenLabs: !!process.env.ELEVEN_LABS_API_KEY });
  });

  // Vite middleware for rendering dev build vs static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Folklore server] Running full-stack on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});
