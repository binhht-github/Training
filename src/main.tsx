import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // dữ liệu tươi trong 5 phút
      // cacheTime: 1000 * 60 * 10, // cache tồn tại 10 phút nếu không được dùng
      retry: 2, // thử lại 2 lần nếu lỗi
      retryDelay: attempt => attempt * 1000, // delay tăng dần theo số lần thử
      refetchOnWindowFocus: false, // không fetch lại khi focus tab
      refetchOnReconnect: true, // fetch lại khi mạng khôi phục
    },
    mutations: {
      retry: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>
  // </StrictMode>,
)
