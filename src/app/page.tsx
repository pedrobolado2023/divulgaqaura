
export default function Home() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-8">
            <main className="max-w-2xl w-full text-center space-y-8">
                <div className="space-y-4">
                    <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        WhatsApp Portal
                    </h1>
                    <p className="text-neutral-400 text-lg">
                        Sistema de automação e gerenciamento de grupos pronto para deploy.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 transition-colors">
                        <h2 className="text-xl font-semibold mb-2 text-emerald-400">Status</h2>
                        <div className="flex items-center justify-center gap-2 text-neutral-300">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            Operacional
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-cyan-500/50 transition-colors">
                        <h2 className="text-xl font-semibold mb-2 text-cyan-400">Deploy</h2>
                        <p className="text-neutral-300">
                            EasyPanel Ready
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
