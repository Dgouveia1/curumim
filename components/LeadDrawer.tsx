import React from 'react';
import {
    X,
    Phone,
    Calendar,
    Thermometer,
    AlertCircle,
    CheckCircle2,
    MessageSquare,
    Baby,
    Users,
    Palette,
    PartyPopper,
    DollarSign,
    MapPin,
    UserCheck,
} from 'lucide-react';
import { Lead } from '../types';
import { MOCK_VENDEDORES } from '../constants';

interface LeadDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    lead: Lead | null;
    primaryColor: string;
    onNavigate?: (view: string) => void;
}

const TEMPERATURA_COLORS: Record<string, string> = {
    muito_quente: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    quente: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    morna: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    morno: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    frio: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    muito_frio: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
};

const TIPO_LABEL: Record<string, string> = {
    festa: '🎂 Festa de Aniversário',
    espaco_kids: '🏠 Espaço Kids',
    recreacao: '🎪 Recreação',
    outro: '📋 Outro Serviço',
};

const LOCAL_LABEL: Record<string, string> = {
    no_espaco: 'No Espaço Curumim',
    em_casa: 'No endereço do cliente',
    a_definir: 'A definir',
};

const ETAPA_LABEL: Record<string, string> = {
    novo: 'Novo Lead',
    contato: 'Em Contato',
    visita_espaco: 'Visita ao Espaço',
    orcamento: 'Orçamento',
    fechamento: 'Fechamento',
    confirmado: '✅ Confirmado',
};

export const LeadDrawer: React.FC<LeadDrawerProps> = ({ isOpen, onClose, lead, primaryColor, onNavigate }) => {
    if (!lead) return null;

    const vendedor = MOCK_VENDEDORES.find(v => v.id === lead.vendedor_id);
    const tempClass = TEMPERATURA_COLORS[lead.temperatura] ?? TEMPERATURA_COLORS['morno'];
    const getTempLabel = (t: string) => t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const formatDate = (d?: string) =>
        d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

    const daysUntil = lead.data_evento
        ? Math.ceil((new Date(lead.data_evento + 'T00:00:00').getTime() - Date.now()) / 86_400_000)
        : null;

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed inset-y-0 right-0 w-full max-w-md bg-gray-950 border-l border-gray-800 z-[70] transform transition-transform duration-300 shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* ── Header ────────────────────────────────────── */}
                <div className="px-6 py-5 border-b border-gray-800 bg-gray-900/60 flex items-start justify-between flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-white">{lead.nome}</h2>
                        <p className="text-sm text-gray-400 font-mono mt-0.5">{lead.telefone}</p>
                        {lead.nome_crianca && (
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <Baby className="w-3 h-3" />
                                Criança: <span className="text-gray-300 font-medium ml-1">{lead.nome_crianca}</span>
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* ── Content ───────────────────────────────────── */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Resumo da IA */}
                    <div className="p-5 rounded-xl border border-indigo-500/30 bg-indigo-500/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/15 blur-2xl -mr-10 -mt-10" />
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse inline-block" />
                            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-300">Resumo da IA</h3>
                        </div>
                        <p className="text-sm text-indigo-100 leading-relaxed">{lead.resumo || 'Nenhum resumo gerado ainda.'}</p>
                    </div>

                    {/* KPIs rápidos: Temperatura + Orçamento */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                            <div className="text-xs text-gray-500 mb-2">Temperatura</div>
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${tempClass}`}>
                                <Thermometer className="w-3 h-3" />
                                {getTempLabel(lead.temperatura)}
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                            <div className="text-xs text-gray-500 mb-2">Orçamento Est.</div>
                            <div className="text-lg font-bold" style={{ color: primaryColor }}>
                                {lead.orcamento_estimado
                                    ? lead.orcamento_estimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
                                    : 'A solicitar'}
                            </div>
                        </div>
                    </div>

                    {/* Data do Evento + Contagem regressiva */}
                    {lead.data_evento && (
                        <div
                            className="p-4 rounded-xl border flex items-center gap-4"
                            style={{ borderColor: primaryColor + '30', backgroundColor: primaryColor + '08' }}
                        >
                            <PartyPopper className="w-8 h-8 flex-shrink-0" style={{ color: primaryColor }} />
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">Data do Evento</p>
                                <p className="text-white font-semibold text-sm">{formatDate(lead.data_evento)}</p>
                                {daysUntil !== null && daysUntil >= 0 && (
                                    <p className={`text-xs mt-0.5 font-bold ${daysUntil <= 7 ? 'text-rose-400' : daysUntil <= 21 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                        {daysUntil === 0 ? '🎉 Hoje!' : `${daysUntil} dia${daysUntil !== 1 ? 's' : ''} para o evento`}
                                    </p>
                                )}
                                {daysUntil !== null && daysUntil < 0 && (
                                    <p className="text-xs mt-0.5 text-gray-500">Evento passado</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Detalhes do Evento */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Detalhes do Evento</h3>
                        <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl divide-y divide-gray-800">

                            {[
                                { icon: PartyPopper, label: 'Tipo de Serviço', value: TIPO_LABEL[lead.tipo_servico] ?? lead.tipo_servico },
                                { icon: Users, label: 'Qtd. Crianças', value: lead.qtd_criancas ? `${lead.qtd_criancas} crianças` : '—' },
                                { icon: Palette, label: 'Tema da Festa', value: lead.tema_festa ?? '—' },
                                { icon: MapPin, label: 'Local', value: LOCAL_LABEL[lead.local_preferido ?? ''] ?? lead.local_preferido ?? '—' },
                                { icon: Calendar, label: 'Etapa do Funil', value: ETAPA_LABEL[lead.etapa_funil] ?? lead.etapa_funil },
                                { icon: Calendar, label: 'Cadastro', value: new Date(lead.created_at).toLocaleDateString('pt-BR') },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex items-center justify-between px-4 py-3">
                                    <span className="text-sm text-gray-500 flex items-center gap-2">
                                        <Icon className="w-3.5 h-3.5 opacity-60" />
                                        {label}
                                    </span>
                                    <span className="text-sm text-gray-200 font-medium text-right max-w-[55%]">{value}</span>
                                </div>
                            ))}

                            {/* FUP */}
                            <div className="flex items-center justify-between px-4 py-3">
                                <span className="text-sm text-gray-500 flex items-center gap-2">
                                    <AlertCircle className="w-3.5 h-3.5 opacity-60" />
                                    FUP Pendente
                                </span>
                                <span className={`text-sm font-semibold flex items-center gap-1.5 ${lead.fup_pendente ? 'text-amber-400' : 'text-emerald-400'}`}>
                                    {lead.fup_pendente
                                        ? <><AlertCircle className="w-3.5 h-3.5" />Pendente</>
                                        : <><CheckCircle2 className="w-3.5 h-3.5" />Resolvido</>
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Vendedor Responsável */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Responsável</h3>
                        {vendedor ? (
                            <div className="flex items-center gap-3 p-4 bg-gray-800/40 border border-gray-700/50 rounded-xl">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${vendedor.cor_avatar} shadow`}>
                                    {vendedor.avatar_iniciais}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">{vendedor.nome}</p>
                                    <p className="text-xs text-gray-500">{vendedor.email}</p>
                                </div>
                                <UserCheck className="w-4 h-4 text-emerald-400 ml-auto" />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 p-4 bg-gray-800/40 border border-dashed border-gray-700 rounded-xl text-gray-500 text-sm">
                                <Users className="w-5 h-5" />
                                Nenhum vendedor atribuído
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    {lead.tags && lead.tags.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {lead.tags.map(tag => (
                                    <span key={tag} className="text-xs px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-300">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Footer de Ações ────────────────────────────── */}
                <div className="p-6 border-t border-gray-800 bg-gray-900/40 flex-shrink-0 flex flex-col gap-3">
                    <button
                        className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg"
                        style={{ backgroundColor: '#25D366' }}
                        onClick={() => onNavigate?.('chat')}
                    >
                        <MessageSquare className="w-5 h-5" />
                        Abrir chat
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-medium text-sm transition">
                            Editar Lead
                        </button>
                        <button
                            className="py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2"
                            style={{ backgroundColor: primaryColor, color: '#1a1a1a' }}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Resolver FUP
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};