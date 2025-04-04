import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ThemeContextProvider from './context/ThemeContextProvider'
// import AuthContextProvider from './context/AuthContextProvider'
import CodeExecutionContextProvider from './context/CodeExecutionContextProvider'
import EditorSettingsContextProvider from './context/EditorSettingsContextProvider'

createRoot(document.getElementById('root')).render(
  <ThemeContextProvider>
    {/* <AuthContextProvider> */}
    <EditorSettingsContextProvider>
      <CodeExecutionContextProvider>
        <App />
      </CodeExecutionContextProvider>
    </EditorSettingsContextProvider>
    {/* </AuthContextProvider> */}
  </ThemeContextProvider>
  ,
)
