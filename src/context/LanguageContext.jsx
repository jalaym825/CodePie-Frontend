// LanguageSyncContext.jsx

import { createContext } from "react";

export const LanguageContext = createContext({
    languageId: "71", // default: Python
    languageName: "Python",
    monacoLanguage: "python",
    updateLanguage: () => {},
});
