import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { SnackbarProvider } from 'notistack';
import Contact from './Contact'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './cartContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SnackbarProvider>
      <BrowserRouter>
        <CartProvider>
          < App />
        </CartProvider>
      </BrowserRouter>
    </SnackbarProvider>
  </StrictMode>
)
