import React, { useState, useEffect } from 'react';
import { Smartphone, RefreshCw, CheckCircle2, AlertCircle, ShieldCheck, QrCode } from 'lucide-react';
import { ConnectionStatus, Tenant } from '../types';

interface WhatsAppConnectProps {
  tenant: Tenant;
}

export const WhatsAppConnect: React.FC<WhatsAppConnectProps> = ({ tenant }) => {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [qrProgress, setQrProgress] = useState(100);

  // Simulate QR Code timeout loop
  useEffect(() => {
    if (status === 'disconnected') {
      const timer = setInterval(() => {
        setQrProgress((prev) => {
          if (prev <= 0) return 100;
          return prev - 2;
        });
      }, 200);
      return () => clearInterval(timer);
    }
  }, [status]);

  const handleSimulateConnection = () => {
    setStatus('connecting');
    setTimeout(() => {
      setStatus('connected');
    }, 3000);
  };

  const handleDisconnect = () => {
    setStatus('disconnected');
    setQrProgress(100);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Conexão WhatsApp</h2>
        <p className="text-gray-400">Gerencie a conexão do seu número oficial para o atendimento automático da IA.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Left Column: Instructions & Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className={`p-6 rounded-xl border ${
            status === 'connected' 
              ? 'bg-emerald-500/10 border-emerald-500/20' 
              : 'bg-dark-800 border-gray-700'
          }`}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                status === 'connected' ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-400'
              }`}>
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Status da Conexão</p>
                <p className={`text-lg font-bold ${
                  status === 'connected' ? 'text-emerald-400' : 'text-white'
                }`}>
                  {status === 'connected' ? 'Online e Sincronizado' : status === 'connecting' ? 'Verificando...' : 'Desconectado'}
                </p>
              </div>
            </div>
            {status === 'connected' && (
              <button 
                onClick={handleDisconnect}
                className="w-full py-2 bg-dark-900/50 hover:bg-rose-500/20 text-gray-300 hover:text-rose-400 border border-gray-600 hover:border-rose-500/30 rounded-lg text-sm transition-all"
              >
                Desconectar Sessão
              </button>
            )}
          </div>

          <div className="bg-dark-800/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              Segurança e Privacidade
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-1.5"></span>
                Seu QR Code é gerado em tempo real e é único para esta sessão.
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-1.5"></span>
                A IA lerá apenas mensagens de novos contatos ou leads marcados.
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-1.5"></span>
                A conexão mantém criptografia de ponta a ponta do WhatsApp.
              </li>
            </ul>
          </div>
        </div>

        {/* Center/Right: The QR Display */}
        <div className="lg:col-span-2 flex items-center justify-center p-8 bg-dark-800 rounded-2xl border border-gray-700/50 relative overflow-hidden">
          
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          
          {status === 'disconnected' && (
            <div className="flex flex-col items-center z-10">
              <div className="relative group cursor-pointer" onClick={handleSimulateConnection}>
                <div className="w-72 h-72 bg-white p-4 rounded-xl shadow-2xl relative overflow-hidden">
                   {/* Fake QR Pattern */}
                   <div className="w-full h-full border-4 border-black border-dashed flex items-center justify-center">
                        <QrCode className="w-32 h-32 text-black opacity-80" />
                   </div>
                   
                   {/* Scan overlay */}
                   <div className="absolute top-0 left-0 w-full h-1 bg-brand-500 shadow-[0_0_20px_rgba(212,175,55,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                   
                   {/* Blur overlay for timeout */}
                   {qrProgress < 10 && (
                     <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
                        <RefreshCw className="w-8 h-8 text-gray-800 animate-spin mb-2" />
                        <span className="text-gray-800 font-bold text-sm">Atualizando Code...</span>
                     </div>
                   )}
                </div>
              </div>
              
              <div className="mt-8 text-center space-y-2">
                <p className="text-white text-lg font-medium">Abra o WhatsApp no seu celular</p>
                <p className="text-gray-400 text-sm">Menu {'>'} Aparelhos Conectados {'>'} Conectar Aparelho</p>
              </div>

              <div className="mt-6 w-64 bg-gray-700 h-1 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-brand-500 transition-all duration-200"
                    style={{ width: `${qrProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {status === 'connecting' && (
             <div className="flex flex-col items-center z-10 animate-pulse">
                <div className="w-24 h-24 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mb-6"></div>
                <h3 className="text-xl text-white font-bold">Estabelecendo conexão segura...</h3>
                <p className="text-gray-400 text-sm mt-2">Isso pode levar alguns segundos</p>
             </div>
          )}

          {status === 'connected' && (
             <div className="flex flex-col items-center z-10 text-center">
                <div className="w-32 h-32 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-emerald-500/10">
                    <CheckCircle2 className="w-16 h-16 text-emerald-400" />
                </div>
                <h3 className="text-2xl text-white font-bold mb-2">WhatsApp Conectado!</h3>
                <p className="text-gray-400 max-w-md">
                    O número <strong>(11) 99999-9999</strong> está ativo. A IA Copiloto já está monitorando novas interações.
                </p>
                <div className="mt-8 p-4 bg-dark-900/50 border border-gray-700 rounded-lg flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                    <span className="text-xs font-mono text-emerald-400">SYSTEM: Listening for incoming messages...</span>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};