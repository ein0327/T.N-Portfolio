// js/i18n.js

const translations = {
    ja: {
        hero_text: `モダンな技術と洗練されたデザインで、<br>ユーザーの心を動かすWebサイトを構築します。`,
        about_heading: `デザインとビジネスの架け橋`,
        about_desc: `「ビジネスの課題解決」と「心を動かすユーザー体験」を両立するWeb制作を得意としています。美しいデザインを高い技術力で忠実に再現し、細部にまでこだわったなめらかな操作感が、プロダクトの信頼性とブランド価値を大きく高めると信じています。`,
        // Skills
        skill_1_title: `Scalable Web Creation`,
        skill_1_desc: `最新テクノロジーを活用し、スマートフォンからPCまであらゆる環境で高速かつ安定して動作する、ビジネスの基盤となるWebサイト・アプリケーションを提供します。`,
        skill_2_title: `Immersive Digital Experience`,
        skill_2_desc: `洗練されたデザイン美学と滑らかなアニメーションを融合。ただ情報を伝えるだけでなく、ユーザーの記憶に残り、ブランドのファンを生み出すリッチなデジタル体験を創出します。`,
        skill_3_title: `User-Centric Performance`,
        skill_3_desc: `離脱率を下げる表示速度の最適化（SEO）はもちろん、誰もが迷わず目的を達成できるアクセシビリティ（a11y）にも配慮。ビジネス成果に直結する高品質な設計を行います。`,
        // Sphere
        'sphere_subtitle': '球体にホバーすると、数学とコードが織りなす魔法に触れられます。',
        // Works
        'featured_subtitle': '実装技術やUI/UXデザインのアイデアを形にしたサンプルプロジェクトです。',
        'swipe_hint': '横にスワイプして見る',
        'work1_title': 'BtoB向け データ分析ダッシュボード（Demo）',
        work1_desc: `エンタープライズ向けの洗練されたUIレイアウト設計のサンプル。複雑なデータを直感的に可視化する管理画面のモックアップ。`,
        work2_title: `モダンアパレルECプラットフォーム（Demo）`,
        work2_desc: `ヘッドレスコマース構成を想定したUIの実装実験。シームレスな商品検索と決済フローの表現。`,
        work3_title: `クリエイティブスタジオ 公式サイト（Demo）`,
        work3_desc: `エッジの効いたタイポグラフィとブルータリズムを取り入れた実験的なデザイン。ブランドの独自性を強調する表現のサンプル。`,
        work4_title: `メッセージングアプリ LP開発（Demo）`,
        work4_desc: `ポップで親しみやすい世界観を3Dイラストを用いて表現した架空のLP。スクロール連動のマイクロインタラクションのデモ。`,
        work5_title: `総合コンサルティングファーム サイト（Demo）`,
        work5_desc: `信頼感と重厚感を重視したBtoB向けコーポレートデザインのサンプル。堅牢な情報アーキテクチャの表現。`,
        work6_title: `高級不動産ポータルプラットフォーム（Demo）`,
        work6_desc: `富裕層向け不動産の検索・閲覧を想定したプロトタイプ。高品質な画像表示とモダンな検索UIの実験。`,
        contact_text: `新しいプロジェクトのご相談、協業のお誘いなど、お気軽にご連絡ください。<br>素晴らしいプロダクトを一緒に作り上げましょう。`
    },
    en: {
        hero_text: `Building websites that move users' hearts with<br>modern technology and sophisticated design.`,
        about_heading: `A Bridge Between Design and Business`,
        about_desc: `I specialize in crafting web experiences that bridge business goals with emotional user engagement. By translating beautiful designs into high-quality interactive products, I believe attention to detail greatly elevates a brand's value and reliability.`,
        // Skills
        skill_1_title: `Scalable Web Creation`,
        skill_1_desc: `Leveraging modern web technologies to provide robust and fast-loading web applications across all devices, forming a solid and scalable foundation for your business.`,
        skill_2_title: `Immersive Digital Experience`,
        skill_2_desc: `Fusing refined design aesthetics with smooth animations. Going beyond mere information delivery to create engaging digital experiences that cultivate brand fans and leave a lasting impression.`,
        skill_3_title: `User-Centric Performance`,
        skill_3_desc: `Optimizing loading speed for SEO and ensuring accessibility (a11y) so anyone can achieve their goals without friction. We engineer high-quality solutions designed to drive business growth.`,
        // Sphere
        'sphere_subtitle': 'Hover over the sphere to interact with mathematics and code.',
        // Works
        'featured_subtitle': 'A collection of sample projects demonstrating implementation techniques and UI/UX design ideas.',
        'swipe_hint': 'Swipe to explore',
        'work1_title': 'B2B Data Analytics Dashboard (Demo)',
        work1_desc: `A sample of sophisticated UI layout design tailored for enterprises. A mock-up management interface visualizing complex data.`,
        work2_title: `Modern Apparel E-commerce (Demo)`,
        work2_desc: `An experimental UI implementation assuming a headless commerce architecture. Demonstrates seamless product search and checkout flows.`,
        work3_title: `Creative Studio Official Site (Demo)`,
        work3_desc: `An experimental design incorporating edgy typography and brutalism. A sample expression emphasizing brand identity.`,
        work4_title: `Messaging App Landing Page (Demo)`,
        work4_desc: `A fictional LP expressing a pop worldview using 3D illustrations. A demonstration of scroll-linked micro-interactions.`,
        work5_title: `Comprehensive Consulting Firm Site (Demo)`,
        work5_desc: `A corporate design sample for B2B emphasizing trust and profoundness. Expresses a robust information architecture.`,
        work6_title: `Luxury Real Estate Portal Platform (Demo)`,
        work6_desc: `A prototype for a luxury real estate search application. An experiment involving high-quality image display and modern search UI.`,
        contact_text: `Please feel free to contact me for new project consultations, collaboration requests, or anything else.<br>Let's build a great product together.`
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const langBtns = document.querySelectorAll('.lang-btn');
    
    // Check local storage for language preference
    let currentLang = localStorage.getItem('portfolio_lang') || 'ja';
    
    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('portfolio_lang', lang);
        
        // Update document lang attribute
        document.documentElement.lang = lang;
        
        // Update active button state
        langBtns.forEach(btn => {
            if(btn.dataset.lang === lang) {
                btn.classList.add('is-active');
            } else {
                btn.classList.remove('is-active');
            }
        });
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // Update all elements with inline data-ja/data-en attributes (for Demo pages)
        document.querySelectorAll('[data-en][data-ja]').forEach(el => {
            const translatedText = el.getAttribute(`data-${lang}`);
            if (translatedText) {
                el.innerHTML = translatedText;
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-ja-placeholder][data-en-placeholder]').forEach(el => {
            const translatedPlaceholder = el.getAttribute(`data-${lang}-placeholder`);
            if (translatedPlaceholder) {
                el.setAttribute('placeholder', translatedPlaceholder);
            }
        });
    }

    // Attach click events to buttons
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
             const lang = btn.dataset.lang;
             if (lang !== currentLang) {
                 setLanguage(lang);
             }
        });
    });
    
    // Initial language setup
    setLanguage(currentLang);
});
