import React, { useState, useRef, useEffect } from 'react';
import {
    Search,
    Send,
    Smile,
    Paperclip,
    MoreVertical,
    ChevronDown,
    ChevronLeft,
    Bot,
    User,
    Headphones,
    Check,
    CheckCheck,
    Clock,
    Filter,
    Tag,
    PartyPopper,
    Star,
} from 'lucide-react';
import { Conversation, ChatMessage, MessageSender, ConversationTag, Lead } from '../types';
import { MOCK_VENDEDORES } from '../constants';

// ─────────────────────────────────────────────────────────────
// DADOS MOCK DE CONVERSAS
// ─────────────────────────────────────────────────────────────

const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: 'c1',
        lead: {
            id: 'l1', created_at: '2026-02-10 09:14:22', telefone: '11984523610',
            nome: 'Mariana Ferreira', nome_crianca: 'Sofia', tipo_servico: 'festa',
            data_evento: '2026-03-15', qtd_criancas: 30, tema_festa: 'Princesa Sofia',
            orcamento_estimado: 4500, temperatura: 'muito_quente', resumo: '',
            fup_pendente: true, etapa_funil: 'visita_espaco', vendedor_id: 'v1',
        },
        ultima_mensagem: 'Oi! Quero saber mais sobre os pacotes de festa.',
        timestamp_ultima: '2026-02-27T01:48:00',
        nao_lidas: 3,
        tags: ['Orçamento Enviado'],
        messages: [
            { id: 'm1', sender: 'cliente', text: 'Oi! Quero saber mais sobre os pacotes de festa para minha filha Sofia, ela vai fazer 5 anos.', timestamp: '2026-02-27T01:40:00', status: 'read' },
            { id: 'm2', sender: 'ia', text: 'Olá, Mariana! 🎉 Aqui é a Lulinha, do Grupo Curumim! Que incrível, a Sofia vai fazer 5 aninhos! Me conta, você já tem algum tema em mente?', timestamp: '2026-02-27T01:40:45', status: 'read' },
            { id: 'm3', sender: 'cliente', text: 'Sim! Ela ama Princesa Sofia. Seriam umas 30 crianças no dia 15/03.', timestamp: '2026-02-27T01:42:00', status: 'read' },
            { id: 'm4', sender: 'ia', text: 'Perfeito! Para 30 crianças com tema Princesa Sofia, temos o Pacote Encantado a partir de R$ 4.200. Inclui decoração temática, recreação por 3h e buffet kids. Posso te enviar os detalhes completos?', timestamp: '2026-02-27T01:43:00', status: 'read' },
            { id: 'm5', sender: 'vendedor', text: 'Mariana, tudo bem? Sou a Camila, responsável pelo seu atendimento! Vou te enviar o orçamento personalizado agora. 😊', timestamp: '2026-02-27T01:45:00', status: 'read' },
            { id: 'm6', sender: 'cliente', text: 'Oi Camila! Quero saber mais sobre os pacotes de festa.', timestamp: '2026-02-27T01:48:00', status: 'delivered' },
        ],
    },
    {
        id: 'c2',
        lead: {
            id: 'l2', created_at: '2026-02-11 10:05:44', telefone: '13956120894',
            nome: 'Patricia Lima', nome_crianca: 'Pedro', tipo_servico: 'festa',
            data_evento: '2026-04-05', qtd_criancas: 50, tema_festa: 'Super-Heróis',
            orcamento_estimado: 7200, temperatura: 'muito_quente', resumo: '',
            fup_pendente: false, etapa_funil: 'fechamento', vendedor_id: 'v2',
        },
        ultima_mensagem: 'Vou enviar o comprovante do sinal agora!',
        timestamp_ultima: '2026-02-27T00:22:00',
        nao_lidas: 0,
        tags: ['Aguardando Sinal'],
        messages: [
            { id: 'm1', sender: 'cliente', text: 'Boa tarde! Vocês já receberam meu contrato assinado?', timestamp: '2026-02-26T14:00:00', status: 'read' },
            { id: 'm2', sender: 'vendedor', text: 'Oi Patrícia! Sim, recebemos. Tudo certo! Agora precisamos do sinal de R$ 1.500 para confirmar a data do Pedro. 🎈', timestamp: '2026-02-26T14:05:00', status: 'read' },
            { id: 'm3', sender: 'cliente', text: 'Ótimo! Posso pagar via PIX?', timestamp: '2026-02-26T14:08:00', status: 'read' },
            { id: 'm4', sender: 'ia', text: 'Claro, Patrícia! Nossa chave PIX é festas@grupocurumim.com.br. Após o pagamento, envie o comprovante aqui mesmo! ✅', timestamp: '2026-02-26T14:09:00', status: 'read' },
            { id: 'm5', sender: 'cliente', text: 'Vou enviar o comprovante do sinal agora!', timestamp: '2026-02-27T00:22:00', status: 'read' },
        ],
    },
    {
        id: 'c3',
        lead: {
            id: 'l3', created_at: '2026-02-12 11:22:10', telefone: '14998204511',
            nome: 'Roberto Carvalho', nome_crianca: 'Luísa', tipo_servico: 'espaco_kids',
            data_evento: '2026-03-22', qtd_criancas: 20, tema_festa: 'Frozen',
            orcamento_estimado: 3100, temperatura: 'quente', resumo: '',
            fup_pendente: true, etapa_funil: 'orcamento', vendedor_id: 'v3',
        },
        ultima_mensagem: 'Tem disponibilidade no sábado dia 22?',
        timestamp_ultima: '2026-02-26T20:10:00',
        nao_lidas: 1,
        tags: ['Espaço Kids', 'FUP Atrasado'],
        messages: [
            { id: 'm1', sender: 'cliente', text: 'Boa noite! Minha filha Luísa quer festa do Frozen. Vocês têm Espaço Kids disponível?', timestamp: '2026-02-26T19:50:00', status: 'read' },
            { id: 'm2', sender: 'ia', text: 'Boa noite, Roberto! 🌟 Sim! Nosso Espaço Kids é perfeito para a temática Frozen. Temos decoração em tons de azul e branco, bolinhas e escorregador cobertos. Para quantas crianças seria?', timestamp: '2026-02-26T19:51:00', status: 'read' },
            { id: 'm3', sender: 'cliente', text: 'Umas 20 crianças. Tenho interesse em saber os valores.', timestamp: '2026-02-26T19:55:00', status: 'read' },
            { id: 'm4', sender: 'ia', text: 'Para 20 crianças no Espaço Kids por 4h, nosso pacote Gelado sai a R$ 3.100. Já enviamos a proposta completa para seu e-mail! 📧', timestamp: '2026-02-26T19:57:00', status: 'read' },
            { id: 'm5', sender: 'cliente', text: 'Tem disponibilidade no sábado dia 22?', timestamp: '2026-02-26T20:10:00', status: 'delivered' },
        ],
    },
    {
        id: 'c4',
        lead: {
            id: 'l8', created_at: '2026-02-17 15:10:00', telefone: '18991234509',
            nome: 'Juliana Pires', nome_crianca: 'Arthur', tipo_servico: 'festa',
            data_evento: '2026-04-20', qtd_criancas: 60, tema_festa: 'Minecraft',
            orcamento_estimado: 8000, temperatura: 'quente', resumo: '',
            fup_pendente: true, etapa_funil: 'visita_espaco', vendedor_id: 'v1',
        },
        ultima_mensagem: 'Que espaço lindo! Quando posso agendar uma visita?',
        timestamp_ultima: '2026-02-26T15:30:00',
        nao_lidas: 2,
        tags: ['VIP', 'Orçamento Enviado'],
        messages: [
            { id: 'm1', sender: 'cliente', text: 'Oi! Vi vocês no Instagram. Preciso de um pacote premium para 60 crianças, Minecraft.', timestamp: '2026-02-26T14:00:00', status: 'read' },
            { id: 'm2', sender: 'ia', text: 'Olá Juliana! Que festa incrível vai ser! 🎮 Para 60 crianças com decoração exclusiva Minecraft, nosso Pacote Diamante inclui: buffet completo, recreadores, DJ, personalização total e 5h de evento. Valor sob consulta a partir de R$ 7.800.', timestamp: '2026-02-26T14:02:00', status: 'read' },
            { id: 'm3', sender: 'vendedor', text: 'Juliana, aqui é a Camila! Você é nossa cliente VIP hoje! 🌟 Vou te enviar fotos do nosso espaço decorado por completo, já preparamos um mood board Minecraft especial para o Arthur!', timestamp: '2026-02-26T14:10:00', status: 'read' },
            { id: 'm4', sender: 'cliente', text: 'Que espaço lindo! Quando posso agendar uma visita?', timestamp: '2026-02-26T15:30:00', status: 'delivered' },
        ],
    },
    {
        id: 'c5',
        lead: {
            id: 'l7', created_at: '2026-02-16 09:00:00', telefone: '19992345678',
            nome: 'Luciana Mendes', nome_crianca: 'Clara', tipo_servico: 'espaco_kids',
            data_evento: undefined, qtd_criancas: 15, tema_festa: undefined,
            orcamento_estimado: undefined, temperatura: 'frio', resumo: '',
            fup_pendente: false, etapa_funil: 'novo', vendedor_id: undefined,
        },
        ultima_mensagem: 'Ok, vou pensar e retorno.',
        timestamp_ultima: '2026-02-20T09:30:00',
        nao_lidas: 0,
        tags: ['Espaço Kids', 'Lead Frio'],
        messages: [
            { id: 'm1', sender: 'cliente', text: 'Oi, quanto custa o espaço kids?', timestamp: '2026-02-20T09:00:00', status: 'read' },
            { id: 'm2', sender: 'ia', text: 'Olá! 🎉 Nossos pacotes de Espaço Kids começam a partir de R$ 2.500 para até 20 crianças. Você já tem uma data em mente?', timestamp: '2026-02-20T09:05:00', status: 'read' },
            { id: 'm3', sender: 'cliente', text: 'Ok, vou pensar e retorno.', timestamp: '2026-02-20T09:30:00', status: 'read' },
        ],
    },
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const TAG_STYLES: Record<ConversationTag, { bg: string; text: string }> = {
    'Festa Confirmada': { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
    'Orçamento Enviado': { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    'FUP Atrasado': { bg: 'bg-red-500/20', text: 'text-red-400' },
    'Aguardando Sinal': { bg: 'bg-amber-500/20', text: 'text-amber-400' },
    'Lead Frio': { bg: 'bg-gray-500/20', text: 'text-gray-400' },
    'Espaço Kids': { bg: 'bg-violet-500/20', text: 'text-violet-400' },
    'Recreação': { bg: 'bg-orange-500/20', text: 'text-orange-400' },
    'VIP': { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
};

function formatTimestamp(ts: string): string {
    const date = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86_400_000);
    if (days === 0) return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (days === 1) return 'Ontem';
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function getInitials(nome: string): string {
    return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function getVendedor(id?: string) {
    return MOCK_VENDEDORES.find(v => v.id === id);
}

const TIPO_LABEL: Record<string, string> = {
    festa: '🎂 Festa',
    espaco_kids: '🏠 Espaço Kids',
    recreacao: '🎪 Recreação',
    outro: '📋 Outro',
};

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTE: Avatar de Lead
// ─────────────────────────────────────────────────────────────

const LeadAvatar: React.FC<{ lead: Lead; size?: 'sm' | 'md' | 'lg' }> = ({ lead, size = 'md' }) => {
    const sizeMap = { sm: 'w-8 h-8 text-xs', md: 'w-12 h-12 text-sm', lg: 'w-14 h-14 text-base' };
    const colors: Record<string, string> = {
        muito_quente: 'from-rose-500 to-orange-500',
        quente: 'from-orange-500 to-amber-500',
        morna: 'from-amber-500 to-yellow-500',
        morno: 'from-amber-500 to-yellow-500',
        frio: 'from-blue-500 to-cyan-500',
        muito_frio: 'from-blue-700 to-indigo-700',
    };
    return (
        <div className={`${sizeMap[size]} rounded-full bg-gradient-to-br ${colors[lead.temperatura]} flex items-center justify-center font-bold text-white flex-shrink-0 shadow-lg`}>
            {getInitials(lead.nome)}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTE: Card de Conversa (Painel Esquerdo)
// ─────────────────────────────────────────────────────────────

const ConversationItem: React.FC<{
    conv: Conversation;
    isActive: boolean;
    onClick: () => void;
}> = ({ conv, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-all duration-150 border-b border-gray-800/50 ${isActive ? 'bg-gray-800/70' : 'hover:bg-gray-800/40'
            }`}
    >
        <LeadAvatar lead={conv.lead} size="md" />
        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="text-sm font-semibold text-white truncate">{conv.lead.nome}</span>
                <span className="text-[10px] text-gray-500 flex-shrink-0">{formatTimestamp(conv.timestamp_ultima)}</span>
            </div>

            {/* Subtítulo: tipo de serviço */}
            <p className="text-[10px] text-gray-500 mb-1">{TIPO_LABEL[conv.lead.tipo_servico]}{conv.lead.nome_crianca ? ` · ${conv.lead.nome_crianca}` : ''}</p>

            <div className="flex items-end justify-between gap-2">
                <p className="text-xs text-gray-400 truncate flex-1">{conv.ultima_mensagem}</p>
                {conv.nao_lidas > 0 && (
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {conv.nao_lidas}
                    </span>
                )}
            </div>

            {/* Tags */}
            {conv.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                    {conv.tags.map(tag => {
                        const style = TAG_STYLES[tag] ?? { bg: 'bg-gray-700', text: 'text-gray-400' };
                        return (
                            <span key={tag} className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                                {tag}
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    </button>
);

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTE: Bolha de Mensagem (Painel Direito)
// ─────────────────────────────────────────────────────────────

const MessageBubble: React.FC<{ msg: ChatMessage; conv: Conversation }> = ({ msg, conv }) => {
    const isClient = msg.sender === 'cliente';
    const isIA = msg.sender === 'ia';
    const isAgent = msg.sender === 'vendedor';

    const vendedor = isAgent ? getVendedor(conv.lead.vendedor_id) : null;

    const StatusIcon = () => {
        if (!msg.status || isClient) return null;
        if (msg.status === 'read') return <CheckCheck className="w-3 h-3 text-blue-400" />;
        if (msg.status === 'delivered') return <CheckCheck className="w-3 h-3 text-gray-400" />;
        return <Check className="w-3 h-3 text-gray-400" />;
    };

    if (isClient) {
        return (
            <div className="flex items-end gap-2 justify-start">
                <LeadAvatar lead={conv.lead} size="sm" />
                <div className="max-w-[70%]">
                    <div className="bg-gray-800 border border-gray-700/50 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-gray-100 shadow-sm">
                        {msg.text}
                    </div>
                    <p className="text-[10px] text-gray-600 mt-1 ml-1">{formatTimestamp(msg.timestamp)}</p>
                </div>
            </div>
        );
    }

    if (isIA) {
        return (
            <div className="flex items-end gap-2 justify-end">
                <div className="max-w-[70%]">
                    <div className="flex items-center gap-1.5 justify-end mb-1">
                        <Bot className="w-3 h-3 text-violet-400" />
                        <span className="text-[10px] text-violet-400 font-semibold">Copiloto IA</span>
                    </div>
                    <div className="bg-gradient-to-br from-violet-600/30 to-purple-700/30 border border-violet-500/30 rounded-2xl rounded-br-sm px-4 py-2.5 text-sm text-gray-100 shadow-sm">
                        {msg.text}
                    </div>
                    <div className="flex items-center gap-1 justify-end mt-1 mr-1">
                        <p className="text-[10px] text-gray-600">{formatTimestamp(msg.timestamp)}</p>
                        <StatusIcon />
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-violet-400" />
                </div>
            </div>
        );
    }

    // Vendedor
    return (
        <div className="flex items-end gap-2 justify-end">
            <div className="max-w-[70%]">
                <div className="flex items-center gap-1.5 justify-end mb-1">
                    <Headphones className="w-3 h-3 text-amber-400" />
                    <span className="text-[10px] text-amber-400 font-semibold">{vendedor?.nome ?? 'Vendedor'}</span>
                </div>
                <div className="bg-gradient-to-br from-amber-500/20 to-yellow-600/20 border border-amber-500/30 rounded-2xl rounded-br-sm px-4 py-2.5 text-sm text-gray-100 shadow-sm">
                    {msg.text}
                </div>
                <div className="flex items-center gap-1 justify-end mt-1 mr-1">
                    <p className="text-[10px] text-gray-600">{formatTimestamp(msg.timestamp)}</p>
                    <StatusIcon />
                </div>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white ${vendedor?.cor_avatar ?? 'bg-amber-500'}`}>
                {vendedor?.avatar_iniciais ?? 'V'}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL: ChatView
// ─────────────────────────────────────────────────────────────

interface ChatViewProps {
    primaryColor: string;
}

export const ChatView: React.FC<ChatViewProps> = ({ primaryColor }) => {
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
    const [activeConvId, setActiveConvId] = useState<string>(MOCK_CONVERSATIONS[0].id);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTagFilter, setActiveTagFilter] = useState<ConversationTag | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [senderMode, setSenderMode] = useState<MessageSender>('vendedor');
    const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeConv = conversations.find(c => c.id === activeConvId) ?? conversations[0];

    // Filtro de busca + tag
    const filteredConvs = conversations.filter(c => {
        const matchSearch =
            c.lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.ultima_mensagem.toLowerCase().includes(searchTerm.toLowerCase());
        const matchTag = activeTagFilter ? c.tags.includes(activeTagFilter) : true;
        return matchSearch && matchTag;
    });

    // Scroll automático ao final das mensagens
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConvId, activeConv?.messages.length]);

    const handleSend = () => {
        if (!newMessage.trim()) return;
        const msg: ChatMessage = {
            id: `m-${Date.now()}`,
            sender: senderMode,
            text: newMessage.trim(),
            timestamp: new Date().toISOString(),
            status: 'sent',
        };
        setConversations(prev =>
            prev.map(c =>
                c.id === activeConvId
                    ? { ...c, messages: [...c.messages, msg], ultima_mensagem: msg.text, timestamp_ultima: msg.timestamp, nao_lidas: 0 }
                    : c
            )
        );
        setNewMessage('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    const allTags = Array.from(new Set(conversations.flatMap(c => c.tags))) as ConversationTag[];

    const vendedor = getVendedor(activeConv.lead.vendedor_id);

    return (
        <div className="flex h-screen pt-0 overflow-hidden bg-dark-900 pb-20 md:pb-0">

            {/* ══════════════════════════════════════════
          PAINEL ESQUERDO — Lista de Conversas
      ══════════════════════════════════════════ */}
            <div className={`w-full md:w-[340px] flex-shrink-0 flex flex-col border-r border-gray-800 bg-gray-900/40 ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>

                {/* Cabeçalho esquerdo */}
                <div className="px-4 pt-6 pb-3 border-b border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                            <PartyPopper className="w-5 h-5" style={{ color: primaryColor }} />
                            WhatsApp
                        </h2>
                        <div className="flex gap-1">
                            <button className="text-gray-400 hover:text-white transition p-1.5 rounded-lg hover:bg-gray-800">
                                <Filter className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-white transition p-1.5 rounded-lg hover:bg-gray-800">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Busca */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar contato ou mensagem..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-800/60 border border-gray-700/50 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-600 transition"
                        />
                    </div>
                </div>

                {/* Filtro por Tags */}
                <div className="px-4 py-2 flex gap-1.5 flex-wrap border-b border-gray-800/60">
                    <button
                        onClick={() => setActiveTagFilter(null)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-full transition ${activeTagFilter === null ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Todos
                    </button>
                    {allTags.map(tag => {
                        const style = TAG_STYLES[tag] ?? { bg: '', text: 'text-gray-400' };
                        return (
                            <button
                                key={tag}
                                onClick={() => setActiveTagFilter(prev => (prev === tag ? null : tag))}
                                className={`text-[10px] font-semibold px-2 py-1 rounded-full transition ${activeTagFilter === tag ? `${style.bg} ${style.text} ring-1 ring-current` : `${style.text} opacity-60 hover:opacity-100`
                                    }`}
                            >
                                {tag}
                            </button>
                        );
                    })}
                </div>

                {/* Lista de Conversas */}
                <div className="flex-1 overflow-y-auto">
                    {filteredConvs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-3">
                            <Search className="w-8 h-8 opacity-30" />
                            <p className="text-sm">Nenhuma conversa encontrada</p>
                        </div>
                    ) : (
                        filteredConvs.map(conv => (
                            <ConversationItem
                                key={conv.id}
                                conv={conv}
                                isActive={conv.id === activeConvId}
                                onClick={() => {
                                    setActiveConvId(conv.id);
                                    setMobileView('chat');
                                    // Zerar não lidas ao abrir
                                    setConversations(prev =>
                                        prev.map(c => c.id === conv.id ? { ...c, nao_lidas: 0 } : c)
                                    );
                                }}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* ══════════════════════════════════════════
          PAINEL DIREITO — Histórico de Mensagens
      ══════════════════════════════════════════ */}
            <div className={`flex-1 flex flex-col min-w-0 ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>

                {/* Header da Conversa Ativa */}
                <div className="h-[72px] flex items-center px-4 md:px-6 gap-3 md:gap-4 border-b border-gray-800 bg-gray-900/30 flex-shrink-0">
                    <button onClick={() => setMobileView('list')} className="md:hidden p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition shrink-0">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <LeadAvatar lead={activeConv.lead} size="md" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white text-base truncate">{activeConv.lead.nome}</h3>
                            {activeConv.tags.includes('VIP') && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span>{TIPO_LABEL[activeConv.lead.tipo_servico]}</span>
                            {activeConv.lead.data_evento && (
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(activeConv.lead.data_evento + 'T00:00:00').toLocaleDateString('pt-BR')}
                                </span>
                            )}
                            {vendedor && (
                                <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${vendedor.cor_avatar}/20 text-white/70`}>
                                    <span className={`w-2 h-2 rounded-full ${vendedor.cor_avatar}`} />
                                    {vendedor.nome}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Ações do Header */}
                    <div className="flex items-center gap-2">
                        {/* Tags da conversa ativa */}
                        <div className="hidden md:flex gap-1.5">
                            {activeConv.tags.map(tag => {
                                const style = TAG_STYLES[tag] ?? { bg: 'bg-gray-700', text: 'text-gray-400' };
                                return (
                                    <span key={tag} className={`text-[10px] font-semibold px-2 py-1 rounded-full ${style.bg} ${style.text}`}>
                                        {tag}
                                    </span>
                                );
                            })}
                        </div>
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Área de Mensagens */}
                <div
                    className="flex-1 overflow-y-auto p-6 space-y-4"
                    style={{
                        backgroundImage: `radial-gradient(circle at 20% 20%, ${primaryColor}08 0%, transparent 50%), radial-gradient(circle at 80% 80%, #7c3aed10 0%, transparent 50%)`,
                    }}
                >
                    {/* Indicador de Data */}
                    <div className="flex items-center gap-3 my-2">
                        <div className="flex-1 h-px bg-gray-800" />
                        <span className="text-[10px] text-gray-600 font-medium px-3 py-1 bg-gray-800/50 rounded-full">
                            Hoje
                        </span>
                        <div className="flex-1 h-px bg-gray-800" />
                    </div>

                    {activeConv.messages.map(msg => (
                        <MessageBubble key={msg.id} msg={msg} conv={activeConv} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* ── Input de Envio ──────────────────────────── */}
                <div className="border-t border-gray-800 bg-gray-900/30 px-4 py-3 flex-shrink-0">

                    {/* Seletor de Modo de Envio */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Enviar como:</span>
                        {([
                            { value: 'vendedor', label: 'Vendedor', icon: Headphones, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
                            { value: 'ia', label: 'IA', icon: Bot, color: 'text-violet-400 border-violet-500/40 bg-violet-500/10' },
                        ] as const).map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setSenderMode(opt.value)}
                                className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition ${senderMode === opt.value ? opt.color : 'text-gray-500 border-gray-700 hover:border-gray-600'
                                    }`}
                            >
                                <opt.icon className="w-3 h-3" />
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-end gap-3">
                        {/* Botões Auxiliares */}
                        <button className="p-2.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl transition">
                            <Smile className="w-5 h-5" />
                        </button>
                        <button className="p-2.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl transition">
                            <Paperclip className="w-5 h-5" />
                        </button>

                        {/* Textarea */}
                        <div className="flex-1 relative">
                            <textarea
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={`Mensagem como ${senderMode === 'ia' ? 'IA (Copiloto)' : 'Vendedor'}…`}
                                rows={1}
                                className="w-full bg-gray-800/60 border border-gray-700/50 rounded-2xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gray-500 resize-none transition leading-relaxed"
                                style={{ maxHeight: '120px' }}
                            />
                        </div>

                        {/* Botão Enviar */}
                        <button
                            onClick={handleSend}
                            disabled={!newMessage.trim()}
                            className="p-3 rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
                            style={{ backgroundColor: primaryColor, color: '#1a1a1a' }}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-700 mt-1.5 ml-1">
                        Enter para enviar · Shift+Enter para nova linha
                    </p>
                </div>
            </div>
        </div>
    );
};
