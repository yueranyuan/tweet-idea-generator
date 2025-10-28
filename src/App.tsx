import { SubscribeDevProvider } from '@subscribe.dev/react'
import TweetGenerator from './components/TweetGenerator'

function App() {
  // Get local access token (dev-only, tree-shaken in production)
  const localAccessToken = import.meta.env.DEV
    ? import.meta.env.VITE_SUBSCRIBEDEV_LOCAL_ACCESS_TOKEN
    : undefined;

  return (
    <SubscribeDevProvider
      projectToken={import.meta.env.VITE_SUBSCRIBEDEV_PUBLIC_API_KEY}
      accessToken={localAccessToken}
    >
      <TweetGenerator />
    </SubscribeDevProvider>
  )
}

export default App
