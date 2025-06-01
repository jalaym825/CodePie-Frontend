import React, { createContext, useState, useContext } from 'react';

const SubmissionContext = createContext();

export const SubmissionProvider = ({ children }) => {
    const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
    const [submissionData, setSubmissionData] = useState(null);
    const [activeTab, setActiveTab] = useState('editor');
    const [newSubmission,SetNewSubmission] = useState(false);

    // Function to handle new submissions
    const handleNewSubmission = (data) => {
        SetNewSubmission(true);
        setSubmissionData(data);
        setSelectedSubmissionId(data.id); // Clear any selected past 
        
        setActiveTab('submission');
    };

    // Function to handle viewing past submissions
    const handleViewSubmission = (submissionId) => {
        setSelectedSubmissionId(submissionId);
        setSubmissionData(null); // Clear any new submission data
        setActiveTab('submission');
    };

    // Function to clear submission data
    const clearSubmission = () => {
        setSelectedSubmissionId(null);
        setSubmissionData(null);
        setActiveTab('editor');
    };
  

    return (
        <SubmissionContext.Provider 
            value={{newSubmission,
                SetNewSubmission,
                selectedSubmissionId,
                setSelectedSubmissionId,
                submissionData,
                setSubmissionData,
                activeTab,
                setActiveTab,
                handleNewSubmission,
                handleViewSubmission,
                clearSubmission
            }}
        >
            {children}
        </SubmissionContext.Provider>
    );
};

export const useSubmission = () => {
    const context = useContext(SubmissionContext);
    if (!context) {
        throw new Error('useSubmission must be used within a SubmissionProvider');
    }
    return context;
};