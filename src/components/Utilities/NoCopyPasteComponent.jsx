import React, { useEffect, useRef } from 'react';

const NoCopyPasteComponent = ({ children, className = "" }) => {
    const componentRef = useRef(null);

    useEffect(() => {
        const element = componentRef.current;
        if (!element) return;

        // Function to prevent copy/cut/paste
        const preventCopyPaste = (e) => {
            e.preventDefault();
            return false;
        };

        // Add event listeners
        element.addEventListener('copy', preventCopyPaste);
        element.addEventListener('cut', preventCopyPaste);
        element.addEventListener('paste', preventCopyPaste);

        // For context menu (right-click)
        const preventContextMenu = (e) => {
            e.preventDefault();
            return false;
        };

        element.addEventListener('contextmenu', preventContextMenu);

        // Cleanup function to remove event listeners
        return () => {
            element.removeEventListener('copy', preventCopyPaste);
            element.removeEventListener('cut', preventCopyPaste);
            element.removeEventListener('paste', preventCopyPaste);
            element.removeEventListener('contextmenu', preventContextMenu);
        };
    }, []);

    return (
        <div
            ref={componentRef}
            className={className}
            // Alternative inline approach
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
        >
            {children}
        </div>
    );
};

export default NoCopyPasteComponent;