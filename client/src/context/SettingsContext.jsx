import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    // Default Settings
    const defaultSettings = {
        theme: 'dark',
        markerSize: 'normal',
        highContrast: false,
        notifications: true,
        soundAlerts: false,
        autoRefresh: true,
        refreshInterval: 30, // seconds
        mapStyle: 'dark', // dark, light, satellite
        language: 'en'
    };

    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('cargoflow_settings');
        return saved ? JSON.parse(saved) : defaultSettings;
    });

    // Apply Theme Changes immediately
    useEffect(() => {
        const root = document.documentElement;
        const applyTheme = () => {
            const isDark = settings.theme === 'dark' || (settings.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            if (isDark) {
                root.classList.remove('light');
            } else {
                root.classList.add('light');
            }
        };

        applyTheme();

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (settings.theme === 'auto') applyTheme();
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [settings.theme, settings.highContrast]);

    // Save to LocalStorage whenever settings change
    const updateSettings = (newSettings) => {
        setSettings(prev => {
            const updated = { ...prev, ...newSettings };
            localStorage.setItem('cargoflow_settings', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};
