// ============================================================
// TIPOS GLOBAIS — Copiloto IA | Grupo Curumim
// ============================================================

// ── Temperatura / Qualificação do Lead ───────────────────────
export type Temperature = 'muito_quente' | 'quente' | 'morna' | 'morno' | 'frio' | 'muito_frio';

// ── Etapas do Funil de Eventos ───────────────────────────────
export type FunnelStage =
  | 'novo'
  | 'contato'
  | 'visita_espaco'
  | 'orcamento'
  | 'fechamento'
  | 'confirmado';

// ── Tipos de Serviço oferecidos pelo Grupo Curumim ───────────
export type TipoServico = 'festa' | 'espaco_kids' | 'recreacao' | 'outro';

// ── Tags de conversa no Chat ─────────────────────────────────
export type ConversationTag =
  | 'Festa Confirmada'
  | 'Orçamento Enviado'
  | 'FUP Atrasado'
  | 'Aguardando Sinal'
  | 'Lead Frio'
  | 'Espaço Kids'
  | 'Recreação'
  | 'VIP';

// ── Entidade: Vendedor ────────────────────────────────────────
export interface Vendedor {
  id: string;
  nome: string;
  email: string;
  avatar_iniciais: string; // Ex: "CR"
  cor_avatar: string;      // Tailwind color class, ex: "bg-blue-500"
  ativo: boolean;
}

// ── Entidade: Lead (Evento/Festa) ─────────────────────────────
export interface Lead {
  id?: string;
  created_at: string;
  telefone: string;
  nome: string;                       // Nome do responsável
  nome_crianca?: string;              // Nome da criança aniversariante
  tipo_servico: TipoServico;          // festa | espaco_kids | recreacao | outro
  data_evento?: string;               // Data prevista do evento (ISO)
  qtd_criancas?: number;              // Número de crianças esperadas
  tema_festa?: string;                // Ex: "Princesa Sofia", "Dinossauros"
  local_preferido?: string;           // "no_espaco" | "em_casa" | "a_definir"
  orcamento_estimado?: number;        // Valor orçado / estimado (R$)
  temperatura: Temperature;
  resumo: string;                     // Resumo da última interação da IA
  fup_pendente: boolean;
  etapa_funil: FunnelStage;
  ultimo_contato?: string;
  vendedor_id?: string;               // FK -> Vendedor.id
  tags?: ConversationTag[];           // Tags de contexto
}

// ── Configuração do Tenant ────────────────────────────────────
export interface Tenant {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  logoText: string;
  slug: string;
  nicho?: string; // Ex: "eventos_infantis"
}

// ── Estado dos Filtros do CRM ─────────────────────────────────
export interface FilterState {
  search: string;
  temperatura: string;
  fup: string;
  tipo_servico?: string;
  vendedor_id?: string;
}

// ── Métricas do Dashboard ─────────────────────────────────────
export interface DashboardMetrics {
  total: number;
  hot: number;
  fupPending: number;
  conversionRate: number;
  eventosMes?: number;       // Total de eventos confirmados no mês
  ticketMedio?: number;      // Ticket médio dos eventos fechados
}

// ── Configurações da IA ───────────────────────────────────────
export interface AISettings {
  modelName: string;
  creativity: number; // 0 a 1
  tone: 'professional' | 'friendly' | 'aggressive' | 'consultative';
  responseLength: 'short' | 'medium' | 'long';
  systemPrompt: string;
  persona_nome?: string;    // Ex: "Lulinha", "Tia Festa"
  foco_servico?: TipoServico | 'all'; // Foco da persona
}

// ── Status da Conexão WhatsApp ────────────────────────────────
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// ── Mensagem no Chat Web ──────────────────────────────────────
export type MessageSender = 'ia' | 'cliente' | 'vendedor';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

// ── Conversa no painel de Chat ────────────────────────────────
export interface Conversation {
  id: string;
  lead: Lead;
  ultima_mensagem: string;
  timestamp_ultima: string;
  nao_lidas: number;
  tags: ConversationTag[];
  messages: ChatMessage[];
}

// ── Item de Disparo em Massa ──────────────────────────────────
export interface BroadcastItem {
  lead_id: string;
  nome: string;
  telefone: string;
  data_evento?: string;
  tipo_servico: TipoServico;
  selected: boolean;
}

// ── Sexo da Criança ────────────────────────────────────────────
export type SexoCrianca = 'menina' | 'menino' | 'nao_informado';

// ── Responsável pelo cliente ───────────────────────────────────
export interface Responsavel {
  nome: string;
  telefone: string;
  email?: string;
  cpf?: string;
  parentesco?: 'mae' | 'pai' | 'avo' | 'tio' | 'outro';
}

// ── Entidade: Festa realizada ──────────────────────────────────
export interface FestaRealizada {
  data: string;                 // ISO date
  tipo_servico: TipoServico;
  tema?: string;
  qtd_criancas?: number;
  valor_pago?: number;
}

// ── Entidade: Cliente (Criança como cadastro principal) ────────
export interface ClienteCrianca {
  id: string;
  created_at: string;
  // Dados da Criança
  nome_crianca: string;
  data_nascimento: string;       // ISO date YYYY-MM-DD
  sexo: SexoCrianca;
  gostos: string[];              // Tags de interesses/gostos
  // Dados do Responsável
  responsavel: Responsavel;
  // Histórico
  ultima_festa?: FestaRealizada; // Data/info da última festa realizada
  historico_festas?: FestaRealizada[];
  // Relacionamento com Leads
  lead_ids?: string[];           // IDs dos leads associados
  // Meta
  observacoes?: string;
  ativo: boolean;
}
