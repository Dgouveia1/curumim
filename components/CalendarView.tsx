import React, { useState, useMemo } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    CalendarDays,
    Clock,
    Users,
    Baby,
    PartyPopper,
    X,
    MapPin,
    DollarSign,
    Tag,
} from 'lucide-react';
import { Lead } from '../types';
import { MOCK_LEADS, MOCK_VENDEDORES } from '../constants';

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const MONTHS_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const DAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const DAYS_FULL = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

const TIPO_LABEL: Record<string, string> = {
    festa: '🎂 Festa', espaco_kids: '🏠 Espaço Kids', recreacao: '🎪 Recreação', outro: '📋 Outro',
};

const TIPO_BG: Record<string, string> = {
    festa: 'bg-yellow-500',
    espaco_kids: 'bg-emerald-500',
    recreacao: 'bg-violet-500',
    outro: 'bg-gray-500',
};

const TIPO_LIGHT: Record<string, string> = {
    festa: '#FDB81320',
    espaco_kids: '#22c55e20',
    recreacao: '#a855f720',
    outro: '#6b728020',
};

const TIPO_COLOR: Record<string, string> = {
    festa: '#FDB813',
    espaco_kids: '#22c55e',
    recreacao: '#a855f7',
    outro: '#6b7280',
};

function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate();
}

function formatDatePt(d: Date) {
    return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatCurrency(v: number) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

// ─────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────

interface CalEvent {
    id: string;
    lead: Lead;
    date: Date;
}

// ─────────────────────────────────────────────────────────────
// LEGENDA DE VENDEDOR
// ─────────────────────────────────────────────────────────────

const VendedorTag: React.FC<{ vendedorId?: string; size?: 'sm' | 'xs' }> = ({ vendedorId, size = 'sm' }) => {
    const vend = MOCK_VENDEDORES.find(v => v.id === vendedorId);
    if (!vend) return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-800/60 border border-gray-700/50 px-1.5 py-0.5 rounded-full">
            ? Sem resp.
        </span>
    );
    return (
        <span className={`inline-flex items-center gap-1 ${size === 'xs' ? 'text-[9px]' : 'text-[10px]'} font-bold text-white px-1.5 py-0.5 rounded-full`}
            style={{ backgroundColor: `color-mix(in srgb, transparent 60%, currentColor)` }}
        >
            <span className={`w-3.5 h-3.5 rounded-full ${vend.cor_avatar} flex items-center justify-center text-[7px] font-black`}>
                {vend.avatar_iniciais[0]}
            </span>
            {size === 'sm' ? vend.nome.split(' ')[0] : vend.avatar_iniciais}
        </span>
    );
};

// ─────────────────────────────────────────────────────────────
// MINI PILL (evento no calendário)
// ─────────────────────────────────────────────────────────────

const EventPill: React.FC<{ ev: CalEvent; onClick: (ev: CalEvent) => void }> = ({ ev, onClick }) => {
    const { lead } = ev;
    const vend = MOCK_VENDEDORES.find(v => v.id === lead.vendedor_id);
    const color = TIPO_COLOR[lead.tipo_servico] ?? '#6b7280';

    return (
        <button
            onClick={e => { e.stopPropagation(); onClick(ev); }}
            className="w-full text-left text-[10px] font-bold px-1.5 py-0.5 rounded-md truncate
                 flex items-center gap-1 hover:brightness-110 transition mb-0.5 group"
            style={{ backgroundColor: color + '28', color, border: `1px solid ${color}35` }}
            title={`${lead.nome_crianca ?? lead.nome} — ${vend?.nome ?? 'Sem responsável'}`}
        >
            {/* Dot de tipo */}
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <span className="truncate flex-1">
                {lead.nome_crianca ?? lead.nome}
            </span>
            {/* Avatar do vendedor */}
            {vend && (
                <span className={`w-3.5 h-3.5 rounded-full ${vend.cor_avatar} flex items-center justify-center text-[7px] font-black text-white flex-shrink-0`}>
                    {vend.avatar_iniciais[0]}
                </span>
            )}
        </button>
    );
};

// ─────────────────────────────────────────────────────────────
// MODAL DE DETALHE DO EVENTO
// ─────────────────────────────────────────────────────────────

const EventModal: React.FC<{ ev: CalEvent | null; onClose: () => void; onNavigate?: (view: string) => void }> = ({ ev, onClose, onNavigate }) => {
    if (!ev) return null;
    const { lead } = ev;
    const vend = MOCK_VENDEDORES.find(v => v.id === lead.vendedor_id);
    const color = TIPO_COLOR[lead.tipo_servico] ?? '#6b7280';
    const days = Math.ceil((ev.date.getTime() - new Date().setHours(0, 0, 0, 0)) / 86_400_000);

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]" onClick={onClose} />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[90]
                      w-full max-w-sm bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">

                {/* Header colorido */}
                <div className="px-5 pt-5 pb-4 relative" style={{ background: `linear-gradient(135deg, ${color}18, transparent)` }}>
                    <div className="flex items-start justify-between">
                        <div>
                            <span className="text-xs font-black uppercase tracking-widest mb-1 block" style={{ color }}>
                                {TIPO_LABEL[lead.tipo_servico]}
                            </span>
                            <h3 className="text-lg font-black text-white font-display leading-tight">
                                {lead.nome_crianca
                                    ? <>Festa de <span style={{ color }}>{lead.nome_crianca}</span></>
                                    : lead.nome}
                            </h3>
                            {lead.tema_festa && (
                                <p className="text-sm text-gray-400 mt-0.5">Tema: {lead.tema_festa}</p>
                            )}
                        </div>
                        <button onClick={onClose}
                            className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition flex-shrink-0">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Data com countdown */}
                    <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-300">
                            <CalendarDays className="w-4 h-4 text-gray-500" />
                            {formatDatePt(ev.date)}
                        </div>
                        <span className={`text-xs font-black px-2 py-0.5 rounded-full ml-auto ${days < 0 ? 'text-gray-500 bg-gray-800' : days === 0 ? 'text-white' : 'text-white'}`}
                            style={days >= 0 ? { backgroundColor: color + '30', color } : {}}>
                            {days < 0 ? 'Evento passado' : days === 0 ? '🎉 Hoje!' : days === 1 ? 'Amanhã' : `Em ${days} dias`}
                        </span>
                    </div>
                </div>

                {/* Detalhes */}
                <div className="px-5 pb-5 space-y-3">
                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                        {lead.qtd_criancas && (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Users className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                                <span><strong className="text-gray-200">{lead.qtd_criancas}</strong> crianças</span>
                            </div>
                        )}
                        {lead.orcamento_estimado && (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <DollarSign className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                                <span style={{ color: color }}>{formatCurrency(lead.orcamento_estimado)}</span>
                            </div>
                        )}
                        {lead.local_preferido && (
                            <div className="flex items-center gap-2 text-sm text-gray-400 col-span-2">
                                <MapPin className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                                <span>{{ no_espaco: 'Espaço Curumim', em_casa: 'Endereço do cliente', a_definir: 'A definir' }[lead.local_preferido] ?? lead.local_preferido}</span>
                            </div>
                        )}
                    </div>

                    {/* Contato */}
                    <div className="border-t border-gray-800/60 pt-3">
                        <p className="text-xs text-gray-600 mb-1 font-semibold uppercase tracking-wide">Responsável do contato</p>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                            <Baby className="w-3.5 h-3.5 text-gray-600" />
                            {lead.nome}
                            <span className="text-gray-600 text-xs font-mono">{lead.telefone}</span>
                        </div>
                    </div>

                    {/* Vendedor */}
                    <div className="border-t border-gray-800/60 pt-3">
                        <p className="text-xs text-gray-600 mb-2 font-semibold uppercase tracking-wide">Agendado por</p>
                        {vend ? (
                            <div className="flex items-center gap-3 p-3 rounded-xl"
                                style={{ backgroundColor: color + '10', border: `1px solid ${color}20` }}>
                                <div className={`w-9 h-9 rounded-full ${vend.cor_avatar} flex items-center justify-center text-sm font-black text-white shadow`}>
                                    {vend.avatar_iniciais}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{vend.nome}</p>
                                    <p className="text-xs text-gray-500">{vend.email}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-sm text-gray-500 border border-dashed border-gray-800 rounded-xl p-3">
                                <Users className="w-4 h-4" />
                                Nenhum vendedor atribuído
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    {lead.tags && lead.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 border-t border-gray-800/60 pt-3">
                            {lead.tags.map(t => (
                                <span key={t} className="text-[10px] px-2.5 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-400 flex items-center gap-1">
                                    <Tag className="w-2.5 h-2.5" />{t}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Ação rápida */}
                    <button
                        className="w-full mt-1 py-2.5 rounded-xl font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition hover:opacity-90"
                        style={{ backgroundColor: color, color: '#1a1a1a' }}
                        onClick={() => { onClose(); onNavigate?.('chat'); }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        Abrir Conversa
                    </button>
                </div>
            </div>
        </>
    );
};

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────

interface CalendarViewProps {
    primaryColor: string;
    onNavigate?: (view: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ primaryColor, onNavigate }) => {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedEvent, setSelectedEvent] = useState<CalEvent | null>(null);
    const [view, setView] = useState<'month' | 'week'>('month');
    const [filterVendedor, setFilterVendedor] = useState<string>('');

    // ── Converter MOCK_LEADS → Eventos ──────────────────────
    const allEvents: CalEvent[] = useMemo(() => {
        return MOCK_LEADS
            .filter(lead => !!lead.data_evento)
            .map(lead => ({
                id: lead.id ?? lead.telefone,
                lead,
                date: new Date(lead.data_evento! + 'T00:00:00'),
            }))
            .filter(ev => !filterVendedor || ev.lead.vendedor_id === filterVendedor);
    }, [filterVendedor]);

    // ── Navegação ───────────────────────────────────────────
    const prevPeriod = () => {
        if (view === 'month') {
            setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
        } else {
            setCurrentDate(d => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; });
        }
    };
    const nextPeriod = () => {
        if (view === 'month') {
            setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
        } else {
            setCurrentDate(d => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; });
        }
    };
    const goToday = () => {
        setCurrentDate(view === 'month'
            ? new Date(today.getFullYear(), today.getMonth(), 1)
            : new Date(today));
    };

    // ── VIEW: Mês ───────────────────────────────────────────
    const monthCells = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const cells: (Date | null)[] = [
            ...Array(firstDay).fill(null),
            ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
        ];
        // Pad to multiple of 7
        while (cells.length % 7 !== 0) cells.push(null);
        return cells;
    }, [currentDate]);

    // ── VIEW: Semana ────────────────────────────────────────
    const weekDays = useMemo(() => {
        const start = new Date(currentDate);
        const day = start.getDay();
        start.setDate(start.getDate() - day); // Domingo
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return d;
        });
    }, [currentDate, view]);

    const eventsOf = (d: Date) => allEvents.filter(ev => isSameDay(ev.date, d));

    // ── Label do período ────────────────────────────────────
    const periodLabel = view === 'month'
        ? `${MONTHS_PT[currentDate.getMonth()]} ${currentDate.getFullYear()}`
        : (() => {
            const s = weekDays[0], e = weekDays[6];
            return `${s.getDate()} ${MONTHS_PT[s.getMonth()].slice(0, 3)} — ${e.getDate()} ${MONTHS_PT[e.getMonth()].slice(0, 3)} ${e.getFullYear()}`;
        })();

    return (
        <div className="h-full flex flex-col overflow-hidden">

            {/* ── Toolbar ──────────────────────────────────────── */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-gray-800/60 flex flex-wrap items-center gap-3">
                {/* Título */}
                <div className="flex items-center gap-2 mr-auto">
                    <CalendarDays className="w-5 h-5" style={{ color: primaryColor }} />
                    <h2 className="text-base font-black text-white font-display">{periodLabel}</h2>
                </div>

                {/* Filtro por vendedor */}
                <div className="relative">
                    <select
                        value={filterVendedor}
                        onChange={e => setFilterVendedor(e.target.value)}
                        className="appearance-none bg-gray-800/60 border border-gray-700/50 rounded-xl px-3 pr-7 py-2
                       text-xs font-bold text-gray-300 focus:outline-none cursor-pointer transition hover:border-gray-600"
                    >
                        <option value="">Todos os vendedores</option>
                        {MOCK_VENDEDORES.filter(v => v.ativo).map(v => (
                            <option key={v.id} value={v.id}>{v.nome}</option>
                        ))}
                    </select>
                    <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none rotate-90" />
                </div>

                {/* Toggle view */}
                <div className="flex bg-gray-800/60 border border-gray-700/50 rounded-xl p-0.5">
                    {(['month', 'week'] as const).map(v => (
                        <button
                            key={v}
                            onClick={() => { setView(v); setCurrentDate(today); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black font-display uppercase tracking-wide transition ${view === v ? 'text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
                                }`}
                            style={view === v ? { backgroundColor: primaryColor, color: '#1a1a1a' } : {}}
                        >
                            {{ month: 'Mês', week: 'Semana' }[v]}
                        </button>
                    ))}
                </div>

                {/* Nav */}
                <div className="flex items-center gap-1">
                    <button onClick={prevPeriod}
                        className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={goToday}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 transition font-display">
                        Hoje
                    </button>
                    <button onClick={nextPeriod}
                        className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* ── Legenda de Vendedores ─────────────────────────── */}
            <div className="flex-shrink-0 px-6 py-2 border-b border-gray-800/40 flex flex-wrap gap-3 items-center">
                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Vendedor:</span>
                {MOCK_VENDEDORES.map(v => (
                    <button
                        key={v.id}
                        onClick={() => setFilterVendedor(prev => prev === v.id ? '' : v.id)}
                        className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border transition
                        ${filterVendedor === v.id ? 'text-white border-transparent' : 'text-gray-400 border-gray-700 hover:border-gray-600'}`}
                        style={filterVendedor === v.id ? { backgroundColor: v.cor_avatar.replace('bg-', '') + '30', borderColor: 'transparent' } : {}}
                    >
                        <span className={`w-3 h-3 rounded-full ${v.cor_avatar}`} />
                        {v.nome.split(' ')[0]}
                    </button>
                ))}
                <span className="text-[10px] text-gray-700 ml-auto">
                    {allEvents.length} evento{allEvents.length !== 1 ? 's' : ''}
                </span>
                {/* Tipos legenda */}
                <div className="flex items-center gap-3 ml-2">
                    {Object.entries(TIPO_LABEL).map(([k, label]) => (
                        <span key={k} className="flex items-center gap-1 text-[10px] text-gray-600">
                            <span className={`w-2 h-2 rounded-full ${TIPO_BG[k]}`} /> {label.split(' ').slice(1).join(' ')}
                        </span>
                    ))}
                </div>
            </div>

            {/* ── Grade Calendário ──────────────────────────────── */}
            <div className="flex-1 overflow-auto">

                {/* ══ MENSAL ══════════════════════════════════════ */}
                {view === 'month' && (
                    <div className="min-h-full flex flex-col">
                        {/* Cabeçalho dos dias da semana */}
                        <div className="grid grid-cols-7 border-b border-gray-800/40 flex-shrink-0">
                            {DAYS_PT.map(day => (
                                <div key={day} className="py-2.5 text-center text-[11px] font-black text-gray-600 uppercase tracking-widest font-display">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Células dos dias */}
                        <div className="flex-1 grid grid-cols-7" style={{ gridAutoRows: '1fr' }}>
                            {monthCells.map((date, idx) => {
                                if (!date) return (
                                    <div key={idx} className="border-b border-r border-gray-800/30 bg-gray-900/10 min-h-[100px]" />
                                );
                                const isToday = isSameDay(date, today);
                                const isOtherMon = date.getMonth() !== currentDate.getMonth();
                                const dayEvents = eventsOf(date);
                                const MAX_VISIBLE = 3;

                                return (
                                    <div
                                        key={idx}
                                        className={`border-b border-r border-gray-800/30 p-1.5 min-h-[100px] flex flex-col transition-all
                                ${isOtherMon ? 'bg-black/20' : 'bg-transparent hover:bg-gray-800/10'}
                                ${isToday ? 'ring-1 ring-inset' : ''}`}
                                        style={isToday ? { outline: `2px solid ${primaryColor}`, outlineOffset: '-2px' } : {}}
                                    >
                                        {/* Número do dia */}
                                        <div className="flex-shrink-0 mb-1 self-start">
                                            <span
                                                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-black font-display
                                    ${isToday ? 'text-white' : isOtherMon ? 'text-gray-700' : 'text-gray-400'}`}
                                                style={isToday ? { backgroundColor: primaryColor } : {}}
                                            >
                                                {date.getDate()}
                                            </span>
                                        </div>

                                        {/* Eventos */}
                                        <div className="flex-1 space-y-0">
                                            {dayEvents.slice(0, MAX_VISIBLE).map(ev => (
                                                <EventPill key={ev.id} ev={ev} onClick={setSelectedEvent} />
                                            ))}
                                            {dayEvents.length > MAX_VISIBLE && (
                                                <button
                                                    className="w-full text-[9px] font-black text-gray-600 hover:text-gray-400 transition py-0.5 text-left px-1"
                                                    onClick={() => setSelectedEvent(dayEvents[MAX_VISIBLE])}
                                                >
                                                    +{dayEvents.length - MAX_VISIBLE} mais
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ══ SEMANAL ══════════════════════════════════════ */}
                {view === 'week' && (
                    <div className="min-h-full flex flex-col">
                        {/* Cabeçalho — dias da semana */}
                        <div className="grid grid-cols-7 border-b border-gray-800/40 flex-shrink-0">
                            {weekDays.map((d, i) => {
                                const isToday = isSameDay(d, today);
                                const dayEvs = eventsOf(d);
                                return (
                                    <div key={i}
                                        className={`py-3 px-2 text-center border-r border-gray-800/30 last:border-r-0
                                ${isToday ? 'bg-gray-800/40' : ''}`}>
                                        <p className="text-[10px] font-black uppercase tracking-wider text-gray-600 font-display">
                                            {DAYS_PT[i]}
                                        </p>
                                        <div
                                            className={`w-9 h-9 mx-auto mt-1 rounded-full flex items-center justify-center text-base font-black font-display ${isToday ? 'text-white' : 'text-gray-300'}`}
                                            style={isToday ? { backgroundColor: primaryColor } : {}}
                                        >
                                            {d.getDate()}
                                        </div>
                                        {dayEvs.length > 0 && (
                                            <div className="mt-0.5 flex justify-center gap-0.5">
                                                {dayEvs.slice(0, 4).map(ev => (
                                                    <span key={ev.id} className="w-1.5 h-1.5 rounded-full"
                                                        style={{ backgroundColor: TIPO_COLOR[ev.lead.tipo_servico] ?? '#6b7280' }} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Corpo — eventos por dia */}
                        <div className="flex-1 grid grid-cols-7 divide-x divide-gray-800/30">
                            {weekDays.map((d, i) => {
                                const isToday = isSameDay(d, today);
                                const dayEvs = eventsOf(d);

                                return (
                                    <div key={i}
                                        className={`p-2 flex flex-col gap-2 min-h-[400px] ${isToday ? 'bg-gray-800/20' : ''}`}>
                                        {dayEvs.length === 0 && (
                                            <div className="flex-1 flex items-center justify-center">
                                                <span className="text-[11px] text-gray-800">—</span>
                                            </div>
                                        )}
                                        {dayEvs.map(ev => {
                                            const { lead } = ev;
                                            const vend = MOCK_VENDEDORES.find(v => v.id === lead.vendedor_id);
                                            const color = TIPO_COLOR[lead.tipo_servico] ?? '#6b7280';
                                            return (
                                                <button
                                                    key={ev.id}
                                                    onClick={() => setSelectedEvent(ev)}
                                                    className="w-full text-left rounded-xl p-2.5 border transition hover:brightness-110 group"
                                                    style={{ backgroundColor: color + '12', borderColor: color + '30' }}
                                                >
                                                    {/* Tipo */}
                                                    <p className="text-[9px] font-black uppercase tracking-wider mb-1" style={{ color }}>
                                                        {TIPO_LABEL[lead.tipo_servico]}
                                                    </p>
                                                    {/* Nome */}
                                                    <p className="text-xs font-bold text-white truncate font-display">
                                                        {lead.nome_crianca ?? lead.nome}
                                                    </p>
                                                    {lead.tema_festa && (
                                                        <p className="text-[10px] text-gray-500 truncate">{lead.tema_festa}</p>
                                                    )}
                                                    {/* Vendedor Tag */}
                                                    {vend && (
                                                        <div className="mt-2 flex items-center gap-1.5">
                                                            <span className={`w-4 h-4 rounded-full ${vend.cor_avatar} flex items-center justify-center text-[7px] font-black text-white`}>
                                                                {vend.avatar_iniciais[0]}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 font-bold">{vend.nome.split(' ')[0]}</span>
                                                        </div>
                                                    )}
                                                    {/* Orçamento */}
                                                    {lead.orcamento_estimado && (
                                                        <p className="text-[10px] mt-1 font-bold" style={{ color }}>
                                                            {formatCurrency(lead.orcamento_estimado)}
                                                        </p>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de detalhe */}
            <EventModal ev={selectedEvent} onClose={() => setSelectedEvent(null)} onNavigate={onNavigate} />
        </div>
    );
};
