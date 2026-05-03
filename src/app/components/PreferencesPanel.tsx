import React, { useState } from 'react';
import { X, Sparkles, Check, ChevronRight } from 'lucide-react';
import { useApp, Preferences } from '../context/AppContext';

const OVERALL_OPTIONS = ['Healthy', 'Low Calories', 'High Protein'];
const DIETARY_OPTIONS = ['None', 'Vegan', 'Vegetarian', 'Other'];
const PROTEIN_OPTIONS = ['Pork', 'Beef', 'Chicken', 'Seafood', 'Plant'];

function ToggleChip({
  label, selected, onToggle, color,
}: { label: string; selected: boolean; onToggle: () => void; color?: string }) {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-1.5 rounded-full text-[13px] border transition-all flex items-center gap-1.5 ${
        selected ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200'
      }`}
      style={selected && color ? { backgroundColor: color, borderColor: color } : undefined}
    >
      {selected && <Check size={11} />}
      {label}
    </button>
  );
}

export function PreferencesPanel() {
  const { preferences, setPreferences, setShowPreferences } = useApp();
  const [local, setLocal] = useState<Preferences>({ ...preferences });
  const [aiInput, setAiInput] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const toggleItem = (key: keyof Preferences, value: string) => {
    setLocal(prev => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      };
    });
  };

  const handleAI = () => {
    if (!aiInput.trim()) return;
    setAiThinking(true);
    setTimeout(() => {
      // Parse AI input and update preferences
      const text = aiInput.toLowerCase();
      const newPrefs: Preferences = { overall: [], dietary: [], protein: [] };
      if (text.includes('healthy')) newPrefs.overall.push('Healthy');
      if (text.includes('calori')) newPrefs.overall.push('Low Calories');
      if (text.includes('protein')) newPrefs.overall.push('High Protein');
      if (text.includes('vegan')) newPrefs.dietary.push('Vegan');
      if (text.includes('vegetarian')) newPrefs.dietary.push('Vegetarian');
      if (text.includes('chicken')) newPrefs.protein.push('Chicken');
      if (text.includes('beef')) newPrefs.protein.push('Beef');
      if (text.includes('pork')) newPrefs.protein.push('Pork');
      if (text.includes('seafood') || text.includes('fish') || text.includes('salmon')) newPrefs.protein.push('Seafood');
      if (text.includes('plant')) newPrefs.protein.push('Plant');
      setLocal(newPrefs);
      setAiThinking(false);
      setAiInput('');
      setShowAI(false);
    }, 1200);
  };

  const handleSave = () => {
    setPreferences(local);
    setShowPreferences(false);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40" onClick={() => setShowPreferences(false)} />

      {/* Sheet */}
      <div className="bg-white rounded-t-3xl overflow-hidden flex flex-col max-h-[88%]">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 pt-1 border-b border-gray-100">
          <h2 className="text-[18px] font-bold">My Preferences</h2>
          <button
            onClick={() => setShowPreferences(false)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* AI input */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-[#06C167]" />
              <span className="text-[14px] font-semibold text-gray-800">AI Preference Assistant</span>
            </div>
            {showAI ? (
              <div className="space-y-2">
                <textarea
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  placeholder="e.g. I'm vegan, high protein, no pork or beef..."
                  className="w-full text-[13px] bg-white border border-gray-200 rounded-xl p-3 resize-none outline-none focus:border-[#06C167]"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAI}
                    disabled={aiThinking}
                    className="flex-1 bg-black text-white rounded-full py-2 text-[13px] font-semibold flex items-center justify-center gap-1"
                  >
                    {aiThinking ? (
                      <><span className="animate-pulse">✨</span> Analyzing...</>
                    ) : (
                      <><Sparkles size={12} /> Apply with AI</>
                    )}
                  </button>
                  <button
                    onClick={() => setShowAI(false)}
                    className="px-3 py-2 border border-gray-200 rounded-full text-[13px] text-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAI(true)}
                className="w-full flex items-center justify-between text-left bg-white border border-gray-200 rounded-xl px-3 py-2.5"
              >
                <span className="text-[13px] text-gray-500">Describe your preferences to AI...</span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            )}
          </div>

          {/* Overall preference */}
          <div>
            <div className="text-[15px] font-bold mb-1">Overall preference</div>
            <div className="text-[12px] text-gray-500 mb-3">Select all that apply</div>
            <div className="flex flex-wrap gap-2">
              {OVERALL_OPTIONS.map(opt => (
                <ToggleChip
                  key={opt}
                  label={opt}
                  selected={local.overall.includes(opt)}
                  onToggle={() => toggleItem('overall', opt)}
                  color="#06C167"
                />
              ))}
            </div>
          </div>

          {/* Dietary restriction */}
          <div>
            <div className="text-[15px] font-bold mb-1">Dietary restriction</div>
            <div className="text-[12px] text-gray-500 mb-3">Select all that apply</div>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map(opt => (
                <ToggleChip
                  key={opt}
                  label={opt}
                  selected={local.dietary.includes(opt)}
                  onToggle={() => toggleItem('dietary', opt)}
                />
              ))}
            </div>
          </div>

          {/* Protein types */}
          <div>
            <div className="text-[15px] font-bold mb-1">Protein types</div>
            <div className="text-[12px] text-gray-500 mb-3">Select what you enjoy</div>
            <div className="flex flex-wrap gap-2">
              {PROTEIN_OPTIONS.map(opt => (
                <ToggleChip
                  key={opt}
                  label={opt}
                  selected={local.protein.includes(opt)}
                  onToggle={() => toggleItem('protein', opt)}
                />
              ))}
            </div>
          </div>

          {/* Allergies note */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
            <div className="text-[13px] font-semibold text-amber-800 mb-0.5">Allergies & Intolerances</div>
            <div className="text-[12px] text-amber-700">Allergy info is shown on each meal. Always verify ingredients if you have severe allergies.</div>
          </div>

          {/* Current active */}
          {(local.overall.length > 0 || local.dietary.length > 0 || local.protein.length > 0) && (
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-[13px] font-semibold text-gray-700 mb-1">Active preferences</div>
              <div className="flex flex-wrap gap-1.5">
                {[...local.overall, ...local.dietary, ...local.protein].map(p => (
                  <span key={p} className="text-[11px] bg-black text-white rounded-full px-2 py-0.5">{p}</span>
                ))}
              </div>
            </div>
          )}

          <div className="h-4" />
        </div>

        {/* Save button */}
        <div className="px-5 py-4 border-t border-gray-100 bg-white">
          <button
            onClick={handleSave}
            className="w-full bg-black text-white rounded-full py-3.5 text-[15px] font-semibold"
          >
            Save preferences
          </button>
        </div>
      </div>
    </div>
  );
}
