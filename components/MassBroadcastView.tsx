import React, { useState, useMemo } from 'react';
import {
    Megaphone,
    Search,
    Filter,
    CheckSquare,
    Square,
    Send,
    Users,
    ChevronDown,
    Tag,
    AlertTriangle,
    CheckCircle2,
    Loader2,
    Braces,
    Calendar,
    Baby,
    X,
    Sparkles,
    BarChart2,
    Clock,
} from 'lucide-react';
import { Lead, TipoServico, FunnelStage, ConversationTag } from '../types';
import { MOCK_LEADS, MOCK_VENDEDORES } from '../constants';

// ─────────────────────────────────────────────────────────────
// TIPOS LOCAIS
// ─────────────────────────────────────────────────────────────

type BroadcastStatus = 'idle' | 'sending' | 'done' | 'error';

interface TemplateVar {
    key: string;
    label: string;
    example: string;
}

// ─────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────

const TEMPLATE_VARS: TemplateVar[] = [
    { key: '{nome}', label: 'Nome do responsável', example: 'Maria Silva' },
    { key: '{nome_crianca}', label: 'Nome da criança', example: 'Sofia' },
    { key: '{data_evento}', label: 'Data do evento', example: '15/03/2026' },
    { key: '{tema_festa}', label: 'Tema da festa', example: 'Princesa Sofia' },
    { key: '{qtd_criancas}', label: 'Qtd. crianças', example: '30' },
    { key: '{tipo_servico}', label: 'Tipo de serviço', example: 'Festa' },
];

const ETAPA_OPTIONS: { value: FunnelStage | ''; label: string }[] = [
    { value: '', label: 'Todas as Etapas' },
    { value: 'novo', label: 'Novo Lead' },
    { value: 'contato', label: 'Em Contato' },
    { value: 'visita_espaco', label: 'Visita ao Espaço' },
    { value: 'orcamento', label: 'Orçamento' },
    { value: 'fechamento', label: 'Fechamento' },
    { value: 'confirmado', label: 'Confirmado' },
];

const SERVICO_OPTIONS: { value: TipoServico | ''; label: string }[] = [
    { value: '', label: 'Todos os Serviços' },
    { value: 'festa', label: '🎂 Festa' },
    { value: 'espaco_kids', label: '🏠 Espaço Kids' },
    { value: 'recreacao', label: '🎪 Recreação' },
    { value: 'outro', label: '📋 Outro' },
];

const QUICK_TEMPLATES: { label: string; icon: React.ElementType; text: string }[] = [
    {
        label: 'Lembrete de Evento',
        icon: Calendar,
        text: 'Olá {nome}! 🎉 Passando para lembrar que a festa da {nome_crianca} está marcada para {data_evento}. Qualquer dúvida, estamos à disposição! 🎈 — Grupo Curumim',
    },
    {
        label: 'Orçamento Especial',
        icon: Sparkles,
        text: 'Oi {nome}! ✨ Temos uma condição especial esta semana para festas com tema {tema_festa}. Vamos conversar? Garanta a data da {nome_crianca}! 🎂 — Grupo Curumim',
    },
    {
        label: 'Follow-up',
        icon: Clock,
        text: 'Olá {nome}! 👋 Você ainda tem interesse em realizar a festa da {nome_crianca} aqui no Grupo Curumim? Podemos montar um pacote personalizado para {qtd_criancas} crianças. Responda aqui! 🎊',
    },
    {
        label: 'Promoção Espaço Kids',
        icon: BarChart2,
        text: '🏠 Olá {nome}! Nosso Espaço Kids está com agenda aberta para {data_evento}. Pacotes a partir de R$ 2.500 para até 20 crianças. Quer saber mais? — Grupo Curumim',
    },
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function formatDate(d?: string): string {
    if (!d) return '—';
    return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function interpolate(template: string, lead: Lead): string {
    const TIPO_LABEL: Record<string, string> = { festa: 'Festa', espaco_kids: 'Espaço Kids', recreacao: 'Recreação', outro: 'Outro' };
    return template
        .replace(/\{nome\}/g, lead.nome)
        .replace(/\{nome_crianca\}/g, lead.nome_crianca ?? 'criança')
        .replace(/\{data_evento\}/g, formatDate(lead.data_evento))
        .replace(/\{tema_festa\}/g, lead.tema_festa ?? 'especial')
        .replace(/\{qtd_criancas\}/g, String(lead.qtd_criancas ?? '?'))
        .replace(/\{tipo_servico\}/g, TIPO_LABEL[lead.tipo_servico] ?? lead.tipo_servico);
}

const ETAPA_LABEL: Record<string, string> = {
    novo: 'Novo', contato: 'Em Contato', visita_espaco: 'Visita', orcamento: 'Orçamento', fechamento: 'Fechamento', confirmado: 'Confirmado',
};

const ETAPA_COLOR: Record<string, string> = {
    novo: 'text-blue-400 bg-blue-500/10', contato: 'text-yellow-400 bg-yellow-500/10',
    visita_espaco: 'text-purple-400 bg-purple-500/10', orcamento: 'text-orange-400 bg-orange-500/10',
    fechamento: 'text-rose-400 bg-rose-500/10', confirmado: 'text-emerald-400 bg-emerald-500/10',
};

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTE: Dropdown de Filtro
// ─────────────────────────────────────────────────────────────

function FilterSelect<T extends string>({
    value, onChange, options, icon: Icon,
}: {
    value: T; onChange: (v: T) => void;
    options: { value: T; label: string }[];
    icon?: React.ElementType;
}) {
    return (
        <div className="relative flex-1 min-w-[160px]">
            {Icon && <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />}
            <select
                value={value}
                onChange={e => onChange(e.target.value as T)}
                className="w-full appearance-none bg-gray-800/60 border border-gray-700/50 rounded-xl text-xs text-gray-300 py-2 pr-7 focus:outline-none focus:border-gray-500 transition cursor-pointer"
                style={{ paddingLeft: Icon ? '2rem' : '0.75rem' }}
            >
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL: MassBroadcastView
// ─────────────────────────────────────────────────────────────

interface MassBroadcastViewProps {
    primaryColor: string;
}

export const MassBroadcastView: React.FC<MassBroadcastViewProps> = ({ primaryColor }) => {
    // ── Estado dos filtros ─────────────────────────────────────
    const [search, setSearch] = useState('');
    const [filterEtapa, setFilterEtapa] = useState<FunnelStage | ''>('');
    const [filterServico, setFilterServico] = useState<TipoServico | ''>('');
    const [filterFup, setFilterFup] = useState<'' | 'true' | 'false'>('');

    // ── Seleção de leads ───────────────────────────────────────
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // ── Mensagem ───────────────────────────────────────────────
    const [messageText, setMessageText] = useState('');
    const [previewLeadIdx, setPreviewLeadIdx] = useState(0);

    // ── Status do disparo ──────────────────────────────────────
    const [broadcastStatus, setBroadcastStatus] = useState<BroadcastStatus>('idle');
    const [sentCount, setSentCount] = useState(0);

    // ── Leads filtrados ────────────────────────────────────────
    const filtered = useMemo(() => {
        return MOCK_LEADS.filter(l => {
            const s = search.toLowerCase();
            const matchSearch = !s || l.nome.toLowerCase().includes(s) || (l.nome_crianca ?? '').toLowerCase().includes(s);
            const matchEtapa = !filterEtapa || l.etapa_funil === filterEtapa;
            const matchServico = !filterServico || l.tipo_servico === filterServico;
            const matchFup = !filterFup || String(l.fup_pendente) === filterFup;
            return matchSearch && matchEtapa && matchServico && matchFup;
        });
    }, [search, filterEtapa, filterServico, filterFup]);

    const allSelected = filtered.length > 0 && filtered.every(l => selectedIds.has(l.id!));
    const someSelected = filtered.some(l => selectedIds.has(l.id!));
    const selectedLeads = MOCK_LEADS.filter(l => selectedIds.has(l.id!));

    // ── Toggle seleção ─────────────────────────────────────────
    const toggleAll = () => {
        if (allSelected) {
            setSelectedIds(prev => { const n = new Set(prev); filtered.forEach(l => n.delete(l.id!)); return n; });
        } else {
            setSelectedIds(prev => { const n = new Set(prev); filtered.forEach(l => n.add(l.id!)); return n; });
        }
    };

    const toggleOne = (id: string) => {
        setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    };

    // ── Preview da mensagem interpolada ───────────────────────
    const previewLead = selectedLeads[previewLeadIdx] ?? selectedLeads[0] ?? MOCK_LEADS[0];
    const previewText = messageText ? interpolate(messageText, previewLead) : '';

    // ── Inserir variável na mensagem ────────────────────────────
    const insertVar = (v: string) => setMessageText(prev => prev + v);

    // ── Simulação de Disparo ────────────────────────────────────
    const handleBroadcast = () => {
        if (!selectedLeads.length || !messageText.trim()) return;
        setBroadcastStatus('sending');
        setSentCount(0);
        let i = 0;
        const interval = setInterval(() => {
            i++;
            setSentCount(i);
            if (i >= selectedLeads.length) {
                clearInterval(interval);
                setBroadcastStatus('done');
            }
        }, 200);
    };

    const resetBroadcast = () => { setBroadcastStatus('idle'); setSentCount(0); };

    const hasActiveFilter = search || filterEtapa || filterServico || filterFup;

    return (
        <div className="h-full flex overflow-hidden">

            {/* ══════════════════════════════════════════
          COLUNA PRINCIPAL — Seleção de Leads
      ══════════════════════════════════════════ */}
            <div className="flex-1 flex flex-col min-w-0 border-r border-gray-800">

                {/* ── Header ──────────────────────────── */}
                <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                            <Megaphone className="w-5 h-5" style={{ color: primaryColor }} />
                            Disparos em Massa
                        </h2>
                        <span className="text-xs text-gray-500">
                            {selectedIds.size} lead{selectedIds.size !== 1 ? 's' : ''} selecionado{selectedIds.size !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Filtros */}
                    <div className="flex flex-wrap gap-2">
                        <div className="relative flex-1 min-w-[160px]">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Buscar lead..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-gray-800/60 border border-gray-700/50 rounded-xl pl-8 pr-3 py-2 text-xs text-gray-300 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition"
                            />
                        </div>

                        <FilterSelect<FunnelStage | ''> value={filterEtapa} onChange={setFilterEtapa} options={ETAPA_OPTIONS} icon={Filter} />
                        <FilterSelect<TipoServico | ''> value={filterServico} onChange={setFilterServico} options={SERVICO_OPTIONS} icon={Tag} />

                        <div className="relative">
                            <select
                                value={filterFup}
                                onChange={e => setFilterFup(e.target.value as '' | 'true' | 'false')}
                                className="appearance-none bg-gray-800/60 border border-gray-700/50 rounded-xl px-3 pr-7 py-2 text-xs text-gray-300 focus:outline-none focus:border-gray-500 transition cursor-pointer"
                            >
                                <option value="">FUP: Todos</option>
                                <option value="true">FUP Pendente</option>
                                <option value="false">FUP Resolvido</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                        </div>

                        {hasActiveFilter && (
                            <button
                                onClick={() => { setSearch(''); setFilterEtapa(''); setFilterServico(''); setFilterFup(''); }}
                                className="flex items-center gap-1 text-xs text-gray-400 hover:text-white px-3 py-2 rounded-xl bg-gray-800/40 border border-gray-700/40 hover:border-gray-600 transition"
                            >
                                <X className="w-3.5 h-3.5" /> Limpar
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Tabela de Leads ──────────────────── */}
                <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-xs">
                        <thead className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-10">
                            <tr>
                                <th className="w-10 px-4 py-3">
                                    <button onClick={toggleAll} className="text-gray-400 hover:text-white transition">
                                        {allSelected
                                            ? <CheckSquare className="w-4 h-4" style={{ color: primaryColor }} />
                                            : someSelected
                                                ? <CheckSquare className="w-4 h-4 text-gray-500" />
                                                : <Square className="w-4 h-4" />}
                                    </button>
                                </th>
                                <th className="text-left px-4 py-3 text-gray-500 font-semibold uppercase tracking-wider">Responsável</th>
                                <th className="text-left px-4 py-3 text-gray-500 font-semibold uppercase tracking-wider">Criança / Tema</th>
                                <th className="text-left px-4 py-3 text-gray-500 font-semibold uppercase tracking-wider">Serviço</th>
                                <th className="text-left px-4 py-3 text-gray-500 font-semibold uppercase tracking-wider">Data Evento</th>
                                <th className="text-left px-4 py-3 text-gray-500 font-semibold uppercase tracking-wider">Etapa</th>
                                <th className="text-center px-4 py-3 text-gray-500 font-semibold uppercase tracking-wider">FUP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-16 text-center text-gray-600">
                                        <Search className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                        <p>Nenhum lead corresponde aos filtros</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(lead => {
                                    const isSelected = selectedIds.has(lead.id!);
                                    const vend = MOCK_VENDEDORES.find(v => v.id === lead.vendedor_id);
                                    return (
                                        <tr
                                            key={lead.id}
                                            onClick={() => toggleOne(lead.id!)}
                                            className={`cursor-pointer transition-colors ${isSelected ? 'bg-amber-500/5 border-l-2' : 'hover:bg-gray-800/30'}`}
                                            style={isSelected ? { borderLeftColor: primaryColor } : {}}
                                        >
                                            {/* Checkbox */}
                                            <td className="px-4 py-3">
                                                {isSelected
                                                    ? <CheckSquare className="w-4 h-4" style={{ color: primaryColor }} />
                                                    : <Square className="w-4 h-4 text-gray-600" />}
                                            </td>
                                            {/* Responsável */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    {vend && (
                                                        <span className={`w-5 h-5 rounded-full ${vend.cor_avatar} flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0`}>
                                                            {vend.avatar_iniciais}
                                                        </span>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-gray-200">{lead.nome}</p>
                                                        <p className="text-gray-600 font-mono">{lead.telefone}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Criança / Tema */}
                                            <td className="px-4 py-3">
                                                <p className="text-gray-300 flex items-center gap-1">
                                                    <Baby className="w-3 h-3 text-gray-600 flex-shrink-0" />
                                                    {lead.nome_crianca ?? '—'}
                                                </p>
                                                {lead.tema_festa && <p className="text-gray-600 mt-0.5">{lead.tema_festa}</p>}
                                            </td>
                                            {/* Serviço */}
                                            <td className="px-4 py-3 text-gray-400">
                                                {{ festa: '🎂 Festa', espaco_kids: '🏠 Espaço Kids', recreacao: '🎪 Recreação', outro: '📋 Outro' }[lead.tipo_servico]}
                                            </td>
                                            {/* Data */}
                                            <td className="px-4 py-3 text-gray-400 font-mono">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3 text-gray-600" />
                                                    {formatDate(lead.data_evento)}
                                                </div>
                                            </td>
                                            {/* Etapa */}
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ETAPA_COLOR[lead.etapa_funil] ?? 'text-gray-400 bg-gray-700'}`}>
                                                    {ETAPA_LABEL[lead.etapa_funil] ?? lead.etapa_funil}
                                                </span>
                                            </td>
                                            {/* FUP */}
                                            <td className="px-4 py-3 text-center">
                                                {lead.fup_pendente
                                                    ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mx-auto" />
                                                    : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mx-auto" />}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ══════════════════════════════════════════
          COLUNA DIREITA — Mensagem + Painel de Resumo
      ══════════════════════════════════════════ */}
            <div className="w-[380px] flex-shrink-0 flex flex-col bg-gray-900/30">

                {/* ── Composição da Mensagem ────────────── */}
                <div className="flex-1 flex flex-col p-5 border-b border-gray-800 overflow-y-auto">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Megaphone className="w-3.5 h-3.5" />
                        Mensagem do Disparo
                    </h3>

                    {/* Templates Rápidos */}
                    <div className="mb-4">
                        <p className="text-[10px] text-gray-600 mb-2 uppercase tracking-wider font-semibold">Templates Rápidos</p>
                        <div className="grid grid-cols-2 gap-2">
                            {QUICK_TEMPLATES.map(tpl => {
                                const TplIcon = tpl.icon;
                                return (
                                    <button
                                        key={tpl.label}
                                        onClick={() => setMessageText(tpl.text)}
                                        className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-2 rounded-xl
                               bg-gray-800/60 border border-gray-700/50 hover:border-gray-600 text-gray-300
                               hover:text-white transition text-left"
                                    >
                                        <TplIcon className="w-3 h-3 flex-shrink-0 opacity-70" />
                                        {tpl.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Textarea da Mensagem */}
                    <div className="flex-1 flex flex-col">
                        <p className="text-[10px] text-gray-600 mb-2 uppercase tracking-wider font-semibold">Mensagem</p>
                        <textarea
                            value={messageText}
                            onChange={e => setMessageText(e.target.value)}
                            placeholder="Digite a mensagem ou use um template acima. Use {nome}, {data_evento} etc. para personalizar."
                            className="flex-1 min-h-[120px] bg-gray-800/60 border border-gray-700/50 rounded-xl p-3 text-sm
                         text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gray-500 resize-none transition"
                        />
                        <div className="flex items-center justify-between mt-1.5">
                            <span className="text-[10px] text-gray-600">{messageText.length} caracteres</span>
                            {messageText && (
                                <button onClick={() => setMessageText('')} className="text-[10px] text-gray-600 hover:text-gray-400 transition">
                                    Limpar
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Variáveis disponíveis */}
                    <div className="mt-4">
                        <p className="text-[10px] text-gray-600 mb-2 uppercase tracking-wider font-semibold flex items-center gap-1">
                            <Braces className="w-3 h-3" /> Variáveis
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {TEMPLATE_VARS.map(v => (
                                <button
                                    key={v.key}
                                    onClick={() => insertVar(v.key)}
                                    title={`Exemplo: ${v.example}`}
                                    className="text-[10px] font-mono px-2 py-1 rounded-lg bg-gray-800 border border-gray-700
                             text-gray-400 hover:text-white hover:border-gray-500 transition"
                                >
                                    {v.key}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preview da Mensagem */}
                    {previewText && selectedLeads.length > 0 && (
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold">
                                    Preview — {previewLead.nome}
                                </p>
                                {selectedLeads.length > 1 && (
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => setPreviewLeadIdx(i => Math.max(0, i - 1))}
                                            disabled={previewLeadIdx === 0}
                                            className="text-gray-500 hover:text-white disabled:opacity-20 transition text-[10px]"
                                        >‹</button>
                                        <span className="text-[10px] text-gray-600">{previewLeadIdx + 1}/{selectedLeads.length}</span>
                                        <button
                                            onClick={() => setPreviewLeadIdx(i => Math.min(selectedLeads.length - 1, i + 1))}
                                            disabled={previewLeadIdx === selectedLeads.length - 1}
                                            className="text-gray-500 hover:text-white disabled:opacity-20 transition text-[10px]"
                                        >›</button>
                                    </div>
                                )}
                            </div>
                            <div className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {previewText}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Painel de Resumo do Disparo ─────────── */}
                <div className="p-5 flex-shrink-0">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <BarChart2 className="w-3.5 h-3.5" />
                        Resumo do Disparo
                    </h3>

                    {/* Métricas */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {[
                            { label: 'Selecionados', value: selectedIds.size, color: primaryColor },
                            { label: 'Com FUP', value: selectedLeads.filter(l => l.fup_pendente).length, color: '#f59e0b' },
                            { label: 'Confirmados', value: selectedLeads.filter(l => l.etapa_funil === 'confirmado').length, color: '#10b981' },
                        ].map(stat => (
                            <div key={stat.label} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-3 text-center">
                                <p className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Breakdown por serviço */}
                    {selectedLeads.length > 0 && (
                        <div className="mb-4 space-y-2">
                            {(['festa', 'espaco_kids', 'recreacao'] as TipoServico[]).map(tipo => {
                                const count = selectedLeads.filter(l => l.tipo_servico === tipo).length;
                                if (!count) return null;
                                const LABELS: Record<string, string> = { festa: '🎂 Festa', espaco_kids: '🏠 Espaço Kids', recreacao: '🎪 Recreação' };
                                const pct = Math.round((count / selectedLeads.length) * 100);
                                return (
                                    <div key={tipo}>
                                        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                            <span>{LABELS[tipo]}</span>
                                            <span>{count} ({pct}%)</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{ width: `${pct}%`, backgroundColor: primaryColor + 'cc' }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Warnings */}
                    {selectedIds.size === 0 && (
                        <div className="flex items-center gap-2 text-[11px] text-amber-400/80 bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 mb-4">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            Selecione pelo menos 1 lead para disparar.
                        </div>
                    )}
                    {!messageText && (
                        <div className="flex items-center gap-2 text-[11px] text-amber-400/80 bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 mb-4">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            Compose a mensagem antes de disparar.
                        </div>
                    )}

                    {/* Status do Disparo */}
                    {broadcastStatus === 'sending' && (
                        <div className="flex items-center gap-2 text-[11px] text-blue-400 bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 mb-4">
                            <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                            Enviando... {sentCount}/{selectedLeads.length}
                        </div>
                    )}
                    {broadcastStatus === 'done' && (
                        <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 mb-4">
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                            ✅ {sentCount} mensagens enviadas com sucesso!
                        </div>
                    )}

                    {/* Botão de Disparo */}
                    {broadcastStatus === 'done' ? (
                        <button
                            onClick={resetBroadcast}
                            className="w-full py-3 rounded-xl font-bold text-sm border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 transition"
                        >
                            Novo Disparo
                        </button>
                    ) : (
                        <button
                            onClick={handleBroadcast}
                            disabled={!selectedIds.size || !messageText.trim() || broadcastStatus === 'sending'}
                            className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2
                         transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90"
                            style={{ backgroundColor: primaryColor, color: '#1a1a1a' }}
                        >
                            {broadcastStatus === 'sending'
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                                : <><Send className="w-4 h-4" /> Disparar para {selectedIds.size || 0} leads</>
                            }
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
