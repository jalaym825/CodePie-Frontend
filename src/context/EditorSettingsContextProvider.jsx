// EditorSettingsContextProvider.jsx
import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { EditorSettingsContext } from './EditorSettingsContext';
import { languages } from '../helpers/editorData';

export default function EditorSettingsContextProvider({ children }) {
    const editorRef = useRef(null);
    const [editorFontSize, setEditorFontSize] = useState(14);
    const [lineWrap, setLineWrap] = useState(true);
    const [autoFormat, setAutoFormat] = useState(true);
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

    const formatCode = useCallback(() => {
        if (editorRef.current) {
            editorRef.current.getAction('editor.action.formatDocument').run();
            // toast.success('Code formatted');
        }
    }, []);

    const copyCode = useCallback(() => {
        if (editorRef.current) {
            const code = editorRef.current.getValue();
            navigator.clipboard.writeText(code);
            toast.success('Code copied to clipboard');
        }
    }, []);

    const downloadCode = useCallback(() => {
        if (!editorRef.current) return;

        const code = editorRef.current.getValue();
        let extension = 'txt';

        switch (language.monacoLanguage) {
            case 'javascript': extension = 'js'; break;
            case 'python': extension = 'py'; break;
            case 'java': extension = 'java'; break;
            case 'c': extension = 'c'; break;
            case 'cpp': extension = 'cpp'; break;
            case 'csharp': extension = 'cs'; break;
            case 'typescript': extension = 'ts'; break;
            case 'php': extension = 'php'; break;
            case 'html': extension = 'html'; break;
            case 'css': extension = 'css'; break;
            default: extension = 'txt';
        }

        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `code.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(`Downloaded as code.${extension}`);
    }, [language]);

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
        formatCode,
        copyCode,
        downloadCode,
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
        formatCode,
        copyCode,
        downloadCode,
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