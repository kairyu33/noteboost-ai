/**
 * Home Page - Component-Based Architecture
 *
 * @description Main application page using composable components
 * Demonstrates clean separation of concerns and reusability
 *
 * Refactored from 700-line monolithic component to ~100 lines
 * with clean, maintainable architecture and text export functionality
 */

'use client';

import { useState } from 'react';
import { MainLayout } from '@/app/components/layout';
import { Container, Section } from '@/app/components/layout';
import { ArticleInput, AnalysisResults, Header, Footer } from '@/app/components/features';
import { useAnalysis } from '@/app/hooks/useAnalysis';

/**
 * Home page component
 *
 * @description Orchestrates the article analysis workflow
 * All UI logic is delegated to specialized components
 */
export default function HomePage() {
  const [articleText, setArticleText] = useState('');
  const { analyze, data, loading, error, clearError } = useAnalysis();

  /**
   * Handle article analysis
   */
  const handleAnalyze = async () => {
    await analyze(articleText);
  };

  return (
    <MainLayout>
      {/* Full-screen Loading Overlay - Only show during analysis */}
      {loading && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
          <div className="text-center max-w-md w-full px-8">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 mb-4 animate-pulse">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              記事を分析中...
            </h2>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full animate-progress-bar"></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              タイトル、要約、ハッシュタグを生成しています
            </p>
          </div>
        </div>
      )}

      {/* Main Content - Hide during loading */}
      {!loading && (
        <Section>
          <Container maxWidth="7xl">
            <Header />

            <ArticleInput
              value={articleText}
              onChange={setArticleText}
              onAnalyze={handleAnalyze}
              loading={loading}
              error={error}
              onClearError={clearError}
            />

            {data && <AnalysisResults data={data} />}

            <Footer />
          </Container>
        </Section>
      )}
    </MainLayout>
  );
}
