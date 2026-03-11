"use client";

import { useState, useEffect } from 'react';

const SETTING_KEYS = ['site_title', 'about_page', 'footer_text', 'contact_email', 'contact_phone'];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        const settingsMap: Record<string, string> = {};
        data.forEach((s: any) => {
          settingsMap[s.key] = s.value;
        });
        setSettings(settingsMap);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      for (const key of SETTING_KEYS) {
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value: settings[key] || '' })
        });
      }
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings.');
    }
    setSaving(false);
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-6 border border-slate-200">
      <h3 className="text-lg font-medium leading-6 text-slate-900 mb-6">Global Site Settings</h3>
      <form onSubmit={handleSave} className="space-y-6">
        
        {SETTING_KEYS.map(key => (
          <div key={key}>
            <label className="block text-sm font-medium text-slate-700 capitalize mb-1">
              {key.replace('_', ' ')}
            </label>
            {key === 'about_page' || key === 'footer_text' ? (
              <textarea
                rows={4}
                value={settings[key] || ''}
                onChange={e => handleChange(key, e.target.value)}
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm p-2 border"
              />
            ) : (
              <input
                type="text"
                value={settings[key] || ''}
                onChange={e => handleChange(key, e.target.value)}
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm p-2 border"
              />
            )}
          </div>
        ))}

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center rounded-md border border-transparent bg-slate-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
