/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconDownload, IconLanguage, IconPack, IconPlumbob, IconUpdate } from '@/components/icons';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-900 overflow-x-hidden">
      {/* Background Plumbob Pattern - Full width & height */}
      <div className="fixed inset-0 w-screen h-screen">
        <div className="absolute inset-0 grid grid-cols-8 md:grid-cols-12 gap-4 p-4">
          {Array(144).fill(0).map((_, i) => (
            <div key={i} className="w-8 h-8 md:w-12 md:h-12">
              <svg viewBox="0 0 24 24" className="w-full h-full text-emerald-500/[0.03] dark:text-emerald-500/[0.02]">
                <path fill="currentColor" d="M12 2L2 19h20L12 2z"/>
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section với Plumbob Icon */}
        <div className="text-center mb-32 relative">
          {/* Main Title với Plumbob Icon */}
          <div className="inline-block mb-16 relative">
            {/* Animated Plumbob Icon */}
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full animate-spin-slow">
                  <svg viewBox="0 0 24 24" className="w-full h-full text-emerald-500/20">
                    <path fill="currentColor" d="M12 2L2 19h20L12 2z"/>
                  </svg>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-3/4 animate-float">
                  <svg viewBox="0 0 24 24" className="w-full h-full text-emerald-500">
                    <path fill="currentColor" d="M12 2L2 19h20L12 2zm0 4l6.9 11H5.1L12 6z"/>
                  </svg>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1/2 h-1/2 animate-pulse">
                  <svg viewBox="0 0 24 24" className="w-full h-full text-emerald-500/30">
                    <path fill="currentColor" d="M12 2L2 19h20L12 2z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Title with Sims Style */}
            <h1 className="text-8xl font-black tracking-tight mb-4 relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600">
                The Sims 4
              </span>
              <div className="absolute -top-8 -right-8 w-16 h-16 text-emerald-500/20 animate-spin-slow">
                <IconPlumbob />
              </div>
            </h1>
            <div className="text-5xl font-bold text-gray-800 dark:text-white transform -translate-y-2 relative">
              Việt Hóa AI
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
            </div>
          </div>
          
          <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Trải nghiệm The Sims 4 với bản việt hóa chất lượng cao được tối ưu bởi AI. 
            Chơi game bằng tiếng Việt, tận hưởng mọi chi tiết của thế giới Sims.
          </p>

          {/* Hero Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl transform group-hover:scale-105 transition-transform"></div>
                <div className="relative p-6">
                  <div className="text-4xl font-bold text-emerald-500 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid với Plumbob Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          {features.map((feature, index) => (
            <div key={index} 
              className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-3xl 
                transform group-hover:scale-105 transition-transform duration-500"></div>
              <div className="relative bg-white/80 dark:bg-gray-800/80 rounded-3xl p-8 
                border-2 border-emerald-500/10 dark:border-emerald-500/20
                hover:border-emerald-500/30 dark:hover:border-emerald-500/40
                transition-all duration-500">
                {/* Feature Icon Container */}
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl transform -rotate-6"></div>
                  <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl transform rotate-6"></div>
                  <div className="relative bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-4
                    transform group-hover:rotate-12 transition-transform duration-500">
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {feature.description}
                </p>
                
                {/* Feature Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  {feature.stats.map((stat, i) => (
                    <div key={i} className="flex items-center gap-1">
                      {stat.icon}
                      <span>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pack Categories */}
        <div className="mb-32">
          <h2 className="text-5xl font-bold mb-16 text-center text-gray-900 dark:text-white flex items-center justify-center gap-4">
            <IconPack className="w-12 h-12 text-emerald-500" />
            Danh Sách Pack Việt Hóa
          </h2>

          {/* Pack Type Tabs */}
          <div className="flex justify-center gap-4 mb-12">
            {packTypes.map((type, index) => (
              <button key={index}
                className="px-6 py-3 rounded-xl text-sm font-semibold
                  bg-white dark:bg-gray-800 
                  border-2 border-emerald-500/20 hover:border-emerald-500/40
                  text-gray-700 dark:text-gray-300
                  transition-all duration-300">
                {type}
              </button>
            ))}
          </div>

          {/* Pack Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {kitPacks.map((pack, index) => (
              <PackCard key={index} pack={pack} />
            ))}
          </div>
        </div>

        {/* Download Section */}
        <div className="mb-32">
          <div className="relative bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-3xl p-12">
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="plumbob-pattern absolute inset-0 opacity-5"></div>
            </div>
            
            <div className="relative text-center">
              <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Bắt đầu trải nghiệm ngay
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Tải xuống bản việt hóa hoàn chỉnh mới nhất và khám phá thế giới The Sims 4 bằng tiếng Việt
              </p>
              <a href="#download"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r 
                  from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700
                  text-white rounded-xl text-lg font-semibold
                  transform hover:-translate-y-1 transition-all duration-300">
                <IconDownload className="w-6 h-6 mr-2" />
                Tải toàn bộ pack việt hóa
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pt-12 border-t border-gray-100 dark:border-gray-800">
          <div className="w-24 h-24 mx-auto mb-8 relative">
            <div className="absolute inset-0 animate-spin-slow">
              <IconPlumbob className="w-full h-full text-emerald-500/20" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <IconPlumbob className="w-12 h-12 text-emerald-500" />
            </div>
          </div>
          
          <div className="flex justify-center gap-8 mb-8">
            {footerLinks.map((link, index) => (
              <a key={index} href={link.href}
                className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400
                  transition-colors duration-300">
                {link.label}
              </a>
            ))}
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            © {new Date().getFullYear()} The Sims 4 Việt Hóa - TomiSakae | Dự án phi lợi nhuận
          </p>
        </footer>
      </div>
    </div>
  );
}

const PackCard = ({ pack }: { pack: any }) => (
  <div className="group relative">
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-3xl 
      transform group-hover:scale-105 transition-transform duration-500"></div>
    <div className="relative bg-white/80 dark:bg-gray-800/80 rounded-3xl p-8 
      border-2 border-emerald-500/10 dark:border-emerald-500/20
      hover:border-emerald-500/30 dark:hover:border-emerald-500/40
      transition-all duration-500">
      
      {/* Pack Icon */}
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl 
          transform group-hover:rotate-12 transition-transform duration-500">
          <IconPack className="w-full h-full text-white/90 p-3" />
        </div>
      </div>

      {/* Pack Info */}
      <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{pack.name}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{pack.description}</p>

      {/* Pack Stats */}
      <div className="flex flex-wrap gap-4 mb-8">
        {pack.features.map((feature: any, index: any) => (
          <span key={index} className="inline-flex items-center gap-1 text-sm 
            px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 
            text-emerald-600 dark:text-emerald-400">
            {feature.icon}
            {feature.text}
          </span>
        ))}
      </div>

      {/* Download Button */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold px-4 py-2 
          bg-emerald-50 dark:bg-emerald-900/30 
          text-emerald-600 dark:text-emerald-400 rounded-xl">
          {pack.items} items
        </span>
        <a href={pack.downloadLink}
          className="group/button inline-flex items-center px-6 py-3 
            bg-gradient-to-r from-emerald-500 to-green-600 
            hover:from-emerald-600 hover:to-green-700
            text-white rounded-xl transition-all duration-300 font-semibold"
          target="_blank"
          rel="noopener noreferrer">
          Tải xuống
          <IconDownload className="w-5 h-5 ml-2 transform group-hover/button:translate-y-1 transition-transform" />
        </a>
      </div>
    </div>
  </div>
);

const stats = [
  { value: "40+", label: "Pack đã việt hóa" },
  { value: "98%", label: "Độ chính xác" },
  { value: "24/7", label: "Đang dịch" }
];

const features = [
  {
    icon: <IconLanguage className="w-8 h-8" />,
    title: "Việt Hóa Bằng AI",
    description: "Sử dụng công nghệ AI tiên tiến để đảm bảo chất lượng dịch thuật tự nhiên và chính xác",
    stats: [
      { icon: <IconUpdate className="w-4 h-4" />, value: "Cập nhật liên tục" },
      { icon: <IconLanguage className="w-4 h-4" />, value: "100% Tiếng Việt" }
    ]
  },
  {
    icon: <IconPack className="w-8 h-8" />,
    title: "Đầy Đủ Nội Dung",
    description: "Việt hóa toàn bộ từ giao diện đến các tương tác trong game, bao gồm cả các pack mới nhất",
    stats: [
      { icon: <IconUpdate className="w-4 h-4" />, value: "Pack mới nhất" },
      { icon: <IconLanguage className="w-4 h-4" />, value: "Đầy đủ content" }
    ]
  },
  {
    icon: <IconDownload className="w-8 h-8" />,
    title: "Dễ Dàng Cài Đặt",
    description: "Hướng dẫn cài đặt chi tiết, hỗ trợ mọi phiên bản game và các bản mod tương thích",
    stats: [
      { icon: <IconUpdate className="w-4 h-4" />, value: "Tương thích cao" },
      { icon: <IconLanguage className="w-4 h-4" />, value: "Hỗ trợ 24/7" }
    ]
  }
];

const packTypes = [
  "Tất cả Pack",
  "Expansion Packs",
  "Game Packs",
  "Stuff Packs",
  "Kit Packs"
];

const kitPacks = [
  {
    name: "40 Kit Packs Collection",
    description: "Bộ sưu tập 40 Kit Packs đã được việt hóa hoàn chỉnh",
    items: "40",
    downloadLink: "/TheSims4KitPacks-TomiSakae-AIVH.rar",
    features: [
      { icon: <IconUpdate className="w-4 h-4" />, text: "Cập nhật mới nhất" },
      { icon: <IconLanguage className="w-4 h-4" />, text: "100% Tiếng Việt" }
    ]
  },
  // ... thêm các packs khác
];

const footerLinks = [
  { label: "Hướng dẫn cài đặt", href: "#guide" },
  { label: "Cập nhật mới", href: "#updates" },
  { label: "Liên hệ", href: "#contact" },
  { label: "Điều khoản", href: "#terms" }
];

