import React, { useState } from 'react';
import { X, Plus, LogOut, Trash2 } from 'lucide-react';
import type { ThemeMode, FontFamily, BgTexture, BorderWeight, ShadowDepth } from '../context/SettingsContext';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDeleteModal: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onOpenDeleteModal }) => {
  const { logout } = useAuth();
  const { 
    themeMode, primaryAccent, fontFamily, borderWeight, shadowDepth, 
    bgTexture, chatBubbleColor, userTags,
    updateSetting 
  } = useSettings();

  const [newTag, setNewTag] = useState('');

  if (!isOpen) return null;

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && userTags.length < 3) {
      updateSetting('userTags', [...userTags, newTag.trim().toUpperCase()]);
      setNewTag('');
    }
  };

  const colorOptions = [
    '#82b3ff', // blue
    '#ff9cfa', // pink
    '#ffde59', // yellow
    '#a7e4b5', // green
    '#ff6b6b', // red
    '#cc99ff', // purple
    '#ffffff', // white
  ];

  const borderWeights: BorderWeight[] = ['2px', '4px', '6px'];
  const shadowDepths: ShadowDepth[] = ['4px', '8px', '12px'];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-md bg-black/40">
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-[#2d2d2d] border-[var(--dynamic-border)] border-black shadow-[var(--dynamic-shadow)_var(--dynamic-shadow)_0px_0px_#000] flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b-[var(--dynamic-border)] border-black bg-white shrink-0">
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-black">
            SYSTEM <span className="bg-[#ffde59] px-2 border-2 border-black inline-block transform -rotate-1">SETTINGS</span>
          </h1>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-[#ff9cfa] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-8 space-y-12 bg-[#2d2d2d] text-white no-scrollbar">
          
          {/* Aesthetics Section */}
          <section>
            <h2 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#82b3ff] border-2 border-black flex items-center justify-center text-black text-sm">-</span>
              AESTHETICS
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Theme Mode */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Visual Protocol</label>
                <div className="flex gap-2">
                  {(['light', 'dark', 'gray'] as ThemeMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => updateSetting('themeMode', m)}
                      className={`flex-grow py-3 border-2 border-black font-black uppercase text-[10px] transition-all ${
                        themeMode === m 
                          ? 'bg-white text-black translate-x-[2px] translate-y-[2px] shadow-none !border-[var(--accent-color)]' 
                          : 'bg-[#404040] shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5'
                      }`}
                      style={themeMode === m ? { backgroundColor: primaryAccent } : {}}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Primary Nerve</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateSetting('primaryAccent', c)}
                      style={{ backgroundColor: c }}
                      className={`w-8 h-8 border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all ${
                        primaryAccent === c ? 'scale-110 !shadow-none translate-x-[2px] translate-y-[2px]' : 'hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Typography */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Symbol Subset</label>
                <div className="flex gap-2">
                  {(['font-sans', 'font-mono', 'font-serif'] as FontFamily[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => updateSetting('fontFamily', f)}
                      className={`flex-grow py-3 border-2 border-black font-black uppercase text-[10px] transition-all ${f} ${
                        fontFamily === f 
                          ? 'bg-white text-black translate-x-[2px] translate-y-[2px] shadow-none !border-[var(--accent-color)]' 
                          : 'bg-[#404040] shadow-[3px_3px_0px_0px_#000]'
                      }`}
                      style={fontFamily === f ? { backgroundColor: primaryAccent } : {}}
                    >
                      {f.split('-')[1]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Texture */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Surface Grain</label>
                <div className="flex gap-2">
                  {(['none', 'dots', 'grid'] as BgTexture[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => updateSetting('bgTexture', t)}
                      className={`flex-grow py-3 border-2 border-black font-black uppercase text-[10px] transition-all ${
                        bgTexture === t 
                          ? 'bg-white text-black translate-x-[2px] translate-y-[2px] shadow-none !border-[var(--accent-color)]' 
                          : 'bg-[#404040] shadow-[3px_3px_0px_0px_#000]'
                      }`}
                      style={bgTexture === t ? { backgroundColor: primaryAccent } : {}}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Border Weight */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Structural Girth</label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                        const idx = borderWeights.indexOf(borderWeight);
                        if (idx > 0) updateSetting('borderWeight', borderWeights[idx - 1]);
                    }}
                    className="w-10 h-10 border-2 border-black bg-white text-black font-black shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-20"
                    disabled={borderWeight === borderWeights[0]}
                  >-</button>
                  <span className="font-black text-xl w-8 text-center">{borderWeight}</span>
                  <button 
                    onClick={() => {
                        const idx = borderWeights.indexOf(borderWeight);
                        if (idx < borderWeights.length - 1) updateSetting('borderWeight', borderWeights[idx + 1]);
                    }}
                    className="w-10 h-10 border-2 border-black bg-white text-black font-black shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-20"
                    disabled={borderWeight === borderWeights[borderWeights.length - 1]}
                  >+</button>
                </div>
              </div>

              {/* Shadow Depth */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Void Displacement</label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                        const idx = shadowDepths.indexOf(shadowDepth);
                        if (idx > 0) updateSetting('shadowDepth', shadowDepths[idx - 1]);
                    }}
                    className="w-10 h-10 border-2 border-black bg-white text-black font-black shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-20"
                    disabled={shadowDepth === shadowDepths[0]}
                  >-</button>
                  <span className="font-black text-xl w-8 text-center">{shadowDepth}</span>
                  <button 
                    onClick={() => {
                        const idx = shadowDepths.indexOf(shadowDepth);
                        if (idx < shadowDepths.length - 1) updateSetting('shadowDepth', shadowDepths[idx + 1]);
                    }}
                    className="w-10 h-10 border-2 border-black bg-white text-black font-black shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-20"
                    disabled={shadowDepth === shadowDepths[shadowDepths.length - 1]}
                  >+</button>
                </div>
              </div>
            </div>
          </section>

          {/* Chat Preferences Section */}
          <section>
            <h2 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#ff9cfa] border-2 border-black flex items-center justify-center text-black text-sm">+</span>
              CHAT PREFERENCES
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Chat Bubble Color */}
              <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Signal Highlight</label>
                <div className="flex flex-wrap gap-2">
                   {colorOptions.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateSetting('chatBubbleColor', c)}
                      style={{ backgroundColor: c }}
                      className={`w-8 h-8 border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all ${
                        chatBubbleColor === c ? 'scale-110 !shadow-none translate-x-[2px] translate-y-[2px]' : 'hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* User Tags */}
              <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Frequency Tags (max 3)</label>
                <form onSubmit={handleAddTag} className="flex gap-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="ENTER TAG..."
                    disabled={userTags.length >= 3}
                    className="flex-grow bg-[#404040] border-2 border-black px-4 py-3 font-black uppercase text-[10px] focus:outline-none focus:bg-[#505050] text-white disabled:opacity-50"
                  />
                  <button 
                    type="submit"
                    disabled={userTags.length >= 3 || !newTag.trim()}
                    className="w-12 h-12 bg-[#a7e4b5] border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 active:shadow-none disabled:opacity-50 text-black transition-all"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </form>
                <div className="flex gap-3 mt-4">
                  {userTags.map((tag, i) => (
                    <div 
                      key={i} 
                      className="bg-brutal-accent text-black border-2 border-black px-4 py-1 text-[10px] font-black flex items-center gap-2 transform -rotate-1 shadow-[2px_2px_0px_0px_#000]"
                    >
                      {tag}
                      <button onClick={() => updateSetting('userTags', userTags.filter((_, idx) => idx !== i))}>
                        <X className="w-3 h-3 hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          {/* Account Actions Section */}
          <section>
            <h2 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-3 text-[#ff6b6b]">
              <span className="w-8 h-8 bg-[#ff6b6b] border-2 border-black flex items-center justify-center text-black text-sm">!</span>
              ACCOUNT ACTIONS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  onClose();
                  logout();
                }}
                className="w-full btn-brutal bg-white hover:bg-gray-100 flex justify-between items-center group !py-4"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest text-black">Logout</span>
                </div>
                <div className="w-2 h-2 bg-black group-hover:animate-ping"></div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenDeleteModal();
                }}
                className="w-full btn-brutal bg-[#ff9cfa] hover:bg-[#ff85f8] flex justify-between items-center group !py-4"
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5 text-black" />
                  <span className="text-xs font-black uppercase tracking-widest text-black">Delete Account</span>
                </div>
                <div className="w-2 h-2 bg-black group-hover:scale-150 transition-transform"></div>
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t-[var(--dynamic-border)] border-black/20 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
                NextFace Control Panel v1.2.0 • Build 2026-03-15
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t-[var(--dynamic-border)] border-black bg-white flex justify-end shrink-0">
           <button 
             onClick={onClose}
             className="btn-brutal bg-[#82b3ff] px-10 text-black"
           >
             Close Console
           </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
