"use client";

import { useState, useEffect } from "react";
import {
    Send,
    Users,
    MessageSquare,
    Clock,
    CheckCircle2,
    AlertCircle,
    Database,
    Sparkles,
    Smartphone
} from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function Dashboard() {
    const [message, setMessage] = useState("");
    const [numbers, setNumbers] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [topic, setTopic] = useState("");
    const [showAiModal, setShowAiModal] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        sent: 0,
        pending: 0,
        success_rate: "0%"
    });

    // Fetch real stats on mount
    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

        try {
            const { count: pendingCount } = await supabase
                .from('contatos_pending') // Adjust table name if needed
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending');

            const { count: sentCount } = await supabase
                .from('contatos_pending')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'sent');

            const total = (pendingCount || 0) + (sentCount || 0);
            const rate = total > 0 && sentCount ? ((sentCount / total) * 100).toFixed(1) + "%" : "0%";

            setStats({
                total: total,
                sent: sentCount || 0,
                pending: pendingCount || 0,
                success_rate: rate
            });
        } catch (e) {
            console.error("Error fetching stats:", e);
        }
    };

    const handleGenerateAI = async () => {
        if (!topic) return;
        setIsGenerating(true);
        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                body: JSON.stringify({ prompt: topic }),
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();
            if (data.message) {
                setMessage(data.message);
                setShowAiModal(false);
            }
        } catch (error) {
            alert("Erro ao gerar mensagem. Verifique a API Key do Groq.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSend = async () => {
        setIsSending(true);

        try {
            // Parse numbers
            const numberList = numbers.split('\n')
                .map(n => n.replace(/\D/g, ''))
                .filter(n => n.length >= 10);

            if (numberList.length === 0) {
                alert("Nenhum número válido encontrado.");
                setIsSending(false);
                return;
            }

            // Save to Supabase
            if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
                const rows = numberList.map(num => ({
                    telefone: num,
                    message_template: message,
                    status: 'pending',
                    created_at: new Date().toISOString()
                }));

                const { error } = await supabase
                    .from('contatos_pending')
                    .insert(rows);

                if (error) throw error;

                alert(`Sucesso! ${rows.length} contatos adicionados à fila de envio.`);
                setNumbers("");
                fetchStats();
            } else {
                // Demo mode if no Supabase
                alert("[MODO DEMONSTRAÇÃO] Configure o Supabase no EasyPanel para salvar de verdade.");
            }

        } catch (error) {
            console.error(error);
            alert("Erro ao salvar contatos.");
        } finally {
            setIsSending(false);
        }
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
                        { label: "Total Contatos", value: stats.total.toLocaleString(), icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
                        { label: "Enviados", value: stats.sent.toLocaleString(), icon: CheckCircle2, color: "text-[#25d366]", bg: "bg-[#25d366]/10" },
                        { label: "Fila Pendente", value: stats.pending.toLocaleString(), icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
                        { label: "Taxa de Entrega", value: stats.success_rate, icon: Smartphone, color: "text-purple-400", bg: "bg-purple-400/10" },
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
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-8 bg-[#25d366] rounded-full"></div>
                                    <h2 className="text-xl font-bold">Nova Campanha</h2>
                                </div>
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
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                            <MessageSquare size={14} />
                                            Mensagem
                                        </label>
                                        <button
                                            onClick={() => setShowAiModal(!showAiModal)}
                                            className="text-xs flex items-center gap-1 text-[#25d366] hover:text-[#1fa953] transition-colors"
                                        >
                                            <Sparkles size={12} />
                                            Gerar com IA (Groq)
                                        </button>
                                    </div>

                                    {showAiModal && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mb-4 bg-[#ffffff05] p-4 rounded-xl border border-[#ffffff10]"
                                        >
                                            <input
                                                type="text"
                                                value={topic}
                                                onChange={(e) => setTopic(e.target.value)}
                                                placeholder="Ex: Oferta imperdível de Lançamento"
                                                className="w-full bg-[#0a0a0c] border border-[#ffffff15] rounded-lg p-3 text-sm mb-2"
                                            />
                                            <button
                                                onClick={handleGenerateAI}
                                                disabled={isGenerating}
                                                className="w-full bg-[#25d366]/20 hover:bg-[#25d366]/30 text-[#25d366] text-sm py-2 rounded-lg transition-colors"
                                            >
                                                {isGenerating ? "Criando mágica..." : "Gerar Texto Persuasivo"}
                                            </button>
                                        </motion.div>
                                    )}

                                    <div className="relative">
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Olá! Temos uma novidade para você..."
                                            className="w-full h-40 bg-[#0a0a0c] border border-[#ffffff15] rounded-xl p-4 text-sm focus:outline-none focus:border-[#25d366] focus:ring-1 focus:ring-[#25d366] transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleSend}
                                    disabled={isSending || !message || !numbers}
                                    className="w-full h-12 bg-[#25d366] hover:bg-[#1fa953] active:scale-[0.99] text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {isSending ? "Salvando..." : "Adicionar à Fila de Disparo"}
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="glass rounded-xl p-6">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Database size={16} className="text-blue-400" />
                                Status da Conexão
                            </h3>
                            <div className="space-y-3">
                                {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                                    <div className="flex items-center justify-between text-sm p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                        <span className="text-green-400">Supabase Ativo</span>
                                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between text-sm p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                        <span className="text-red-400">Configure as Variáveis!</span>
                                        <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
