import React, { useState } from 'react';
import { SupportedLanguage } from '../types';
import { FAQ_TRANSLATIONS } from '../lib/faqTranslations';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Laptop,
  QrCode,
  Link,
  Copy,
  Zap,
  ShieldCheck
} from 'lucide-react';

interface FAQSectionProps {
  onOpenQR?: () => void;
  onJoinRoom?: (code: string) => void;
  currentLang?: SupportedLanguage;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  onOpenQR,
  currentLang = 'en',
}) => {
  const [openId, setOpenId] = useState<string | null>('what-is-airdrop-online');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const faqData = FAQ_TRANSLATIONS[currentLang] || FAQ_TRANSLATIONS.en;

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const filteredFAQs = activeCategory === 'all'
    ? faqData.items
    : faqData.items.filter((item) => item.category === activeCategory);

  // Schema.org FAQPage JSON-LD Structured Data in active language
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'inLanguage': currentLang,
    'mainEntity': faqData.items.map((item) => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer
      }
    }))
  };

  const renderCardIcon = (type: string) => {
    switch (type) {
      case 'android-iphone':
        return <Smartphone className="w-4 h-4 text-emerald-400" />;
      case 'iphone-android':
        return <Smartphone className="w-4 h-4 text-indigo-400" />;
      case 'android-pc':
        return <Laptop className="w-4 h-4 text-amber-400" />;
      case 'pc-iphone':
        return <Laptop className="w-4 h-4 text-sky-400" />;
      default:
        return <Smartphone className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <section id="faq-section" className={`bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden font-sans space-y-8 my-10 ${currentLang === 'ar' ? 'font-arabic' : ''}`}>

      {/* Inject localized JSON-LD structured data for Google & Bing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="space-y-3 text-center sm:text-left rtl:sm:text-right relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{faqData.badge}</span>
        </div>

        <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl text-white font-light tracking-tight rtl:font-bold rtl:leading-tight">
          {faqData.titlePrefix}
          <span className="italic text-amber-300 font-normal rtl:not-italic rtl:text-amber-400">{faqData.titleHighlight}</span>
          {faqData.titleSuffix}
        </h2>

        <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed font-light">
          {faqData.description}
        </p>
      </div>

      {/* Cross-Platform Device Matrix Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {faqData.cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl hover:border-amber-500/40 transition-all space-y-2 text-left rtl:text-right"
          >
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider">{card.direction}</span>
              {renderCardIcon(card.type)}
            </div>
            <h3 className="text-sm font-semibold text-slate-100">{card.title}</h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* 3 Easy Pairing Methods Banner */}
      <div className="bg-slate-950/90 border border-amber-500/30 p-5 sm:p-6 rounded-2xl space-y-4 relative z-10">
        <h3 className="font-serif-editorial text-lg text-amber-200 italic flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>{faqData.connectionTitle}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          {faqData.connectionWays.map((way, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-left rtl:text-right">
              {idx === 0 && <QrCode className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
              {idx === 1 && <Copy className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
              {idx === 2 && <Link className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />}
              <div>
                <strong className="text-slate-100 block mb-0.5">{way.title}</strong>
                <span>{way.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2 theme-scrollbar border-b border-slate-800/80 relative z-10">
        {faqData.categories.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveCategory(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeCategory === tab.id
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/10'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80'
            } ${currentLang === 'ar' ? 'font-arabic text-xs' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-3 relative z-10 min-h-[380px]">
        {filteredFAQs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-slate-950/80 border border-slate-800/80 rounded-2xl overflow-hidden transition-all text-left rtl:text-right"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-900/60 transition-colors focus:outline-none"
              >
                <span className={`font-medium text-sm sm:text-base text-slate-100 leading-snug ${currentLang === 'ar' ? 'font-arabic font-semibold' : ''}`}>
                  {faq.question}
                </span>
                <span className="p-1.5 rounded-xl bg-slate-900 text-amber-400 border border-slate-800 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className={`px-4 pb-5 pt-3 sm:px-5 border-t border-slate-800/50 text-slate-300 text-xs sm:text-sm font-light leading-relaxed whitespace-pre-line animate-in fade-in duration-150 ${currentLang === 'ar' ? 'font-arabic leading-loose text-slate-200' : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Call To Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80 relative z-10">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{faqData.footerBadge}</span>
        </div>

        {onOpenQR && (
          <button
            onClick={onOpenQR}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl text-xs transition-all shadow-lg shadow-amber-500/10"
          >
            <QrCode className="w-4 h-4" />
            <span>{faqData.btnOpenQr}</span>
          </button>
        )}
      </div>

    </section>
  );
};