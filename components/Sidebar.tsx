import React from 'react';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  MessageSquare,
  Megaphone,
  PartyPopper,
  Sparkles,
  Smartphone,
  CalendarDays,
  Baby,
} from 'lucide-react';
import { Tenant } from '../types';

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
  tenant: Tenant;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, tenant }) => {

  const operacionalItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'calendar', label: 'Agenda', icon: CalendarDays },
    { id: 'clientes', label: 'Clientes', icon: Baby },
    { id: 'kanban', label: 'Gestão de Leads', icon: Users },
    { id: 'chat', label: 'WhatsApp', icon: MessageSquare },
    { id: 'broadcast', label: 'Disparos em Massa', icon: Megaphone },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  ];

  const sistemaItems = [
    { id: 'whatsapp', label: 'Conexão WhatsApp', icon: Smartphone },
    { id: 'ai-calibration', label: 'Calibrar IA', icon: Sparkles },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const renderItem = (item: { id: string; label: string; icon: React.ElementType }) => {
    const isActive = currentView === item.id;
    const isNew = item.id === 'chat' || item.id === 'broadcast';
    return (
      <button
        key={item.id}
        onClick={() => onChangeView(item.id)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group font-display ${isActive
          ? 'bg-gray-800/80 text-white shadow-lg shadow-black/20 border border-gray-700/50 font-bold'
          : 'text-gray-400 hover:text-white hover:bg-gray-800/40 font-semibold'
          }`}
      >
        <item.icon
          className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}
          style={isActive ? { color: tenant.primaryColor } : {}}
        />
        <span className="flex-1 text-left leading-none">{item.label}</span>
        {isNew && (
          <span
            className="text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide"
            style={{ backgroundColor: tenant.primaryColor + '25', color: tenant.primaryColor }}
          >
            Novo
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-dark-900 border-r border-gray-800/70 flex flex-col z-50">

      {/* ── Branding com Logo ──────────────────────────── */}
      <div className="h-[72px] flex items-center px-5 border-b border-gray-800/70 gap-3 flex-shrink-0">
        {/* Logo Grupo Curumim */}
        <img
          src="/logos/logo.png"
          alt="Grupo Curumim"
          className="h-9 w-auto object-contain"
          style={{ filter: 'brightness(1.05) drop-shadow(0 2px 6px rgba(253,184,19,0.3))' }}
          onError={e => {
            // Fallback: mostra ícone se logo não carregar
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {/* Fallback visível apenas se logo falhar */}
        <div className="flex flex-col">
          <span
            className="text-[10px] font-black uppercase tracking-widest font-display"
            style={{ color: tenant.primaryColor }}
          >
            Copiloto IA
          </span>
          <span className="text-[9px] text-gray-600 font-mono uppercase tracking-wider">v2.0</span>
        </div>
      </div>

      {/* ── Navegação ──────────────────────────────────── */}
      <nav className="flex-1 py-5 px-3 space-y-5 overflow-y-auto">

        {/* Operacional */}
        <div className="space-y-0.5">
          <div className="px-3 mb-2 h7 text-gray-600" style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.68rem', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase' }}>
            Operacional
          </div>
          {operacionalItems.map(renderItem)}
        </div>

        {/* Inteligência */}
        <div className="space-y-0.5">
          <div className="px-3 mb-2" style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.68rem', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase', color: '#4b5563' }}>
            Inteligência &amp; Sistema
          </div>
          {sistemaItems.map(renderItem)}
        </div>
      </nav>

      {/* ── Rodapé — Perfil ────────────────────────────── */}
      <div className="p-4 border-t border-gray-800/70 bg-black/20 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Avatar com cor do tenant */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black font-display shadow-inner flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${tenant.primaryColor}40, ${tenant.primaryColor}70)`,
              border: `1.5px solid ${tenant.primaryColor}50`,
              color: tenant.primaryColor,
            }}
          >
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate font-display leading-tight">Admin</p>
            <p className="text-[11px] text-gray-600 truncate leading-tight">admin@grupocurumim.com.br</p>
          </div>
          <button className="text-gray-600 hover:text-white transition-colors p-1" title="Sair">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};