import React, { useState } from 'react';
import {
    BarChart2, TrendingUp, Clock, Users, PartyPopper, Star, Zap, Calendar,
    ChevronDown, ArrowUp, ArrowDown, Minus, BadgeCheck, AlertCircle,
    Target, DollarSign, Activity, Percent, Award, MapPin, Layers,
} from 'lucide-react';
import { MOCK_LEADS, MOCK_VENDEDORES } from '../constants';

// ─────────────────────────────────────────────────────────────
// DADOS MOCK
// ─────────────────────────────────────────────────────────────

const TEMPO_RESPOSTA_POR_VENDEDOR = [
    { nome: 'Camila Rocha', iniciais: 'CR', cor: 'bg-pink-500', tempoMin: 4, atendimentos: 18, conversao: 67, meta: 20, receita: 91400 },
    { nome: 'Rafael Souza', iniciais: 'RS', cor: 'bg-blue-500', tempoMin: 7, atendimentos: 14, conversao: 50, meta: 20, receita: 58200 },
    { nome: 'Jéssica Alves', iniciais: 'JA', cor: 'bg-violet-500', tempoMin: 3, atendimentos: 21, conversao: 71, meta: 20, receita: 107300 },
];

const VOLUME_SEMANAL = [
    { dia: 'Seg', leads: 8, festas: 5, espaco: 2, recreacao: 1 },
    { dia: 'Ter', leads: 12, festas: 7, espaco: 3, recreacao: 2 },
    { dia: 'Qua', leads: 6, festas: 4, espaco: 1, recreacao: 1 },
    { dia: 'Qui', leads: 15, festas: 9, espaco: 4, recreacao: 2 },
    { dia: 'Sex', leads: 10, festas: 6, espaco: 3, recreacao: 1 },
    { dia: 'Sáb', leads: 20, festas: 14, espaco: 4, recreacao: 2 },
    { dia: 'Dom', leads: 5, festas: 3, espaco: 1, recreacao: 1 },
];

const FUNIL_DADOS = [
    { etapa: 'Novos Leads', total: 76, pct: 100, color: '#3b82f6' },
    { etapa: 'Em Contato', total: 54, pct: 71, color: '#eab308' },
    { etapa: 'Visita Espaço', total: 38, pct: 50, color: '#a855f7' },
    { etapa: 'Orçamento', total: 25, pct: 33, color: '#f97316' },
    { etapa: 'Fechamento', total: 14, pct: 18, color: '#f43f5e' },
    { etapa: 'Confirmado', total: 9, pct: 12, color: '#22c55e' },
];

const SERVICO_DADOS = [
    { label: '🎂 Festas', valor: 52, pct: 65, color: '#FDB813' },
    { label: '🏠 Espaço Kids', valor: 19, pct: 24, color: '#22c55e' },
    { label: '🎪 Recreação', valor: 9, pct: 11, color: '#a855f7' },
];

const MESES_RECEITA = [
    { mes: 'Set', valor: 28400 },
    { mes: 'Out', valor: 35200 },
    { mes: 'Nov', valor: 42000 },
    { mes: 'Dez', valor: 61500 },
    { mes: 'Jan', valor: 38900 },
    { mes: 'Fev', valor: 47300 },
];

// ── BI Gerencial / Performance ───────────────────────────────

const ORIGEM_LEADS = [
    { canal: 'Instagram / Meta Ads', leads: 38, receita: 192000, cor: '#e1306c' },
    { canal: 'Indicação de Cliente', leads: 21, receita: 108500, cor: '#22c55e' },
    { canal: 'Google / SEO', leads: 11, receita: 54200, cor: '#4285f4' },
    { canal: 'WhatsApp Direto', leads: 4, receita: 18200, cor: '#25d366' },
    { canal: 'Outros', leads: 2, receita: 6900, cor: '#6b7280' },
];

// Drop-off entre etapas do funil
const DROPOFF = FUNIL_DADOS.slice(0, -1).map((f, i) => {
    const next = FUNIL_DADOS[i + 1];
    const perda = f.total - next.total;
    const pctPerda = Math.round((perda / f.total) * 100);
    return { de: f.etapa, para: next.etapa, perda, pctPerda, color: next.color };
});

// Taxa de ocupação mensal (máx = 8 sábados + domingos disponíveis = 16 horários/mês)
const OCUPACAO_MENSAL = [
    { mes: 'Set', ocupados: 9, disponivel: 16 },
    { mes: 'Out', ocupados: 11, disponivel: 16 },
    { mes: 'Nov', ocupados: 13, disponivel: 16 },
    { mes: 'Dez', ocupados: 15, disponivel: 16 },
    { mes: 'Jan', ocupados: 10, disponivel: 16 },
    { mes: 'Fev', ocupados: 12, disponivel: 16 },
];

// Heatmap: Faixa etária × Tema
const HEATMAP_TEMAS = [
    { tema: 'Princesa/Frozen', fx1: 5, fx2: 8, fx3: 3, fx4: 1 },
    { tema: 'Super-Heróis', fx1: 2, fx2: 9, fx3: 6, fx4: 2 },
    { tema: 'Minecraft/Games', fx1: 0, fx2: 4, fx3: 11, fx4: 5 },
    { tema: 'Safari/Animais', fx1: 7, fx2: 5, fx3: 2, fx4: 0 },
    { tema: 'Bita/Personagens', fx1: 9, fx2: 3, fx3: 0, fx4: 0 },
    { tema: 'Esporte', fx1: 0, fx2: 2, fx3: 5, fx4: 8 },
];
const FAIXAS = ['1–3 anos', '4–6 anos', '7–9 anos', '10+ anos'];

// LTV/CAC mock
const LTV_POR_SERVICO = [
    { label: '🎂 Festas', ltv: 14800, cac: 320, margem: 68, color: '#FDB813' },
    { label: '🏠 Espaço Kids', ltv: 9200, cac: 210, margem: 72, color: '#22c55e' },
    { label: '🎪 Recreação', ltv: 5400, cac: 180, margem: 61, color: '#a855f7' },
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function formatCurrency(v: number) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

const maxReceita = Math.max(...MESES_RECEITA.map(m => m.valor));
const maxVolume = Math.max(...VOLUME_SEMANAL.map(d => d.leads));
const maxOrigem = Math.max(...ORIGEM_LEADS.map(o => o.receita));

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTES
// ─────────────────────────────────────────────────────────────

interface KpiCardProps {
    title: string;
    value: string | number;
    subtext?: string;
    icon: React.ElementType;
    trend?: number;
    color: string;
    badge?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, subtext, icon: Icon, trend, color, badge }) => {
    const TrendIcon = trend === undefined ? Minus : trend > 0 ? ArrowUp : ArrowDown;
    const trendColor = trend === undefined ? 'text-gray-500' : trend > 0 ? 'text-emerald-400' : 'text-rose-400';
    return (
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 flex flex-col gap-3 hover:border-gray-700 transition">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
                <div className="flex items-center gap-2">
                    {badge && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-500 uppercase tracking-wide">{badge}</span>}
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
                        <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                </div>
            </div>
            <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                {subtext && <p className="text-xs text-gray-500 mt-0.5">{subtext}</p>}
            </div>
            {trend !== undefined && (
                <div className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
                    <TrendIcon className="w-3 h-3" />
                    {Math.abs(trend)}% vs. mês anterior
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
// ABA 1: VISÃO COMERCIAL (conteúdo atual)
// ─────────────────────────────────────────────────────────────

const TabComercial: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
    const totalLeads = MOCK_LEADS.length;
    const confirmados = MOCK_LEADS.filter(l => l.etapa_funil === 'confirmado').length;
    const fupPendente = MOCK_LEADS.filter(l => l.fup_pendente).length;
    const ticketMedio = MOCK_LEADS.filter(l => l.orcamento_estimado)
        .reduce((acc, l) => acc + (l.orcamento_estimado ?? 0), 0)
        / (MOCK_LEADS.filter(l => l.orcamento_estimado).length || 1);
    const taxaConversao = Math.round((confirmados / totalLeads) * 100);
    const receitaProjectada = confirmados * ticketMedio;

    return (
        <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                <KpiCard title="Total de Leads" value={totalLeads} icon={Users} color="#3b82f6" trend={12} subtext="Todos os status" />
                <KpiCard title="Confirmados" value={confirmados} icon={BadgeCheck} color="#22c55e" trend={8} subtext="Sinais recebidos" />
                <KpiCard title="Taxa Conversão" value={`${taxaConversao}%`} icon={TrendingUp} color={primaryColor} trend={3} subtext="Lead → Confirmado" />
                <KpiCard title="FUP Pendente" value={fupPendente} icon={AlertCircle} color="#f59e0b" trend={-5} subtext="Requer atenção" />
                <KpiCard title="Ticket Médio" value={formatCurrency(ticketMedio)} icon={Star} color="#a855f7" trend={6} subtext="Por evento" />
                <KpiCard title="Receita Proj." value={formatCurrency(receitaProjectada)} icon={Zap} color="#22c55e" trend={14} subtext="Confirmados × ticket" />
            </div>

            {/* Receita Mensal + Funil */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold text-white">Receita Mensal (R$)</h3>
                        <span className="text-xs text-gray-500">Últimos 6 meses</span>
                    </div>
                    <div className="flex items-end gap-3 h-40">
                        {MESES_RECEITA.map(m => {
                            const heightPct = Math.round((m.valor / maxReceita) * 100);
                            return (
                                <div key={m.mes} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                    <span className="text-[10px] text-gray-600 opacity-0 group-hover:opacity-100 transition font-mono">{formatCurrency(m.valor)}</span>
                                    <div className="w-full relative flex items-end" style={{ height: '112px' }}>
                                        <div className="w-full rounded-t-xl transition-all duration-500 group-hover:brightness-125"
                                            style={{ height: `${heightPct}%`, background: `linear-gradient(to top, ${primaryColor}cc, ${primaryColor}66)`, minHeight: '6px' }} />
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium">{m.mes}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-white mb-5">Funil de Conversão</h3>
                    <div className="space-y-3">
                        {FUNIL_DADOS.map(f => (
                            <div key={f.etapa}>
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>{f.etapa}</span>
                                    <span className="font-semibold text-gray-200">{f.total}</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${f.pct}%`, backgroundColor: f.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500 text-center">
                        Taxa final: <span className="text-emerald-400 font-bold">{taxaConversao}%</span>
                    </div>
                </div>
            </div>

            {/* Volume semanal + Distribuição serviço */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold text-white">Volume de Leads por Dia</h3>
                        <div className="flex items-center gap-4 text-[10px]">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: primaryColor }} />Festas</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Espaço</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500 inline-block" />Recreação</span>
                        </div>
                    </div>
                    <div className="flex items-end gap-2 h-32">
                        {VOLUME_SEMANAL.map(d => {
                            const total = d.leads;
                            const hTotal = Math.round((total / maxVolume) * 100);
                            const hFesta = Math.round((d.festas / total) * hTotal);
                            const hEspaco = Math.round((d.espaco / total) * hTotal);
                            const hRec = hTotal - hFesta - hEspaco;
                            return (
                                <div key={d.dia} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                    <span className="text-[10px] text-gray-600 opacity-0 group-hover:opacity-100 transition">{total}</span>
                                    <div className="w-full flex flex-col-reverse rounded-t-xl overflow-hidden" style={{ height: `${hTotal * 1.1}px`, minHeight: '6px' }}>
                                        <div style={{ height: `${hFesta}%`, backgroundColor: primaryColor + 'cc', flexShrink: 0 }} className="w-full" />
                                        <div style={{ height: `${hEspaco}%`, flexShrink: 0 }} className="w-full bg-emerald-500/70" />
                                        <div style={{ height: `${hRec}%`, flexShrink: 0 }} className="w-full bg-violet-500/70" />
                                    </div>
                                    <span className="text-[10px] text-gray-500">{d.dia}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-white mb-5">Volume por Serviço</h3>
                    <div className="space-y-4">
                        {SERVICO_DADOS.map(s => (
                            <div key={s.label}>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-gray-300 font-medium">{s.label}</span>
                                    <span className="text-gray-400">{s.valor} <span className="text-gray-600">({s.pct}%)</span></span>
                                </div>
                                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 space-y-3 pt-4 border-t border-gray-800">
                        {[
                            { label: '🎂 Festas', receita: 212400, color: primaryColor },
                            { label: '🏠 Espaço Kids', receita: 59300, color: '#22c55e' },
                            { label: '🎪 Recreação', receita: 16200, color: '#a855f7' },
                        ].map(r => (
                            <div key={r.label} className="flex items-center justify-between text-xs">
                                <span className="text-gray-400">{r.label}</span>
                                <span className="font-bold" style={{ color: r.color }}>{formatCurrency(r.receita)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Performance Vendedores */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    Performance da Equipe (Operacional)
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-800">
                                <th className="text-left pb-3 font-semibold">Vendedor</th>
                                <th className="text-center pb-3 font-semibold">Atendimentos</th>
                                <th className="text-center pb-3 font-semibold">Tempo Médio</th>
                                <th className="text-center pb-3 font-semibold">Conversão</th>
                                <th className="text-left pb-3 font-semibold">Performance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/60">
                            {TEMPO_RESPOSTA_POR_VENDEDOR.map(v => (
                                <tr key={v.nome} className="hover:bg-gray-800/30 transition">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full ${v.cor} flex items-center justify-center text-xs font-bold text-white shadow`}>{v.iniciais}</div>
                                            <span className="font-medium text-gray-200">{v.nome}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-center"><span className="text-white font-bold">{v.atendimentos}</span></td>
                                    <td className="py-4 text-center">
                                        <span className={`font-bold ${v.tempoMin <= 5 ? 'text-emerald-400' : v.tempoMin <= 8 ? 'text-amber-400' : 'text-rose-400'}`}>{v.tempoMin} min</span>
                                    </td>
                                    <td className="py-4 text-center"><span className="font-bold text-white">{v.conversao}%</span></td>
                                    <td className="py-4 pr-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full" style={{ width: `${v.conversao}%`, backgroundColor: '#FDB813' }} />
                                            </div>
                                            <span className="text-[10px] text-gray-600 w-8 text-right">{v.conversao}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Próximos Eventos Confirmados */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Próximos Eventos Confirmados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {MOCK_LEADS
                        .filter(l => l.etapa_funil === 'confirmado' && l.data_evento)
                        .sort((a, b) => (a.data_evento ?? '').localeCompare(b.data_evento ?? ''))
                        .map(l => {
                            const days = Math.ceil((new Date(l.data_evento! + 'T00:00:00').getTime() - Date.now()) / 86_400_000);
                            return (
                                <div key={l.id} className="p-4 rounded-xl border border-gray-700/50 bg-gray-800/40 flex items-center gap-3 hover:border-gray-600 transition">
                                    <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-center flex-shrink-0"
                                        style={{ backgroundColor: primaryColor + '20', color: primaryColor }}>
                                        <span className="text-[10px] font-bold uppercase">
                                            {new Date(l.data_evento! + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short' })}
                                        </span>
                                        <span className="text-lg font-black leading-none">
                                            {new Date(l.data_evento! + 'T00:00:00').getDate()}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-white text-sm truncate">{l.nome_crianca ?? l.nome}</p>
                                        <p className="text-xs text-gray-500 truncate">{l.tema_festa ?? 'Tema a confirmar'} · {l.qtd_criancas} crianças</p>
                                        <p className={`text-[10px] font-bold mt-0.5 ${days <= 7 ? 'text-rose-400' : days <= 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                            {days <= 0 ? 'Hoje!' : `Em ${days} dia${days !== 1 ? 's' : ''}`}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
// ABA 2: PERFORMANCE DO NEGÓCIO (métricas gerenciais)
// ─────────────────────────────────────────────────────────────

const TabPerformance: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
    // Taxa de Ocupação média
    const ocupMedia = Math.round(OCUPACAO_MENSAL.reduce((a, m) => a + (m.ocupados / m.disponivel) * 100, 0) / OCUPACAO_MENSAL.length);
    // Sales Cycle (mock)
    const salesCycle = 11; // dias médios
    // Receita total
    const receitaTotal = ORIGEM_LEADS.reduce((a, o) => a + o.receita, 0);
    // LTV médio ponderado
    const ltvMedio = Math.round(LTV_POR_SERVICO.reduce((a, l) => a + l.ltv, 0) / LTV_POR_SERVICO.length);
    const cacMedio = Math.round(LTV_POR_SERVICO.reduce((a, l) => a + l.cac, 0) / LTV_POR_SERVICO.length);
    const roiCac = Math.round(ltvMedio / cacMedio);

    // Máx heatmap
    const heatMax = Math.max(...HEATMAP_TEMAS.flatMap(t => [t.fx1, t.fx2, t.fx3, t.fx4]));

    return (
        <div className="space-y-6">

            {/* ── KPIs Executivos ────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard title="Taxa de Ocupação" value={`${ocupMedia}%`} icon={Activity} color="#FDB813" trend={8} subtext="Fins de semana / mês" badge="operacional" />
                <KpiCard title="Ciclo de Vendas" value={`${salesCycle} dias`} icon={Clock} color="#3b82f6" trend={-12} subtext="Do 1º contato ao sinal" badge="eficiência" />
                <KpiCard title="LTV Médio / Família" value={formatCurrency(ltvMedio)} icon={TrendingUp} color="#22c55e" trend={18} subtext="Receita ao longo do tempo" badge="estratégico" />
                <KpiCard title="ROI sobre CAC" value={`${roiCac}× retorno`} icon={Target} color="#a855f7" trend={5} subtext={`CAC médio: ${formatCurrency(cacMedio)}`} badge="marketing" />
            </div>

            {/* ── Receita por Canal de Origem + Ocupação Mensal ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* Receita por Origem (Barras horizontais) */}
                <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            Receita por Origem do Lead
                        </h3>
                        <span className="text-xs text-gray-500">{formatCurrency(receitaTotal)} total</span>
                    </div>
                    <div className="space-y-3">
                        {ORIGEM_LEADS.map(o => {
                            const pct = Math.round((o.receita / maxOrigem) * 100);
                            const pctTotal = Math.round((o.receita / receitaTotal) * 100);
                            return (
                                <div key={o.canal}>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="text-gray-300 font-medium flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: o.cor }} />
                                            {o.canal}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-600 text-[10px]">{o.leads} leads</span>
                                            <span className="font-bold" style={{ color: o.cor }}>{formatCurrency(o.receita)}</span>
                                            <span className="text-gray-600 text-[10px]">{pctTotal}%</span>
                                        </div>
                                    </div>
                                    <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: o.cor + '99' }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Taxa de Ocupação Mensal */}
                <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Activity className="w-4 h-4 text-gray-400" />
                            Taxa de Ocupação Mensal
                        </h3>
                        <span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ backgroundColor: primaryColor + '20', color: primaryColor }}>
                            Média: {ocupMedia}%
                        </span>
                    </div>
                    <div className="flex items-end gap-3 h-36 mb-3">
                        {OCUPACAO_MENSAL.map(m => {
                            const pct = Math.round((m.ocupados / m.disponivel) * 100);
                            const badColor = pct >= 80 ? '#22c55e' : pct >= 60 ? primaryColor : '#f43f5e';
                            return (
                                <div key={m.mes} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                    <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition" style={{ color: badColor }}>{pct}%</span>
                                    <div className="w-full relative flex items-end" style={{ height: '110px' }}>
                                        <div className="w-full rounded-t-xl transition-all duration-500 group-hover:brightness-110"
                                            style={{ height: `${pct}%`, backgroundColor: badColor + '99', minHeight: '6px' }} />
                                    </div>
                                    <span className="text-xs text-gray-500">{m.mes}</span>
                                </div>
                            );
                        })}
                    </div>
                    {/* Legenda */}
                    <div className="flex items-center gap-4 text-[10px] pt-3 border-t border-gray-800">
                        <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />≥ 80% Ótimo</span>
                        <span className="flex items-center gap-1" style={{ color: primaryColor }}><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: primaryColor }} />60–79% Bom</span>
                        <span className="flex items-center gap-1 text-rose-400"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /></span>
                        <span className="text-rose-400">{'< 60% Atenção'}</span>
                    </div>
                </div>
            </div>

            {/* ── Drop-off do Funil + LTV por Serviço ─────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* Drop-off Rate entre etapas */}
                <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Layers className="w-4 h-4 text-gray-400" />
                            Drop-off por Etapa do Funil
                        </h3>
                        <span className="text-xs text-gray-500">Onde perdemos leads</span>
                    </div>
                    <div className="space-y-3">
                        {DROPOFF.map((d, i) => {
                            const urgente = d.pctPerda >= 40;
                            return (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-28 text-[10px] text-gray-500 text-right flex-shrink-0 leading-tight">
                                        {d.de} → {d.para}
                                    </div>
                                    <div className="flex-1 h-5 bg-gray-800 rounded-full overflow-hidden relative">
                                        <div className="h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                                            style={{ width: `${d.pctPerda}%`, backgroundColor: urgente ? '#f43f5e99' : '#f97316' + '80' }}>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 w-24 flex-shrink-0">
                                        <span className={`text-xs font-bold ${urgente ? 'text-rose-400' : 'text-amber-400'}`}>
                                            -{d.pctPerda}%
                                        </span>
                                        <span className="text-[10px] text-gray-600">({d.perda} leads)</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-600 flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                        <span>Foco: <strong className="text-rose-400">Orçamento → Fechamento</strong> tem o maior drop-off ({DROPOFF[3]?.pctPerda}%). Priorize follow-up nessa etapa.</span>
                    </div>
                </div>

                {/* LTV, CAC e Margem por Serviço */}
                <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            LTV · CAC · Margem por Serviço
                        </h3>
                    </div>
                    <div className="space-y-5">
                        {LTV_POR_SERVICO.map(l => (
                            <div key={l.label} className="p-4 rounded-xl border" style={{ borderColor: l.color + '30', backgroundColor: l.color + '08' }}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-bold text-white">{l.label}</span>
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: l.color + '20', color: l.color }}>
                                        Margem {l.margem}%
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <p className="text-gray-600 mb-0.5">LTV (3 anos)</p>
                                        <p className="font-bold text-base" style={{ color: l.color }}>{formatCurrency(l.ltv)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 mb-0.5">CAC</p>
                                        <p className="font-bold text-base text-gray-300">{formatCurrency(l.cac)}</p>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="flex justify-between text-[10px] text-gray-600 mb-1">
                                        <span>CAC → LTV</span>
                                        <span className="font-bold" style={{ color: l.color }}>{Math.round(l.ltv / l.cac)}× ROI</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${l.margem}%`, backgroundColor: l.color }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Metas de Vendedores (% atingimento) ─────────── */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-400" />
                    Atingimento de Meta — Vendedores (Mês Atual)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TEMPO_RESPOSTA_POR_VENDEDOR.map(v => {
                        const pctMeta = Math.round((v.atendimentos / v.meta) * 100);
                        const metaColor = pctMeta >= 100 ? '#22c55e' : pctMeta >= 75 ? '#FDB813' : '#f43f5e';
                        const circumference = 2 * Math.PI * 36;
                        const strokeDash = (pctMeta / 100) * circumference;
                        return (
                            <div key={v.nome} className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-800 hover:border-gray-700 transition">
                                {/* Gauge circular SVG */}
                                <div className="relative w-24 h-24">
                                    <svg viewBox="0 0 80 80" className="w-24 h-24 -rotate-90">
                                        <circle cx="40" cy="40" r="36" fill="none" stroke="#1f2937" strokeWidth="7" />
                                        <circle cx="40" cy="40" r="36" fill="none" stroke={metaColor} strokeWidth="7"
                                            strokeDasharray={`${Math.min(strokeDash, circumference)} ${circumference}`}
                                            strokeLinecap="round" className="transition-all duration-1000" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-lg font-black" style={{ color: metaColor }}>{pctMeta}%</span>
                                        <span className="text-[9px] text-gray-600 font-semibold">da meta</span>
                                    </div>
                                </div>
                                {/* Info */}
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <div className={`w-6 h-6 rounded-full ${v.cor} flex items-center justify-center text-[9px] font-black text-white`}>{v.iniciais}</div>
                                        <span className="font-bold text-sm text-white">{v.nome.split(' ')[0]}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-4 text-[10px] text-gray-500 mt-2">
                                        <div className="text-center">
                                            <p className="text-gray-200 font-bold text-sm">{v.atendimentos}</p>
                                            <p>atend.</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-200 font-bold text-sm">{formatCurrency(v.receita)}</p>
                                            <p>receita</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Heatmap: Faixa Etária × Tema ─────────────────── */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <PartyPopper className="w-4 h-4 text-gray-400" />
                        Mapa de Calor — Faixa Etária × Tema
                    </h3>
                    <span className="text-xs text-gray-500">Nº de contratações</span>
                </div>
                {/* Grid heatmap */}
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr>
                                <th className="text-left text-gray-500 font-semibold pb-2 pr-4 w-40">Tema</th>
                                {FAIXAS.map(f => (
                                    <th key={f} className="text-center text-gray-500 font-semibold pb-2 px-2">{f}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/30">
                            {HEATMAP_TEMAS.map(row => {
                                const vals = [row.fx1, row.fx2, row.fx3, row.fx4];
                                return (
                                    <tr key={row.tema} className="hover:bg-gray-800/20 transition">
                                        <td className="py-2 pr-4 text-gray-300 font-medium text-[11px]">{row.tema}</td>
                                        {vals.map((val, fi) => {
                                            const intensity = val === 0 ? 0 : Math.round((val / heatMax) * 100);
                                            const bgAlpha = val === 0 ? '05' : Math.round((intensity / 100) * 220).toString(16).padStart(2, '0');
                                            return (
                                                <td key={fi} className="py-2 px-2 text-center">
                                                    <div className="mx-auto w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition"
                                                        style={{
                                                            backgroundColor: `#FDB813${bgAlpha}`,
                                                            color: val === 0 ? '#374151' : intensity > 60 ? '#fff' : '#FDB813',
                                                        }}>
                                                        {val === 0 ? '—' : val}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <p className="text-[10px] text-gray-600 mt-4">
                    💡 <strong className="text-gray-400">Insight:</strong> "Minecraft/Games" domina a faixa 7–9 anos. "Bita/Personagens" é exclusivo de 1–3 anos. Explore campanhas segmentadas por faixa.
                </p>
            </div>

        </div>
    );
};

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL: ReportsView
// ─────────────────────────────────────────────────────────────

interface ReportsViewProps {
    primaryColor: string;
}

type TabId = 'comercial' | 'performance';

export const ReportsView: React.FC<ReportsViewProps> = ({ primaryColor }) => {
    const [periodo, setPeriodo] = useState('mes');
    const [activeTab, setActiveTab] = useState<TabId>('comercial');

    const tabs: { id: TabId; label: string; desc: string }[] = [
        { id: 'comercial', label: '📊 Visão Comercial', desc: 'Leads, conversão e equipe' },
        { id: 'performance', label: '🎯 Performance do Negócio', desc: 'BI Estratégico e Financeiro' },
    ];

    return (
        <div className="h-full overflow-y-auto p-6 space-y-6 pb-20 md:pb-6">

            {/* ── Header ───────────────────────────────────────── */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BarChart2 className="w-7 h-7" style={{ color: primaryColor }} />
                        Relatórios & BI
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Visão gerencial e estratégica do Grupo Curumim</p>
                </div>
                <div className="relative">
                    <select value={periodo} onChange={e => setPeriodo(e.target.value)}
                        className="appearance-none bg-gray-800/70 border border-gray-700 rounded-xl px-4 pr-8 py-2 text-sm text-gray-300 focus:outline-none cursor-pointer">
                        <option value="semana">Esta Semana</option>
                        <option value="mes">Este Mês</option>
                        <option value="trimestre">Trimestre</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
            </div>

            {/* ── Tabs ─────────────────────────────────────────── */}
            <div className="flex gap-2 border-b border-gray-800 pb-0">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex flex-col items-start px-5 py-3 rounded-t-xl border-b-2 transition-all text-left ${activeTab === tab.id
                            ? 'border-current text-white bg-gray-800/40'
                            : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/20'
                            }`}
                        style={activeTab === tab.id ? { borderColor: primaryColor, color: primaryColor } : {}}
                    >
                        <span className="text-sm font-bold font-display">{tab.label}</span>
                        <span className="text-[10px] text-gray-600 font-normal mt-0.5">{tab.desc}</span>
                    </button>
                ))}
            </div>

            {/* ── Conteúdo da aba ──────────────────────────────── */}
            {activeTab === 'comercial' && <TabComercial primaryColor={primaryColor} />}
            {activeTab === 'performance' && <TabPerformance primaryColor={primaryColor} />}

        </div>
    );
};
