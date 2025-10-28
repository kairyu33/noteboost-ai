import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "note.com ハッシュタグ AI ジェネレーター",
  description: "Claude AIを使用してnote.com記事に最適なハッシュタグを自動生成します",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
        {/* Toast通知プロバイダー */}
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={4000}
          theme="system"
        />
        {/* Optimized devtools removal - less aggressive, stops after 30s */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                let removalCount = 0;
                let intervalId = null;
                let timeoutId = null;

                function removeDevtools() {
                  // Remove all possible devtools elements
                  const selectors = [
                    '[data-nextjs-dialog-overlay]',
                    '[data-nextjs-portal]',
                    'button[data-nextjs-app-router-devtools-button]',
                    'div[data-nextjs-devtools]',
                    'nextjs-portal',
                    '#__next-build-watcher',
                    'button[title*="Next.js"]',
                    'button[aria-label*="Next.js"]',
                    'button:has(kbd)',
                    '[class*="devtools"]',
                    '[id*="devtools"]'
                  ];

                  let removed = false;
                  selectors.forEach(selector => {
                    try {
                      const elements = document.querySelectorAll(selector);
                      elements.forEach(el => {
                        if (el && el.parentNode) {
                          el.parentNode.removeChild(el);
                          removed = true;
                        }
                      });
                    } catch (e) {}
                  });

                  // Check for buttons with "N" text that might be devtools
                  const buttons = document.querySelectorAll('button');
                  buttons.forEach(btn => {
                    const text = btn.textContent?.trim();
                    if (text === 'N' || btn.getAttribute('aria-label')?.includes('devtools')) {
                      if (btn.parentNode) {
                        btn.parentNode.removeChild(btn);
                        removed = true;
                      }
                    }
                  });

                  if (removed) {
                    removalCount++;
                  }
                }

                // Run immediately
                removeDevtools();

                // Run on DOM changes with debouncing
                if (typeof MutationObserver !== 'undefined') {
                  let debounceTimer = null;
                  const observer = new MutationObserver(() => {
                    if (debounceTimer) clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(removeDevtools, 100);
                  });
                  observer.observe(document.body, {
                    childList: true,
                    subtree: true
                  });
                }

                // Reduced polling frequency: 2000ms instead of 500ms (75% reduction in overhead)
                intervalId = setInterval(removeDevtools, 2000);

                // Stop aggressive checking after 30 seconds (devtools usually appear early)
                timeoutId = setTimeout(() => {
                  if (intervalId) {
                    clearInterval(intervalId);
                    console.log('[Devtools Removal] Stopped aggressive checking after 30s. Removed devtools', removalCount, 'times.');
                  }
                }, 30000);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
