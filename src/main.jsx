import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ThemeContextProvider from './context/ThemeContextProvider'
import CodeExecutionContextProvider from './context/CodeExecutionContextProvider'
import EditorSettingsContextProvider from './context/EditorSettingsContextProvider'
import { Toaster } from 'sonner'
import AuthContextProvider from './context/AuthContextProvider'
import UserContextProvider from './context/UserContextProvider'
import AuthInitializer from './Pages/Layouts/AuthInitializer'

createRoot(document.getElementById('root')).render(
  <ThemeContextProvider>
    <Toaster richColors />
    <AuthContextProvider>
      <UserContextProvider>
        <EditorSettingsContextProvider>
          <CodeExecutionContextProvider>
            <AuthInitializer>
              <App />
            </AuthInitializer>
          </CodeExecutionContextProvider>
        </EditorSettingsContextProvider>
      </UserContextProvider>
    </AuthContextProvider>
  </ThemeContextProvider>
  ,
)
