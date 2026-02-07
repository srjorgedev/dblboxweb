import React, { useState } from 'react';
import html2canvas from 'html2canvas';

export const SaveTierButton: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        const tiersContainer = document.getElementById('tiers-container');
        if (!tiersContainer) {
            console.error("Tier container not found!");
            return;
        }

        setIsLoading(true);

        try {
            const canvas = await html2canvas(tiersContainer, {
                backgroundColor: '#1a1b25',
                useCORS: true,
                allowTaint: true,
                scale: 1.5,
                logging: false,
                ignoreElements: (element) => element.classList.contains('tier-actions'),
            });

            const link = document.createElement('a');
            link.download = `dblbox-tier-${Date.now()}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (error) {
            console.error("Error saving tier list:", error);
            alert("Error al guardar la imagen.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button 
            className="pill-button"
            onClick={handleSave} 
            disabled={isLoading}
            title={isLoading ? "Procesando imagen..." : "Guardar Tier List como PNG"}
        >
            <span>{isLoading ? '⌛' : '📷'}</span>
            <span>{isLoading ? 'Procesando...' : 'Guardar'}</span>
        </button>
    );
};
