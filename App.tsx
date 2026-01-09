
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Sprout, 
  MessageSquare, 
  CloudSun, 
  BarChart3, 
  Settings,
  Menu,
  X,
  Bell,
  Construction
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import CropManagement from './components/CropManagement';
import AIAdvisor from './components/AIAdvisor';
import { ViewType } from './types';

const PlaceholderView: React.FC<{ title: string; icon: React.ElementType }> = ({ title, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 bg-white rounded-3xl border border-slate-100 shadow-sm">
    <div className="p-6 bg-slate-50 rounded-full mb-6 text-slate-300">
      <Icon size={64} className="opacity-40" />
    </div>
    <h2 className="text-2xl font-bold text-slate-800 mb-2">{title} 功能开发中</h2>
    <p className="text-slate-500 max-w-md text-center px-6">
      我们正在努力为您接入实时{title}数据，该模块将在下个版本更新中正式上线，敬请期待。
    </p>
    <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-xs font-bold uppercase tracking-widest border border-amber-100">
      <Construction size={14} />
      Under Construction
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderView = () => {
    switch (currentView) {
      case ViewType.DASHBOARD:
        return <Dashboard />;
      case ViewType.CROP_MANAGEMENT:
        return <CropManagement />;
      case ViewType.AI_ADVISOR:
        return <AIAdvisor />;
      case ViewType.MARKET:
        return <PlaceholderView title="行情中心" icon={BarChart3} />;
      case ViewType.WEATHER:
        return <PlaceholderView title="天气预报" icon={CloudSun} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
            <Settings size={64} className="mb-4 opacity-20" />
            <h2 className="text-xl font-medium">功能正在开发中</h2>
            <p>该模块将在下个版本更新中上线。</p>
          </div>
        );
    }
  };

  const navItems = [
    { id: ViewType.DASHBOARD, label: '仪表盘', icon: LayoutDashboard },
    { id: ViewType.CROP_MANAGEMENT, label: '作物管理', icon: Sprout },
    { id: ViewType.AI_ADVISOR, label: 'AI 顾问', icon: MessageSquare },
    { id: ViewType.WEATHER, label: '天气预报', icon: CloudSun },
    { id: ViewType.MARKET, label: '行情中心', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex text-slate-700">
      {/* 侧边栏 */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transition-transform lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Sprout size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-tight">智农科技</h1>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">AgriSmart Pro</p>
          </div>
        </div>

        <nav className="mt-8 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                currentView === item.id 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-emerald-600'
              }`}
            >
              <item.icon size={20} className={currentView === item.id ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-500 mb-2">云端存储容量</p>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mb-3">
              <div className="bg-emerald-500 h-1.5 rounded-full w-3/4"></div>
            </div>
            <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700">升级版本</button>
          </div>
          <button className="w-full mt-4 flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-rose-500 transition-colors">
            <Settings size={20} />
            <span className="font-medium text-sm">系统设置</span>
          </button>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col min-h-screen bg-slate-50 overflow-x-hidden">
        {/* 头部 */}
        <header className="h-20 bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 hover:bg-slate-50 rounded-lg"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden sm:block">
              <h2 className="text-slate-400 text-sm">欢迎回来，</h2>
              <p className="text-slate-800 font-bold">李华 (农场管理员)</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-emerald-600 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-100 mx-2"></div>
            <button className="flex items-center gap-3 pl-2 pr-1 py-1 hover:bg-slate-50 rounded-full transition-colors border border-transparent hover:border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">绿野现代农场</p>
                <p className="text-[10px] text-slate-400 font-semibold">编号: 488219</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold overflow-hidden">
                <img src="https://picsum.photos/seed/farmer/100/100" alt="Farmer" className="w-full h-full object-cover" />
              </div>
            </button>
          </div>
        </header>

        {/* 视图内容 */}
        <div className="p-6 max-w-7xl mx-auto w-full">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
