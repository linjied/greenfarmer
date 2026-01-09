
import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, MoreVertical, ChevronRight, Leaf, Sprout, Filter, 
  ClipboardList, X, Calendar as CalendarIcon, Tag, MessageSquare,
  ChevronLeft
} from 'lucide-react';
import { Crop, FarmingRecord } from '../types';

const mockCrops: Crop[] = [
  { 
    id: '1', name: '冬小麦', variety: '巴伐利亚-4号', plantedDate: '2023-11-15', status: 'Growing', health: 92, area: 45,
    records: [
      { id: 'r1', type: '灌溉', date: '2025-05-10', note: '全田漫灌，覆盖率100%' },
      { id: 'r2', type: '施肥', date: '2025-05-02', note: '追施尿素，促进拔节' },
      { id: 'r4', type: '除草', date: '2025-05-10', note: '人工清除田间杂草' }
    ]
  },
  { 
    id: '2', name: '甜玉米', variety: '黄金邦塔姆', plantedDate: '2024-03-10', status: 'Sprouting', health: 88, area: 12,
    records: [
      { id: 'r3', type: '喷药', date: '2025-05-12', note: '预防蚜虫，药剂：吡虫啉' }
    ]
  },
  { id: '3', name: '褐土马铃薯', variety: '经典克莱斯', plantedDate: '2024-02-22', status: 'Growing', health: 76, area: 30, records: [] },
  { id: '4', name: '大豆', variety: '高产专家', plantedDate: '2024-04-05', status: 'Sprouting', health: 55, area: 55, records: [] },
];

const statusMap: Record<string, string> = {
  Growing: '生长期',
  Sprouting: '萌芽期',
  Harvested: '已采收',
  Dormant: '休眠期',
};

const CropManagement: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>(mockCrops);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  
  // 日历状态
  const [viewDate, setViewDate] = useState(new Date());
  const [activeDate, setActiveDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // 新记录表单状态
  const [newRecordType, setNewRecordType] = useState<FarmingRecord['type']>('施肥');
  const [newRecordDate, setNewRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [newRecordNote, setNewRecordNote] = useState('');

  const filteredCrops = crops.filter(crop => 
    crop.name.includes(searchTerm) ||
    crop.variety.includes(searchTerm)
  );

  const getHealthStyles = (health: number) => {
    if (health >= 80) return { text: 'text-emerald-600', bar: 'bg-emerald-500', label: '优秀' };
    if (health >= 60) return { text: 'text-amber-600', bar: 'bg-amber-500', label: '良好' };
    return { text: 'text-rose-600', bar: 'bg-rose-500', label: '需关注' };
  };

  const handleAddRecord = () => {
    if (!selectedCrop || !newRecordNote) return;
    
    const newRecord: FarmingRecord = {
      id: Math.random().toString(36).substr(2, 9),
      type: newRecordType,
      date: newRecordDate,
      note: newRecordNote
    };

    const updatedCrops = crops.map(c => {
      if (c.id === selectedCrop.id) {
        return { ...c, records: [newRecord, ...(c.records || [])] };
      }
      return c;
    });

    setCrops(updatedCrops);
    setNewRecordNote('');
    setSelectedCrop(updatedCrops.find(c => c.id === selectedCrop.id) || null);
    setActiveDate(newRecordDate); // 添加后自动选中该日期
  };

  // 日历逻辑
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, dateStr });
    }
    return days;
  }, [viewDate]);

  const activeDayRecords = useMemo(() => {
    if (!selectedCrop || !selectedCrop.records) return [];
    return selectedCrop.records.filter(r => r.date === activeDate);
  }, [selectedCrop, activeDate]);

  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
    setViewDate(newDate);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">作物清单</h1>
          <p className="text-slate-500">正在追踪您农场中的 {crops.length} 个活跃地块</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
          <Plus size={18} />
          登记新种植
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="搜索作物名称、品种..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg text-sm hover:bg-slate-50">
          <Filter size={18} />
          筛选条件
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map(crop => {
          const styles = getHealthStyles(crop.health);
          return (
            <div key={crop.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:border-emerald-200 transition-all">
              <div className="h-24 bg-emerald-50 relative">
                 <div className="absolute top-4 left-4 p-2 bg-white rounded-lg text-emerald-600 shadow-sm">
                    {crop.status === 'Growing' ? <Leaf size={24} /> : <Sprout size={24} />}
                 </div>
                 <div className="absolute top-4 right-4">
                   <button className="p-1 text-slate-400 hover:text-slate-600">
                      <MoreVertical size={20} />
                   </button>
                 </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{crop.name}</h3>
                    <p className="text-sm text-slate-500">{crop.variety}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    crop.status === 'Growing' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {statusMap[crop.status]}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 my-6">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold">面积</p>
                    <p className="text-sm font-medium text-slate-700">{crop.area} 公顷</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold">种植日期</p>
                    <p className="text-sm font-medium text-slate-700">{new Date(crop.plantedDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">健康指数</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${styles.text} bg-white border border-current`}>
                        {styles.label}
                      </span>
                    </div>
                    <span className={`font-bold ${styles.text}`}>
                      {crop.health}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 shadow-inner overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ease-out ${styles.bar}`} 
                      style={{ width: `${crop.health}%` }}
                    >
                      <div className="w-full h-full bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      setSelectedCrop(crop);
                      setViewDate(new Date()); // 重置到当前月份
                    }}
                    className="flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium hover:bg-emerald-50 hover:text-emerald-600 transition-colors border border-slate-100"
                  >
                    <ClipboardList size={16} />
                    农事记录
                  </button>
                  <button className="flex items-center justify-center gap-1 py-2 text-slate-600 text-sm font-medium hover:text-emerald-600 transition-colors">
                    详细分析
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 农事记录模态框 - 日历增强版 */}
      {selectedCrop && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedCrop(null)}></div>
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <CalendarIcon size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">农事记录 - {selectedCrop.name}</h2>
                  <p className="text-sm text-slate-500">通过日历查看操作分布及详情</p>
                </div>
              </div>
              <button onClick={() => setSelectedCrop(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row h-[70vh]">
              {/* 左侧：日历与添加表单 */}
              <div className="flex-1 border-r border-slate-100 overflow-y-auto p-6 space-y-6">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="font-bold text-slate-700">{viewDate.getFullYear()}年 {viewDate.getMonth() + 1}月</h3>
                    <div className="flex gap-1">
                      <button onClick={() => changeMonth(-1)} className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"><ChevronLeft size={16} /></button>
                      <button onClick={() => changeMonth(1)} className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"><ChevronRight size={16} /></button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                      <div key={d} className="text-center text-[10px] font-bold text-slate-400 py-1">{d}</div>
                    ))}
                    {calendarDays.map((dayObj, i) => {
                      if (!dayObj) return <div key={`empty-${i}`} className="aspect-square"></div>;
                      
                      const hasRecords = selectedCrop.records?.some(r => r.date === dayObj.dateStr);
                      const isSelected = activeDate === dayObj.dateStr;
                      const isToday = dayObj.dateStr === new Date().toISOString().split('T')[0];

                      return (
                        <button
                          key={dayObj.dateStr}
                          onClick={() => setActiveDate(dayObj.dateStr)}
                          className={`relative aspect-square rounded-xl flex items-center justify-center text-sm transition-all border ${
                            isSelected 
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100 z-10' 
                              : hasRecords 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100 font-bold hover:bg-emerald-100' 
                                : 'bg-white text-slate-600 border-transparent hover:border-slate-200'
                          } ${isToday && !isSelected ? 'ring-1 ring-inset ring-emerald-500' : ''}`}
                        >
                          {dayObj.day}
                          {hasRecords && !isSelected && (
                            <span className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Plus size={14} /> 添加新记录 ({activeDate})
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <select 
                      value={newRecordType}
                      onChange={(e) => setNewRecordType(e.target.value as any)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option>施肥</option><option>喷药</option><option>灌溉</option><option>除草</option><option>采收</option><option>其他</option>
                    </select>
                    <input 
                      type="date" 
                      value={newRecordDate}
                      onChange={(e) => setNewRecordDate(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="操作备注..."
                      value={newRecordNote}
                      onChange={(e) => setNewRecordNote(e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    <button 
                      onClick={handleAddRecord}
                      disabled={!newRecordNote}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                      添加
                    </button>
                  </div>
                </div>
              </div>

              {/* 右侧：具体记录详情 */}
              <div className="w-full md:w-80 bg-slate-50 overflow-y-auto p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    {activeDate}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full font-bold">
                    {activeDayRecords.length} 条记录
                  </span>
                </div>

                {activeDayRecords.length > 0 ? (
                  activeDayRecords.map(record => (
                    <div key={record.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">
                          {record.type}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed italic border-l-2 border-emerald-500 pl-3">
                        {record.note}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-300 opacity-60 py-10">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                      <ClipboardList size={32} />
                    </div>
                    <p className="text-sm">该日期暂无记录</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropManagement;
