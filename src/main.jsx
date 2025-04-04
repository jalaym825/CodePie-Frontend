import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ThemeContextProvider from './context/ThemeContextProvider'
// import AuthContextProvider from './context/AuthContextProvider'
import CodeExecutionContextProvider from './context/CodeExecutionContextProvider'
import EditorSettingsContextProvider from './context/EditorSettingsContextProvider'
import { Toaster } from 'sonner'
import AuthContextProvider from './context/AuthContextProvider'

createRoot(document.getElementById('root')).render(
  <ThemeContextProvider>
    <Toaster richColors />
    <AuthContextProvider>
      <EditorSettingsContextProvider>
        <CodeExecutionContextProvider>
          <App />
        </CodeExecutionContextProvider>
      </EditorSettingsContextProvider>
    </AuthContextProvider>
  </ThemeContextProvider>
  ,
)
