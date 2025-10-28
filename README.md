# NoteBoost AI - ノート記事分析ツール

<div align="center">

![NoteBoost AI](https://img.shields.io/badge/AI-Claude%20Sonnet%204.5-blue?style=for-the-badge&logo=anthropic)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-ISC-green?style=for-the-badge)

**Claude AI (Sonnet 4.5) を使用してnote.com記事を総合分析するWebアプリケーション**

[デモを見る](https://noteboost-ai.vercel.app) | [デプロイガイド](./DEPLOYMENT_GUIDE.md) | [セキュリティ監査](./SECURITY_AUDIT.md)

</div>

---

## ✨ 主な機能

### 🎯 包括的な記事分析
- **タイトル候補 5個**: SEO最適化されたキャッチーなタイトル
- **記事の要約**: 学べること、メリット、おすすめ読者を抽出
- **アイキャッチ画像アイデア**: DALL-E用プロンプト、構図案、カラーパレット
- **ハッシュタグ 20個**: note.comで検索されやすい最適なタグ
- **シリーズ記事案 3個**: 関連記事の提案

### 💾 便利な機能
- **テキスト形式エクスポート**: 分析結果を.txtファイルでダウンロード
- **ワンクリックコピー**: 個別のハッシュタグやタイトルを簡単コピー
- **レスポンシブデザイン**: モバイル、タブレット、デスクトップ対応
- **ダーク/ライトモード**: システム設定に自動追従

### 🔒 セキュリティ機能
- **認証システム**: 不正アクセス防止
- **レート制限**: API乱用防止（デフォルト: 5リクエスト/分）
- **入力サニタイゼーション**: XSS攻撃対策
- **HTTPSのみ**: 通信の暗号化

---

## 🚀 クイックスタート

### 前提条件
- Node.js 18.18.0以上
- npm または yarn
- Anthropic API キー ([取得はこちら](https://console.anthropic.com/settings/keys))

### インストール

```bash
# 1. リポジトリをクローン
git clone https://github.com/YOUR_USERNAME/noteboost-ai.git
cd noteboost-ai

# 2. 依存関係をインストール
npm install

# 3. 環境変数を設定
cp .env.example .env.local
# .env.local を編集して API キーを設定

# 4. 開発サーバーを起動
npm run dev

# 5. ブラウザで開く
# http://localhost:3000
```

### 環境変数の設定

`.env.local` ファイルを作成：

```bash
# 必須
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# オプション（デフォルト値）
API_RATE_LIMIT_MAX_REQUESTS=5
API_RATE_LIMIT_WINDOW_MS=60000
JWT_SECRET=your_jwt_secret_key_at_least_32_characters
```

---

## 📖 使い方

### ステップ1: ログイン
```
デフォルト認証情報（開発環境）
Username: admin
Password: password123
```
⚠️ **本番環境では必ず変更してください**

### ステップ2: 記事を入力
1. テキストエリアにnote記事の内容を貼り付け（最大30,000文字）
2. 「記事を分析する」ボタンをクリック

### ステップ3: 結果を確認
- タブを切り替えて各分析結果を確認
- 必要な部分をコピーして使用
- 全体をテキストファイルでダウンロード

---

## 🏗️ 技術スタック

### フロントエンド
- **Next.js 16.0** - React フレームワーク (App Router)
- **React 19.2** - UIライブラリ
- **TypeScript 5.9** - 型安全な開発
- **Tailwind CSS 4.1** - ユーティリティファーストCSS

### バックエンド
- **Next.js API Routes** - サーバーレス関数
- **Anthropic Claude API** - AI 分析エンジン (Sonnet 4.5)
- **Prisma ORM** - データベース管理（認証用）

### 認証・セキュリティ
- **JWT** - セッション管理
- **bcrypt** - パスワードハッシュ化
- **Rate Limiting** - API保護

---

## 📁 プロジェクト構造

```
noteboost-ai/
├── app/
│   ├── api/
│   │   ├── analyze-article-full/   # メイン分析API
│   │   └── auth/                   # 認証API
│   ├── components/
│   │   ├── features/               # 機能別コンポーネント
│   │   ├── layout/                 # レイアウトコンポーネント
│   │   └── ui/                     # 再利用可能UIコンポーネント
│   ├── hooks/                      # カスタムフック
│   ├── utils/                      # ユーティリティ関数
│   ├── constants/                  # 定数定義
│   └── types/                      # TypeScript型定義
├── lib/
│   ├── simpleAuth.ts              # 認証ロジック
│   ├── rateLimit.ts               # レート制限
│   └── validation.ts              # 入力検証
├── prisma/
│   └── schema.prisma              # データベーススキーマ
├── public/                        # 静的ファイル
├── .env.local                     # 環境変数（Git除外）
├── next.config.ts                 # Next.js設定
├── tailwind.config.ts             # Tailwind CSS設定
├── DEPLOYMENT_GUIDE.md            # デプロイガイド
├── SECURITY_AUDIT.md              # セキュリティ監査
└── README.md
```

---

## 🌐 本番デプロイ

### Vercel（推奨）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/noteboost-ai)

詳細は [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) を参照してください。

### 必要な環境変数
```bash
ANTHROPIC_API_KEY=your_key
JWT_SECRET=your_secret
API_RATE_LIMIT_MAX_REQUESTS=10
```

---

## 🔒 セキュリティ

### 実装済みセキュリティ機能
- ✅ API キーはサーバーサイドのみ
- ✅ 認証システム（JWT + HTTPOnly Cookie）
- ✅ レート制限（IPベース）
- ✅ 入力検証・サニタイゼーション
- ✅ XSS対策
- ✅ SQLインジェクション対策（Prisma ORM）
- ✅ HTTPS強制

詳細は [SECURITY_AUDIT.md](./SECURITY_AUDIT.md) を参照してください。

---

## 💰 コスト見積もり

### Vercelホスティング
- **無料プラン**: 月間数千ユーザーまで対応
- ビルド時間: 100時間/月
- 帯域幅: 100GB/月

### Anthropic API
- **Claude Sonnet 4.5**:
  - 入力: $3/1M トークン
  - 出力: $15/1M トークン
- **1記事あたり**: 約$0.035-0.05
- **月100記事**: 約$3-5
- **月1000記事**: 約$30-50

---

## 📊 パフォーマンス

### 最適化機能
- ✅ プロンプトキャッシング（90%コスト削減）
- ✅ max_tokens最適化（2400トークン）
- ✅ 簡潔なシステムプロンプト
- ✅ コード分割（Next.js自動）
- ✅ Vercel Edge Network

### 分析速度
- 平均: 30-40秒/記事
- トークン数: 入力2000-3000、出力2000-2400

---

## 🛠️ 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# リント実行
npm run lint

# 型チェック
npm run type-check
```

---

## 🐛 トラブルシューティング

### API キーエラー
```
API key is not configured
```
**解決策**: `.env.local` に正しいAPI キーを設定

### ビルドエラー
```bash
# キャッシュをクリア
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### 認証エラー
```
Authentication required
```
**解決策**: ログインページでデフォルト認証情報を入力

---

## 🤝 貢献

プルリクエストを歓迎します！

1. フォーク
2. フィーチャーブランチ作成 (`git checkout -b feature/amazing-feature`)
3. コミット (`git commit -m 'Add amazing feature'`)
4. プッシュ (`git push origin feature/amazing-feature`)
5. プルリクエスト作成

---

## 📝 ライセンス

ISC License - 詳細は [LICENSE](LICENSE) を参照

---

## 🙏 クレジット

- **AI**: [Anthropic Claude](https://www.anthropic.com/) (Sonnet 4.5)
- **フレームワーク**: [Next.js](https://nextjs.org/) 16.0
- **UI**: [Tailwind CSS](https://tailwindcss.com/) 4.1
- **デプロイ**: [Vercel](https://vercel.com/)

---

## 📮 サポート

問題や質問がある場合:
- GitHub Issues: [Create Issue](https://github.com/YOUR_USERNAME/noteboost-ai/issues)
- Email: support@example.com

---

<div align="center">

**Built with ❤️ using Claude AI and Next.js**

[⬆ トップに戻る](#noteboost-ai---ノート記事分析ツール)

</div>
