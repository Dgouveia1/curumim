import React, { useState, useEffect } from 'react';
import {
    PartyPopper,
    CalendarDays,
    Users,
    Flame,
    AlertCircle,
    UserX,
    ArrowRight,
    Baby,
    MapPin,
    Clock,
    CheckCircle2,
    Inbox,
    TrendingUp,
    ChevronRight,
} from 'lucide-react';
import { Lead } from '../types';
import { MOCK_LEADS, MOCK_VENDEDORES, ACTIVE_TENANT } from '../constants';

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function getGreeting(): string {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return 'Bom dia';
    if (h >= 12 && h < 18) return 'Boa tarde';
    return 'Boa noite';
}

function formatFullDate(date: Date): string {
    return date.toLocaleDateString('pt-BR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
}

function formatTime(date: Date): string {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function daysUntil(dateStr: string): number {
    return Math.ceil(
        (new Date(dateStr + 'T00:00:00').getTime() - new Date().setHours(0, 0, 0, 0)) / 86_400_000
    );
}

const TIPO_ICON: Record<string, string> = {
    festa: '🎂',
    espaco_kids: '🏠',
    recreacao: '🎪',
    outro: '📋',
};

const ETAPA_COLOR: Record<string, string> = {
    novo: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    contato: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    visita_espaco: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    orcamento: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    fechamento: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    confirmado: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

const ETAPA_LABEL: Record<string, string> = {
    novo: 'Novo', contato: 'Em Contato', visita_espaco: 'Visita',
    orcamento: 'Orçamento', fechamento: 'Fechamento', confirmado: '✅ Confirmado',
};

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTE: Card de KPI compacto
// ─────────────────────────────────────────────────────────────

interface KpiMiniProps {
    label: string;
    value: number | string;
    icon: React.ElementType;
    color: string;
    sub?: string;
    onClick?: () => void;
}

const KpiMini: React.FC<KpiMiniProps> = ({ label, value, icon: Icon, color, sub, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-4 p-4 rounded-2xl border border-gray-800/60 bg-gray-900/50
               hover:border-gray-700 hover:bg-gray-800/40 transition-all group text-left w-full"
    >
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: color + '18' }}>
            <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-black text-white font-display leading-none mt-0.5">{value}</p>
            {sub && <p className="text-[11px] text-gray-600 mt-0.5">{sub}</p>}
        </div>
        <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-gray-400 transition flex-shrink-0" />
    </button>
);

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTE: Card de Evento do Dia
// ─────────────────────────────────────────────────────────────

const EventoCard: React.FC<{ lead: Lead; days: number }> = ({ lead, days }) => {
    const vend = MOCK_VENDEDORES.find(v => v.id === lead.vendedor_id);
    const urgColor = days === 0
        ? '#f43f5e'
        : days <= 7
            ? '#f97316'
            : days <= 30
                ? '#FDB813'
                : '#22c55e';

    return (
        <div className="flex items-start gap-4 p-4 rounded-2xl border border-gray-800/50 bg-gray-900/40
                    hover:border-gray-700 hover:bg-gray-800/30 transition-all group">
            {/* Calendário */}
            <div className="flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center"
                style={{ backgroundColor: urgColor + '18', border: `1px solid ${urgColor}25` }}>
                <span className="text-[9px] font-black uppercase" style={{ color: urgColor }}>
                    {new Date(lead.data_evento! + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short' })}
                </span>
                <span className="text-lg font-black leading-none" style={{ color: urgColor }}>
                    {new Date(lead.data_evento! + 'T00:00:00').getDate()}
                </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm">{TIPO_ICON[lead.tipo_servico]}</span>
                    <p className="text-sm font-bold text-white truncate font-display">
                        {lead.nome_crianca ?? lead.nome}
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ETAPA_COLOR[lead.etapa_funil] ?? ''}`}>
                        {ETAPA_LABEL[lead.etapa_funil]}
                    </span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-500">
                    {lead.tema_festa && (
                        <span className="flex items-center gap-1">
                            <Baby className="w-3 h-3" /> {lead.tema_festa}
                        </span>
                    )}
                    {lead.qtd_criancas && (
                        <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" /> {lead.qtd_criancas} crianças
                        </span>
                    )}
                    {vend && (
                        <span className="flex items-center gap-1">
                            <span className={`w-3 h-3 rounded-full inline-block ${vend.cor_avatar}`} />
                            {vend.nome.split(' ')[0]}
                        </span>
                    )}
                </div>
            </div>

            {/* Countdown */}
            <div className="flex-shrink-0 text-right">
                <p className="text-xs font-black font-display" style={{ color: urgColor }}>
                    {days === 0 ? 'HOJE!' : days === 1 ? 'AMANHÃ' : `${days}d`}
                </p>
                <p className="text-[10px] text-gray-600">para o evento</p>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────

interface HomeViewProps {
    primaryColor: string;
    onNavigate?: (view: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ primaryColor, onNavigate }) => {
    const [now, setNow] = useState(new Date());

    // Relogio ao vivo
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // ── Cálculos sobre leads ─────────────────────────────────
    const total = MOCK_LEADS.length;
    const quentes = MOCK_LEADS.filter(l => l.temperatura === 'quente' || l.temperatura === 'muito_quente').length;
    const semVendedor = MOCK_LEADS.filter(l => !l.vendedor_id).length;
    const fupPendente = MOCK_LEADS.filter(l => l.fup_pendente).length;
    const novosHoje = MOCK_LEADS.filter(l => {
        const d = new Date(l.created_at);
        return d.toDateString() === now.toDateString();
    }).length;

    // ── Eventos próximos (30 dias) ordenados por data ────────
    const eventosProximos = MOCK_LEADS
        .filter(l => l.data_evento)
        .map(l => ({ lead: l, days: daysUntil(l.data_evento!) }))
        .filter(({ days }) => days >= 0 && days <= 60)
        .sort((a, b) => a.days - b.days);

    const eventosHoje = eventosProximos.filter(e => e.days === 0);
    const eventosSemana = eventosProximos.filter(e => e.days > 0 && e.days <= 7);
    const eventosMes = eventosProximos.filter(e => e.days > 7 && e.days <= 30);

    // ── Atividade recente: 5 leads mais recentes ─────────────
    const recentes = [...MOCK_LEADS]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

    return (
        <div className="h-full overflow-y-auto">
            <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

                {/* ── HERO: Boas-vindas ──────────────────────────────────── */}
                <div className="relative rounded-3xl overflow-hidden p-8"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}15 0%, transparent 60%), linear-gradient(to bottom right, #0f172a, #040812)` }}>
                    {/* Glow */}
                    <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
                        style={{ backgroundColor: primaryColor }} />
                    <div className="absolute -bottom-12 -left-8 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-10 bg-emerald-500" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                        {/* Texto */}
                        <div className="flex-1">
                            <p className="h7 text-gray-500 mb-1 font-display text-xs font-black uppercase tracking-widest">
                                {formatFullDate(now)}
                            </p>
                            <h1 className="text-3xl md:text-4xl font-black text-white font-display leading-tight mb-2"
                                style={{ textTransform: 'none' }}>
                                {getGreeting()},<br />
                                <span style={{ color: primaryColor }}>bem-vindo de volta! 🎉</span>
                            </h1>
                            <p className="text-gray-400 text-base leading-relaxed max-w-md">
                                Aqui está um resumo do seu dia no <strong className="text-gray-200">Grupo Curumim</strong>.
                                Você tem{' '}
                                <span className="font-bold" style={{ color: primaryColor }}>{eventosHoje.length}</span>{' '}
                                evento{eventosHoje.length !== 1 ? 's' : ''} hoje
                                {fupPendente > 0 && (
                                    <> e <span className="font-bold text-amber-400">{fupPendente} FUP{fupPendente !== 1 ? 's' : ''} pendente{fupPendente !== 1 ? 's' : ''}</span></>
                                )}.
                            </p>
                        </div>

                        {/* Relógio */}
                        <div className="flex-shrink-0 text-center md:text-right">
                            <div className="text-5xl font-black font-mono tracking-tighter"
                                style={{ color: primaryColor, textShadow: `0 0 30px ${primaryColor}50` }}>
                                {formatTime(now)}
                            </div>
                            <p className="text-xs text-gray-600 mt-1 font-display uppercase tracking-wider">
                                Horário de Brasília
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── KPIs RÁPIDOS ──────────────────────────────────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <KpiMini
                        label="Leads ativos"
                        value={total}
                        icon={Users}
                        color="#3b82f6"
                        sub={`+${novosHoje} hoje`}
                        onClick={() => onNavigate?.('kanban')}
                    />
                    <KpiMini
                        label="Leads quentes"
                        value={quentes}
                        icon={Flame}
                        color="#f43f5e"
                        sub="Alta prioridade"
                        onClick={() => onNavigate?.('kanban')}
                    />
                    <KpiMini
                        label="FUP pendente"
                        value={fupPendente}
                        icon={AlertCircle}
                        color="#f59e0b"
                        sub="Requer atenção"
                        onClick={() => onNavigate?.('kanban')}
                    />
                    <KpiMini
                        label="Sem vendedor"
                        value={semVendedor}
                        icon={UserX}
                        color="#a855f7"
                        sub="Clique para distribuir"
                        onClick={() => onNavigate?.('kanban')}
                    />
                </div>

                {/* ── AGENDA DO DIA ─────────────────────────────────────── */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                    {/* Eventos próximos */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-black text-white font-display flex items-center gap-2"
                                style={{ textTransform: 'none', fontSize: '1rem' }}>
                                <CalendarDays className="w-4 h-4" style={{ color: primaryColor }} />
                                Agenda de Eventos
                            </h2>
                            {eventosProximos.length > 0 && (
                                <button
                                    onClick={() => onNavigate?.('reports')}
                                    className="text-xs font-bold flex items-center gap-1 hover:opacity-80 transition font-display uppercase tracking-wide"
                                    style={{ color: primaryColor }}
                                >
                                    Ver todos <ArrowRight className="w-3 h-3" />
                                </button>
                            )}
                        </div>

                        {/* Hoje */}
                        {eventosHoje.length > 0 && (
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-2 font-display">
                                    🔴 Hoje
                                </p>
                                <div className="space-y-2">
                                    {eventosHoje.map(({ lead }) => (
                                        <EventoCard key={lead.id} lead={lead} days={0} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Esta semana */}
                        {eventosSemana.length > 0 && (
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-2 font-display">
                                    🟡 Esta Semana
                                </p>
                                <div className="space-y-2">
                                    {eventosSemana.slice(0, 3).map(({ lead, days }) => (
                                        <EventoCard key={lead.id} lead={lead} days={days} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Próximo mês */}
                        {eventosMes.length > 0 && (
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 font-display">
                                    🟢 Próximos 30 dias
                                </p>
                                <div className="space-y-2">
                                    {eventosMes.slice(0, 3).map(({ lead, days }) => (
                                        <EventoCard key={lead.id} lead={lead} days={days} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {eventosProximos.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-gray-800 rounded-2xl">
                                <PartyPopper className="w-10 h-10 text-gray-700 mb-3" />
                                <p className="text-gray-600 text-sm">Nenhum evento agendado nos próximos 60 dias.</p>
                            </div>
                        )}
                    </div>

                    {/* Coluna direita: Resumo de Contatos + Atividade Recente */}
                    <div className="space-y-4">

                        {/* Resumo por etapa */}
                        <div>
                            <h2 className="text-base font-black text-white font-display flex items-center gap-2 mb-3"
                                style={{ textTransform: 'none', fontSize: '1rem' }}>
                                <TrendingUp className="w-4 h-4" style={{ color: primaryColor }} />
                                Funil Hoje
                            </h2>
                            <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl overflow-hidden divide-y divide-gray-800/40">
                                {[
                                    { id: 'novo', label: 'Novos Leads', color: '#3b82f6' },
                                    { id: 'contato', label: 'Em Contato', color: '#eab308' },
                                    { id: 'visita_espaco', label: 'Visita Espaço', color: '#a855f7' },
                                    { id: 'orcamento', label: 'Orçamento', color: '#f97316' },
                                    { id: 'fechamento', label: 'Fechamento', color: '#f43f5e' },
                                    { id: 'confirmado', label: 'Confirmado', color: '#22c55e' },
                                ].map(stage => {
                                    const count = MOCK_LEADS.filter(l => l.etapa_funil === stage.id).length;
                                    const pct = Math.round((count / total) * 100);
                                    return (
                                        <div key={stage.id}
                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800/30 transition cursor-pointer"
                                            onClick={() => onNavigate?.('kanban')}
                                        >
                                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color }} />
                                            <span className="text-sm text-gray-300 flex-1 font-display font-semibold">{stage.label}</span>
                                            <div className="flex items-center gap-3">
                                                <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: stage.color }} />
                                                </div>
                                                <span className="text-sm font-black text-white w-5 text-right font-display">{count}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Atividade recente */}
                        <div>
                            <h2 className="text-base font-black text-white font-display flex items-center gap-2 mb-3"
                                style={{ textTransform: 'none', fontSize: '1rem' }}>
                                <Inbox className="w-4 h-4" style={{ color: primaryColor }} />
                                Contatos Recentes
                            </h2>
                            <div className="space-y-2">
                                {recentes.map(lead => {
                                    const vend = MOCK_VENDEDORES.find(v => v.id === lead.vendedor_id);
                                    const isHot = lead.temperatura === 'quente' || lead.temperatura === 'muito_quente';
                                    return (
                                        <div
                                            key={lead.id}
                                            onClick={() => onNavigate?.('kanban')}
                                            className="flex items-center gap-3 p-3 rounded-xl border border-gray-800/50
                                 hover:border-gray-700 hover:bg-gray-800/30 transition cursor-pointer group"
                                        >
                                            {/* Indicador de temperatura */}
                                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isHot ? 'bg-rose-500' : lead.fup_pendente ? 'bg-amber-500' : 'bg-gray-700'}`} />

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-bold text-gray-200 truncate font-display">{lead.nome}</p>
                                                    <span className="text-xs">{TIPO_ICON[lead.tipo_servico]}</span>
                                                </div>
                                                <p className="text-xs text-gray-600 truncate">{lead.resumo?.substring(0, 50)}…</p>
                                            </div>

                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {/* Avatar vendedor */}
                                                {vend
                                                    ? <span className={`w-6 h-6 rounded-full ${vend.cor_avatar} flex items-center justify-center text-[9px] font-black text-white`}>{vend.avatar_iniciais}</span>
                                                    : <span className="w-6 h-6 rounded-full bg-gray-800 border border-dashed border-gray-700 flex items-center justify-center text-[9px] text-gray-600">?</span>
                                                }
                                                {/* FUP */}
                                                {lead.fup_pendente
                                                    ? <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                                                    : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/40 flex-shrink-0" />
                                                }
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => onNavigate?.('kanban')}
                                className="w-full mt-3 py-2.5 rounded-xl border border-gray-800 text-xs font-bold text-gray-500
                           hover:text-white hover:border-gray-700 transition font-display uppercase tracking-wide flex items-center justify-center gap-2"
                            >
                                Ver todos os leads <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
