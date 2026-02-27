import React, { useState, useMemo } from 'react';
import {
    Search,
    Plus,
    X,
    Baby,
    Phone,
    Mail,
    Calendar,
    Tag,
    Heart,
    ChevronRight,
    PartyPopper,
    User,
    Users,
    Edit3,
    Filter,
    Star,
    Sparkles,
    Clock,
} from 'lucide-react';
import { ClienteCrianca, FestaRealizada, Responsavel, SexoCrianca, TipoServico } from '../types';

// ─────────────────────────────────────────────────────────────
// DADOS MOCK
// ─────────────────────────────────────────────────────────────

const MOCK_CLIENTES: ClienteCrianca[] = [
    {
        id: 'c1',
        created_at: '2025-03-10',
        nome_crianca: 'Sofia Ferreira',
        data_nascimento: '2020-03-15',
        sexo: 'menina',
        gostos: ['Princesas', 'Unicórnios', 'Rosa', 'Dança'],
        responsavel: { nome: 'Mariana Ferreira', telefone: '11984523610', email: 'mariana@email.com', parentesco: 'mae' },
        ultima_festa: { data: '2025-03-15', tipo_servico: 'festa', tema: 'Princesa Sofia', qtd_criancas: 30, valor_pago: 4500 },
        historico_festas: [
            { data: '2024-03-15', tipo_servico: 'festa', tema: 'Frozen', qtd_criancas: 25, valor_pago: 3800 },
            { data: '2025-03-15', tipo_servico: 'festa', tema: 'Princesa Sofia', qtd_criancas: 30, valor_pago: 4500 },
        ],
        ativo: true,
    },
    {
        id: 'c2',
        created_at: '2025-04-05',
        nome_crianca: 'Pedro Lima',
        data_nascimento: '2018-04-05',
        sexo: 'menino',
        gostos: ['Super-Heróis', 'Marvel', 'Futebol', 'Azul'],
        responsavel: { nome: 'Patricia Lima', telefone: '13956120894', email: 'patricia@email.com', parentesco: 'mae' },
        ultima_festa: { data: '2025-04-05', tipo_servico: 'festa', tema: 'Super-Heróis', qtd_criancas: 50, valor_pago: 7200 },
        historico_festas: [
            { data: '2023-04-05', tipo_servico: 'espaco_kids', qtd_criancas: 20, valor_pago: 2500 },
            { data: '2024-04-05', tipo_servico: 'festa', tema: 'Minecraft', qtd_criancas: 40, valor_pago: 5500 },
            { data: '2025-04-05', tipo_servico: 'festa', tema: 'Super-Heróis', qtd_criancas: 50, valor_pago: 7200 },
        ],
        ativo: true,
    },
    {
        id: 'c3',
        created_at: '2025-03-22',
        nome_crianca: 'Luísa Carvalho',
        data_nascimento: '2019-07-22',
        sexo: 'menina',
        gostos: ['Frozen', 'Elsa', 'Neve', 'Princesas'],
        responsavel: { nome: 'Roberto Carvalho', telefone: '14998204511', parentesco: 'pai' },
        ultima_festa: { data: '2025-03-22', tipo_servico: 'espaco_kids', tema: 'Frozen', qtd_criancas: 20, valor_pago: 3100 },
        historico_festas: [
            { data: '2025-03-22', tipo_servico: 'espaco_kids', tema: 'Frozen', qtd_criancas: 20, valor_pago: 3100 },
        ],
        ativo: true,
    },
    {
        id: 'c4',
        created_at: '2025-04-20',
        nome_crianca: 'Arthur Pires',
        data_nascimento: '2017-09-10',
        sexo: 'menino',
        gostos: ['Minecraft', 'Games', 'Tecnologia', 'Verde'],
        responsavel: { nome: 'Juliana Pires', telefone: '18991234509', email: 'ju.pires@email.com', parentesco: 'mae' },
        ultima_festa: { data: '2025-04-20', tipo_servico: 'festa', tema: 'Minecraft', qtd_criancas: 60, valor_pago: 8000 },
        historico_festas: [
            { data: '2025-04-20', tipo_servico: 'festa', tema: 'Minecraft', qtd_criancas: 60, valor_pago: 8000 },
        ],
        ativo: true,
    },
    {
        id: 'c5',
        created_at: '2025-08-12',
        nome_crianca: 'Clara Mendes',
        data_nascimento: '2021-08-12',
        sexo: 'menina',
        gostos: ['Bichinhos', 'Jardim', 'Animais'],
        responsavel: { nome: 'Luciana Mendes', telefone: '19992345678', parentesco: 'mae' },
        ativo: true,
    },
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function calcIdade(dataNasc: string): string {
    const hoje = new Date();
    const nasc = new Date(dataNasc + 'T00:00:00');
    let anos = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) anos--;
    return `${anos} ano${anos !== 1 ? 's' : ''}`;
}

function formatDate(d: string) {
    return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatCurrency(v: number) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

function proximoAniversario(dataNasc: string): number {
    const hoje = new Date();
    const nasc = new Date(dataNasc + 'T00:00:00');
    const aniversario = new Date(hoje.getFullYear(), nasc.getMonth(), nasc.getDate());
    if (aniversario < hoje) aniversario.setFullYear(hoje.getFullYear() + 1);
    return Math.ceil((aniversario.getTime() - hoje.getTime()) / 86_400_000);
}

const GOSTOS_SUGESTOES = [
    'Princesas', 'Unicórnios', 'Frozen', 'Barbie', 'Peppa Pig', 'Super-Heróis', 'Marvel', 'DC',
    'Minecraft', 'Roblox', 'Games', 'Futebol', 'Dinossauros', 'Carros', 'Fortnite',
    'Circo', 'Arte', 'Música', 'Dança', 'Natureza', 'Animais', 'Bichinhos',
    'Mickey', 'Turma da Mônica', 'Patrulha Canina', 'Pokémon', 'Star Wars',
];

const TIPO_LABEL: Record<TipoServico, string> = {
    festa: '🎂 Festa',
    espaco_kids: '🏠 Espaço Kids',
    recreacao: '🎪 Recreação',
    outro: '📋 Outro',
};

const PARENTESCO_LABEL: Record<string, string> = {
    mae: 'Mãe',
    pai: 'Pai',
    avo: 'Avó/Avô',
    tio: 'Tio/Tia',
    outro: 'Responsável',
};

const SEX_CONFIG: Record<SexoCrianca, { label: string; color: string; emoji: string }> = {
    menina: { label: 'Menina', color: '#ec4899', emoji: '👧' },
    menino: { label: 'Menino', color: '#3b82f6', emoji: '👦' },
    nao_informado: { label: 'N/I', color: '#6b7280', emoji: '🧒' },
};

// ─────────────────────────────────────────────────────────────
// CARD DE CLIENTE
// ─────────────────────────────────────────────────────────────

const ClienteCard: React.FC<{ cliente: ClienteCrianca; onClick: () => void; primaryColor: string }> = ({ cliente, onClick, primaryColor }) => {
    const sex = SEX_CONFIG[cliente.sexo];
    const dias = proximoAniversario(cliente.data_nascimento);
    const aniversarioProximo = dias <= 30;
    const totalFestas = cliente.historico_festas?.length ?? (cliente.ultima_festa ? 1 : 0);
    const totalGasto = cliente.historico_festas?.reduce((s, f) => s + (f.valor_pago ?? 0), 0) ?? (cliente.ultima_festa?.valor_pago ?? 0);

    return (
        <button
            onClick={onClick}
            className="w-full text-left bg-gray-900/70 hover:bg-gray-800/70 border border-gray-700/50 hover:border-gray-600/70 rounded-2xl p-5 transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5 group"
        >
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
                {/* Avatar */}
                <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 shadow-lg"
                    style={{ backgroundColor: sex.color + '20', border: `1.5px solid ${sex.color}40` }}
                >
                    {sex.emoji}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white text-base truncate">{cliente.nome_crianca}</h3>
                        {aniversarioProximo && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center gap-1">
                                🎂 {dias === 0 ? 'Hoje!' : `Em ${dias}d`}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {calcIdade(cliente.data_nascimento)} • {sex.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {cliente.responsavel.nome}
                        {cliente.responsavel.parentesco && <span className="text-gray-600">({PARENTESCO_LABEL[cliente.responsavel.parentesco]})</span>}
                    </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition flex-shrink-0 mt-1" />
            </div>

            {/* Gostos */}
            {cliente.gostos.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {cliente.gostos.slice(0, 4).map(g => (
                        <span key={g} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                            {g}
                        </span>
                    ))}
                    {cliente.gostos.length > 4 && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-500">
                            +{cliente.gostos.length - 4}
                        </span>
                    )}
                </div>
            )}

            {/* Footer stats */}
            <div className="flex items-center gap-4 pt-3 border-t border-gray-800/60">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <PartyPopper className="w-3 h-3" />
                    <span>{totalFestas} festa{totalFestas !== 1 ? 's' : ''}</span>
                </div>
                {totalGasto > 0 && (
                    <div className="flex items-center gap-1 text-xs font-semibold ml-auto" style={{ color: primaryColor }}>
                        {formatCurrency(totalGasto)}
                    </div>
                )}
                {cliente.ultima_festa && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        {formatDate(cliente.ultima_festa.data)}
                    </div>
                )}
            </div>
        </button>
    );
};

// ─────────────────────────────────────────────────────────────
// DRAWER DE DETALHE
// ─────────────────────────────────────────────────────────────

const ClienteDrawer: React.FC<{ cliente: ClienteCrianca | null; onClose: () => void; primaryColor: string }> = ({ cliente, onClose, primaryColor }) => {
    if (!cliente) return null;
    const sex = SEX_CONFIG[cliente.sexo];
    const dias = proximoAniversario(cliente.data_nascimento);

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={onClose} />
            <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-gray-950 border-l border-gray-800 z-[70] flex flex-col shadow-2xl transform transition-transform duration-300">

                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-950 flex-shrink-0">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl flex-shrink-0"
                                style={{ backgroundColor: sex.color + '18', border: `2px solid ${sex.color}35` }}
                            >
                                {sex.emoji}
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white">{cliente.nome_crianca}</h2>
                                <p className="text-sm text-gray-400 mt-0.5">{calcIdade(cliente.data_nascimento)} • {sex.label}</p>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                    <Calendar className="w-3 h-3" />
                                    Nasc: {formatDate(cliente.data_nascimento)}
                                    {dias <= 30 && <span className="text-yellow-400 font-bold ml-1">🎂 Em {dias}d!</span>}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition flex-shrink-0">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Gostos */}
                    <div>
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Heart className="w-3.5 h-3.5" /> Gostos & Interesses
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {cliente.gostos.length > 0 ? cliente.gostos.map(g => (
                                <span key={g} className="text-sm font-semibold px-3 py-1.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                                    {g}
                                </span>
                            )) : <span className="text-sm text-gray-600">Nenhum gosto cadastrado</span>}
                        </div>
                    </div>

                    {/* Responsável */}
                    <div>
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <User className="w-3.5 h-3.5" /> Responsável
                        </h3>
                        <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-base font-black text-white flex-shrink-0">
                                    {cliente.responsavel.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{cliente.responsavel.nome}</p>
                                    {cliente.responsavel.parentesco && (
                                        <p className="text-xs text-gray-500">{PARENTESCO_LABEL[cliente.responsavel.parentesco]}</p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2 pt-2 border-t border-gray-700/40">
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <Phone className="w-3.5 h-3.5 text-gray-500" />
                                    {cliente.responsavel.telefone}
                                </div>
                                {cliente.responsavel.email && (
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <Mail className="w-3.5 h-3.5 text-gray-500" />
                                        {cliente.responsavel.email}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Última festa */}
                    {cliente.ultima_festa && (
                        <div>
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Star className="w-3.5 h-3.5" /> Última Festa
                            </h3>
                            <div
                                className="rounded-xl p-4 border"
                                style={{ backgroundColor: primaryColor + '0d', borderColor: primaryColor + '30' }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">{TIPO_LABEL[cliente.ultima_festa.tipo_servico].split(' ')[0]}</span>
                                    <div>
                                        <p className="text-sm font-bold text-white">
                                            {cliente.ultima_festa.tema ?? TIPO_LABEL[cliente.ultima_festa.tipo_servico].slice(3)}
                                        </p>
                                        <p className="text-xs text-gray-400">{formatDate(cliente.ultima_festa.data)}</p>
                                    </div>
                                    {cliente.ultima_festa.valor_pago && (
                                        <span className="ml-auto text-sm font-black" style={{ color: primaryColor }}>
                                            {formatCurrency(cliente.ultima_festa.valor_pago)}
                                        </span>
                                    )}
                                </div>
                                {cliente.ultima_festa.qtd_criancas && (
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        {cliente.ultima_festa.qtd_criancas} crianças
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Histórico completo */}
                    {cliente.historico_festas && cliente.historico_festas.length > 1 && (
                        <div>
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <PartyPopper className="w-3.5 h-3.5" /> Histórico de Festas ({cliente.historico_festas.length})
                            </h3>
                            <div className="space-y-2">
                                {[...cliente.historico_festas].reverse().map((f, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-800/40 border border-gray-700/40 rounded-xl">
                                        <span className="text-base flex-shrink-0">{TIPO_LABEL[f.tipo_servico].split(' ')[0]}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-200">{f.tema ?? TIPO_LABEL[f.tipo_servico].slice(3)}</p>
                                            <p className="text-xs text-gray-500">{formatDate(f.data)}{f.qtd_criancas ? ` · ${f.qtd_criancas} crianças` : ''}</p>
                                        </div>
                                        {f.valor_pago && (
                                            <span className="text-sm font-bold text-emerald-400">{formatCurrency(f.valor_pago)}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Observações */}
                    {cliente.observacoes && (
                        <div>
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Observações</h3>
                            <p className="text-sm text-gray-300 leading-relaxed bg-gray-800/30 border border-gray-700/30 rounded-xl p-4">
                                {cliente.observacoes}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-800 bg-gray-900/40 flex-shrink-0">
                    <button
                        className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition hover:opacity-90"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <Edit3 className="w-4 h-4" />
                        Editar Cadastro
                    </button>
                </div>
            </div>
        </>
    );
};

// ─────────────────────────────────────────────────────────────
// MODAL DE CADASTRO
// ─────────────────────────────────────────────────────────────

const GOSTO_INPUT_PLACEHOLDER = 'Ex: Dinossauros (Enter para adicionar)';

const CadastroModal: React.FC<{
    onClose: () => void;
    onSave: (c: ClienteCrianca) => void;
    primaryColor: string;
}> = ({ onClose, onSave, primaryColor }) => {
    const [form, setForm] = useState({
        nome_crianca: '',
        data_nascimento: '',
        sexo: 'nao_informado' as SexoCrianca,
        resp_nome: '',
        resp_telefone: '',
        resp_email: '',
        resp_parentesco: 'mae' as Responsavel['parentesco'],
        ultima_festa_data: '',
        ultima_festa_tipo: 'festa' as TipoServico,
        ultima_festa_tema: '',
        observacoes: '',
    });
    const [gostos, setGostos] = useState<string[]>([]);
    const [gostoInput, setGostoInput] = useState('');
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const addGosto = (g: string) => {
        const trimmed = g.trim();
        if (trimmed && !gostos.includes(trimmed)) {
            setGostos(prev => [...prev, trimmed]);
        }
        setGostoInput('');
    };

    const removeGosto = (g: string) => setGostos(prev => prev.filter(x => x !== g));

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.nome_crianca.trim()) e.nome_crianca = 'Nome da criança é obrigatório';
        if (!form.data_nascimento) e.data_nascimento = 'Data de nascimento é obrigatória';
        if (!form.resp_nome.trim()) e.resp_nome = 'Nome do responsável é obrigatório';
        if (!form.resp_telefone.trim()) e.resp_telefone = 'Telefone é obrigatório';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => {
        if (!validate()) { setStep(1); return; }
        const ultima_festa: FestaRealizada | undefined = form.ultima_festa_data
            ? { data: form.ultima_festa_data, tipo_servico: form.ultima_festa_tipo, tema: form.ultima_festa_tema || undefined }
            : undefined;
        const novo: ClienteCrianca = {
            id: `c-${Date.now()}`,
            created_at: new Date().toISOString().slice(0, 10),
            nome_crianca: form.nome_crianca.trim(),
            data_nascimento: form.data_nascimento,
            sexo: form.sexo,
            gostos,
            responsavel: {
                nome: form.resp_nome.trim(),
                telefone: form.resp_telefone.trim(),
                email: form.resp_email.trim() || undefined,
                parentesco: form.resp_parentesco,
            },
            ultima_festa,
            historico_festas: ultima_festa ? [ultima_festa] : undefined,
            observacoes: form.observacoes.trim() || undefined,
            ativo: true,
        };
        onSave(novo);
        onClose();
    };

    const inputCls = (field: string) =>
        `w-full bg-gray-800/60 border ${errors[field] ? 'border-rose-500/60' : 'border-gray-700/50'} rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition`;

    return (
        <>
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]" onClick={onClose} />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[90] w-full max-w-lg bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

                {/* Modal header */}
                <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h2 className="text-base font-black text-white">Novo Cliente</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Passo {step} de 3</p>
                    </div>
                    {/* Steps */}
                    <div className="flex items-center gap-2 mr-4">
                        {[1, 2, 3].map(s => (
                            <button key={s} onClick={() => setStep(s as 1 | 2 | 3)}>
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${step === s ? 'text-gray-900' : step > s ? 'text-white/60' : 'text-gray-600 bg-gray-800'}`}
                                    style={step === s ? { backgroundColor: primaryColor } : step > s ? { backgroundColor: primaryColor + '60' } : {}}
                                >
                                    {s}
                                </div>
                            </button>
                        ))}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Modal body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {step === 1 && (
                        <>
                            <p className="text-xs font-black text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-4">
                                <Baby className="w-3.5 h-3.5" /> Dados da Criança
                            </p>
                            <div>
                                <label className="text-xs text-gray-400 font-semibold mb-1 block">Nome da criança *</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Sofia Ferreira"
                                    value={form.nome_crianca}
                                    onChange={e => setForm(f => ({ ...f, nome_crianca: e.target.value }))}
                                    className={inputCls('nome_crianca')}
                                />
                                {errors.nome_crianca && <p className="text-xs text-rose-400 mt-1">{errors.nome_crianca}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-400 font-semibold mb-1 block">Data de nascimento *</label>
                                    <input
                                        type="date"
                                        value={form.data_nascimento}
                                        onChange={e => setForm(f => ({ ...f, data_nascimento: e.target.value }))}
                                        className={inputCls('data_nascimento')}
                                    />
                                    {errors.data_nascimento && <p className="text-xs text-rose-400 mt-1">{errors.data_nascimento}</p>}
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 font-semibold mb-1 block">Sexo</label>
                                    <select
                                        value={form.sexo}
                                        onChange={e => setForm(f => ({ ...f, sexo: e.target.value as SexoCrianca }))}
                                        className={inputCls('sexo')}
                                    >
                                        <option value="nao_informado">Não informado</option>
                                        <option value="menina">Menina 👧</option>
                                        <option value="menino">Menino 👦</option>
                                    </select>
                                </div>
                            </div>
                            {/* Gostos */}
                            <div>
                                <label className="text-xs text-gray-400 font-semibold mb-1 block">Gostos & Interesses</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder={GOSTO_INPUT_PLACEHOLDER}
                                        value={gostoInput}
                                        onChange={e => setGostoInput(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addGosto(gostoInput); } }}
                                        className="flex-1 bg-gray-800/60 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition"
                                    />
                                    <button
                                        onClick={() => addGosto(gostoInput)}
                                        className="px-3 py-2 rounded-xl text-xs font-bold text-white transition"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                {/* Sugestões */}
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {GOSTOS_SUGESTOES.filter(g => !gostos.includes(g)).slice(0, 12).map(g => (
                                        <button
                                            key={g}
                                            onClick={() => addGosto(g)}
                                            className="text-[10px] font-semibold px-2 py-1 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 border border-gray-700 transition"
                                        >
                                            + {g}
                                        </button>
                                    ))}
                                </div>
                                {gostos.length > 0 && (
                                    <div className="flex flex-wrap gap-2 p-3 bg-gray-800/30 rounded-xl border border-gray-700/30">
                                        {gostos.map(g => (
                                            <span key={g} className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                                {g}
                                                <button onClick={() => removeGosto(g)}><X className="w-3 h-3 hover:text-white" /></button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <p className="text-xs font-black text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-4">
                                <User className="w-3.5 h-3.5" /> Dados do Responsável
                            </p>
                            <div>
                                <label className="text-xs text-gray-400 font-semibold mb-1 block">Nome completo *</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Mariana Ferreira"
                                    value={form.resp_nome}
                                    onChange={e => setForm(f => ({ ...f, resp_nome: e.target.value }))}
                                    className={inputCls('resp_nome')}
                                />
                                {errors.resp_nome && <p className="text-xs text-rose-400 mt-1">{errors.resp_nome}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-400 font-semibold mb-1 block">Telefone / WhatsApp *</label>
                                    <input
                                        type="tel"
                                        placeholder="11 9 8765-4321"
                                        value={form.resp_telefone}
                                        onChange={e => setForm(f => ({ ...f, resp_telefone: e.target.value }))}
                                        className={inputCls('resp_telefone')}
                                    />
                                    {errors.resp_telefone && <p className="text-xs text-rose-400 mt-1">{errors.resp_telefone}</p>}
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 font-semibold mb-1 block">Parentesco</label>
                                    <select
                                        value={form.resp_parentesco}
                                        onChange={e => setForm(f => ({ ...f, resp_parentesco: e.target.value as any }))}
                                        className={inputCls('resp_parentesco')}
                                    >
                                        <option value="mae">Mãe</option>
                                        <option value="pai">Pai</option>
                                        <option value="avo">Avó / Avô</option>
                                        <option value="tio">Tio / Tia</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 font-semibold mb-1 block">E-mail</label>
                                <input
                                    type="email"
                                    placeholder="email@exemplo.com"
                                    value={form.resp_email}
                                    onChange={e => setForm(f => ({ ...f, resp_email: e.target.value }))}
                                    className={inputCls('resp_email')}
                                />
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <p className="text-xs font-black text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-4">
                                <PartyPopper className="w-3.5 h-3.5" /> Última Festa Realizada
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-400 font-semibold mb-1 block">Data da última festa</label>
                                    <input
                                        type="date"
                                        value={form.ultima_festa_data}
                                        onChange={e => setForm(f => ({ ...f, ultima_festa_data: e.target.value }))}
                                        className={inputCls('ultima_festa_data')}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 font-semibold mb-1 block">Tipo de serviço</label>
                                    <select
                                        value={form.ultima_festa_tipo}
                                        onChange={e => setForm(f => ({ ...f, ultima_festa_tipo: e.target.value as TipoServico }))}
                                        className={inputCls('ultima_festa_tipo')}
                                    >
                                        <option value="festa">🎂 Festa</option>
                                        <option value="espaco_kids">🏠 Espaço Kids</option>
                                        <option value="recreacao">🎪 Recreação</option>
                                        <option value="outro">📋 Outro</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 font-semibold mb-1 block">Tema da festa</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Princesa Sofia, Minecraft..."
                                    value={form.ultima_festa_tema}
                                    onChange={e => setForm(f => ({ ...f, ultima_festa_tema: e.target.value }))}
                                    className={inputCls('ultima_festa_tema')}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 font-semibold mb-1 block">Observações gerais</label>
                                <textarea
                                    rows={3}
                                    placeholder="Ex: Cliente VIP, prefere festas no período da manhã..."
                                    value={form.observacoes}
                                    onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))}
                                    className={`${inputCls('observacoes')} resize-none`}
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Modal footer */}
                <div className="px-6 py-4 border-t border-gray-800 flex gap-3 flex-shrink-0">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(s => (s - 1) as 1 | 2 | 3)}
                            className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-300 font-semibold text-sm hover:bg-gray-800 transition"
                        >
                            Voltar
                        </button>
                    )}
                    {step < 3 ? (
                        <button
                            onClick={() => setStep(s => (s + 1) as 1 | 2 | 3)}
                            className="flex-1 py-2.5 rounded-xl font-bold text-sm transition hover:opacity-90 text-gray-900"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Próximo
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            className="flex-1 py-2.5 rounded-xl font-bold text-sm transition hover:opacity-90 text-gray-900 flex items-center justify-center gap-2"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <Sparkles className="w-4 h-4" />
                            Salvar Cliente
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────

interface ClientesViewProps {
    primaryColor: string;
}

export const ClientesView: React.FC<ClientesViewProps> = ({ primaryColor }) => {
    const [clientes, setClientes] = useState<ClienteCrianca[]>(MOCK_CLIENTES);
    const [search, setSearch] = useState('');
    const [filterSexo, setFilterSexo] = useState<SexoCrianca | ''>('');
    const [selectedCliente, setSelectedCliente] = useState<ClienteCrianca | null>(null);
    const [showCadastro, setShowCadastro] = useState(false);

    const filteredClientes = useMemo(() => {
        return clientes.filter(c => {
            const matchSearch =
                c.nome_crianca.toLowerCase().includes(search.toLowerCase()) ||
                c.responsavel.nome.toLowerCase().includes(search.toLowerCase()) ||
                c.gostos.some(g => g.toLowerCase().includes(search.toLowerCase()));
            const matchSexo = filterSexo ? c.sexo === filterSexo : true;
            return matchSearch && matchSexo;
        });
    }, [clientes, search, filterSexo]);

    const aniversariosProximos = clientes.filter(c => proximoAniversario(c.data_nascimento) <= 30);
    const totalGeral = clientes.reduce((s, c) => s + (c.historico_festas?.reduce((a, f) => a + (f.valor_pago ?? 0), 0) ?? (c.ultima_festa?.valor_pago ?? 0)), 0);

    const handleSave = (c: ClienteCrianca) => {
        setClientes(prev => [c, ...prev]);
    };

    return (
        <div className="h-full flex flex-col overflow-hidden pb-20 md:pb-0">

            {/* ── Header ────────────────────────────────────── */}
            <div className="flex-shrink-0 px-6 py-5 border-b border-gray-800/60">
                <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-xl font-black text-white flex items-center gap-2">
                            <Baby className="w-5 h-5" style={{ color: primaryColor }} />
                            Clientes
                        </h1>
                        <p className="text-xs text-gray-500 mt-0.5">{clientes.length} crianças cadastradas</p>
                    </div>
                    <button
                        onClick={() => setShowCadastro(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition hover:opacity-90 shadow-lg text-gray-900"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <Plus className="w-4 h-4" />
                        Novo Cliente
                    </button>
                </div>

                {/* KPI row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                        { label: 'Total de Clientes', value: clientes.length, icon: Baby, color: primaryColor },
                        { label: 'Aniversários (30d)', value: aniversariosProximos.length, icon: PartyPopper, color: '#f59e0b' },
                        { label: 'LTV Total', value: formatCurrency(totalGeral), icon: Star, color: '#10b981' },
                    ].map(k => (
                        <div key={k.label} className="bg-gray-800/40 border border-gray-700/40 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <k.icon className="w-3.5 h-3.5" style={{ color: k.color }} />
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">{k.label}</span>
                            </div>
                            <p className="text-lg font-black text-white">{k.value}</p>
                        </div>
                    ))}
                </div>

                {/* Filtros */}
                <div className="flex gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar criança, responsável ou gosto..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-gray-800/60 border border-gray-700/50 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-600 transition"
                        />
                    </div>
                    <div className="flex items-center gap-1 bg-gray-800/40 border border-gray-700/40 rounded-xl p-1">
                        {[{ value: '', label: 'Todos' }, { value: 'menina', label: '👧 Meninas' }, { value: 'menino', label: '👦 Meninos' }].map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setFilterSexo(opt.value as any)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filterSexo === opt.value ? 'text-gray-900' : 'text-gray-400 hover:text-gray-200'}`}
                                style={filterSexo === opt.value ? { backgroundColor: primaryColor } : {}}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Lista de Clientes ─────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-6">
                {filteredClientes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-4">
                        <Baby className="w-12 h-12 opacity-20" />
                        <p className="text-sm opacity-60">Nenhum cliente encontrado</p>
                        <button
                            onClick={() => setShowCadastro(true)}
                            className="px-4 py-2 rounded-xl text-sm font-bold transition hover:opacity-90 text-gray-900"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Cadastrar primeiro cliente
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Aniversários próximos destaque */}
                        {aniversariosProximos.length > 0 && !search && !filterSexo && (
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[11px] font-black text-yellow-500 uppercase tracking-wider">🎂 Aniversários nos próximos 30 dias</span>
                                </div>
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {aniversariosProximos.map(c => {
                                        const dias = proximoAniversario(c.data_nascimento);
                                        const sex = SEX_CONFIG[c.sexo];
                                        return (
                                            <button
                                                key={c.id}
                                                onClick={() => setSelectedCliente(c)}
                                                className="flex-shrink-0 bg-yellow-500/10 border border-yellow-500/25 hover:border-yellow-500/50 rounded-2xl p-4 text-left transition hover:-translate-y-0.5 w-40"
                                            >
                                                <div className="text-2xl mb-2">{sex.emoji}</div>
                                                <p className="text-sm font-bold text-white truncate">{c.nome_crianca.split(' ')[0]}</p>
                                                <p className="text-[10px] text-yellow-400 font-bold mt-1">🎂 {dias === 0 ? 'Hoje!' : `Em ${dias} dias`}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-2 mb-3">
                            <Filter className="w-3.5 h-3.5 text-gray-600" />
                            <span className="text-xs text-gray-600 font-semibold">{filteredClientes.length} resultado{filteredClientes.length !== 1 ? 's' : ''}</span>
                        </div>

                        {/* ── Tabela / Lista ──────────────────────── */}
                        <div className="bg-gray-900/50 border border-gray-800/60 rounded-2xl overflow-hidden">
                            {/* Cabeçalho */}
                            <div className="grid grid-cols-[2.5rem_1fr_1fr_1fr_auto] gap-4 px-4 py-2.5 border-b border-gray-800/80 bg-gray-800/30">
                                <div />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Criança</span>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Responsável</span>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Gostos</span>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider pr-2">Última Festa</span>
                            </div>

                            {/* Linhas */}
                            {filteredClientes.map((c, idx) => {
                                const sex = SEX_CONFIG[c.sexo];
                                const dias = proximoAniversario(c.data_nascimento);
                                const anivProximo = dias <= 30;
                                const totalGasto = c.historico_festas?.reduce((s, f) => s + (f.valor_pago ?? 0), 0) ?? (c.ultima_festa?.valor_pago ?? 0);
                                const totalFestas = c.historico_festas?.length ?? (c.ultima_festa ? 1 : 0);

                                return (
                                    <button
                                        key={c.id}
                                        onClick={() => setSelectedCliente(c)}
                                        className={`w-full grid grid-cols-[2.5rem_1fr_1fr_1fr_auto] gap-4 px-4 py-3.5 text-left transition-all duration-150 group hover:bg-gray-800/50 ${idx !== filteredClientes.length - 1 ? 'border-b border-gray-800/40' : ''}`}
                                    >
                                        {/* Avatar / emoji */}
                                        <div
                                            className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 self-center"
                                            style={{ backgroundColor: sex.color + '18', border: `1.5px solid ${sex.color}35` }}
                                        >
                                            {sex.emoji}
                                        </div>

                                        {/* Criança */}
                                        <div className="flex flex-col justify-center min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-bold text-white truncate group-hover:text-white/90">{c.nome_crianca}</span>
                                                {anivProximo && (
                                                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 whitespace-nowrap">
                                                        🎂 {dias === 0 ? 'Hoje!' : `${dias}d`}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-500 mt-0.5">{calcIdade(c.data_nascimento)} · {sex.label}</span>
                                        </div>

                                        {/* Responsável */}
                                        <div className="flex flex-col justify-center min-w-0">
                                            <span className="text-sm text-gray-300 truncate">{c.responsavel.nome}</span>
                                            <span className="text-xs text-gray-600 mt-0.5 font-mono">{c.responsavel.telefone}</span>
                                        </div>

                                        {/* Gostos */}
                                        <div className="flex flex-wrap gap-1 items-center self-center">
                                            {c.gostos.slice(0, 3).map(g => (
                                                <span key={g} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/12 text-indigo-300 border border-indigo-500/20 whitespace-nowrap">
                                                    {g}
                                                </span>
                                            ))}
                                            {c.gostos.length > 3 && (
                                                <span className="text-[10px] text-gray-600">+{c.gostos.length - 3}</span>
                                            )}
                                        </div>

                                        {/* Última Festa + valor */}
                                        <div className="flex flex-col justify-center items-end self-center gap-0.5 pr-1">
                                            {c.ultima_festa ? (
                                                <>
                                                    <span className="text-xs text-gray-400 whitespace-nowrap">{formatDate(c.ultima_festa.data)}</span>
                                                    {totalGasto > 0 && (
                                                        <span className="text-xs font-bold whitespace-nowrap" style={{ color: primaryColor }}>{formatCurrency(totalGasto)}</span>
                                                    )}
                                                    <span className="text-[10px] text-gray-600">{totalFestas} festa{totalFestas !== 1 ? 's' : ''}</span>
                                                </>
                                            ) : (
                                                <span className="text-xs text-gray-600 italic">Sem histórico</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Drawer de detalhe */}
            <ClienteDrawer
                cliente={selectedCliente}
                onClose={() => setSelectedCliente(null)}
                primaryColor={primaryColor}
            />

            {/* Modal de cadastro */}
            {showCadastro && (
                <CadastroModal
                    onClose={() => setShowCadastro(false)}
                    onSave={handleSave}
                    primaryColor={primaryColor}
                />
            )}
        </div>
    );
};
