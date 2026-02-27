import React, { useState, useMemo } from 'react';
import {
  Calendar,
  PartyPopper,
  AlertCircle,
  MoreHorizontal,
  Users,
  Filter,
  ChevronDown,
  Baby,
  Palette,
  Shuffle,
  Clock,
  BadgeCheck,
  X,
} from 'lucide-react';
import { Lead, FunnelStage, TipoServico, Vendedor } from '../types';
import { MOCK_VENDEDORES } from '../constants';

// ─────────────────────────────────────────────────────────────
// CONFIGURAÇÃO DAS COLUNAS DO FUNIL DE EVENTOS
// ─────────────────────────────────────────────────────────────

interface ColumnConfig {
  id: FunnelStage;
  label: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  icon: React.ElementType;
}

const COLUMNS: ColumnConfig[] = [
  { id: 'novo', label: 'Novo Lead', borderColor: 'border-blue-500', badgeBg: 'bg-blue-500/10', badgeText: 'text-blue-400', icon: Users },
  { id: 'contato', label: 'Em Contato', borderColor: 'border-yellow-500', badgeBg: 'bg-yellow-500/10', badgeText: 'text-yellow-400', icon: Clock },
  { id: 'visita_espaco', label: 'Visita ao Espaço', borderColor: 'border-purple-500', badgeBg: 'bg-purple-500/10', badgeText: 'text-purple-400', icon: PartyPopper },
  { id: 'orcamento', label: 'Orçamento', borderColor: 'border-orange-500', badgeBg: 'bg-orange-500/10', badgeText: 'text-orange-400', icon: Filter },
  { id: 'fechamento', label: 'Fechamento', borderColor: 'border-rose-500', badgeBg: 'bg-rose-500/10', badgeText: 'text-rose-400', icon: AlertCircle },
  { id: 'confirmado', label: '✅ Confirmado', borderColor: 'border-emerald-500', badgeBg: 'bg-emerald-500/10', badgeText: 'text-emerald-400', icon: BadgeCheck },
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const TEMPERATURA_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  muito_quente: { bg: 'bg-rose-500/15', text: 'text-rose-400', dot: 'bg-rose-500' },
  quente: { bg: 'bg-orange-500/15', text: 'text-orange-400', dot: 'bg-orange-500' },
  morna: { bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-500' },
  morno: { bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-500' },
  frio: { bg: 'bg-blue-500/15', text: 'text-blue-400', dot: 'bg-blue-500' },
  muito_frio: { bg: 'bg-indigo-500/15', text: 'text-indigo-400', dot: 'bg-indigo-500' },
};

const TIPO_ICON: Record<TipoServico, string> = {
  festa: '🎂',
  espaco_kids: '🏠',
  recreacao: '🎪',
  outro: '📋',
};

const TIPO_LABEL: Record<TipoServico, string> = {
  festa: 'Festa',
  espaco_kids: 'Espaço Kids',
  recreacao: 'Recreação',
  outro: 'Outro',
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function getDaysUntilEvent(dateStr?: string): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr + 'T00:00:00').getTime() - Date.now();
  return Math.ceil(diff / 86_400_000);
}

function getVendedor(id?: string): Vendedor | undefined {
  return MOCK_VENDEDORES.find(v => v.id === id);
}

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTE: Dropdown simples
// ─────────────────────────────────────────────────────────────

interface DropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  icon?: React.ElementType;
}

const FilterDropdown: React.FC<DropdownProps> = ({ label, value, options, onChange, icon: Icon }) => (
  <div className="relative">
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="appearance-none bg-gray-800/70 border border-gray-700/60 rounded-xl pl-8 pr-8 py-2 text-xs text-gray-300 focus:outline-none focus:border-gray-500 cursor-pointer transition hover:border-gray-600 font-medium"
    >
      <option value="">{label}</option>
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
    {Icon && <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />}
    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
  </div>
);

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTE: Card do Lead no Kanban
// ─────────────────────────────────────────────────────────────

const LeadCard: React.FC<{ lead: Lead; onClick: () => void; primaryColor: string }> = ({ lead, onClick, primaryColor }) => {
  const tempStyle = TEMPERATURA_STYLE[lead.temperatura] ?? TEMPERATURA_STYLE['morno'];
  const vendedor = getVendedor(lead.vendedor_id);
  const daysUntil = getDaysUntilEvent(lead.data_evento);

  const urgencyColor =
    daysUntil !== null && daysUntil <= 7
      ? 'text-rose-400'
      : daysUntil !== null && daysUntil <= 21
        ? 'text-amber-400'
        : 'text-gray-500';

  return (
    <div
      onClick={onClick}
      className="bg-gray-900/80 hover:bg-gray-800/80 border border-gray-700/50 hover:border-gray-600/70 rounded-2xl p-4 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 relative group"
    >
      {/* Badge de FUP pendente */}
      {lead.fup_pendente && (
        <div className="absolute -top-1.5 -right-1.5 z-10">
          <span className="flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500" />
          </span>
        </div>
      )}

      {/* Linha 1: Temperatura + Tipo de Serviço + Menu */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${tempStyle.bg} ${tempStyle.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${tempStyle.dot} inline-block`} />
          {lead.temperatura.replace('_', ' ')}
        </span>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-sm" title={TIPO_LABEL[lead.tipo_servico]}>{TIPO_ICON[lead.tipo_servico]}</span>
          <button
            onClick={e => e.stopPropagation()}
            className="text-gray-700 hover:text-gray-300 transition opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Linha 2: Nome do responsável e da criança */}
      <h4 className="text-white font-semibold text-sm truncate leading-tight">{lead.nome}</h4>
      {lead.nome_crianca && (
        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
          <Baby className="w-3 h-3 opacity-60" />
          {lead.nome_crianca}
          {lead.tema_festa && <span className="text-gray-600">· {lead.tema_festa}</span>}
        </p>
      )}

      {/* Resumo */}
      <p className="text-xs text-gray-500 line-clamp-2 mt-2 mb-3">{lead.resumo}</p>

      {/* Linha de Dados: Data do Evento + Qtd Crianças */}
      <div className="flex items-center gap-3 text-xs mb-3">
        {lead.data_evento ? (
          <div className={`flex items-center gap-1 font-medium ${urgencyColor}`}>
            <Calendar className="w-3 h-3" />
            <span>{formatDate(lead.data_evento)}</span>
            {daysUntil !== null && daysUntil >= 0 && (
              <span className="text-[10px] opacity-70">({daysUntil}d)</span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>Sem data</span>
          </div>
        )}
        {lead.qtd_criancas && (
          <div className="flex items-center gap-1 text-gray-500 ml-auto">
            <Users className="w-3 h-3" />
            <span>{lead.qtd_criancas} crianças</span>
          </div>
        )}
      </div>

      {/* Orçamento + Avatar do Vendedor */}
      <div className="flex items-center justify-between pt-2.5 border-t border-gray-700/40">
        {lead.orcamento_estimado ? (
          <span className="text-xs font-semibold" style={{ color: primaryColor }}>
            {lead.orcamento_estimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
          </span>
        ) : (
          <span className="text-xs text-gray-600">Sem orçamento</span>
        )}

        {/* Avatar do Vendedor responsável */}
        {vendedor ? (
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md ${vendedor.cor_avatar}`}
            title={vendedor.nome}
          >
            {vendedor.avatar_iniciais}
          </div>
        ) : (
          <div
            className="w-7 h-7 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center"
            title="Sem vendedor atribuído"
          >
            <Users className="w-3 h-3 text-gray-600" />
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTE: Botão de Distribuição (Roleta)
// ─────────────────────────────────────────────────────────────

interface AssignModalProps {
  lead: Lead;
  onAssign: (leadId: string, vendedorId: string) => void;
  onClose: () => void;
}

const AssignModal: React.FC<AssignModalProps> = ({ lead, onAssign, onClose }) => {
  const activeVendedores = MOCK_VENDEDORES.filter(v => v.ativo);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-80 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-sm">Atribuir Lead</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Selecione um vendedor para <span className="text-white font-semibold">{lead.nome}</span>:
        </p>
        <div className="space-y-2">
          {activeVendedores.map(v => (
            <button
              key={v.id}
              onClick={() => { onAssign(lead.id!, v.id); onClose(); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/50 hover:border-gray-600 transition text-left"
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white ${v.cor_avatar} shadow`}>
                {v.avatar_iniciais}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{v.nome}</p>
                <p className="text-[10px] text-gray-500">{v.email}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Botão Roleta */}
        <button
          onClick={() => {
            const random = activeVendedores[Math.floor(Math.random() * activeVendedores.length)];
            onAssign(lead.id!, random.id);
            onClose();
          }}
          className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-white text-sm font-semibold hover:opacity-90 transition"
        >
          <Shuffle className="w-4 h-4" />
          Atribuição Automática (Roleta)
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL: KanbanBoard
// ─────────────────────────────────────────────────────────────

interface KanbanBoardProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  primaryColor: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ leads: initialLeads, onLeadClick, primaryColor }) => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [filterVendedor, setFilterVendedor] = useState('');
  const [filterServico, setFilterServico] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [assigningLead, setAssigningLead] = useState<Lead | null>(null);

  // ── Filtros aplicados ─────────────────────────────────────
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchVendedor = filterVendedor ? l.vendedor_id === filterVendedor : true;
      const matchServico = filterServico ? l.tipo_servico === filterServico : true;
      const matchSearch = filterSearch
        ? l.nome.toLowerCase().includes(filterSearch.toLowerCase()) ||
        (l.nome_crianca ?? '').toLowerCase().includes(filterSearch.toLowerCase()) ||
        (l.tema_festa ?? '').toLowerCase().includes(filterSearch.toLowerCase())
        : true;
      return matchVendedor && matchServico && matchSearch;
    });
  }, [leads, filterVendedor, filterServico, filterSearch]);

  // ── Totais por estado original (para o header) ────────────
  const totalOriginal = leads.length;
  const totalFiltrado = filteredLeads.length;
  const hasActiveFilter = filterVendedor || filterServico || filterSearch;

  // ── Atribuição de vendedor ────────────────────────────────
  const handleAssign = (leadId: string, vendedorId: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, vendedor_id: vendedorId } : l));
  };

  // ── Botão Roleta Global (distribui todos sem vendedor) ────
  const handleRoletaGlobal = () => {
    const activeVend = MOCK_VENDEDORES.filter(v => v.ativo);
    if (!activeVend.length) return;
    let idx = 0;
    setLeads(prev =>
      prev.map(l => {
        if (l.vendedor_id) return l;
        const vend = activeVend[idx % activeVend.length];
        idx++;
        return { ...l, vendedor_id: vend.id };
      })
    );
  };

  const semVendedor = leads.filter(l => !l.vendedor_id).length;

  const vendedorOptions = MOCK_VENDEDORES.filter(v => v.ativo).map(v => ({ value: v.id, label: v.nome }));
  const servicoOptions: { value: string; label: string }[] = [
    { value: 'festa', label: '🎂 Festa' },
    { value: 'espaco_kids', label: '🏠 Espaço Kids' },
    { value: 'recreacao', label: '🎪 Recreação' },
    { value: 'outro', label: '📋 Outro' },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* ── Barra de Filtros ─────────────────────────────── */}
      <div className="flex-shrink-0 px-6 pt-6 pb-4 flex flex-wrap items-center gap-3 border-b border-gray-800/60">

        {/* Título e Contagem */}
        <div className="mr-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <PartyPopper className="w-5 h-5" style={{ color: primaryColor }} />
            Gestão de Leads
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {hasActiveFilter ? `${totalFiltrado} de ${totalOriginal}` : `${totalOriginal} leads`}
          </p>
        </div>

        {/* Busca rápida */}
        <div className="relative flex-1 min-w-[180px] max-w-[250px]">
          <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar lead..."
            value={filterSearch}
            onChange={e => setFilterSearch(e.target.value)}
            className="w-full bg-gray-800/70 border border-gray-700/60 rounded-xl pl-8 pr-3 py-2 text-xs text-gray-300 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition"
          />
        </div>

        {/* Filtro por Vendedor */}
        <FilterDropdown
          label="Todos os Vendedores"
          value={filterVendedor}
          options={vendedorOptions}
          onChange={setFilterVendedor}
          icon={Users}
        />

        {/* Filtro por Serviço */}
        <FilterDropdown
          label="Todos os Serviços"
          value={filterServico}
          options={servicoOptions}
          onChange={setFilterServico}
          icon={Palette}
        />

        {/* Limpar Filtros */}
        {hasActiveFilter && (
          <button
            onClick={() => { setFilterVendedor(''); setFilterServico(''); setFilterSearch(''); }}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-3 py-2 rounded-xl bg-gray-800/40 border border-gray-700/40 hover:border-gray-600 transition"
          >
            <X className="w-3.5 h-3.5" />
            Limpar
          </button>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Legendas de Vendedores */}
        <div className="hidden lg:flex items-center gap-2">
          {MOCK_VENDEDORES.filter(v => v.ativo).map(v => (
            <button
              key={v.id}
              onClick={() => setFilterVendedor(filterVendedor === v.id ? '' : v.id)}
              className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border transition ${filterVendedor === v.id
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
                }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${v.cor_avatar}`} />
              {v.nome.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Botão Roleta Global */}
        <button
          onClick={handleRoletaGlobal}
          disabled={semVendedor === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600/20 text-violet-400 border border-violet-500/30 hover:bg-violet-600/30 transition disabled:opacity-40 disabled:cursor-not-allowed"
          title={semVendedor > 0 ? `Distribuir ${semVendedor} lead(s) sem vendedor` : 'Todos os leads já possuem vendedor'}
        >
          <Shuffle className="w-4 h-4" />
          Distribuir {semVendedor > 0 ? `(${semVendedor})` : ''}
        </button>
      </div>

      {/* ── Colunas do Kanban ─────────────────────────────── */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex h-full gap-4 min-w-[1400px]">
          {COLUMNS.map(col => {
            const colLeads = filteredLeads.filter(l => l.etapa_funil === col.id);
            const ColIcon = col.icon;
            return (
              <div key={col.id} className="flex-1 flex flex-col min-w-[220px] max-w-[280px]">

                {/* Header da Coluna */}
                <div className={`flex items-center justify-between mb-4 pb-2.5 border-b-2 ${col.borderColor}`}>
                  <div className="flex items-center gap-2">
                    <ColIcon className={`w-3.5 h-3.5 ${col.badgeText}`} />
                    <h3 className="font-bold text-gray-200 text-xs uppercase tracking-wider">
                      {col.label}
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${col.badgeBg} ${col.badgeText}`}>
                    {colLeads.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-4">
                  {colLeads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-700 gap-2">
                      <ColIcon className="w-8 h-8 opacity-20" />
                      <p className="text-xs opacity-50">Vazio</p>
                    </div>
                  ) : (
                    colLeads.map(lead => (
                      <div key={lead.id ?? lead.telefone} className="relative group/card">
                        <LeadCard
                          lead={lead}
                          onClick={() => onLeadClick(lead)}
                          primaryColor={primaryColor}
                        />
                        {/* Botão de atribuição rápida no hover */}
                        <button
                          onClick={e => { e.stopPropagation(); setAssigningLead(lead); }}
                          className="absolute bottom-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity text-[10px] font-semibold px-2 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 flex items-center gap-1"
                        >
                          <Users className="w-3 h-3" />
                          {lead.vendedor_id ? 'Re-atribuir' : 'Atribuir'}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Modal de Atribuição de Vendedor ───────────────── */}
      {assigningLead && (
        <AssignModal
          lead={assigningLead}
          onAssign={handleAssign}
          onClose={() => setAssigningLead(null)}
        />
      )}
    </div>
  );
};