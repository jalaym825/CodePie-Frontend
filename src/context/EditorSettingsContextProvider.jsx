// EditorSettingsContextProvider.jsx
import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { languageMap } from "../helpers/editorData";
import { EditorSettingsContext } from './EditorSettingsContext';

export default function EditorSettingsContextProvider({ children }) {
    const editorRef = useRef(null);
    const [monacoLanguage, setMonacoLanguage] = useState('python');
    const [editorFontSize, setEditorFontSize] = useState(14);
    const [lineWrap, setLineWrap] = useState(true);
    const [autoFormat, setAutoFormat] = useState(true);
    const [theme, setTheme] = useState('vs');
    const [showSettings, setShowSettings] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);
    const [showProblem, setShowProblem] = useState(true);

    const languages = useMemo(() => [
        { id: '71', name: 'Python' },
        { id: '62', name: 'Java' },
        { id: '54', name: 'C++' },
        { id: '63', name: 'JavaScript' },
    ], []);

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
                console.log("Error attempting to enable fullscreen:", err);
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

    // Update Monaco language when language changes
    const updateMonacoLanguage = useCallback((language) => {
        const selectedLang = languages.find((lang) => lang.id.toString() === language);
        if (selectedLang) {
            const langName = selectedLang.name.toLowerCase().replace(/\s/g, '');
            const monacoLang =
                languageMap[langName] ||
                languageMap[langName.split(/[^a-zA-Z+]/)[0]] ||
                'plaintext';
            setMonacoLanguage(monacoLang);
        }
    }, [languages]);

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
            toast.success('Code formatted');
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
        const selectedLang = languages.find((lang) => lang.id === monacoLanguage);
        let extension = 'txt';

        if (selectedLang) {
            switch (monacoLanguage) {
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
    }, [languages, monacoLanguage]);

    const ctxValue = useMemo(() => ({
        monacoLanguage,
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
        toggleSettings,
        isFullscreen,
        toggleFullscreen,
        showFullscreenPrompt,
        enableFullscreen,
        closeFullscreenPrompt,
        showProblem,
        toggleProblemPanel,
        languages,
        updateMonacoLanguage
    }), [
        monacoLanguage,
        editorFontSize,
        lineWrap,
        autoFormat,
        theme,
        handleEditorDidMount,
        formatCode,
        copyCode,
        downloadCode,
        showSettings,
        toggleSettings,
        isFullscreen,
        toggleFullscreen,
        showFullscreenPrompt,
        enableFullscreen,
        closeFullscreenPrompt,
        showProblem,
        toggleProblemPanel,
        languages,
        updateMonacoLanguage
    ]);

    return (
        <EditorSettingsContext.Provider value={ctxValue}>
            {children}
        </EditorSettingsContext.Provider>
    );
}