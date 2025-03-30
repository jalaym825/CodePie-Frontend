import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { languageMap } from "../helpers/editorData";

const useEditorSettings = ({ language, languages }) => {
    const editorRef = useRef(null);
    const [monacoLanguage, setMonacoLanguage] = useState('python');
    const [editorFontSize, setEditorFontSize] = useState(14);
    const [lineWrap, setLineWrap] = useState(true);
    const [autoFormat, setAutoFormat] = useState(true);
    const [theme, setTheme] = useState('vs');

    useEffect(() => {
        if (languages.length > 0) {
            const selectedLang = languages.find(
                (lang) => lang.id.toString() === language,
            );
            if (selectedLang) {
                const langName = selectedLang.name.toLowerCase().replace(/\s/g, '');
                const monacoLang =
                    languageMap[langName] ||
                    languageMap[langName.split(/[^a-zA-Z+]/)[0]] ||
                    'plaintext';

                setMonacoLanguage(monacoLang);
            }
        }
    }, [language, languages]);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        // Enable code suggestions
        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: false,
            noSyntaxValidation: false,
        });

        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ES2020,
            allowNonTsExtensions: true,
        });

        // Enhanced editor settings
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
    };

    const formatCode = () => {
        if (editorRef.current) {
            editorRef.current.getAction('editor.action.formatDocument').run();
            toast.success('Code formatted');
        }
    };

    const copyCode = () => {
        if (editorRef.current) {
            const code = editorRef.current.getValue();
            navigator.clipboard.writeText(code);
            toast.success('Code copied to clipboard');
        }
    };

    const downloadCode = () => {
        if (!editorRef.current) return;

        const code = editorRef.current.getValue();
        const selectedLang = languages.find(
            (lang) => lang.id.toString() === language,
        );
        let extension = 'txt';

        if (selectedLang) {
            switch (monacoLanguage) {
                case 'javascript':
                    extension = 'js';
                    break;
                case 'python':
                    extension = 'py';
                    break;
                case 'java':
                    extension = 'java';
                    break;
                case 'c':
                    extension = 'c';
                    break;
                case 'cpp':
                    extension = 'cpp';
                    break;
                case 'csharp':
                    extension = 'cs';
                    break;
                case 'typescript':
                    extension = 'ts';
                    break;
                case 'php':
                    extension = 'php';
                    break;
                case 'html':
                    extension = 'html';
                    break;
                case 'css':
                    extension = 'css';
                    break;
                default:
                    extension = 'txt';
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
    };

    return {
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
    };
};

export default useEditorSettings;