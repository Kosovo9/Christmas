'use client';

import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Users, DollarSign, Image as ImageIcon,
    Gift, Search, Lock, RefreshCw, TrendingUp
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<any>(null);

    // Give Credits State
    const [targetUserId, setTargetUserId] = useState('');
    const [creditAmount, setCreditAmount] = useState(1000);
    const [creditStatus, setCreditStatus] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'Navidad2025') { // Hardcoded for simplicity as requested, change in prod!
            setIsAuthenticated(true);
            fetchStats();
        } else {
            alert('Acceso Denegado');
        }
    };

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/stats');
            const data = await res.json();
            setStats(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleGiveCredits = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreditStatus('Procesando...');
        try {
            const res = await fetch('/api/admin/give-credits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: targetUserId,
                    amount: creditAmount,
                    adminKey: password
                })
            });
            const data = await res.json();
            if (data.success) {
                setCreditStatus(`✅ Éxito! ${creditAmount} créditos añadidos.`);
                setTargetUserId('');
            } else {
                setCreditStatus('❌ Error: ' + data.error);
            }
        } catch (e) {
            setCreditStatus('❌ Error de conexión');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(225,29,72,0.6)]">
                            <Lock className="text-white" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-white">NEXORA ADMIN</h1>
                        <p className="text-neutral-400">Acceso Restringido</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña Maestra"
                            className="w-full bg-black border border-neutral-700 rounded-xl px-4 py-3 text-white focus:border-rose-500 focus:outline-none transition-colors"
                        />
                        <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-rose-500/20">
                            ENTRAR
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            {/* Sidebar / Nav */}
            <nav className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
                            <LayoutDashboard size={18} />
                        </div>
                        <span className="font-bold text-xl tracking-tight">NEXORA <span className="text-rose-500">GOD MODE</span></span>
                    </div>
                    <button onClick={fetchStats} className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-8 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard icon={<DollarSign />} title="Ingresos Totales" value={`$${stats?.stats?.revenue || 0}`} color="text-green-400" />
                    <StatCard icon={<Users />} title="Usuarios Totales" value={stats?.stats?.users || 0} color="text-blue-400" />
                    <StatCard icon={<ImageIcon />} title="Imágenes Generadas" value={stats?.stats?.images || 0} color="text-purple-400" />
                    <StatCard icon={<TrendingUp />} title="Conversión" value={`${stats?.stats?.conversionRate || 0}%`} color="text-yellow-400" />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><TrendingUp size={18} className="text-rose-500" /> Rendimiento de Ventas</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats?.chartData || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="date" stroke="#666" />
                                    <YAxis stroke="#666" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="amount" fill="#e11d48" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Give Credits Tool */}
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Gift size={18} className="text-rose-500" /> Regalar Créditos</h3>
                        <form onSubmit={handleGiveCredits} className="space-y-4">
                            <div>
                                <label className="block text-xs text-neutral-400 mb-1">User ID (de Supabase o Clerk)</label>
                                <input
                                    type="text"
                                    value={targetUserId}
                                    onChange={(e) => setTargetUserId(e.target.value)}
                                    placeholder="user_2..."
                                    className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:border-rose-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-neutral-400 mb-1">Cantidad de Créditos</label>
                                <input
                                    type="number"
                                    value={creditAmount}
                                    onChange={(e) => setCreditAmount(Number(e.target.value))}
                                    className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:border-rose-500 focus:outline-none"
                                />
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-bold py-2 rounded-lg transition-all shadow-lg">
                                ENVIAR CRÉDITOS
                            </button>
                            {creditStatus && <p className="text-xs text-center mt-2 font-mono">{creditStatus}</p>}
                        </form>
                    </div>
                </div>

                {/* Recent Images Gallery */}
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><ImageIcon size={18} className="text-rose-500" /> Últimas Generaciones</h3>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        {stats?.recentImages?.map((img: any, i: number) => (
                            <div key={i} className="aspect-[4/5] rounded-lg overflow-hidden bg-black relative group">
                                <img src={img.image_url} alt="Gen" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-[10px] text-neutral-400 truncate">
                                    {new Date(img.created_at).toLocaleTimeString()}
                                </div>
                            </div>
                        ))}
                        {(!stats?.recentImages || stats.recentImages.length === 0) && (
                            <p className="text-neutral-500 col-span-full text-center py-8">No hay imágenes recientes.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ icon, title, value, color }: any) {
    return (
        <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl flex items-center gap-4 hover:border-neutral-700 transition-colors">
            <div className={`p-3 rounded-xl bg-neutral-800 ${color}`}>
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <div>
                <p className="text-neutral-400 text-sm font-medium">{title}</p>
                <h4 className="text-2xl font-bold text-white">{value}</h4>
            </div>
        </div>
    );
}
