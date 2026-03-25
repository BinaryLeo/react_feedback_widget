import { Brain, Camera, Translate, ArrowRight, Rocket, Bug, Lightbulb, Question } from '@phosphor-icons/react';
import { useAppStore } from '../lib/store';
import { t, supportedLanguages } from '../lib/i18n';
import { SafeHtml } from './SafeHtml';

export default function HomeContent() {
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const widgetPosition = useAppStore((state) => state.widgetPosition);

  // Push dropdown left if widget button occupies the top-right corner
  const dropdownRight = widgetPosition === 'top-right' ? 'right-24' : 'right-4';

  return (
    <>
      {/* Language Selector */}
      <div className={`fixed top-4 ${dropdownRight} z-40 transition-all duration-200`}>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as any)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {supportedLanguages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Demo Page Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('home.title', language)}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('home.subtitle', language)}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
              <Brain size={24} weight="regular" className="text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('home.feature_ai_title', language)}</h3>
            <p className="text-gray-600">{t('home.feature_ai_desc', language)}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <Camera size={24} weight="regular" className="text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('home.feature_vision_title', language)}</h3>
            <p className="text-gray-600">{t('home.feature_vision_desc', language)}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
              <Translate size={24} weight="regular" className="text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('home.feature_i18n_title', language)}</h3>
            <p className="text-gray-600">{t('home.feature_i18n_desc', language)}</p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <a href="/admin" className="group bg-gray-900 text-white p-8 rounded-2xl hover:bg-gray-800 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-2">{t('home.dashboard_title', language)}</h2>
                <p className="text-gray-400">{t('home.dashboard_desc', language)}</p>
              </div>
              <ArrowRight size={22} weight="regular" className="group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          </a>

          <a href="/settings" className="group bg-purple-600 text-white p-8 rounded-2xl hover:bg-purple-700 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-2">{t('home.settings_title', language)}</h2>
                <p className="text-purple-200">{t('home.settings_desc', language)}</p>
              </div>
              <ArrowRight size={22} weight="regular" className="group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          </a>
        </div>

        {/* Instructions */}
        <div className="bg-linear-to-br from-gray-50 to-purple-50 border border-purple-100 p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
            <Rocket size={24} weight="regular" className="text-purple-500" />
            {t('home.quick_start', language)}
          </h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold text-sm shrink-0">1</span>
              <p>{t('home.step_1', language)}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold text-sm shrink-0">2</span>
              <p>{t('home.step_2', language)}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold text-sm shrink-0">3</span>
              <p>{t('home.step_3', language)}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold text-sm shrink-0">4</span>
              <p>
                <SafeHtml content={t('home.step_4', language)} />
              </p>
            </div>
          </div>
        </div>

        {/* Try Widget */}
        <div className="bg-gray-900 text-white p-8 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-4">{t('home.try_it', language)}</h2>
          <p className="text-gray-300 mb-6">
            {t('home.try_it_desc', language)}
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Bug size={16} weight="regular" className="text-red-400" />
              <span>{t('home.report_bug', language)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Lightbulb size={16} weight="regular" className="text-yellow-400" />
              <span>{t('home.share_idea', language)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Question size={16} weight="regular" className="text-blue-400" />
              <span>{t('home.ask_question', language)}</span>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-16 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('home.tech_stack', language)}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200">
              Astro 5
            </span>
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200">
              React 19
            </span>
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200">
              Tailwind CSS 4
            </span>
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200">
              Zustand
            </span>
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200">
              Moonshot AI
            </span>
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200">
              Claude AI
            </span>
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200">
              PostgreSQL
            </span>
          </div>
        </div>
      </main>
    </>
  );
}
