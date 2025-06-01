// EditorSettingsContextProvider.jsx
import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { EditorSettingsContext } from './EditorSettingsContext';
import { languages } from '../helpers/editorData';

export default function EditorSettingsContextProvider({ children }) {
    const editorRef = useRef(null);
    const [editorFontSize, setEditorFontSize] = useState(14);
    const [lineWrap, setLineWrap] = useState(true);
    const [autoFormat, setAutoFormat] = useState(false);
    const [theme, setTheme] = useState('vs');
    const [showSettings, setShowSettings] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);
    const [showProblem, setShowProblem] = useState(true);
    const [language, setLanguage] = useState(languages['Python']);
    const [activeTab, setActiveTab] = useState('output');

    // Show fullscreen prompt when component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowFullscreenPrompt(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const enableFullscreen = useCallback(() => {
        setIsFullscreen(true);
        setShowFullscreenPrompt(false);
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error("Error attempting to enable fullscreen:", err);
            });
        }
    }, []);

    const closeFullscreenPrompt = useCallback(() => {
        setShowFullscreenPrompt(false);
    }, []);

    const toggleFullscreen = useCallback(() => {
        setIsFullscreen(prev => !prev);
    }, []);

    const toggleSettings = useCallback(() => {
        setShowSettings(prev => !prev);
    }, []);

    const toggleProblemPanel = useCallback(() => {
        setShowProblem(prev => !prev);
    }, []);

    const updateLanguage = useCallback((lang) => {
        setLanguage(languages[lang]);
    }, []);

    const handleEditorDidMount = useCallback((editor, monaco) => {
        editorRef.current = editor;

        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: false,
            noSyntaxValidation: false,
        });

        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ES2020,
            allowNonTsExtensions: true,
        });

        editor.updateOptions({
            fontFamily: "'Geist Mono', monospace",
            fontLigatures: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: true,
            smoothScrolling: true,
            fontSize: editorFontSize,
            wordWrap: lineWrap ? 'on' : 'off',
            guides: {
                bracketPairs: true,
                indentation: true,
            },
        });
    }, [editorFontSize, lineWrap]);

    const ctxValue = useMemo(() => ({
        editorFontSize,
        setEditorFontSize,
        lineWrap,
        setLineWrap,
        autoFormat,
        setAutoFormat,
        theme,
        setTheme,
        editorRef,
        handleEditorDidMount,
        showSettings,
        setShowSettings,
        toggleSettings,
        isFullscreen,
        toggleFullscreen,
        showFullscreenPrompt,
        enableFullscreen,
        closeFullscreenPrompt,
        showProblem,
        toggleProblemPanel,
        language,
        setLanguage: updateLanguage,
        activeTab,
        setActiveTab,
    }), [
        editorFontSize,
        lineWrap,
        autoFormat,
        theme,
        handleEditorDidMount,
        showSettings,
        setShowSettings,
        toggleSettings,
        isFullscreen,
        toggleFullscreen,
        showFullscreenPrompt,
        enableFullscreen,
        closeFullscreenPrompt,
        showProblem,
        toggleProblemPanel,
        language,
        updateLanguage,
        activeTab,
        setActiveTab,
    ]);

    return (
        <EditorSettingsContext.Provider value={ctxValue}>
            {children}
        </EditorSettingsContext.Provider>
    );
}