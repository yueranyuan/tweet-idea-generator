# 🐦 Tweet Idea Generator

An AI-powered tweet idea generator built with React, TypeScript, and Subscribe.dev. Get creative tweet suggestions with hashtags in seconds!

## Features

- 🤖 **AI-Powered Generation**: Uses GPT-4o to create engaging tweet ideas
- 🎨 **Multiple Tones**: Choose from Professional, Casual, Humorous, Inspirational, Educational, or Controversial
- 🏷️ **Smart Hashtags**: Automatically suggests relevant hashtags for each tweet
- 📋 **One-Click Copy**: Copy tweets to clipboard instantly
- 🔐 **Built-in Auth**: Sign in with GitHub, Google, or email
- 💳 **Credit Tracking**: Monitor your API usage and subscription status

## Tech Stack

- React 18 + TypeScript + Vite
- [@subscribe.dev/react](https://www.npmjs.com/package/@subscribe.dev/react) ^0.0.240
- Bun package manager
- OpenAI GPT-4o via Subscribe.dev

## Setup

```bash
# Clone the repository
git clone https://github.com/yueranyuan/tweet-idea-generator.git
cd tweet-idea-generator

# Install dependencies
bun install

# Create .env.local
cp .env.local.example .env.local
```

### Environment Variables

Get your tokens at [platform.subscribe.dev](https://platform.subscribe.dev):

```bash
# .env.local
VITE_SUBSCRIBEDEV_PUBLIC_API_KEY=your_project_token
VITE_SUBSCRIBEDEV_LOCAL_ACCESS_TOKEN=your_access_token  # Optional, dev-only
```

### Run Development Server

```bash
bun run dev
```

Vite will automatically select an available port (default 5173, auto-increments if busy). Check the terminal output for the actual port.

## How It Works

1. Enter a topic (e.g., "artificial intelligence in healthcare")
2. Select a tone (Professional, Casual, Humorous, etc.)
3. Click "✨ Generate Tweet Ideas"
4. Get 5 AI-generated tweet ideas with hashtags
5. Click "📋 Copy" to copy any tweet to clipboard

## Build & Deploy

```bash
bun run build
```

Deploy the `dist/` folder to any static host:
- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages

## Project Structure

```
src/
├── App.tsx                      # SubscribeDevProvider wrapper
├── components/
│   └── TweetGenerator.tsx       # Main tweet generator component
├── main.tsx                     # React entry point
└── index.css                    # Styles

.env.local                       # Environment variables (not committed)
.env.local.example               # Environment template
vite.config.ts                   # Vite configuration
```

## API Usage

Uses the Subscribe.dev client to call OpenAI GPT-4o:

```typescript
const response = await client.run('openai/gpt-4o', {
  input: {
    messages: [
      { role: 'system', content: 'You are a creative social media expert...' },
      { role: 'user', content: `Generate 5 tweet ideas about "${topic}"...` }
    ]
  },
  response_format: { type: 'json_object' }
})
```

## Documentation

See [CLAUDE.md](CLAUDE.md) for detailed development instructions and architecture.

## Links

- [GitHub Repository](https://github.com/yueranyuan/tweet-idea-generator)
- [Subscribe.dev Platform](https://platform.subscribe.dev)
- [Subscribe.dev Docs](https://docs.subscribe.dev)

---

Built with ❤️ using [Subscribe.dev](https://subscribe.dev) and [Claude Code](https://claude.com/claude-code)
