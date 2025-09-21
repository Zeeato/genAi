import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@/styles/theme.css'

import Home from '@/pages/Home'
import Summarize from '@/pages/Summarize'
import Benchmark from '@/pages/Benchmark'
import Risk from '@/pages/Risk'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'summarize', element: <Summarize /> },
      { path: 'benchmark', element: <Benchmark /> },
      { path: 'risk', element: <Risk /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
