import React from 'react';
import { Users, Flame, AlertCircle, TrendingUp, ArrowRight } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { Lead } from '../types';

interface DashboardViewProps {
    leads: Lead[];
    primaryColor: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ leads, primaryColor }) => {
    const hotLeads = leads.filter(l => l.temperatura === 'muito_quente' || l.temperatura === 'quente').length;
    const pendingFup = leads.filter(l => l.fup_pendente).length;

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight font-display">Visão Geral</h2>
                    <p className="text-gray-500 mt-1 text-base">Acompanhe a performance da sua operação em tempo real.</p>
                </div>
                <div className="flex gap-2">
                    <select className="bg-dark-800 border border-gray-700 text-sm text-white rounded-lg px-4 py-2 focus:outline-none">
                        <option>Hoje</option>
                        <option>Esta Semana</option>
                        <option>Este Mês</option>
                    </select>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total de Leads"
                    value={leads.length}
                    icon={Users}
                    trend="+12%"
                    color={primaryColor}
                    subtext="4 novos hoje"
                />
                <StatsCard
                    title="Leads Quentes"
                    value={hotLeads}
                    icon={Flame}
                    trend="+5%"
                    color="#f43f5e"
                    subtext="Alta probabilidade"
                />
                <StatsCard
                    title="FUP Pendente"
                    value={pendingFup}
                    icon={AlertCircle}
                    color="#f59e0b"
                    subtext="Requer atenção imediata"
                />
                <StatsCard
                    title="Conversão"
                    value="3.2%"
                    icon={TrendingUp}
                    trend="+0.4%"
                    color="#10b981"
                    subtext="Média do setor: 2.1%"
                />
            </div>

            {/* Charts / Lists Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                {/* Simple Bar Chart Mockup (CSS only for robustness) */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-xl flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-6">Volume de Entrada</h3>
                    <div className="flex-1 flex items-end justify-between gap-2 px-2">
                        {[45, 60, 35, 70, 55, 80, 65].map((h, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 w-full group cursor-pointer">
                                <div className="relative w-full">
                                    <div
                                        className="w-full bg-gradient-to-t from-gray-800 to-gray-700 rounded-t-sm group-hover:from-brand-600 group-hover:to-brand-500 transition-all duration-300 relative z-10"
                                        style={{ height: `${h * 2}px` }}
                                    ></div>
                                    {/* Glow Effect on hover */}
                                    <div className="absolute bottom-0 left-0 w-full h-20 bg-brand-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <span className="text-xs text-gray-500 font-mono">
                                    {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass-panel p-0 rounded-xl flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-gray-800">
                        <h3 className="text-lg font-semibold text-white">Atividade Recente</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {leads.slice(0, 5).map((lead, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
                                <div className={`w-2 h-2 rounded-full ${lead.fup_pendente ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate group-hover:text-brand-300 transition-colors">{lead.nome}</p>
                                    <p className="text-xs text-gray-500 truncate">{lead.resumo.substring(0, 40)}...</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};