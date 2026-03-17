/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = 'light' | 'dark' | 'gray';
export type FontFamily = 'font-sans' | 'font-mono' | 'font-serif';
export type BorderWeight = '2px' | '4px' | '6px';
export type ShadowDepth = '4px' | '8px' | '12px';
export type BgTexture = 'none' | 'dots' | 'grid';

interface SettingsState {
  themeMode: ThemeMode;
  primaryAccent: string;
  fontFamily: FontFamily;
  borderWeight: BorderWeight;
  shadowDepth: ShadowDepth;
  bgTexture: BgTexture;
  chatBubbleColor: string;
  userTags: string[];
}

interface SettingsContextType extends SettingsState {
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
}

const DEFAULT_SETTINGS: SettingsState = {
  themeMode: 'light',
  primaryAccent: '#82b3ff',
  fontFamily: 'font-sans',
  borderWeight: '2px',
  shadowDepth: '4px',
  bgTexture: 'none',
  chatBubbleColor: '#82b3ff',
  userTags: [],
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem("nextface_settings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem("nextface_settings", JSON.stringify(settings));
    
    // Apply structural CSS variables to document.documentElement
    const root = document.documentElement;
    root.style.setProperty('--dynamic-border', settings.borderWeight);
    root.style.setProperty('--dynamic-shadow', settings.shadowDepth);
    root.style.setProperty('--accent-color', settings.primaryAccent);
    root.style.setProperty('--chat-bubble-color', settings.chatBubbleColor);

    // Apply theme classes
    root.classList.remove("theme-light", "theme-dark", "theme-gray");
    root.classList.add(`theme-${settings.themeMode}`);

    // Apply font family class
    root.classList.remove("font-sans", "font-mono", "font-serif");
    root.classList.add(settings.fontFamily);
    
  }, [settings]);

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsContext.Provider value={{ ...settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
