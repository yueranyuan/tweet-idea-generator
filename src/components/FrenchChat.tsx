import { useState, useRef, useEffect } from 'react'
import { useSubscribeDev } from '@subscribe.dev/react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

function FrenchChat() {
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

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Bonjour! Je suis ton assistant pour apprendre le français. Comment puis-je t\'aider aujourd\'hui? 🇫🇷',
      timestamp: Date.now()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !client || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      // Build conversation history for GPT-4o
      const conversationMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await client.run('openai/gpt-4o', {
        input: {
          messages: [
            {
              role: 'system',
              content: `Tu es un professeur de français sympathique et patient. Aide l'utilisateur à apprendre le français en:
- Répondant en français (avec des traductions en anglais entre parenthèses si nécessaire)
- Corrigeant gentiment leurs erreurs
- Expliquant la grammaire et le vocabulaire
- Encourageant la pratique
- Utilisant un langage adapté à leur niveau
- Posant des questions pour maintenir la conversation
Sois conversationnel, encourageant et amusant!`
            },
            ...conversationMessages
          ]
        }
      })

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.output[0] as string,
        timestamp: Date.now()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err: any) {
      if (err.type === 'insufficient_credits') {
        setError('Insufficient credits. Please subscribe to continue.')
      } else if (err.type === 'rate_limit_exceeded') {
        setError(`Rate limited. Please retry after ${err.retryAfter} seconds.`)
      } else if (err.type === 'authentication_error') {
        setError('Please sign in to chat.')
      } else {
        setError(err.message || 'An error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Bonjour! Je suis ton assistant pour apprendre le français. Comment puis-je t\'aider aujourd\'hui? 🇫🇷',
        timestamp: Date.now()
      }
    ])
    setError(null)
  }

  return (
    <div className="french-chat-container">
      <div className="header">
        <div className="header-left">
          <h1>🇫🇷 French Learning Chat</h1>
          <button onClick={clearChat} className="button button-secondary">
            New Conversation
          </button>
        </div>
        <div className="header-right">
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
              <button onClick={signOut} className="button button-secondary">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {usage && isSignedIn && (
        <div className="usage-info">
          <div className="usage-item">
            <span>Credits Remaining:</span>
            <span className="credits-value">{usage.remainingCredits}</span>
          </div>
          {subscriptionStatus?.hasActiveSubscription ? (
            <span className="subscription-badge">
              ✓ {subscriptionStatus.plan?.name}
            </span>
          ) : (
            <button onClick={subscribe} className="button button-small">
              Subscribe
            </button>
          )}
        </div>
      )}

      {!isSignedIn && (
        <div className="signin-prompt">
          <p>👋 Please sign in to start chatting in French!</p>
        </div>
      )}

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.role === 'user' ? 'message-user' : 'message-assistant'}`}
          >
            <div className="message-content">
              {msg.content}
            </div>
            <div className="message-time">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message message-assistant">
            <div className="message-content typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="chat-input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isSignedIn ? "Écrivez votre message en français... (Press Enter to send, Shift+Enter for new line)" : "Sign in to chat..."}
          className="chat-input"
          rows={2}
          disabled={!isSignedIn || loading}
        />
        <button
          onClick={handleSend}
          disabled={!isSignedIn || loading || !input.trim()}
          className="button button-send"
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  )
}

export default FrenchChat
