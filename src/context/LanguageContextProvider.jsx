// LanguageSyncContext.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { languageMap } from '../helpers/editorData';
import { LanguageContext } from './LanguageContext';

export default function LanguageSyncProvider({ children }) {
    const [languageId, setLanguageId] = useState("71"); // default: Python
    const [languageName, setLanguageName] = useState("Python");

    const monacoLanguage = useMemo(() => {
        const key = languageName.toLowerCase().replace(/\s/g, '');
        return languageMap[key] || 'plaintext';
    }, [languageName]);

    const updateLanguage = useCallback((id, name) => {
        setLanguageId(id);
        setLanguageName(name);
    }, []);

    const value = useMemo(() => ({
        languageId,
        languageName,
        monacoLanguage,
        updateLanguage
    }), [languageId, languageName, monacoLanguage, updateLanguage]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}
