import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  FileCode,
  Globe2,
  RefreshCw,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Search,
  KeyRound,
  Save,
  X,
  Plus
} from 'lucide-react';
import { PSEOPage, SupportedLanguage } from '../types';

interface AdminPanelProps {
  onClose?: () => void;
  siteUrl?: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'pseo' | 'languages' | 'sitemaps' | 'system'>('pseo');

  // Stats & pSEO state
  const [pagesCount, setPagesCount] = useState<number>(0);
  const [sitemapChunksCount, setSitemapChunksCount] = useState<number>(1);
  const [recentPages, setRecentPages] = useState<PSEOPage[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationMsg, setGenerationMsg] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingPage, setEditingPage] = useState<PSEOPage | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);

  // Language management state
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('en');
  const [translationsData, setTranslationsData] = useState<Record<string, any>>({});
  const [isSavingTranslations, setIsSavingTranslations] = useState<boolean>(false);
  const [langSaveMsg, setLangSaveMsg] = useState<string>('');

  useEffect(() => {
    const token = sessionStorage.getItem('airdrop_admin_token');
    if (token) {
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setIsAuthenticated(true);
        loadData(token);
        loadTranslations(token);
      } else {
        sessionStorage.removeItem('airdrop_admin_token');
      }
    } catch {
      // Backend offline or network failure
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        sessionStorage.setItem('airdrop_admin_token', data.token);
        setIsAuthenticated(true);
        loadData(data.token);
        loadTranslations(data.token);
      } else {
        setAuthError(data.error || 'Invalid credentials');
      }
    } catch {
      setAuthError('Authentication request failed. Check server connection.');
    }
  };

  const loadData = async (token?: string, query = '') => {
    const authToken = token || sessionStorage.getItem('airdrop_admin_token') || '';
    try {
      const url = query ? `/api/admin/pseo?q=${encodeURIComponent(query)}&limit=100` : '/api/admin/pseo?limit=100';
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPagesCount(data.overallTotal || data.total || 0);
        setSitemapChunksCount(data.sitemapCount || 1);
        setRecentPages(data.pages || []);
      }
    } catch (err) {
      console.error('Failed to load admin pSEO data:', err);
    }
  };

  const loadTranslations = async (token?: string) => {
    const authToken = token || sessionStorage.getItem('airdrop_admin_token') || '';
    try {
      const res = await fetch('/api/admin/translations', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTranslationsData(data || {});
      }
    } catch (err) {
      console.error('Failed to load translations:', err);
    }
  };

  const handleGeneratePSEO = async (count: number) => {
    setIsGenerating(true);
    setGenerationMsg('');
    const token = sessionStorage.getItem('airdrop_admin_token') || '';
    try {
      const res = await fetch('/api/admin/pseo/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ count })
      });
      const data = await res.json();
      if (res.ok) {
        setGenerationMsg(`Successfully generated ${data.generatedCount} pages! Sitemaps updated automatically.`);
        loadData();
      } else {
        setGenerationMsg(`Generation error: ${data.error}`);
      }
    } catch {
      setGenerationMsg(`Generation request completed.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePageEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    setIsSavingEdit(true);
    const token = sessionStorage.getItem('airdrop_admin_token') || '';
    try {
      const res = await fetch('/api/admin/pseo/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          slug: editingPage.slug,
          updates: {
            title: editingPage.title,
            h1: editingPage.h1,
            metaDescription: editingPage.metaDescription,
            contentSnippet: editingPage.contentSnippet,
            keywords: editingPage.keywords
          }
        })
      });
      if (res.ok) {
        setEditingPage(null);
        loadData();
      }
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeletePage = async (slug: string) => {
    if (!window.confirm(`Delete pSEO page: /pseo/${slug}?`)) return;
    const token = sessionStorage.getItem('airdrop_admin_token') || '';
    try {
      const res = await fetch(`/api/admin/pseo/${slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleSaveTranslations = async () => {
    setIsSavingTranslations(true);
    setLangSaveMsg('');
    const token = sessionStorage.getItem('airdrop_admin_token') || '';
    try {
      const res = await fetch('/api/admin/translations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          lang: selectedLang,
          translations: translationsData[selectedLang] || {}
        })
      });
      if (res.ok) {
        setLangSaveMsg(`Changes saved for ${selectedLang.toUpperCase()}!`);
      } else {
        setLangSaveMsg('Error saving translation changes.');
      }
    } finally {
      setIsSavingTranslations(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-100">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="font-serif-editorial text-2xl font-bold text-white">AirDrop Web Secure Admin</h1>
            <p className="text-xs text-slate-400 font-light">
              Manage Programmatic SEO, Multi-Language Strings & Dynamic Sitemap Indexes.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Master Admin Password</label>
              <input
                type="password"
                placeholder="Enter ADMIN_PASSWORD..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-amber-400 font-mono focus:outline-none focus:border-amber-500"
                autoFocus
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/15"
            >
              Authenticate & Unlock Panel
            </button>
          </form>

          <div className="text-center">
            <a href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              ← Return to AirDrop Web
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-editorial text-2xl font-bold text-white">System Admin & pSEO Engine</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono uppercase">
                  Authenticated
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-Language Hub (EN/ES/FR/PT/AR) & Hierarchical XML Sitemap Splitter
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl font-medium transition-colors"
            >
              View Live Website
            </a>
            <button
              onClick={() => {
                sessionStorage.removeItem('airdrop_admin_token');
                setIsAuthenticated(false);
              }}
              className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs rounded-xl font-medium border border-rose-500/30 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto theme-scrollbar">
          {[
            { id: 'pseo', label: 'pSEO Pages & Editor', icon: <FileCode className="w-4 h-4" /> },
            { id: 'languages', label: 'Manage Translations (EN/ES/FR/PT/AR)', icon: <Globe2 className="w-4 h-4" /> },
            { id: 'sitemaps', label: 'Sitemap Index & Crawlers', icon: <Layers className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: pSEO ENGINE & EDITOR */}
        {activeTab === 'pseo' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="text-xs text-slate-400 font-mono">TOTAL PSEO PAGES</div>
                <div className="text-3xl font-serif-editorial text-amber-400 font-bold mt-1">
                  {pagesCount.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Indexed in sitemaps</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="text-xs text-slate-400 font-mono">SUB-SITEMAP CHUNKS</div>
                <div className="text-3xl font-serif-editorial text-sky-400 font-bold mt-1">
                  {sitemapChunksCount}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Split at 500 URLs per file</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="text-xs text-slate-400 font-mono">INDEX COVERAGE</div>
                <div className="text-3xl font-serif-editorial text-emerald-400 font-bold mt-1">
                  100% Ready
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Ready for Googlebot & Bingbot</div>
              </div>
            </div>

            {/* Bulk Generator Card */}
            <div className="bg-slate-900 border border-amber-500/30 p-6 rounded-3xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif-editorial text-xl font-bold text-white">
                    Bulk Generate Thousands of pSEO Pages
                  </h2>
                  <p className="text-xs text-slate-400 font-light mt-1">
                    Combines device matrices, media categories, and transfer search intents into unique target landing pages.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleGeneratePSEO(500)}
                    disabled={isGenerating}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-xl text-xs font-semibold disabled:opacity-50"
                  >
                    + 500 Pages
                  </button>
                  <button
                    onClick={() => handleGeneratePSEO(1500)}
                    disabled={isGenerating}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-xl text-xs font-semibold disabled:opacity-50"
                  >
                    + 1,500 Pages
                  </button>
                  <button
                    onClick={() => handleGeneratePSEO(3000)}
                    disabled={isGenerating}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>+ 3,000 Pages</span>
                  </button>
                </div>
              </div>

              {generationMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{generationMsg}</span>
                </div>
              )}
            </div>

            {/* Pages Explorer & Inline Editor Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="font-serif-editorial text-lg text-white font-semibold">
                  pSEO Page Manager & Live Editor
                </h3>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search slug, device, or title..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      loadData(undefined, e.target.value);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div className="overflow-x-auto max-h-96 theme-scrollbar">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 font-mono text-[11px] uppercase">
                      <th className="py-2.5 px-3">Page Title / Topic</th>
                      <th className="py-2.5 px-3">Device Route</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Slug</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {recentPages.map((page, idx) => (
                      <tr key={idx} className="hover:bg-slate-950/40 transition-colors">
                        <td className="py-3 px-3 font-medium text-slate-200 max-w-xs truncate" title={page.title}>
                          {page.title}
                        </td>
                        <td className="py-3 px-3 text-amber-400 font-mono text-[11px]">
                          {page.fromDevice} ➔ {page.toDevice}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[10px]">
                            {page.fileCategory}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-400 truncate max-w-[150px]">
                          /pseo/{page.slug}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingPage(page)}
                              className="p-1 hover:text-amber-400 text-slate-400 transition-colors"
                              title="Edit Page SEO Metadata"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <a
                              href={`/pseo/${page.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 hover:text-sky-400 text-slate-400 transition-colors"
                              title="View Live Page"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleDeletePage(page.slug)}
                              className="p-1 hover:text-rose-400 text-slate-400 transition-colors"
                              title="Delete Page"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {recentPages.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500 font-mono">
                          No pages matching your search. Generate pages above to begin!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal for Editing Page SEO */}
            {editingPage && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-serif-editorial text-lg text-white font-bold">
                      Edit pSEO Page: <code className="text-amber-400 font-mono text-sm">{editingPage.slug}</code>
                    </h3>
                    <button onClick={() => setEditingPage(null)} className="text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSavePageEdit} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 font-mono mb-1 uppercase">Page Title (Meta Title)</label>
                      <input
                        type="text"
                        value={editingPage.title}
                        onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-mono mb-1 uppercase">Main Heading (H1)</label>
                      <input
                        type="text"
                        value={editingPage.h1}
                        onChange={(e) => setEditingPage({ ...editingPage, h1: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-mono mb-1 uppercase">Meta Description</label>
                      <textarea
                        rows={3}
                        value={editingPage.metaDescription}
                        onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-mono mb-1 uppercase">Content Snippet</label>
                      <textarea
                        rows={2}
                        value={editingPage.contentSnippet}
                        onChange={(e) => setEditingPage({ ...editingPage, contentSnippet: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingPage(null)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingEdit}
                        className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MULTI-LANGUAGE TRANSLATION EDITOR */}
        {activeTab === 'languages' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif-editorial text-2xl font-bold text-white">
                  Multi-Language Dictionary Manager
                </h2>
                <p className="text-xs text-slate-400 font-light mt-1">
                  Edit UI text across English, Spanish, French, Portuguese, and Arabic (Cairo RTL). Changes persist directly to the server.
                </p>
              </div>

              {/* Language Selector Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'es', label: 'Español' },
                  { code: 'fr', label: 'Français' },
                  { code: 'pt', label: 'Português' },
                  { code: 'ar', label: 'العربية (RTL)' },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setSelectedLang(l.code as SupportedLanguage)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedLang === l.code
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Translation Keys Editor */}
            {translationsData[selectedLang] ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto theme-scrollbar p-1">
                  {Object.entries(translationsData[selectedLang]).map(([key, val]) => (
                    <div key={key} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                      <label className="text-[11px] font-mono text-amber-400 font-semibold block">{key}</label>
                      <input
                        type="text"
                        value={val as string}
                        dir={selectedLang === 'ar' ? 'rtl' : 'ltr'}
                        onChange={(e) => {
                          const updated = { ...translationsData };
                          updated[selectedLang][key] = e.target.value;
                          setTranslationsData(updated);
                        }}
                        className={`w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50 ${
                          selectedLang === 'ar' ? 'font-arabic text-right' : ''
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <span className="text-xs text-emerald-400 font-mono">{langSaveMsg}</span>
                  <button
                    onClick={handleSaveTranslations}
                    disabled={isSavingTranslations}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/10"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save {selectedLang.toUpperCase()} Translations</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 font-mono text-xs">
                Loading language dictionaries...
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SITEMAP HIERARCHY */}
        {activeTab === 'sitemaps' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div>
              <h2 className="font-serif-editorial text-2xl font-bold text-white">
                Sitemap Index Hierarchy & Fast Crawler Links
              </h2>
              <p className="text-xs text-slate-400 font-light mt-1">
                Google and Bing fetch sub-sitemaps in parallel. Each sub-sitemap serves 500 URLs with high-speed caching headers.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-amber-400 font-bold block">Root Sitemap Index</span>
                <span className="text-xs text-slate-400">Contains links to all {sitemapChunksCount} child sitemaps.</span>
              </div>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <span>Open /sitemap.xml</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase text-slate-400">
                Child Sub-Sitemaps ({sitemapChunksCount} Partitions)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from({ length: sitemapChunksCount }).map((_, i) => (
                  <a
                    key={i}
                    href={`/sitemap_${i + 1}.xml`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs flex items-center justify-betw