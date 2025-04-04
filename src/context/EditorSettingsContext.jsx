// EditorSettingsContext.jsx
import { createContext } from "react";

export const EditorSettingsContext = createContext({
    monacoLanguage: 'python',
    editorFontSize: 14,
    setEditorFontSize: () => {},
    lineWrap: true,
    setLineWrap: () => {},
    autoFormat: true,
    setAutoFormat: () => {},
    theme: 'vs',
    setTheme: () => {},
    editorRef: { current: null },
    handleEditorDidMount: () => {},
    formatCode: () => {},
    copyCode: () => {},
    downloadCode: () => {},
    showSettings: false,
    toggleSettings: () => {},
    isFullscreen: false,
    toggleFullscreen: () => {},
    showFullscreenPrompt: false,
    enableFullscreen: () => {},
    closeFullscreenPrompt: () => {},
    showProblem: true,
    toggleProblemPanel: () => {},
    languages: [],
    updateMonacoLanguage: () => {}
});