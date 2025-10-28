import { useState } from 'react'
import { useSubscribeDev } from '@subscribe.dev/react'

function AIDemo() {
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

  const [textPrompt, setTextPrompt] = useState('')
  const [textResult, setTextResult] = useState<string | null>(null)
  const [textLoading, setTextLoading] = useState(false)
  const [textError, setTextError] = useState<string | null>(null)

  const [imagePrompt, setImagePrompt] = useState('')
  const [imageResult, setImageResult] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)

  // Demo mode - show UI even when not signed in
  const showSignInPrompt = !isSignedIn

  const handleTextGenerate = async () => {
    if (!textPrompt.trim() || !client) return

    setTextLoading(true)
    setTextError(null)
    setTextResult(null)

    try {
      const response = await client.run('openai/gpt-4o', {
        input: {
          messages: [
            { role: 'user', content: textPrompt }
          ]
        }
      })
      setTextResult(response.output[0] as string)
    } catch (err: any) {
      if (err.type === 'insufficient_credits') {
        setTextError('Insufficient credits. Please subscribe to continue.')
      } else if (err.type === 'rate_limit_exceeded') {
        setTextError(`Rate limited. Please retry after ${err.retryAfter} seconds.`)
      } else {
        setTextError(err.message || 'An error occurred')
      }
    } finally {
      setTextLoading(false)
    }
  }

  const handleImageGenerate = async () => {
    if (!imagePrompt.trim() || !client) return

    setImageLoading(true)
    setImageError(null)
    setImageResult(null)

    try {
      const response = await client.run('black-forest-labs/flux-schnell', {
        input: {
          prompt: imagePrompt
        }
      })
      setImageResult(response.output as string)
    } catch (err: any) {
      if (err.type === 'insufficient_credits') {
        setImageError('Insufficient credits. Please subscribe to continue.')
      } else if (err.type === 'rate_limit_exceeded') {
        setImageError(`Rate limited. Please retry after ${err.retryAfter} seconds.`)
      } else {
        setImageError(err.message || 'An error occurred')
      }
    } finally {
      setImageLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Subscribe.dev Boilerplate</h1>
        {showSignInPrompt ? (
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
        <h2>AI Text Generation</h2>
        <p>Example: client.run('openai/gpt-4o', {'{'} input: {'{'} messages: [{'{'} role: 'user', content: prompt {'}'}] {'}'} {'}'})</p>
        <textarea
          value={textPrompt}
          onChange={(e) => setTextPrompt(e.target.value)}
          placeholder="Enter your text prompt here..."
          className="textarea"
          rows={4}
        />
        <button
          onClick={handleTextGenerate}
          disabled={textLoading || !textPrompt.trim()}
          className="button"
        >
          {textLoading ? 'Generating...' : 'Generate Text'}
        </button>

        {textError && (
          <div className="error-message">
            {textError}
          </div>
        )}

        {textResult && (
          <div className="result">
            <h3>Result:</h3>
            <p>{textResult}</p>
          </div>
        )}
      </div>

      <div className="demo-section">
        <h2>AI Image Generation</h2>
        <p>Example: client.run('black-forest-labs/flux-schnell', {'{'} input: {'{'} prompt: imagePrompt {'}'} {'}'})</p>
        <textarea
          value={imagePrompt}
          onChange={(e) => setImagePrompt(e.target.value)}
          placeholder="Enter your image prompt here..."
          className="textarea"
          rows={4}
        />
        <button
          onClick={handleImageGenerate}
          disabled={imageLoading || !imagePrompt.trim()}
          className="button"
        >
          {imageLoading ? 'Generating...' : 'Generate Image'}
        </button>

        {imageError && (
          <div className="error-message">
            {imageError}
          </div>
        )}

        {imageResult && (
          <div className="result">
            <h3>Result:</h3>
            <img src={imageResult} alt="Generated" style={{ maxWidth: '100%' }} />
          </div>
        )}
      </div>
    </div>
  )
}

export default AIDemo
