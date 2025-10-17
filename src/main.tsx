import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App.tsx'
import { Provider } from '@/components/chakra/provider.tsx'
import { i18n } from 'ic10'

i18n.init().then(() => {
  createRoot(document.getElementById('root')!).render(
    <Provider>
      <StrictMode>
        <App />
      </StrictMode>
    </Provider>,
  )
})