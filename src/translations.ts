export type TranslationKey =
  | 'overview'
  | 'analysis'
  | 'specializedTools'
  | 'utilities'
  | 'productAnalytics'
  | 'newAnalysis'
  | 'workspaceReady'
  | 'searchTools'
  | 'language'
  | 'startWithData'
  | 'exploreModule'
  | 'recordsAnalyzed'
  | 'signalsFound'
  | 'dataQuality'
  | 'moduleHub'
  | 'moduleHubTitle'
  | 'fromRawData'
  | 'clearerNextMove'
  | 'analysisStudio'
  | 'giveDataShape'
  | 'loadSample'
  | 'bringTableIntoFocus'
  | 'runAnalysis'
  | 'csvOnly'
  | 'languageLab'
  | 'csvGenerator'
  | 'adminReviews'
  | 'multiAgentRouting'
  | 'productInspection'
  | 'predictiveVending'
  | 'heritageQc'
  | 'academicInbound'
  | 'startPractice'
  | 'generateDataset'
  | 'leaveReview'
  | 'localOnly'
  | 'backToOverview';

export const languageOptions = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'pt', label: 'Português' },
  { code: 'zh', label: '简体中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'ar', label: 'العربية' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'mr', label: 'मराठी' },
  { code: 'ru', label: 'Русский' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'it', label: 'Italiano' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'pl', label: 'Polski' },
  { code: 'uk', label: 'Українська' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'th', label: 'ไทย' },
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'ms', label: 'Bahasa Melayu' },
  { code: 'sw', label: 'Kiswahili' },
  { code: 'ur', label: 'اردو' },
  { code: 'fa', label: 'فارسی' },
  { code: 'el', label: 'Ελληνικά' },
  { code: 'he', label: 'עברית' },
  { code: 'sv', label: 'Svenska' },
  { code: 'da', label: 'Dansk' },
  { code: 'no', label: 'Norsk' },
  { code: 'fi', label: 'Suomi' },
  { code: 'cs', label: 'Čeština' },
  { code: 'ro', label: 'Română' },
  { code: 'hu', label: 'Magyar' },
  { code: 'fil', label: 'Filipino' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'ne', label: 'नेपाली' },
  { code: 'si', label: 'සිංහල' },
  { code: 'as', label: 'অসমীয়া' },
  { code: 'or', label: 'ଓଡ଼ିଆ' },
  { code: 'my', label: 'မြန်မာ' },
  { code: 'km', label: 'ខ្មែរ' },
  { code: 'lo', label: 'ລາວ' },
  { code: 'mn', label: 'Монгол' },
  { code: 'sr', label: 'Српски' },
  { code: 'hr', label: 'Hrvatski' },
  { code: 'sk', label: 'Slovenčina' },
  { code: 'bg', label: 'Български' },
  { code: 'ca', label: 'Català' },
  { code: 'et', label: 'Eesti' },
  { code: 'lv', label: 'Latviešu' },
  { code: 'lt', label: 'Lietuvių' },
  { code: 'sl', label: 'Slovenščina' },
  { code: 'is', label: 'Íslenska' },
  { code: 'swb', label: 'Shikomori' },
  { code: 'am', label: 'አማርኛ' },
  { code: 'yo', label: 'Yorùbá' },
  { code: 'zu', label: 'isiZulu' },
] as const;

const english: Record<TranslationKey, string> = {
  overview: 'Overview',
  analysis: 'Analysis',
  specializedTools: 'Specialized tools',
  utilities: 'Utilities',
  productAnalytics: 'Product analytics',
  newAnalysis: 'New analysis',
  workspaceReady: 'Workspace ready',
  searchTools: 'Search tools',
  language: 'Language',
  startWithData: 'Start with data',
  exploreModule: 'Explore a module',
  recordsAnalyzed: 'Records analyzed',
  signalsFound: 'Useful signals found',
  dataQuality: 'Average data quality',
  moduleHub: 'The module hub',
  moduleHubTitle: 'A focused tool for every kind of question',
  fromRawData: 'From raw data to a',
  clearerNextMove: 'clearer next move.',
  analysisStudio: 'Analysis studio',
  giveDataShape: 'Give your data a useful shape.',
  loadSample: 'Load sample data',
  bringTableIntoFocus: 'Bring a table into focus',
  runAnalysis: 'Run grounded analysis',
  csvOnly: 'CSV only',
  languageLab: 'Language lab',
  csvGenerator: 'CSV generator',
  adminReviews: 'Admin reviews',
  multiAgentRouting: 'Multi-agent routing',
  productInspection: 'Product inspection',
  predictiveVending: 'Predictive vending',
  heritageQc: 'Heritage QC',
  academicInbound: 'Academic inbound',
  startPractice: 'Start practice',
  generateDataset: 'Generate dataset',
  leaveReview: 'Leave a review',
  localOnly: 'Local only',
  backToOverview: 'Back to overview',
};

const packs: Record<string, Partial<Record<TranslationKey, string>>> = {
  hi: { overview: 'अवलोकन', analysis: 'विश्लेषण', specializedTools: 'विशेष उपकरण', utilities: 'उपयोगिताएँ', productAnalytics: 'उत्पाद विश्लेषण', newAnalysis: 'नया विश्लेषण', workspaceReady: 'वर्कस्पेस तैयार है', searchTools: 'टूल खोजें', language: 'भाषा', startWithData: 'डेटा से शुरू करें', exploreModule: 'मॉड्यूल देखें', recordsAnalyzed: 'विश्लेषित रिकॉर्ड', signalsFound: 'मिले उपयोगी संकेत', dataQuality: 'औसत डेटा गुणवत्ता', moduleHub: 'मॉड्यूल हब', moduleHubTitle: 'हर सवाल के लिए एक केंद्रित टूल', fromRawData: 'कच्चे डेटा से', clearerNextMove: 'अगला कदम स्पष्ट करें', analysisStudio: 'विश्लेषण स्टूडियो', giveDataShape: 'अपने डेटा को उपयोगी आकार दें', loadSample: 'सैंपल डेटा लोड करें', bringTableIntoFocus: 'टेबल को फोकस में लाएँ', runAnalysis: 'विश्लेषण चलाएँ', csvOnly: 'केवल CSV', languageLab: 'भाषा लैब', csvGenerator: 'CSV जनरेटर', adminReviews: 'एडमिन रिव्यू', multiAgentRouting: 'मल्टी-एजेंट रूटिंग', productInspection: 'उत्पाद निरीक्षण', predictiveVending: 'पूर्वानुमानित वेंडिंग', heritageQc: 'विरासत QC', academicInbound: 'अकादमिक इनबाउंड', startPractice: 'अभ्यास शुरू करें', generateDataset: 'डेटासेट बनाएँ', leaveReview: 'रिव्यू दें', localOnly: 'केवल स्थानीय', backToOverview: 'अवलोकन पर वापस जाएँ' },
  es: { overview: 'Resumen', analysis: 'Análisis', specializedTools: 'Herramientas especializadas', utilities: 'Utilidades', productAnalytics: 'Analítica del producto', newAnalysis: 'Nuevo análisis', workspaceReady: 'Espacio listo', searchTools: 'Buscar herramientas', language: 'Idioma', startWithData: 'Empezar con datos', exploreModule: 'Explorar un módulo', recordsAnalyzed: 'Registros analizados', signalsFound: 'Señales útiles', dataQuality: 'Calidad media de datos', moduleHub: 'Centro de módulos', moduleHubTitle: 'Una herramienta para cada pregunta', fromRawData: 'De datos sin procesar a un', clearerNextMove: 'siguiente paso más claro.', analysisStudio: 'Estudio de análisis', giveDataShape: 'Dale una forma útil a tus datos', loadSample: 'Cargar datos de ejemplo', bringTableIntoFocus: 'Enfoca una tabla', runAnalysis: 'Ejecutar análisis', csvOnly: 'Solo CSV', languageLab: 'Laboratorio de idiomas', csvGenerator: 'Generador CSV', adminReviews: 'Reseñas de admin', multiAgentRouting: 'Enrutamiento multiagente', productInspection: 'Inspección de productos', predictiveVending: 'Vending predictivo', heritageQc: 'QC de patrimonio', academicInbound: 'Entrada académica', startPractice: 'Empezar práctica', generateDataset: 'Generar conjunto', leaveReview: 'Dejar una reseña', localOnly: 'Solo local', backToOverview: 'Volver al resumen' },
  fr: { overview: 'Vue d’ensemble', analysis: 'Analyse', specializedTools: 'Outils spécialisés', utilities: 'Utilitaires', productAnalytics: 'Analytique produit', newAnalysis: 'Nouvelle analyse', workspaceReady: 'Espace prêt', searchTools: 'Rechercher des outils', language: 'Langue', startWithData: 'Commencer avec des données', exploreModule: 'Explorer un module', recordsAnalyzed: 'Enregistrements analysés', signalsFound: 'Signaux utiles', dataQuality: 'Qualité moyenne des données', moduleHub: 'Hub des modules', moduleHubTitle: 'Un outil ciblé pour chaque question', fromRawData: 'Des données brutes vers un', clearerNextMove: 'prochain pas plus clair.', analysisStudio: 'Studio d’analyse', giveDataShape: 'Donnez une forme utile à vos données', loadSample: 'Charger un exemple', bringTableIntoFocus: 'Mettre une table au point', runAnalysis: 'Lancer l’analyse', csvOnly: 'CSV uniquement', languageLab: 'Laboratoire de langues', csvGenerator: 'Générateur CSV', adminReviews: 'Avis administrateur', multiAgentRouting: 'Routage multi-agents', productInspection: 'Inspection produit', predictiveVending: 'Vente prédictive', heritageQc: 'QC du patrimoine', academicInbound: 'Entrées académiques', startPractice: 'Commencer la pratique', generateDataset: 'Générer un jeu de données', leaveReview: 'Laisser un avis', localOnly: 'Local uniquement', backToOverview: 'Retour à la vue d’ensemble' },
  de: { overview: 'Übersicht', analysis: 'Analyse', specializedTools: 'Spezialwerkzeuge', utilities: 'Werkzeuge', productAnalytics: 'Produktanalyse', newAnalysis: 'Neue Analyse', workspaceReady: 'Arbeitsbereich bereit', searchTools: 'Werkzeuge suchen', language: 'Sprache', startWithData: 'Mit Daten starten', exploreModule: 'Modul erkunden', recordsAnalyzed: 'Analysierte Datensätze', signalsFound: 'Nützliche Signale', dataQuality: 'Durchschnittliche Datenqualität', moduleHub: 'Modul-Hub', moduleHubTitle: 'Ein fokussiertes Werkzeug für jede Frage', fromRawData: 'Von Rohdaten zum', clearerNextMove: 'klareren nächsten Schritt.', analysisStudio: 'Analyse-Studio', giveDataShape: 'Gib deinen Daten eine nützliche Form', loadSample: 'Beispieldaten laden', bringTableIntoFocus: 'Tabelle in den Fokus bringen', runAnalysis: 'Analyse starten', csvOnly: 'Nur CSV', languageLab: 'Sprachlabor', csvGenerator: 'CSV-Generator', adminReviews: 'Admin-Bewertungen', multiAgentRouting: 'Multi-Agenten-Routing', startPractice: 'Übung starten', generateDataset: 'Datensatz erstellen', leaveReview: 'Bewertung abgeben', localOnly: 'Nur lokal', backToOverview: 'Zur Übersicht' },
  pt: { overview: 'Visão geral', analysis: 'Análise', specializedTools: 'Ferramentas especializadas', utilities: 'Utilidades', productAnalytics: 'Análise do produto', newAnalysis: 'Nova análise', workspaceReady: 'Espaço pronto', searchTools: 'Pesquisar ferramentas', language: 'Idioma', startWithData: 'Começar com dados', exploreModule: 'Explorar um módulo', recordsAnalyzed: 'Registros analisados', signalsFound: 'Sinais úteis', dataQuality: 'Qualidade média dos dados', moduleHub: 'Central de módulos', moduleHubTitle: 'Uma ferramenta focada para cada pergunta', fromRawData: 'Dos dados brutos ao', clearerNextMove: 'próximo passo mais claro.', analysisStudio: 'Estúdio de análise', giveDataShape: 'Dê uma forma útil aos seus dados', loadSample: 'Carregar dados de exemplo', bringTableIntoFocus: 'Focar uma tabela', runAnalysis: 'Executar análise', csvOnly: 'Somente CSV', languageLab: 'Laboratório de idiomas', csvGenerator: 'Gerador de CSV', adminReviews: 'Avaliações do admin', multiAgentRouting: 'Roteamento multiagente', startPractice: 'Começar prática', generateDataset: 'Gerar conjunto de dados', leaveReview: 'Deixar avaliação', localOnly: 'Somente local', backToOverview: 'Voltar à visão geral' },
  zh: { overview: '概览', analysis: '分析', specializedTools: '专用工具', utilities: '实用工具', productAnalytics: '产品分析', newAnalysis: '新分析', workspaceReady: '工作区已准备好', searchTools: '搜索工具', language: '语言', startWithData: '从数据开始', exploreModule: '探索模块', recordsAnalyzed: '已分析记录', signalsFound: '有用信号', dataQuality: '平均数据质量', moduleHub: '模块中心', moduleHubTitle: '每个问题都有专注的工具', fromRawData: '从原始数据到', clearerNextMove: '更清晰的下一步。', analysisStudio: '分析工作室', giveDataShape: '让数据呈现有用的形状', loadSample: '加载示例数据', bringTableIntoFocus: '聚焦表格', runAnalysis: '运行分析', csvOnly: '仅 CSV', languageLab: '语言实验室', csvGenerator: 'CSV 生成器', adminReviews: '管理员评价', multiAgentRouting: '多代理路由', startPractice: '开始练习', generateDataset: '生成数据集', leaveReview: '留下评价', localOnly: '仅本地', backToOverview: '返回概览' },
  ja: { overview: '概要', analysis: '分析', specializedTools: '専門ツール', utilities: 'ユーティリティ', productAnalytics: 'プロダクト分析', newAnalysis: '新しい分析', workspaceReady: 'ワークスペース準備完了', searchTools: 'ツールを検索', language: '言語', startWithData: 'データから始める', exploreModule: 'モジュールを見る', recordsAnalyzed: '分析済みレコード', signalsFound: '有用なシグナル', dataQuality: '平均データ品質', moduleHub: 'モジュールハブ', moduleHubTitle: 'あらゆる問いに応える専用ツール', fromRawData: '生データから', clearerNextMove: 'より明確な次の一手へ。', analysisStudio: '分析スタジオ', giveDataShape: 'データを役立つ形にする', loadSample: 'サンプルデータを読み込む', bringTableIntoFocus: 'テーブルに焦点を合わせる', runAnalysis: '分析を実行', csvOnly: 'CSVのみ', languageLab: '言語ラボ', csvGenerator: 'CSVジェネレーター', adminReviews: '管理者レビュー', multiAgentRouting: 'マルチエージェントルーティング', startPractice: '練習を始める', generateDataset: 'データセットを生成', leaveReview: 'レビューを書く', localOnly: 'ローカルのみ', backToOverview: '概要に戻る' },
  ko: { overview: '개요', analysis: '분석', specializedTools: '전문 도구', utilities: '유틸리티', productAnalytics: '제품 분석', newAnalysis: '새 분석', workspaceReady: '워크스페이스 준비 완료', searchTools: '도구 검색', language: '언어', startWithData: '데이터로 시작', exploreModule: '모듈 탐색', recordsAnalyzed: '분석한 레코드', signalsFound: '유용한 신호', dataQuality: '평균 데이터 품질', moduleHub: '모듈 허브', moduleHubTitle: '모든 질문을 위한 집중 도구', fromRawData: '원시 데이터에서', clearerNextMove: '더 명확한 다음 단계로.', analysisStudio: '분석 스튜디오', giveDataShape: '데이터를 유용한 형태로 만들기', loadSample: '샘플 데이터 불러오기', bringTableIntoFocus: '표에 집중하기', runAnalysis: '분석 실행', csvOnly: 'CSV 전용', languageLab: '언어 실험실', csvGenerator: 'CSV 생성기', adminReviews: '관리자 리뷰', multiAgentRouting: '멀티 에이전트 라우팅', startPractice: '연습 시작', generateDataset: '데이터셋 생성', leaveReview: '리뷰 남기기', localOnly: '로컬 전용', backToOverview: '개요로 돌아가기' },
  ar: { overview: 'نظرة عامة', analysis: 'تحليل', specializedTools: 'أدوات متخصصة', utilities: 'أدوات مساعدة', productAnalytics: 'تحليلات المنتج', newAnalysis: 'تحليل جديد', workspaceReady: 'مساحة العمل جاهزة', searchTools: 'البحث عن أدوات', language: 'اللغة', startWithData: 'ابدأ بالبيانات', exploreModule: 'استكشف وحدة', recordsAnalyzed: 'السجلات المحللة', signalsFound: 'إشارات مفيدة', dataQuality: 'متوسط جودة البيانات', moduleHub: 'مركز الوحدات', moduleHubTitle: 'أداة مركزة لكل سؤال', fromRawData: 'من البيانات الخام إلى', clearerNextMove: 'خطوة تالية أوضح.', analysisStudio: 'استوديو التحليل', giveDataShape: 'امنح بياناتك شكلاً مفيداً', loadSample: 'تحميل بيانات نموذجية', bringTableIntoFocus: 'تركيز جدول', runAnalysis: 'تشغيل التحليل', csvOnly: 'CSV فقط', languageLab: 'مختبر اللغات', csvGenerator: 'مولد CSV', adminReviews: 'مراجعات المشرف', multiAgentRouting: 'توجيه متعدد الوكلاء', startPractice: 'ابدأ التدريب', generateDataset: 'إنشاء مجموعة بيانات', leaveReview: 'اترك مراجعة', localOnly: 'محلي فقط', backToOverview: 'العودة إلى النظرة العامة' },
  ru: { overview: 'Обзор', analysis: 'Анализ', specializedTools: 'Специализированные инструменты', utilities: 'Утилиты', productAnalytics: 'Аналитика продукта', newAnalysis: 'Новый анализ', workspaceReady: 'Рабочее пространство готово', searchTools: 'Поиск инструментов', language: 'Язык', startWithData: 'Начать с данных', exploreModule: 'Открыть модуль', recordsAnalyzed: 'Записей проанализировано', signalsFound: 'Полезные сигналы', dataQuality: 'Среднее качество данных', moduleHub: 'Центр модулей', moduleHubTitle: 'Инструмент для каждого вопроса', fromRawData: 'От необработанных данных к', clearerNextMove: 'более ясному следующему шагу.', analysisStudio: 'Студия анализа', giveDataShape: 'Придайте данным полезную форму', loadSample: 'Загрузить пример', bringTableIntoFocus: 'Сфокусировать таблицу', runAnalysis: 'Запустить анализ', csvOnly: 'Только CSV', languageLab: 'Языковая лаборатория', csvGenerator: 'Генератор CSV', adminReviews: 'Отзывы администратора', multiAgentRouting: 'Маршрутизация агентов', startPractice: 'Начать практику', generateDataset: 'Создать набор данных', leaveReview: 'Оставить отзыв', localOnly: 'Только локально', backToOverview: 'Вернуться к обзору' },
  tr: { overview: 'Genel bakış', analysis: 'Analiz', specializedTools: 'Özel araçlar', utilities: 'Yardımcı araçlar', productAnalytics: 'Ürün analitiği', newAnalysis: 'Yeni analiz', workspaceReady: 'Çalışma alanı hazır', searchTools: 'Araçlarda ara', language: 'Dil', startWithData: 'Verilerle başla', exploreModule: 'Modülü keşfet', recordsAnalyzed: 'Analiz edilen kayıtlar', signalsFound: 'Faydalı sinyaller', dataQuality: 'Ortalama veri kalitesi', moduleHub: 'Modül merkezi', moduleHubTitle: 'Her soru için odaklanmış bir araç', fromRawData: 'Ham veriden', clearerNextMove: 'daha net bir sonraki adıma.', analysisStudio: 'Analiz stüdyosu', giveDataShape: 'Verilerinize faydalı bir şekil verin', loadSample: 'Örnek veriyi yükle', bringTableIntoFocus: 'Tabloya odaklan', runAnalysis: 'Analizi çalıştır', csvOnly: 'Yalnızca CSV', languageLab: 'Dil laboratuvarı', csvGenerator: 'CSV oluşturucu', adminReviews: 'Yönetici yorumları', multiAgentRouting: 'Çoklu ajan yönlendirme', startPractice: 'Pratiğe başla', generateDataset: 'Veri kümesi oluştur', leaveReview: 'Yorum bırak', localOnly: 'Yalnızca yerel', backToOverview: 'Genel bakışa dön' },
  bn: { overview: 'ওভারভিউ', analysis: 'বিশ্লেষণ', specializedTools: 'বিশেষায়িত টুল', utilities: 'ইউটিলিটি', productAnalytics: 'পণ্য বিশ্লেষণ', newAnalysis: 'নতুন বিশ্লেষণ', workspaceReady: 'ওয়ার্কস্পেস প্রস্তুত', searchTools: 'টুল খুঁজুন', language: 'ভাষা', startWithData: 'ডেটা দিয়ে শুরু করুন', exploreModule: 'মডিউল দেখুন', recordsAnalyzed: 'বিশ্লেষিত রেকর্ড', signalsFound: 'উপযোগী সংকেত', dataQuality: 'গড় ডেটা মান', moduleHub: 'মডিউল হাব', moduleHubTitle: 'প্রতিটি প্রশ্নের জন্য একটি নির্দিষ্ট টুল', fromRawData: 'কাঁচা ডেটা থেকে', clearerNextMove: 'আরও স্পষ্ট পরবর্তী পদক্ষেপে।', analysisStudio: 'বিশ্লেষণ স্টুডিও', giveDataShape: 'আপনার ডেটাকে কার্যকর আকার দিন', loadSample: 'নমুনা ডেটা লোড করুন', bringTableIntoFocus: 'টেবিলে ফোকাস করুন', runAnalysis: 'বিশ্লেষণ চালান', csvOnly: 'শুধু CSV', languageLab: 'ভাষা ল্যাব', csvGenerator: 'CSV জেনারেটর', adminReviews: 'অ্যাডমিন রিভিউ', multiAgentRouting: 'মাল্টি-এজেন্ট রাউটিং', startPractice: 'অনুশীলন শুরু করুন', generateDataset: 'ডেটাসেট তৈরি করুন', leaveReview: 'রিভিউ দিন', localOnly: 'শুধু স্থানীয়', backToOverview: 'ওভারভিউতে ফিরুন' },
};

export function translate(locale: string, key: TranslationKey) {
  return packs[locale]?.[key] ?? english[key];
}