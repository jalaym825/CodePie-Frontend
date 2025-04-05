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
      <EditorSettingsContextProvider>
        <CodeExecutionContextProvider>
          <UserContextProvider>
            <AuthInitializer>
              <App />
            </AuthInitializer>
          </UserContextProvider>
        </CodeExecutionContextProvider>
      </EditorSettingsContextProvider>
    </AuthContextProvider>
  </ThemeContextProvider>
  ,
)
