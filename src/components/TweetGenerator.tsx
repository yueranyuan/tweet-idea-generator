import { useState } from 'react'
import { useSubscribeDev } from '@subscribe.dev/react'

interface TweetIdea {
  tweet: string
  tone: string
  hashtags: string[]
}

function TweetGenerator() {
  const {
    isSignedIn,
    signIn,
    signOut,
    client,
    user,
    usage,
    subscribe,
    subscriptionStatus,
  } = useSubscribeDev()

  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('professional')
  const [tweetIdeas, setTweetIdeas] = useState<TweetIdea[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!topic.trim() || !client) return

    setLoading(true)
    setError(null)
    setTweetIdeas([])

    try {
      const response = await client.run('openai/gpt-4o', {
        input: {
          messages: [
            {
              role: 'system',
              content: 'You are a creative social media expert who generates engaging tweet ideas. Always respond with valid JSON only, no markdown formatting.'
            },
            {
              role: 'user',
              content: `Generate 5 creative tweet ideas about "${topic}" with a ${tone} tone. Return ONLY a JSON array with this exact structure (no markdown, no code blocks):
[{"tweet": "tweet text here", "tone": "tone description", "hashtags": ["hashtag1", "hashtag2"]}]

Make each tweet unique, engaging, and under 280 characters.`
            }
          ]
        },
        response_format: { type: 'json_object' }
      })

      let result = response.output[0] as string

      // Try to parse the response
      try {
        // First, try parsing as-is
        const parsed = JSON.parse(result)

        // Handle if it's wrapped in an object
        if (parsed.tweets && Array.isArray(parsed.tweets)) {
          setTweetIdeas(parsed.tweets)
        } else if (Array.isArray(parsed)) {
          setTweetIdeas(parsed)
        } else {
          // If it's a single object, wrap it in an array
          setTweetIdeas([parsed])
        }
      } catch (parseError) {
        console.error('Parse error:', parseError, 'Result:', result)
        setError('Failed to parse tweet ideas. Please try again.')
      }
    } catch (err: any) {
      if (err.type === 'insufficient_credits') {
        setError('Insufficient credits. Please subscribe to continue.')
      } else if (err.type === 'rate_limit_exceeded') {
        setError(`Rate limited. Please retry after ${err.retryAfter} seconds.`)
      } else {
        setError(err.message || 'An error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🐦 Tweet Idea Generator</h1>
        {!isSignedIn ? (
          <button onClick={signIn} className="button">
            Sign In
          </button>
        ) : (
          <div className="user-info">
            {user?.avatarUrl && (
              <img src={user.avatarUrl} alt="Avatar" className="avatar" />
            )}
            <span>{user?.email}</span>
            <button onClick={signOut} className="button">
              Sign Out
            </button>
          </div>
        )}
      </div>

      {usage && (
        <div className="usage-info">
          <div className="usage-item">
            <span>Credits Used:</span>
            <span>{usage.usedCredits}</span>
          </div>
          <div className="usage-item">
            <span>Credits Remaining:</span>
            <span>{usage.remainingCredits}</span>
          </div>
          {subscriptionStatus?.hasActiveSubscription ? (
            <span>Active: {subscriptionStatus.plan?.name}</span>
          ) : (
            <button onClick={subscribe} className="button">
              Subscribe
            </button>
          )}
        </div>
      )}

      <div className="demo-section">
        <h2>Generate Tweet Ideas</h2>
        <p>Enter a topic and choose a tone to get creative tweet suggestions powered by AI</p>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="topic" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Topic
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., artificial intelligence, productivity, coffee"
            className="textarea"
            style={{ padding: '0.75rem', fontSize: '1rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="tone" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Tone
          </label>
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="textarea"
            style={{ padding: '0.75rem', fontSize: '1rem' }}
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="humorous">Humorous</option>
            <option value="inspirational">Inspirational</option>
            <option value="educational">Educational</option>
            <option value="controversial">Controversial</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
          className="button"
          style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
        >
          {loading ? 'Generating Ideas...' : '✨ Generate Tweet Ideas'}
        </button>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {tweetIdeas.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3>Your Tweet Ideas:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tweetIdeas.map((idea, index) => (
                <div
                  key={index}
                  className="result"
                  style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', margin: 0 }}>
                      {idea.tweet}
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {idea.hashtags && idea.hashtags.map((tag, i) => (
                        <span
                          key={i}
                          style={{
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.875rem'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => copyToClipboard(idea.tweet)}
                      className="button"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TweetGenerator
