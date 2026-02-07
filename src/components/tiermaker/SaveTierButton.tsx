import React, { useState } from 'react';
import html2canvas from 'html2canvas';

export const SaveTierButton: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        const tiersContainer = document.getElementById('tiers-container');
        if (!tiersContainer) return;

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 150));

        try {
            const canvas = await html2canvas(tiersContainer, {
                backgroundColor: '#1a1b25',
                useCORS: true,
                scale: 2,
                logging: false,
                onclone: (clonedDoc) => {
                    const clonedContainer = clonedDoc.getElementById('tiers-container');
                    if (clonedContainer) {
                        clonedContainer.style.borderRadius = '1rem';
                        clonedContainer.style.overflow = 'hidden';
                        clonedContainer.style.width = `${tiersContainer.offsetWidth}px`;
                    }
                    
                    const style = clonedDoc.createElement('style');
                    style.innerHTML = `
                        * { 
                            transition: none !important; 
                            animation: none !important; 
                        }
                        .unit-card {
                            display: block !important;
                            opacity: 1 !important;
                            visibility: visible !important;
                            transform: none !important;
                        }
                    `;
                    clonedDoc.head.appendChild(style);
                },
                ignoreElements: (element) => element.classList.contains('tier-actions'),
            });

            const link = document.createElement('a');
            link.download = `dblbox-tier-${Date.now()}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (error) {
            console.error("Error saving tier list:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button 
            className={`pill-button ${isLoading ? 'active' : ''}`}
            onClick={handleSave} 
            disabled={isLoading}
            style={isLoading ? { opacity: 0.7, pointerEvents: 'none' } : {}}
            title={isLoading ? "Procesando imagen..." : "Guardar Tier List como PNG"}
        >
            <span>{isLoading ? '⌛' : '📷'}</span>
            <span>{isLoading ? 'Procesando...' : 'Guardar'}</span>
        </button>
    );
};
