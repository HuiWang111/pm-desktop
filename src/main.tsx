import React from 'react'
import ReactDOM from 'react-dom/client'
import { RemeshRoot } from 'remesh-react'
import App from './App'
import './app.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RemeshRoot>
      <App />
    </RemeshRoot>
  </React.StrictMode>
)
