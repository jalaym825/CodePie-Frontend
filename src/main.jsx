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
import LanguageSyncProvider from './context/LanguageContextProvider'

createRoot(document.getElementById('root')).render(
  <ThemeContextProvider>
    <Toaster richColors />
    <AuthContextProvider>
      <UserContextProvider>
        <LanguageSyncProvider>
          <EditorSettingsContextProvider>
            <CodeExecutionContextProvider>
              <AuthInitializer>
                <App />
              </AuthInitializer>
            </CodeExecutionContextProvider>
          </EditorSettingsContextProvider>
        </LanguageSyncProvider>
      </UserContextProvider>
    </AuthContextProvider>
  </ThemeContextProvider>
  ,
)
