
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend
} from 'recharts';
import { 
  Thermometer, Droplets, Wind, Sprout, 
  TrendingUp, AlertTriangle, CheckCircle, Activity 
} from 'lucide-react';
import { SensorData } from '../types';

const data = [
  { name: '00:00', temp: 18, humidity: 82 },
  { name: '04:00', temp: 16, humidity: 85 },
  { name: '08:00', temp: 22, humidity: 70 },
  { name: '12:00', temp: 28, humidity: 45 },
  { name: '16:00', temp: 26, humidity: 50 },
  { name: '20:00', temp: 21, humidity: 75 },
];

const sensorData: SensorData[] = [
  { id: '1', name: '土壤湿度', value: 42, unit: '%', status: 'normal', icon: 'Droplets' },
  { id: '2', name: '环境温度', value: 24.5, unit: '°C', status: 'normal', icon: 'Thermometer' },
  { id: '3', name: '酸碱度 (pH)', value: 6.2, unit: 'pH', status: 'warning', icon: 'Activity' },
  { id: '4', name: '养分指数 (NPK)', value: 85, unit: '指数', status: 'normal', icon: 'Sprout' },
];

const statusLabels: Record<string, string> = {
  normal: '正常',
  warning: '警告',
  critical: '危急',
};

const StatCard: React.FC<{ sensor: SensorData }> = ({ sensor }) => {
  const IconMap: any = { Thermometer, Droplets, Wind, Sprout, Activity };
  const Icon = IconMap[sensor.icon] || Activity;
  
  const statusColors = {
    normal: 'text-emerald-600 bg-emerald-50',
    warning: 'text-amber-600 bg-amber-50',
    critical: 'text-rose-600 bg-rose-50',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${statusColors[sensor.status]}`}>
          <Icon size={24} />
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase ${statusColors[sensor.status]}`}>
          {statusLabels[sensor.status]}
        </span>
      </div>
      <h3 className="text-slate-500 text-sm font-medium">{sensor.name}</h3>
      <div className="flex items-baseline mt-1">
        <span className="text-2xl font-bold text-slate-800">{sensor.value}</span>
        <span className="ml-1 text-slate-400 text-sm">{sensor.unit}</span>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">农场概览</h1>
          <p className="text-slate-500">实时监控您的农业资产状态</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            导出报告
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm shadow-emerald-200">
            添加传感器
          </button>
        </div>
      </div>

      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sensorData.map(sensor => (
          <StatCard key={sensor.id} sensor={sensor} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 主要趋势图 - 混合视图 */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Activity className="text-emerald-500" size={20} />
            环境综合趋势
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  labelFormatter={(label) => `时间: ${label}`}
                  formatter={(value, name) => [value, name === 'temp' ? '温度 (°C)' : '湿度 (%)']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="temp" name="温度" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorTemp)" />
                <Area type="monotone" dataKey="humidity" name="湿度" stroke="#3b82f6" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 系统健康状态 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">系统健康状况</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">灌溉系统</span>
                  <span className="text-sm text-slate-500">98%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">肥料罐液位</span>
                  <span className="text-sm text-slate-500">24%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <TrendingUp size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">仓储容量</span>
                  <span className="text-sm text-slate-500">65%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>
          <button className="w-full mt-8 py-3 bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors">
            查看维护日志
          </button>
        </div>
      </div>

      {/* 新增的详细分析图表行 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 环境温度折线图 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Thermometer className="text-orange-500" size={20} />
            环境温度详细波动
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis unit="°C" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="temp" 
                  name="温度" 
                  stroke="#f97316" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 土壤湿度折线图 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Droplets className="text-blue-500" size={20} />
            土壤湿度详细趋势
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis unit="%" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  name="湿度" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
