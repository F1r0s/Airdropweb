import { SupportedLanguage } from '../types';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  category: 'general' | 'cross-platform' | 'connection-methods' | 'windows-chrome';
}

export interface FAQMatrixCard {
  direction: string;
  title: string;
  description: string;
  type: 'android-iphone' | 'iphone-android' | 'android-pc' | 'pc-iphone';
}

export interface FAQConnectionWay {
  step: string;
  title: string;
  description: string;
}

export interface FAQCategoryTab {
  id: string;
  label: string;
}

export interface FAQLanguageData {
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  description: string;
  cards: FAQMatrixCard[];
  connectionTitle: string;
  connectionWays: FAQConnectionWay[];
  categories: FAQCategoryTab[];
  items: FAQItem[];
  footerBadge: string;
  btnOpenQr: string;
}

export const FAQ_TRANSLATIONS: Record<SupportedLanguage, FAQLanguageData> = {
  en: {
    badge: 'Frequently Asked Questions & SEO Guide',
    titlePrefix: 'AirDrop Online ',
    titleHighlight: 'Cross-Platform',
    titleSuffix: ' Transfer Guide',
    description: 'Everything you need to know about using this free airdrop alternative online to stream files, 4K videos, RAW photos, and clipboard notes between Android, iPhone, Windows PC, Mac, and Chrome.',
    cards: [
      {
        direction: 'Android ➔ iPhone',
        title: 'Android to iPhone Online',
        description: 'Send photos and files directly from Samsung or Pixel to iOS devices with zero app install.',
        type: 'android-iphone'
      },
      {
        direction: 'iPhone ➔ Android',
        title: 'iPhone to Android Online',
        description: 'AirDrop files from iOS Safari browser straight to any Android smartphone or tablet.',
        type: 'iphone-android'
      },
      {
        direction: 'Android ➔ PC',
        title: 'Android to PC / Windows',
        description: 'Stream full 4K video clips and documents from phone to Windows 11 Chrome browser.',
        type: 'android-pc'
      },
      {
        direction: 'PC ➔ iPhone',
        title: 'AirDrop PC to iPhone',
        description: 'Drag and drop files from Windows or Mac PC directly to iPhone browser without iTunes.',
        type: 'pc-iphone'
      }
    ],
    connectionTitle: '3 Fast Ways to Connect & Share Room Session',
    connectionWays: [
      {
        step: '1',
        title: 'Scan QR Code',
        description: 'Scan on-screen QR code with iPhone or Android camera app to open room automatically.'
      },
      {
        step: '2',
        title: 'Copy / Type Room Code',
        description: 'Enter session code (e.g., room-vuxao8) into Join Code on target device.'
      },
      {
        step: '3',
        title: 'Direct Session Link',
        description: 'Copy and send direct session URL link to open in any web browser instantly.'
      }
    ],
    categories: [
      { id: 'all', label: 'All Questions' },
      { id: 'general', label: 'General & Free' },
      { id: 'cross-platform', label: 'Android & iPhone' },
      { id: 'connection-methods', label: 'Pairing Methods' },
      { id: 'windows-chrome', label: 'Windows & Chrome' }
    ],
    items: [
      {
        id: 'what-is-airdrop-online',
        category: 'general',
        question: 'What is AirDrop Online and how does this online airdrop free tool work?',
        keywords: ['airdrop online', 'online airdrop', 'airdrop online free', 'airdrop files free online'],
        answer: 'AirDrop Online is a web-based, zero-installation cross-device file transfer system that acts as an AirDrop alternative online. It allows you to stream original 4K videos, uncompressed RAW photos, PDFs, ZIP archives, and text notes between any smartphone and computer directly in your browser. No apps, accounts, or software downloads are required.'
      },
      {
        id: 'airdrop-iphone-to-android',
        category: 'cross-platform',
        question: 'Can I use AirDrop iPhone to Android online and Android to iPhone?',
        keywords: ['airdrop iphone to android online', 'airdrop android online', 'airdrop alternative online'],
        answer: 'Yes! While Apple native AirDrop is locked to iOS/Mac devices, AirDrop Web provides seamless cross-platform file transfer between Android and iPhone. You can transfer files, photos, and videos from Android to iPhone or iPhone to Android instantly in any web browser.'
      },
      {
        id: 'airdrop-pc-to-iphone',
        category: 'cross-platform',
        question: 'How do I do AirDrop PC to iPhone online or transfer files from Windows to iOS?',
        keywords: ['airdrop pc to iphone online', 'airdrop online windows', 'airdrop online chrome'],
        answer: 'To transfer files from PC to iPhone online, simply open AirDrop Web on your Windows PC browser (Chrome, Edge, Brave, etc.), then connect your iPhone by scanning the session QR code, typing the room code, or opening the direct session link. You can drag and drop any file from your PC directly to your iPhone without iTunes or iCloud.'
      },
      {
        id: 'connection-methods',
        category: 'connection-methods',
        question: 'What are the 3 ways to pair devices (QR Code, Room Code, and Direct Link)?',
        keywords: ['airdrop online', 'airdrop files free online'],
        answer: 'AirDrop Web supports 3 easy connection methods for instant pairing:\n1. Scan QR Code: Open your iPhone or Android camera app and scan the QR code displayed on the host screen.\n2. Type or Copy Room Code: Copy the unique session code (e.g. room-vuxao8) and enter it into the Join Code box on any device.\n3. Direct Room Link: Copy the exact web link (URL) and paste it into any browser on phone, tablet, or PC to join the room immediately.'
      },
      {
        id: 'android-to-pc-transfer',
        category: 'cross-platform',
        question: 'How to stream files from Android to PC / Windows online?',
        keywords: ['airdrop android online', 'airdrop online windows', 'airdrop alternative online'],
        answer: 'Open AirDrop Web on your Windows PC or laptop, scan the on-screen QR code using your Android camera or QR scanner, and select any full-resolution photo or video on your Android phone. Files are streamed using encrypted WebSocket binary chunking directly into your PC download folder with zero quality loss.'
      },
      {
        id: 'airdrop-online-chrome-windows',
        category: 'windows-chrome',
        question: 'Does AirDrop Online work on Chrome, Windows, Mac, and Linux?',
        keywords: ['airdrop online chrome', 'airdrop online windows', 'airdrop online free'],
        answer: 'Yes, AirDrop Web is engineered specifically for modern browsers including Google Chrome, Safari, Microsoft Edge, Mozilla Firefox, and Opera on Windows 11/10, macOS, Linux, Android, and iOS. It requires no extensions or plugins.'
      },
      {
        id: 'file-size-limits-compression',
        category: 'general',
        question: 'Are there file size limits or quality compression during transfer?',
        keywords: ['airdrop files free online', 'airdrop alternative online'],
        answer: 'AirDrop Web provides zero compression for all media. Your 4K videos, ProRAW photographs, and large documents retain 100% of their original bitrates and metadata. Streams are processed in real-time binary chunks for high throughput.'
      },
      {
        id: 'security-privacy',
        category: 'general',
        question: 'Is my data secure and private during online airdrop transfers?',
        keywords: ['online airdrop', 'airdrop online free'],
        answer: 'Absolutely. Your files and notes are transmitted directly through ephemeral peer sessions in your browser memory. Files are never stored on permanent database servers, ensuring maximum privacy and instant session cleanup when you close the tab.'
      }
    ],
    footerBadge: 'Zero compression • Browser-to-browser encrypted streaming • No account required',
    btnOpenQr: 'Open Pairing QR Code Now'
  },
  fr: {
    badge: 'Foire Aux Questions & Guide SEO',
    titlePrefix: 'Guide de transfert ',
    titleHighlight: 'AirDrop en ligne',
    titleSuffix: ' multiplateforme',
    description: 'Tout ce que vous devez savoir sur cette alternative gratuite à AirDrop en ligne pour transférer des fichiers, vidéos 4K, photos RAW et notes de presse-papiers entre Android, iPhone, Windows, Mac et Chrome.',
    cards: [
      {
        direction: 'Android ➔ iPhone',
        title: 'Android vers iPhone en ligne',
        description: 'Envoyez photos et fichiers directement de Samsung ou Pixel vers iOS sans aucune application.',
        type: 'android-iphone'
      },
      {
        direction: 'iPhone ➔ Android',
        title: 'iPhone vers Android en ligne',
        description: 'Transférez des fichiers depuis le navigateur Safari iOS vers tout smartphone ou tablette Android.',
        type: 'iphone-android'
      },
      {
        direction: 'Android ➔ PC',
        title: 'Android vers PC / Windows',
        description: 'Diffusez des vidéos 4K et des documents depuis votre téléphone vers Chrome sur Windows 11.',
        type: 'android-pc'
      },
      {
        direction: 'PC ➔ iPhone',
        title: 'AirDrop PC vers iPhone',
        description: 'Glissez-déposez des fichiers depuis votre PC Windows ou Mac directement sur votre iPhone sans iTunes.',
        type: 'pc-iphone'
      }
    ],
    connectionTitle: '3 façons rapides de se connecter et partager la session',
    connectionWays: [
      {
        step: '1',
        title: 'Scanner le QR Code',
        description: 'Scannez le code QR à l’écran avec l’appareil photo iPhone ou Android pour ouvrir le salon.'
      },
      {
        step: '2',
        title: 'Copier / Saisir le code',
        description: 'Entrez le code de session (ex. room-vuxao8) dans Rejoindre salon sur l’appareil cible.'
      },
      {
        step: '3',
        title: 'Lien direct de session',
        description: 'Copiez et envoyez le lien direct de session pour l’ouvrir instantanément dans un navigateur.'
      }
    ],
    categories: [
      { id: 'all', label: 'Toutes les questions' },
      { id: 'general', label: 'Général & Gratuit' },
      { id: 'cross-platform', label: 'Android & iPhone' },
      { id: 'connection-methods', label: 'Méthodes de connexion' },
      { id: 'windows-chrome', label: 'Windows & Chrome' }
    ],
    items: [
      {
        id: 'what-is-airdrop-online',
        category: 'general',
        question: 'Qu’est-ce qu’AirDrop en ligne et comment fonctionne cet outil gratuit ?',
        keywords: ['airdrop en ligne', 'airdrop gratuit en ligne', 'alternative airdrop'],
        answer: 'AirDrop en ligne est une solution web de transfert de fichiers sans installation servant d’alternative universelle à AirDrop. Il vous permet de transférer des vidéos 4K originales, des photos RAW sans compression, des PDF, des archives ZIP et des notes entre smartphones et ordinateurs directement dans votre navigateur, sans compte ni application.'
      },
      {
        id: 'airdrop-iphone-to-android',
        category: 'cross-platform',
        question: 'Puis-je utiliser AirDrop d’iPhone vers Android et d’Android vers iPhone en ligne ?',
        keywords: ['airdrop iphone vers android', 'airdrop android iphone en ligne'],
        answer: 'Oui ! Alors que l’AirDrop natif d’Apple est restreint aux appareils iOS et Mac, AirDrop Web permet un partage direct et fluide entre Android et iPhone dans n’importe quel navigateur internet.'
      },
      {
        id: 'airdrop-pc-to-iphone',
        category: 'cross-platform',
        question: 'Comment faire un AirDrop de PC vers iPhone ou transférer de Windows vers iOS ?',
        keywords: ['airdrop pc vers iphone', 'transfert windows vers iphone'],
        answer: 'Ouvrez simplement AirDrop Web sur le navigateur de votre PC Windows (Chrome, Edge, etc.), puis connectez votre iPhone en scannant le QR code ou en saisissant le code de session. Vous pouvez ensuite glisser-déposer vos fichiers directement vers votre iPhone sans iTunes ni iCloud.'
      },
      {
        id: 'connection-methods',
        category: 'connection-methods',
        question: 'Quelles sont les 3 méthodes pour jumeler les appareils (QR Code, Code et Lien) ?',
        keywords: ['jumeler airdrop en ligne', 'code de salon airdrop'],
        answer: 'AirDrop Web propose 3 méthodes rapides :\n1. Scanner le QR Code avec l’appareil photo de votre smartphone.\n2. Saisir ou copier le code de session (ex. room-vuxao8) dans l’onglet Rejoindre.\n3. Copier et ouvrir le lien web direct sur n’importe quel appareil.'
      },
      {
        id: 'android-to-pc-transfer',
        category: 'cross-platform',
        question: 'Comment transférer des fichiers depuis Android vers un PC Windows en ligne ?',
        keywords: ['transfert android vers pc en ligne', 'airdrop android windows'],
        answer: 'Ouvrez AirDrop Web sur votre ordinateur Windows, scannez le QR code avec votre téléphone Android et sélectionnez les photos ou vidéos souhaitées. Les fichiers sont transmis via un flux binaire WebSocket directement dans le dossier Téléchargements de votre PC avec une qualité 100% préservée.'
      },
      {
        id: 'airdrop-online-chrome-windows',
        category: 'windows-chrome',
        question: 'AirDrop en ligne fonctionne-t-il sur Chrome, Windows, Mac et Linux ?',
        keywords: ['airdrop chrome', 'airdrop windows en ligne'],
        answer: 'Oui, AirDrop Web est optimisé pour les navigateurs modernes : Google Chrome, Safari, Microsoft Edge, Firefox et Opera sur Windows 11/10, macOS, Linux, Android et iOS, sans extension ni plug-in.'
      },
      {
        id: 'file-size-limits-compression',
        category: 'general',
        question: 'Existe-t-il des limites de taille de fichier ou une compression de qualité ?',
        keywords: ['compression airdrop en ligne', 'taille limite fichier'],
        answer: 'AirDrop Web applique 0% de compression. Vos vidéos 4K 60fps et photos ProRAW conservent l’intégralité de leurs débits et métadonnées d’origine grâce à un découpage en blocs binaires de 64 Ko.'
      },
      {
        id: 'security-privacy',
        category: 'general',
        question: 'Mes données sont-elles sécurisées et confidentielles pendant le transfert ?',
        keywords: ['securite airdrop en ligne', 'confidentialite transfert'],
        answer: 'Absolument. Vos fichiers et textes sont transférés directement en mémoire vive dans des sessions éphémères. Aucun fichier n’est stocké sur des serveurs de base de données permanents, garantissant une confidentialité maximale.'
      }
    ],
    footerBadge: 'Zéro compression • Flux chiffré de navigateur à navigateur • Aucun compte requis',
    btnOpenQr: 'Afficher le QR Code de jumelage'
  },
  es: {
    badge: 'Preguntas Frecuentes y Guía SEO',
    titlePrefix: 'Guía de transferencia ',
    titleHighlight: 'AirDrop Online',
    titleSuffix: ' multiplataforma',
    description: 'Todo lo que necesitas saber sobre cómo usar esta alternativa gratuita a AirDrop online para transmitir archivos, vídeos 4K, fotos RAW y notas entre Android, iPhone, PC Windows, Mac y Chrome.',
    cards: [
      {
        direction: 'Android ➔ iPhone',
        title: 'Android a iPhone Online',
        description: 'Envía fotos y archivos directamente desde Samsung o Pixel a dispositivos iOS sin instalar aplicaciones.',
        type: 'android-iphone'
      },
      {
        direction: 'iPhone ➔ Android',
        title: 'iPhone a Android Online',
        description: 'Transfiere archivos desde Safari en iOS directamente a cualquier teléfono o tablet Android.',
        type: 'iphone-android'
      },
      {
        direction: 'Android ➔ PC',
        title: 'Android a PC / Windows',
        description: 'Transmite vídeos 4K y documentos desde el móvil a Google Chrome en Windows 11/10.',
        type: 'android-pc'
      },
      {
        direction: 'PC ➔ iPhone',
        title: 'AirDrop PC a iPhone',
        description: 'Arrastra y suelta archivos desde PC Windows o Mac directamente a iPhone sin iTunes.',
        type: 'pc-iphone'
      }
    ],
    connectionTitle: '3 formas rápidas de conectar y compartir la sesión',
    connectionWays: [
      {
        step: '1',
        title: 'Escanear Código QR',
        description: 'Apunta con la cámara de tu iPhone o Android al código en pantalla para unirte al instante.'
      },
      {
        step: '2',
        title: 'Copiar / Escribir Código',
        description: 'Escribe el código de sala (ej. room-vuxao8) en el botón Código de Sala del dispositivo.'
      },
      {
        step: '3',
        title: 'Enlace Directo de Sesión',
        description: 'Copia y envía el enlace directo para abrir la sala en cualquier navegador web.'
      }
    ],
    categories: [
      { id: 'all', label: 'Todas las preguntas' },
      { id: 'general', label: 'General y Gratis' },
      { id: 'cross-platform', label: 'Android e iPhone' },
      { id: 'connection-methods', label: 'Métodos de conexión' },
      { id: 'windows-chrome', label: 'Windows y Chrome' }
    ],
    items: [
      {
        id: 'what-is-airdrop-online',
        category: 'general',
        question: '¿Qué es AirDrop Online y cómo funciona esta herramienta gratuita?',
        keywords: ['airdrop online', 'airdrop gratis online', 'alternativa airdrop'],
        answer: 'AirDrop Online es un sistema web de transferencia de archivos sin instalación que actúa como alternativa universal a AirDrop. Te permite transmitir vídeos 4K originales, fotos RAW sin compresión, PDF, archivos ZIP y notas entre cualquier smartphone y ordenador directamente en el navegador, sin cuentas ni descargas.'
      },
      {
        id: 'airdrop-iphone-to-android',
        category: 'cross-platform',
        question: '¿Puedo usar AirDrop de iPhone a Android y de Android a iPhone online?',
        keywords: ['airdrop iphone a android online', 'transferir archivos android iphone'],
        answer: '¡Sí! Mientras que el AirDrop nativo de Apple está restringido a dispositivos iOS/Mac, AirDrop Web permite transferencias fluidas entre Android e iPhone desde cualquier navegador web sin cables.'
      },
      {
        id: 'airdrop-pc-to-iphone',
        category: 'cross-platform',
        question: '¿Cómo pasar archivos de PC a iPhone online o de Windows a iOS?',
        keywords: ['airdrop pc a iphone online', 'pasar archivos pc a iphone'],
        answer: 'Abre AirDrop Web en el navegador de tu PC con Windows (Chrome, Edge, etc.) y conecta tu iPhone escaneando el código QR o introduciendo el código de sala. Podrás arrastrar y soltar archivos desde el PC directamente a tu iPhone sin iTunes ni iCloud.'
      },
      {
        id: 'connection-methods',
        category: 'connection-methods',
        question: '¿Cuáles son las 3 formas de conectar dispositivos (QR, Código y Enlace)?',
        keywords: ['conectar airdrop online', 'codigo de sala airdrop'],
        answer: 'AirDrop Web ofrece 3 métodos sencillos:\n1. Escanear código QR con la app de cámara de tu móvil.\n2. Copiar o escribir el código de sala (ej. room-vuxao8) en el menú de conexión.\n3. Enlace directo: copia la URL de la sala y ábrela en cualquier dispositivo.'
      },
      {
        id: 'android-to-pc-transfer',
        category: 'cross-platform',
        question: '¿Cómo enviar archivos de Android a PC / Windows online?',
        keywords: ['transferir android a pc online', 'airdrop android windows'],
        answer: 'Abre AirDrop Web en tu ordenador Windows, escanea el código QR con tu móvil Android y selecciona fotos o vídeos. Los archivos se transmitirán mediante paquetes binarios WebSocket directamente a tu carpeta de descargas sin pérdida de calidad.'
      },
      {
        id: 'airdrop-online-chrome-windows',
        category: 'windows-chrome',
        question: '¿Funciona AirDrop Online en Chrome, Windows, Mac y Linux?',
        keywords: ['airdrop chrome windows', 'airdrop online pc'],
        answer: 'Sí, AirDrop Web está diseñado para navegadores modernos como Google Chrome, Safari, Microsoft Edge, Firefox y Opera en Windows 11/10, macOS, Linux, Android e iOS sin extensiones.'
      },
      {
        id: 'file-size-limits-compression',
        category: 'general',
        question: '¿Hay límites de tamaño de archivo o compresión de calidad?',
        keywords: ['limite tamano airdrop', 'compresion airdrop online'],
        answer: 'AirDrop Web no aplica ninguna compresión. Tus vídeos 4K a 60fps y fotos ProRAW conservan el 100% de su calidad y metadatos originales gracias a la transmisión en fragmentos de 64 KB.'
      },
      {
        id: 'security-privacy',
        category: 'general',
        question: '¿Son seguros y privados mis datos durante la transferencia?',
        keywords: ['seguridad airdrop online', 'privacidad archivos'],
        answer: 'Totalmente. Tus archivos y notas se transmiten directamente en memoria a través de sesiones efímeras. No se guarda ningún archivo en bases de datos permanentes, garantizando máxima privacidad.'
      }
    ],
    footerBadge: 'Cero compresión • Transmisión cifrada de navegador a navegador • Sin cuentas',
    btnOpenQr: 'Abrir Código QR de Conexión'
  },
  pt: {
    badge: 'Perguntas Frequentes e Guia SEO',
    titlePrefix: 'Guia de transferência ',
    titleHighlight: 'AirDrop Online',
    titleSuffix: ' entre plataformas',
    description: 'Tudo o que você precisa saber sobre como usar esta alternativa gratuita ao AirDrop online para transferir arquivos, vídeos 4K, fotos RAW e notas entre Android, iPhone, PC Windows, Mac e Chrome.',
    cards: [
      {
        direction: 'Android ➔ iPhone',
        title: 'Android para iPhone Online',
        description: 'Envie fotos e arquivos diretamente de aparelhos Samsung ou Pixel para iOS sem instalar aplicativos.',
        type: 'android-iphone'
      },
      {
        direction: 'iPhone ➔ Android',
        title: 'iPhone para Android Online',
        description: 'Transfira arquivos do Safari no iOS direto para qualquer smartphone ou tablet Android.',
        type: 'iphone-android'
      },
      {
        direction: 'Android ➔ PC',
        title: 'Android para PC / Windows',
        description: 'Transmita vídeos 4K e documentos do celular para o Google Chrome no Windows 11/10.',
        type: 'android-pc'
      },
      {
        direction: 'PC ➔ iPhone',
        title: 'AirDrop PC para iPhone',
        description: 'Arraste e solte arquivos do computador Windows ou Mac direto no iPhone sem iTunes.',
        type: 'pc-iphone'
      }
    ],
    connectionTitle: '3 maneiras rápidas de conectar e compartilhar a sessão',
    connectionWays: [
      {
        step: '1',
        title: 'Escanear QR Code',
        description: 'Aponte a câmera do seu iPhone ou Android para o código na tela para conectar na hora.'
      },
      {
        step: '2',
        title: 'Copiar / Digitar Código',
        description: 'Digite o código da sala (ex. room-vuxao8) no botão Código da Sala no aparelho de destino.'
      },
      {
        step: '3',
        title: 'Link Direto da Sessão',
        description: 'Copie e envie o link direto da sessão para abrir em qualquer navegador web.'
      }
    ],
    categories: [
      { id: 'all', label: 'Todas as perguntas' },
      { id: 'general', label: 'Geral e Grátis' },
      { id: 'cross-platform', label: 'Android e iPhone' },
      { id: 'connection-methods', label: 'Métodos de conexão' },
      { id: 'windows-chrome', label: 'Windows e Chrome' }
    ],
    items: [
      {
        id: 'what-is-airdrop-online',
        category: 'general',
        question: 'O que é o AirDrop Online e como funciona esta ferramenta gratuita?',
        keywords: ['airdrop online', 'airdrop gratis online', 'alternativa airdrop'],
        answer: 'O AirDrop Online é um sistema web de transferência de arquivos sem instalação que funciona como uma alternativa multiplataforma ao AirDrop. Permite enviar vídeos 4K originais, fotos RAW sem compressão, PDFs, arquivos ZIP e textos entre celulares e computadores direto no navegador, sem contas ou downloads.'
      },
      {
        id: 'airdrop-iphone-to-android',
        category: 'cross-platform',
        question: 'Posso usar o AirDrop de iPhone para Android e de Android para iPhone online?',
        keywords: ['airdrop iphone para android', 'transferir arquivos android iphone online'],
        answer: 'Sim! Enquanto o AirDrop nativo da Apple funciona apenas no ecossistema iOS/Mac, o AirDrop Web permite transferências fáceis entre Android e iPhone em qualquer navegador web.'
      },
      {
        id: 'airdrop-pc-to-iphone',
        category: 'cross-platform',
        question: 'Como transferir arquivos do PC para iPhone ou do Windows para iOS?',
        keywords: ['airdrop pc para iphone online', 'passar arquivos pc iphone'],
        answer: 'Abra o AirDrop Web no navegador do seu PC Windows (Chrome, Edge, etc.) e emparelhe o iPhone escaneando o QR code ou inserindo o código da sala. Você pode arrastar e soltar arquivos do computador diretamente para o iPhone sem iTunes ou iCloud.'
      },
      {
        id: 'connection-methods',
        category: 'connection-methods',
        question: 'Quais são as 3 formas de conectar dispositivos (QR Code, Código e Link)?',
        keywords: ['conectar airdrop online', 'codigo da sala airdrop'],
        answer: 'O AirDrop Web oferece 3 opções rápidas:\n1. Escanear o QR Code com a câmera do celular.\n2. Inserir o código da sala (ex. room-vuxao8) no menu de conexão.\n3. Copiar e abrir o link direto da sala em qualquer navegador.'
      },
      {
        id: 'android-to-pc-transfer',
        category: 'cross-platform',
        question: 'Como enviar arquivos do Android para o PC / Windows online?',
        keywords: ['transferir android para pc online', 'airdrop android windows'],
        answer: 'Abra o AirDrop Web no seu PC Windows, aponte a câmera do seu Android para o QR code e escolha as fotos ou vídeos desejados. Os arquivos são transmitidos via conexão WebSocket direta para a sua pasta de downloads sem perda de qualidade.'
      },
      {
        id: 'airdrop-online-chrome-windows',
        category: 'windows-chrome',
        question: 'O AirDrop Online funciona no Chrome, Windows, Mac e Linux?',
        keywords: ['airdrop chrome windows', 'airdrop online pc mac'],
        answer: 'Sim, o AirDrop Web foi feito especificamente para navegadores modernos como Google Chrome, Safari, Edge, Firefox e Opera no Windows 11/10, macOS, Linux, Android e iOS sem extensões.'
      },
      {
        id: 'file-size-limits-compression',
        category: 'general',
        question: 'Existem limites de tamanho de arquivo ou perda de qualidade?',
        keywords: ['limite tamanho airdrop', 'compressao airdrop online'],
        answer: 'O AirDrop Web não comprime arquivos. Seus vídeos 4K a 60fps e fotos ProRAW mantêm 100% da resolução original e taxas de dados através de transmissão contínua em blocos de 64 KB.'
      },
      {
        id: 'security-privacy',
        category: 'general',
        question: 'Meus dados e arquivos estão seguros durante a transferência online?',
        keywords: ['seguranca airdrop online', 'privacidade arquivos'],
        answer: 'Com certeza. Seus arquivos e anotações são transmitidos diretamente pela memória da sessão no navegador. Nenhum arquivo é armazenado em bancos de dados permanentes, garantindo total privacidade.'
      }
    ],
    footerBadge: 'Zero compressão • Fluxo criptografado de navegador a navegador • Sem contas',
    btnOpenQr: 'Abrir QR Code de Conexão'
  },
  ar: {
    badge: 'الأسئلة الشائعة ودليل النقل السريع',
    titlePrefix: 'دليل النقل الفوري ',
    titleHighlight: 'بديل إير دروب',
    titleSuffix: ' لجميع الأنظمة',
    description: 'كل ما تحتاج لمعرفته حول استخدام هذا البديل المجاني لخدمة إير دروب عبر المتصفح لنقل الملفات الأصلية، مقاطع 4K، الصور الخام RAW، والملاحظات بين أندرويد، آيفون، أجهزة ويندوز وماك.',
    cards: [
      {
        direction: 'أندرويد ➔ آيفون',
        title: 'من أندرويد إلى آيفون أونلاين',
        description: 'أرسل الصور والملفات مباشرة من هواتف سامسونج أو بكسل إلى أجهزة آبل دون تثبيت تطبيقات.',
        type: 'android-iphone'
      },
      {
        direction: 'آيفون ➔ أندرويد',
        title: 'من آيفون إلى أندرويد أونلاين',
        description: 'شارك الملفات والصور من متصفح سفاري على آيفون إلى أي هاتف أو جهاز لوحي أندرويد مباشرة.',
        type: 'iphone-android'
      },
      {
        direction: 'أندرويد ➔ كمبيوتر',
        title: 'من أندرويد إلى ويندوز / PC',
        description: 'انقل مقاطع الفيديو بدقة 4K والمستندات من الهاتف إلى متصفح كروم على ويندوز 11 و 10.',
        type: 'android-pc'
      },
      {
        direction: 'كمبيوتر ➔ آيفون',
        title: 'من الكمبيوتر إلى آيفون',
        description: 'اسحب وأفلت الملفات من جهاز ويندوز أو ماك مباشرة إلى الآيفون دون الحاجة لبرنامج آيتيونز.',
        type: 'pc-iphone'
      }
    ],
    connectionTitle: '3 طرق سريعة للاتصال ومشاركة الجلسة',
    connectionWays: [
      {
        step: '1',
        title: 'مسح رمز الاستجابة السريعة (QR)',
        description: 'وجّه كاميرا هاتفك الآيفون أو الأندرويد نحو الرمز الظاهر على الشاشة للدخول للغرفة فوراً.'
      },
      {
        step: '2',
        title: 'نسخ / كتابة رمز الغرفة',
        description: 'أدخل رمز الجلسة المخصص (مثل room-vuxao8) في خانة رمز الغرفة على الجهاز الآخر.'
      },
      {
        step: '3',
        title: 'الرابط المباشر للجلسة',
        description: 'انسخ الرابط المباشر وشاركه لفتحه في أي متصفح ويب على الهاتف أو الكمبيوتر.'
      }
    ],
    categories: [
      { id: 'all', label: 'جميع الأسئلة' },
      { id: 'general', label: 'عام ومجاني' },
      { id: 'cross-platform', label: 'أندرويد وآيفون' },
      { id: 'connection-methods', label: 'طرق الاتصال' },
      { id: 'windows-chrome', label: 'ويندوز وكروم' }
    ],
    items: [
      {
        id: 'what-is-airdrop-online',
        category: 'general',
        question: 'ما هو إير دروب أونلاين وكيف تعمل هذه الأداة المجانية؟',
        keywords: ['اير دروب اونلاين', 'اير دروب مجاني', 'بديل اير دروب'],
        answer: 'إير دروب أونلاين هو نظام لنقل الملفات عبر المتصفح بدون تثبيت برامج، يعمل كبديل متوافق مع كافة الأجهزة لخدمة AirDrop. يتيح لك بث مقاطع الفيديو الأصلية بدقة 4K، الصور الخام ProRAW دون ضغط، ملفات PDF، الأرشيفات المضغوطة ZIP، والملاحظات بين الهواتف وأجهزة الكمبيوتر مباشرة عبر المتصفح.'
      },
      {
        id: 'airdrop-iphone-to-android',
        category: 'cross-platform',
        question: 'هل يمكنني استخدام إير دروب من آيفون إلى أندرويد ومن أندرويد إلى آيفون؟',
        keywords: ['اير دروب ايفون الى اندرويد', 'نقل ملفات اندرويد ايفون'],
        answer: 'نعم بكل تأكيد! بينما تقتصر ميزة AirDrop الأصلية من آبل على أجهزة iOS وماك، يوفر AirDrop Web نقلاً سلساً للملفات والصور بين أندرويد وآيفون عبر أي متصفح إنترنت دون الحاجة لأي كابلات.'
      },
      {
        id: 'airdrop-pc-to-iphone',
        category: 'cross-platform',
        question: 'كيف يمكن نقل الملفات من الكمبيوتر إلى آيفون أو من ويندوز إلى iOS أونلاين؟',
        keywords: ['نقل ملفات من الكمبيوتر للايفون', 'اير دروب ويندوز ايفون'],
        answer: 'ما عليك سوى فتح موقع AirDrop Web على متصفح جهاز ويندوز الخاص بك، ثم ربط الآيفون بمسح رمز QR أو إدخال رمز الغرفة. بعد ذلك يمكنك سحب وإفلات أي ملف من الكمبيوتر لفتحه وتحميله على الآيفون مباشرة دون آيتيونز أو آي كلاود.'
      },
      {
        id: 'connection-methods',
        category: 'connection-methods',
        question: 'ما هي الطرق الـ 3 المتاحة لربط الأجهزة (رمز QR، رمز الغرفة، والرابط)؟',
        keywords: ['طرق ربط اير دروب', 'رمز غرفة اير دروب'],
        answer: 'يوفر الموقع 3 خيارات سهلة وسريعة:\n1. مسح رمز QR بكاميرا الهاتف الافتراضية.\n2. نسخ أو كتابة رمز الغرفة (مثل room-vuxao8) في خانة رمز الغرفة.\n3. نسخ الرابط المباشر للجلسة وفتحه في أي متصفح على الجهاز المستهدف.'
      },
      {
        id: 'android-to-pc-transfer',
        category: 'cross-platform',
        question: 'كيف يمكن نقل الملفات من أندرويد إلى الكمبيوتر / ويندوز أونلاين؟',
        keywords: ['نقل الصور من الاندرويد للكمبيوتر', 'اير دروب اندرويد ويندوز'],
        answer: 'افتح الموقع على شاشة الكمبيوتر، امسح رمز QR بكاميرا هاتف أندرويد، واختر الصور أو الفيديوهات المطلوبة. تُبث الملفات عبر قنوات WebSocket المشفرة مباشرة إلى مجلد التنزيلات على جهازك بجودتها الأصلية الكاملة.'
      },
      {
        id: 'airdrop-online-chrome-windows',
        category: 'windows-chrome',
        question: 'هل يعمل إير دروب أونلاين على متصفحات كروم، ويندوز، ماك ولينكس؟',
        keywords: ['اير دروب كروم ويندوز', 'اير دروب اونلاين للكمبيوتر'],
        answer: 'نعم، تم تطوير AirDrop Web ليعمل بكفاءة على كافة المتصفحات الحديثة بما فيها جوجل كروم، سفاري، مايكروسوفت إيدج، وفايرفوكس على أنظمة ويندوز 11 و 10، ماك، لينكس، أندرويد و iOS دون ملحقات.'
      },
      {
        id: 'file-size-limits-compression',
        category: 'general',
        question: 'هل هناك حد أقصى لحجم الملفات أو ضغط يؤثر على جودتها؟',
        keywords: ['ضغط ملفات اير دروب', 'جودة الصور اير دروب اونلاين'],
        answer: 'لا يطبق الموقع أي ضغط أو تقليل لجودة الوسائط. تحتفظ مقاطع الفيديو 4K والصور الخام ProRAW بكامل دقتها ومعدلات بياناتها الأصلية بفضل تقنية التقسيم الثنائي إلى كتل 64 كيلوبايت.'
      },
      {
        id: 'security-privacy',
        category: 'general',
        question: 'هل بياناتي وملفاتي محمية وتتمتع بالخصوصية أثناء النقل؟',
        keywords: ['امان نقل الملفات اونلاين', 'خصوصية اير دروب'],
        answer: 'نعم تماماً. يتم نقل الملفات والنصوص مباشرة عبر ذاكرة الجلسة اللحظية بين المتصفحات، ولا يتم تخزين أي ملف على خوادم أو قواعد بيانات دائمة، مما يضمن أقصى درجات الخصوصية.'
      }
    ],
    footerBadge: 'بدون أي ضغط • نقل مشفر بين المتصفحات مباشرة • لا يتطلب حساباً',
    btnOpenQr: 'فتح رمز QR للاقتران الآن'
  }
};