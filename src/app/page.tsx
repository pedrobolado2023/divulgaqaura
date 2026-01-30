"use client";

import { useState } from "react";
import {
    Send,
    Users,
    MessageSquare,
    Clock,
    CheckCircle2,
    AlertCircle,
    FileText,
    Settings,
    Database
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
    const [message, setMessage] = useState("");
    const [numbers, setNumbers] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleSend = () => {
        setIsSending(true);
        // Simulation of sending process
        setTimeout(() => {
            setIsSending(false);
            alert("Campanha iniciada! As mensagens foram enfileiradas.");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-[#f0f0f2] bg-gradient-mesh selection:bg-[#25d366] selection:text-white pb-20">
            {/* Header */}
            <header className="border-b border-[#ffffff10] bg-[#0a0a0c]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#25d366] to-[#00a884] flex items-center justify-center shadow-lg shadow-[#25d366]/20">
                            <Send className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">WhatsApp Portal</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#25d366]/10 border border-[#25d366]/20 text-[#25d366] text-sm font-medium">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25d366] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25d366]"></span>
                            </span>
                            System Online
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10">
                {/* Welcome Section */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold mb-2">Painel de Disparos</h1>
                    <p className="text-gray-400">Gerencie suas campanhas de marketing e monitore o status dos envios.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: "Total Contatos", value: "37,402", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
                        { label: "Mensagens Enviadas", value: "12,850", icon: MessageSquare, color: "text-[#25d366]", bg: "bg-[#25d366]/10" },
                        { label: "Na Fila", value: "24,552", icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
                        { label: "Taxa de Sucesso", value: "98.2%", icon: CheckCircle2, color: "text-purple-400", bg: "bg-purple-400/10" },
                    ].map((stat, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={i}
                            className="glass p-6 rounded-2xl hover:border-[#ffffff20] transition-colors group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={20} />
                                </div>
                                {i === 2 && (
                                    <span className="text-xs font-semibold px-2 py-1 rounded bg-[#ffffff10] text-gray-300">
                                        Drip Ativo
                                    </span>
                                )}
                            </div>
                            <div className="text-2xl font-bold mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass rounded-2xl p-8 border-[#25d366]/20 bg-gradient-to-b from-[#ffffff05] to-transparent relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <Send size={150} />
                            </div>

                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1 h-8 bg-[#25d366] rounded-full"></div>
                                <h2 className="text-xl font-bold">Nova Campanha</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                        <Users size={14} />
                                        Lista de Contatos (CSV ou Manual)
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            value={numbers}
                                            onChange={(e) => setNumbers(e.target.value)}
                                            placeholder="5511999999999&#10;5511888888888"
                                            className="w-full h-32 bg-[#0a0a0c] border border-[#ffffff15] rounded-xl p-4 text-sm focus:outline-none focus:border-[#25d366] focus:ring-1 focus:ring-[#25d366] transition-all font-mono placeholder:text-gray-700 resize-none"
                                        />
                                        <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-[#0a0a0c] px-2 py-1 rounded border border-[#ffffff10]">
                                            {numbers.split('\n').filter(n => n.trim().length > 0).length} contatos
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                        <MessageSquare size={14} />
                                        Mensagem
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Olá! Temos uma novidade para você..."
                                            className="w-full h-40 bg-[#0a0a0c] border border-[#ffffff15] rounded-xl p-4 text-sm focus:outline-none focus:border-[#25d366] focus:ring-1 focus:ring-[#25d366] transition-all resize-none"
                                        />
                                        <div className="absolute bottom-3 right-3 flex gap-2">
                                            <button className="text-xs bg-[#ffffff10] hover:bg-[#ffffff20] px-2 py-1 rounded text-gray-400 transition-colors">
                                                + Variável Nome
                                            </button>
                                            <button className="text-xs bg-[#ffffff10] hover:bg-[#ffffff20] px-2 py-1 rounded text-gray-400 transition-colors">
                                                + Saudação Aleatória
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl border border-[#ffffff10] bg-[#ffffff03]">
                                        <div className="text-xs text-gray-500 mb-1">Intervalo (Min - Máx)</div>
                                        <div className="font-mono text-sm">60s - 180s <span className="text-[#25d366] ml-1">(Safe Mode)</span></div>
                                    </div>
                                    <div className="p-4 rounded-xl border border-[#ffffff10] bg-[#ffffff03]">
                                        <div className="text-xs text-gray-500 mb-1">Atraso de Digitação</div>
                                        <div className="font-mono text-sm">Ativado (5s)</div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSend}
                                    disabled={isSending || !message || !numbers}
                                    className="w-full h-12 bg-[#25d366] hover:bg-[#1fa953] active:scale-[0.99] text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {isSending ? (
                                        <>
                                            <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                            Processando...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                            Iniciar Campanha
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="glass rounded-xl p-6">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <AlertCircle size={16} className="text-amber-400" />
                                Dicas de Segurança
                            </h3>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li className="flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></div>
                                    Mantenha o intervalo acima de 60 segundos para evitar banimentos.
                                </li>
                                <li className="flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></div>
                                    Use variações de mensagem (Spintax) sempre que possível.
                                </li>
                                <li className="flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></div>
                                    Aqueça chips novos antes de enviar campanhas grandes.
                                </li>
                            </ul>
                        </div>

                        <div className="glass rounded-xl p-6">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Database size={16} className="text-blue-400" />
                                Conexão Supabase
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <span className="text-green-400">Conectado</span>
                                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                                </div>
                                <div className="text-xs text-gray-500">
                                    Sincronizado com tabela <code>contatos_pending</code>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
