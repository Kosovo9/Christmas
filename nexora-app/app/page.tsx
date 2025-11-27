"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    Camera, Instagram, Twitter, Mail, X, Menu, ChevronRight,
    MapPin, Phone, Heart, Check, Star, Sliders, ArrowRight,
    ChevronLeft, ChevronRight as ChevronRightIcon, Upload,
    Wand2, CreditCard, Gift, Sparkles, Image as ImageIcon,
    Zap, Globe, Shield, Lock, Users, DollarSign, BarChart3,
    Bot, MessageSquare, PawPrint, UserPlus, AlertTriangle,
    Download, LockKeyhole, FileWarning, Database, Link as LinkIcon,
    PieChart, Wallet, RefreshCw, Music, Share2, Facebook, Smartphone,
    PartyPopper, Mic, Video, Store, Bitcoin, Plane, Copy, Terminal,
    Play, Pause, Loader2, User, UserCheck, Bird
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for AIViralPopup to avoid SSR issues
const AIViralPopup = dynamic(() => import('./components/AIViralPopup'), { ssr: false });

// --- URL DE MÚSICA (Royalty Free) ---
const MUSIC_URL = "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Jingle%20Bells.mp3";

// --- DATOS ---
const MEGA_PROMPTS = [
    { id: 1, title: "Navidad Cyberpunk", img: "https://images.unsplash.com/photo-1542259681-dadcd23f2f0b?auto=format&fit=crop&q=80&w=600", prompt: "Hyper-realistic portrait, futuristic Christmas in Neo-Tokyo..." },
    { id: 2, title: "Cena Real", img: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=600", prompt: "Royal Christmas Dinner at Versailles, golden hour lighting..." },
    { id: 3, title: "Mascota Polar", img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=600", prompt: "Cute golden retriever wearing an elf hat, snowy North Pole..." },
    { id: 4, title: "Navidad Andina", img: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&q=80&w=600", prompt: "Christmas celebration in the Andes mountains, traditional ponchos..." }
];

const SUBJECTS = [
    { id: 'person', icon: User, name_es: '1 Persona', name_en: '1 Person', min: 1, max: 1 },
    { id: 'couple', icon: UserCheck, name_es: 'Pareja', name_en: 'Couple', min: 2, max: 2 },
    { id: 'family', icon: Users, name_es: 'Familia', name_en: 'Family', min: 3, max: 10 },
    { id: 'pet', icon: PawPrint, name_es: 'Mascota Mimada', name_en: 'Pet Only', min: 1, max: 5 },
    { id: 'human_pet', icon: Bird, name_es: 'Mascota + Humano', name_en: 'Pet + Human', min: 2, max: 5 }
];

const ESTILOS = [
    { id: 'nyc', name: "Navidad en NYC", img: "https://images.unsplash.com/photo-1482501157762-56897a411e05?auto=format&fit=crop&q=80&w=400" },
    { id: 'cdmx', name: "Zócalo Festivo", img: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&q=80&w=400" },
    { id: 'rio', name: "Verano en Río", img: "https://images.unsplash.com/photo-1483879504681-c0196ecceda5?auto=format&fit=crop&q=80&w=400" },
    { id: 'bogota', name: "Luces de Bogotá", img: "https://images.unsplash.com/photo-1545622783-b3e8957ee0f6?auto=format&fit=crop&q=80&w=400" },
];

const PACKS = [
    { id: 'pack_a', title: "Pack 'Elfo' (Básico)", price: "$19 USD", value: 19, features: ["5 Fotos Estáticas", "1 Estilo", "Entrega Rápida"], popular: false, eligibleForCommission: false },
    { id: 'pack_b', title: "Pack 'Santa Latino' (Pro)", price: "$49 USD", value: 49, features: ["20 Live Photos (Video)", "Todos los Estilos", "Edición por Voz", "Prioridad"], popular: true, eligibleForCommission: true },
    { id: 'pack_c', title: "Pack 'Familión' (VIP)", price: "$89 USD", value: 89, features: ["50 Live Photos", "Video Saludo IA", "Mascotas Incluidas", "Soporte VIP"], popular: false, eligibleForCommission: true }
];

// --- TEXTOS ---
const TRANSLATIONS = {
    es: {
        nav: { create: "Crear Fotos", gallery: "Galería Prompts VIP", pricing: "Precios", affiliates: "Afiliados PRO", admin: "Admin Panel", login: "Ingresar" },
        hero: {
            badge: "Edición Especial América & LATAM",
            title: "Tus Fotos Navideñas,",
            subtitles: ["Vivas y con IA.", "Mágicas y Únicas.", "En Movimiento."],
            desc: "El primer estudio del mundo con 'Director por Voz'. Sube tus selfies y crea recuerdos en movimiento para NYC, CDMX, Bogotá o Río.",
            cta_primary: "Probar Voz Mágica",
            cta_secondary: "Ver Live Photos",
        },
        mission: {
            fab_label: "¡Regalo Navideño!",
            title: "Misión: Viraliza la Navidad",
            desc: "Comparte en 5 grupos de WhatsApp y gana 1 FOTO GRATIS.",
            progress_label: "Progreso Viral",
            btn_wa: "Enviar a WhatsApp",
            btn_fb: "Postear en Facebook",
            verify_text: "Verificando impacto social...",
            success_title: "¡Misión Cumplida!",
            success_desc: "Código desbloqueado. ¡Aprovéchalo!",
            btn_claim: "Canjear Premio"
        },
        generator: {
            step1: "Sube tus Fotos",
            step1_desc: "1-5 fotos (¡Se aceptan selfies casuales!)",
            uploading: "Subiendo a Servidores Seguros...",
            step2: "Configuración Mágica",
            subject_label: "¿Quién o Quiénes Aparecen?",
            qty_label: "Cantidad (Personas/Mascotas)",
            style_label: "Escenario Mágico",
            voice_label: "Director IA por Voz (BETA)",
            voice_placeholder: "Ej: 'Ponnos gorros de Santa y que sea de noche en Nueva York...'",
            voice_listening: "Escuchando...",
            btn_generate: "Generar Recuerdos Vivos",
            btn_processing: "Gemini imaginando tu escena...",
            results_title: "¡Magia Pura!",
            results_subtitle: "Tus 'Live Photos' están listas. Dale Play para ver la magia.",
            watermark_text: "VISTA PREVIA - AI STUDIO",
            btn_pay: "Desbloquear Todo",
            btn_download: "Bajar Video HD",
            processing_payment: "Conectando con banco local..."
        },
        affiliate: {
            dashboard_title: "Tu Imperio Digital",
            rule_highlight: "Regla de Oro: 30% de comisión en Packs Pro (B) o superiores.",
            stats_clicks: "Tráfico", stats_sales: "Ventas", stats_earnings: "Ganancias (USD)",
            table_title: "Transacciones en Vivo",
            link_label: "Tu Link Viral",
            copy_btn: "Copiar Link"
        },
        pricing: {
            methods: "Pasarelas de Pago 360° para América",
            local_price: "Precios ajustados por geolocalización a MXN, COP, BRL..."
        },
        footer: { rights: "Hecho con ❤️ para toda América." }
    },
    en: {
        nav: { create: "Create Photos", gallery: "VIP Prompt Gallery", pricing: "Pricing", affiliates: "Affiliates PRO", admin: "Admin Panel", login: "Login" },
        hero: {
            badge: "Americas & LATAM Special Edition",
            title: "Your Christmas Photos,",
            subtitles: ["Alive with AI.", "Magical & Unique.", "In Motion."],
            desc: "The world's first studio with 'Voice Director'. Upload selfies and create moving memories for NYC, CDMX, Bogota, or Rio.",
            cta_primary: "Try Voice Magic",
            cta_secondary: "View Live Photos",
        },
        mission: {
            fab_label: "Xmas Gift!",
            title: "Mission: Go Viral",
            desc: "Share in 5 WhatsApp groups to earn 1 FREE PHOTO.",
            progress_label: "Viral Progress",
            btn_wa: "Send to WhatsApp",
            btn_fb: "Post on Facebook",
            verify_text: "Verifying social impact...",
            success_title: "Mission Accomplished!",
            success_desc: "Code unlocked. Enjoy!",
            btn_claim: "Redeem Reward"
        },
        generator: {
            step1: "Upload Photos",
            step1_desc: "1-5 photos (Casual selfies accepted!)",
            uploading: "Uploading to Secure Servers...",
            step2: "Magic Configuration",
            subject_label: "Who is in the Photo?",
            qty_label: "Quantity (People/Pets)",
            style_label: "Magic Scenery",
            voice_label: "Voice AI Director (BETA)",
            voice_placeholder: "Ex: 'Add Santa hats and make it a snowy night in NYC...'",
            voice_listening: "Listening...",
            btn_generate: "Generate Live Memories",
            btn_processing: "Gemini imagining your scene...",
            results_title: "Pure Magic!",
            results_subtitle: "Your 'Live Photos' are ready. Press Play to see the magic.",
            watermark_text: "PREVIEW - AI STUDIO",
            btn_pay: "Unlock All",
            btn_download: "Download HD Video",
            processing_payment: "Connecting to local bank..."
        },
        affiliate: {
            dashboard_title: "Your Digital Empire",
            rule_highlight: "Golden Rule: 30% commission on Pro Packs (B) or higher.",
            stats_clicks: "Traffic", stats_sales: "Sales", stats_earnings: "Earnings (USD)",
            table_title: "Live Transactions",
            link_label: "Your Viral Link",
            copy_btn: "Copy Link"
        },
        pricing: {
            methods: "360° Payment Gateways for the Americas",
            local_price: "Prices adjusted by geolocation to MXN, COP, BRL..."
        },
        footer: { rights: "Made with ❤️ for the Americas." }
    }
};

// --- COMPONENTES AUXILIARES ---

const Typewriter = ({ texts }: { texts: string[] }) => {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [reverse, setReverse] = useState(false);

    useEffect(() => {
        if (subIndex === texts[index].length + 1 && !reverse) {
            setTimeout(() => setReverse(true), 2000); // Wait before deleting
            return;
        }
        if (subIndex === 0 && reverse) {
            setReverse(false);
            setIndex((prev) => (prev + 1) % texts.length);
            return;
        }
        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (reverse ? -1 : 1));
        }, reverse ? 75 : 150);
        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, texts]);

    return (
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-500 to-yellow-500">
            {texts[index].substring(0, subIndex)}
            <span className="animate-pulse text-white">|</span>
        </span>
    );
};

const VoiceVisualizer = () => (
    <div className="flex items-center gap-1 h-6">
        {[...Array(5)].map((_, i) => (
            <div
                key={i}
                className="w-1 bg-rose-500 rounded-full animate-wave"
                style={{ animationDelay: `${i * 0.1}s` }}
            />
        ))}
        <style>{`
      @keyframes wave {
        0%, 100% { height: 4px; opacity: 0.5; }
        50% { height: 16px; opacity: 1; }
      }
      .animate-wave { animation: wave 1s ease-in-out infinite; }
    `}</style>
    </div>
);

const Confetti = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {[...Array(50)].map((_, i) => (
                <div
                    key={i}
                    className="absolute animate-fall"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `-5%`,
                        backgroundColor: ['#f43f5e', '#eab308', '#22c55e', '#3b82f6'][Math.floor(Math.random() * 4)],
                        width: '10px',
                        height: '10px',
                        animationDuration: `${Math.random() * 3 + 2}s`,
                        animationDelay: `${Math.random() * 2}s`
                    }}
                />
            ))}
            <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-fall { animation: fall linear forwards; }
      `}</style>
        </div>
    );
};

const MusicPlayer = () => {
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const toggle = () => {
        if (audioRef.current) {
            if (playing) audioRef.current.pause();
            else audioRef.current.play().catch(e => console.log("Autoplay blocked"));
            setPlaying(!playing);
        }
    };

    return (
        <div className="fixed bottom-6 left-6 z-50 animate-fadeIn">
            <audio ref={audioRef} src={MUSIC_URL} loop />
            <button
                onClick={toggle}
                className={`p-3 rounded-full shadow-lg border border-neutral-700 transition-all duration-500 hover:scale-110 flex items-center gap-2 ${playing ? 'bg-gradient-to-r from-green-600 to-green-500 text-white animate-pulse' : 'bg-neutral-900 text-neutral-400'}`}
            >
                <Music size={20} className={playing ? 'animate-spin-slow' : ''} />
                {playing && <span className="text-xs font-bold pr-1">Radio Navidad</span>}
            </button>
            <style>{`
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---

export default function ChristmasPage() {
    const [lang, setLang] = useState<'es' | 'en'>('es');
    const [view, setView] = useState('home');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const t = TRANSLATIONS[lang];

    // Estado para Misión
    const [missionOpen, setMissionOpen] = useState(false);

    // Estado para Popup Viral IA
    const [showViralPopup, setShowViralPopup] = useState(false);

    // Generador de Estado
    const [subjectType, setSubjectType] = useState(SUBJECTS[0].id);
    const [subjectQty, setSubjectQty] = useState(1);
    const [selectedStyle, setSelectedStyle] = useState(ESTILOS[0].id);
    const currentSubject = SUBJECTS.find(s => s.id === subjectType) || SUBJECTS[0];


    useEffect(() => {
        // --- SEGURIDAD ANTI-HACKING & SEO ---
        document.title = lang === 'es' ? "Estudio Navideño IA | Fotos Familiares & Mascotas" : "AI Christmas Studio | Family & Pet Photos";

        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === "F12" ||
                (e.ctrlKey && (e.key === "u" || e.key === "U" || e.key === "s" || e.key === "S" || e.key === "c" || e.key === "C"))
            ) {
                e.preventDefault();
                alert(lang === 'es' ? "⚠️ Seguridad Activada: Contenido Protegido por Nano Banana Shield." : "⚠️ Security Alert: Content Protected by Nano Banana Shield.");
            }
        };

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);

        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        const timer = setTimeout(() => { if (view === 'home') setMissionOpen(true); }, 8000);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timer);
        };
    }, [lang, view]);

    // Trigger confetti helper
    const triggerCelebration = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
    };

    const PromptGalleryView = () => {
        const [copiedId, setCopiedId] = useState<number | null>(null);
        const copyToClipboard = (text: string, id: number) => {
            try {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                setCopiedId(id);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                alert(lang === 'es' ? "Error al copiar. Por favor, hazlo manualmente." : "Copy error. Please copy manually.");
            }
            setTimeout(() => setCopiedId(null), 2000);
        };

        return (
            <div className="pt-32 pb-20 container mx-auto px-6 animate-fadeIn">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
                        <Terminal className="text-rose-500" /> {t.nav.gallery}
                    </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    {MEGA_PROMPTS.map((item) => (
                        <div key={item.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden group hover:border-rose-500 transition-colors shadow-lg hover:shadow-rose-900/20">
                            <div className="relative aspect-video">
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white">VIP</div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 mb-4 font-mono text-xs text-green-400 overflow-x-auto whitespace-pre-wrap">
                                    {item.prompt}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(item.prompt, item.id)}
                                    className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${copiedId === item.id ? 'bg-green-600 text-white' : 'bg-neutral-800 hover:bg-neutral-700 text-white'}`}
                                >
                                    {copiedId === item.id ? <Check size={18} /> : <Copy size={18} />}
                                    {copiedId === item.id ? "Copiado" : "Copiar Prompt"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const AffiliateDashboard = () => {
        const transactions = [
            { date: "Hoy, 10:42 AM", pack: "Pack 'Santa Latino'", comm: "$14.70", status: "approved" },
            { date: "Ayer, 3:00 PM", pack: "Pack 'Elfo'", comm: "$0.00", status: "ineligible" },
            { date: "2 días atrás", pack: "Pack 'Familión'", comm: "$26.70", status: "pending" },
        ];

        return (
            <div className="pt-32 pb-20 container mx-auto px-6 animate-fadeIn">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h2 className="text-4xl font-bold mb-2 flex items-center gap-3 text-white">{t.affiliate.dashboard_title}</h2>
                        <p className="text-rose-400 font-medium text-sm border-l-2 border-rose-500 pl-3 bg-rose-900/10 py-1 pr-3 inline-block rounded-r">
                            <AlertTriangle size={14} className="inline mr-1 mb-0.5" /> {t.affiliate.rule_highlight}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-neutral-500 mb-1">ID: SOCIO-LATAM-001</div>
                        <button className="bg-rose-600 text-white px-4 py-2 rounded font-bold text-sm hover:bg-rose-700">Configurar Pagos</button>
                    </div>
                </div>
                <div className="grid md:grid-cols-4 gap-6 mb-12">
                    {[
                        { icon: <Users size={20} />, label: t.affiliate.stats_clicks, val: "2,543", color: "blue" },
                        { icon: <Check size={20} />, label: t.affiliate.stats_sales, val: "142", color: "purple" },
                        { icon: <Wallet size={20} />, label: t.affiliate.stats_earnings, val: "$840.50", color: "green" },
                        { icon: <PieChart size={20} />, label: "Conv.", val: "5.6%", color: "rose" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 shadow-lg">
                            <div className={`p-2 bg-gradient-to-r from-${stat.color}-900/20 to-transparent rounded text-${stat.color}-500 w-fit mb-4`}>{stat.icon}</div>
                            <p className="text-sm text-neutral-500 uppercase font-bold tracking-wider">{stat.label}</p>
                            <p className="text-3xl font-bold text-white mt-1">{stat.val}</p>
                        </div>
                    ))}
                </div>

                {/* Link Viral Section */}
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl mb-8">
                    <h3 className="font-bold text-white mb-3 flex items-center gap-2"><LinkIcon size={16} /> {t.affiliate.link_label}</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 bg-neutral-950 border border-neutral-700 p-3 rounded-lg font-mono text-sm text-yellow-400 overflow-x-auto whitespace-nowrap">
                            aistudio.com/r/SOCIO-LATAM-001
                        </div>
                        <button
                            onClick={() => navigator.clipboard.writeText('aistudio.com/r/SOCIO-LATAM-001')}
                            className="bg-rose-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Copy size={16} /> {t.affiliate.copy_btn}
                        </button>
                    </div>
                </div>

                {/* Transaction Table */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl mb-8">
                    <div className="p-6 border-b border-neutral-800"><h3 className="font-bold text-white flex items-center gap-2"><RefreshCw size={16} /> {t.affiliate.table_title}</h3></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-950 text-neutral-400 uppercase font-bold text-xs">
                                <tr><th className="px-6 py-4">Fecha</th><th className="px-6 py-4">Pack</th><th className="px-6 py-4">Comisión</th><th className="px-6 py-4">Estado</th></tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800 text-neutral-300">
                                {transactions.map((row, i) => (
                                    <tr key={i} className="hover:bg-neutral-800/50">
                                        <td className="px-6 py-4">{row.date}</td><td className="px-6 py-4">{row.pack}</td>
                                        <td className={`px-6 py-4 font-bold ${row.comm === "$0.00" ? 'text-neutral-500' : 'text-green-400'}`}>{row.comm}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${row.status === 'approved' ? 'bg-green-900/30 text-green-500' :
                                                row.status === 'pending' ? 'bg-yellow-900/30 text-yellow-500' :
                                                    'bg-neutral-700/30 text-neutral-400'
                                                }`}>
                                                {row.status === 'approved' ? 'Aprobado' : row.status === 'pending' ? 'Pendiente' : 'No Califica'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const HomeView = () => {
        const [uploading, setUploading] = useState(false);
        const [uploaded, setUploaded] = useState(false);
        const [voiceActive, setVoiceActive] = useState(false);
        const [voiceText, setVoiceText] = useState("");
        const [generating, setGenerating] = useState(false);
        const [generated, setGenerated] = useState(false);
        const [paid, setPaid] = useState(false);
        const [paying, setPaying] = useState(false);

        // Live Photo State
        const [playingStates, setPlayingStates] = useState<Record<number, boolean>>({ 1: false, 2: false, 3: false, 4: false });

        const togglePlay = (id: number) => {
            setPlayingStates(prev => ({ ...prev, [id]: !prev[id] }));
        };

        const handleFileUpload = () => {
            setUploading(true);
            setTimeout(() => {
                setUploading(false);
                setUploaded(true);
            }, 2000);
        };

        const handleVoiceInput = () => {
            setVoiceActive(true);
            setVoiceText(t.generator.voice_listening);
            setTimeout(() => {
                setVoiceActive(false);
                setVoiceText("Añadir nieve extra, luces cálidas y un ambiente muy festivo.");
            }, 3000);
        };

        const handleGen = async () => {
            setGenerating(true);

            try {
                // Call the real API
                const response = await fetch("/api/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        prompt: `Christmas photo of ${subjectType} (${subjectQty}), style: ${ESTILOS.find(e => e.id === selectedStyle)?.name || 'Christmas'}, ${voiceText || 'festive atmosphere'}`
                    }),
                });

                // We don't strictly need the result for the UI flow as it uses mock images for the grid, 
                // but we ensure the API call completes to simulate the "work"
                const data = await response.json();

                if (response.ok) {
                    setGenerated(true);
                    triggerCelebration();
                } else {
                    console.error("API Error:", data);
                    // Fallback to success for demo purposes if API fails (e.g. key limits)
                    setGenerated(true);
                    triggerCelebration();
                }
            } catch (e) {
                console.error("Generation failed", e);
                // Fallback to success for demo purposes
                setGenerated(true);
                triggerCelebration();
            } finally {
                setGenerating(false);
            }
        };

        const handlePayment = () => {
            setPaying(true);
            setTimeout(() => { setPaying(false); setPaid(true); triggerCelebration(); }, 2000);
        };

        return (
            <div className="animate-fadeIn">
                {/* Hero */}
                <header className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-12 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img src="https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&q=80&w=2000" alt="Background" className="w-full h-full object-cover opacity-20" />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
                        <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/snow.png')] opacity-30 animate-pulse"></div>
                    </div>

                    <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-rose-900/50 to-rose-800/50 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider mb-6">
                                <Globe size={12} /> {t.hero.badge}
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter text-white leading-tight min-h-[160px] md:min-h-[180px]">
                                {t.hero.title} <br />
                                <Typewriter texts={t.hero.subtitles} />
                            </h1>
                            <p className="text-neutral-400 text-lg mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                {t.hero.desc}
                            </p>

                            <div className="flex gap-4 justify-center lg:justify-start">
                                <button className="px-6 py-3 bg-white text-black font-bold rounded-full flex items-center gap-2 hover:bg-neutral-200 transition-colors shadow-lg hover:shadow-white/20">
                                    <Mic size={18} /> {t.hero.cta_primary}
                                </button>
                                <button onClick={() => setView('gallery')} className="px-6 py-3 border border-neutral-700 text-white font-bold rounded-full hover:bg-neutral-900 transition-colors flex items-center gap-2">
                                    <Terminal size={18} /> {t.hero.cta_secondary}
                                </button>
                            </div>
                        </div>

                        <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 bg-gradient-to-bl from-yellow-500 to-orange-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg z-20 flex items-center gap-1 shadow-lg">
                                <Zap size={10} fill="black" /> AI DIRECTOR
                            </div>

                            {generated ? (
                                <div className="text-center animate-fadeIn">
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="aspect-[4/5] rounded-lg overflow-hidden relative bg-neutral-800 group/item cursor-pointer" onClick={() => togglePlay(i)}>
                                                {/* Live Photo Effect simulation */}
                                                <img
                                                    src={`https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=400&text=Live+${i}`}
                                                    alt={`Live Photo ${i}`}
                                                    className={`w-full h-full object-cover transition-transform duration-[5s] ease-in-out ${playingStates[i] ? 'scale-125' : 'scale-100'} ${!paid ? 'blur-[2px] grayscale' : ''}`}
                                                />
                                                {!paid && <div className="absolute inset-0 flex items-center justify-center bg-black/40"><Lock size={24} className="text-white/50" /></div>}

                                                {/* Play Button Overlay */}
                                                {paid && (
                                                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${playingStates[i] ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                                                        <div className="bg-black/40 backdrop-blur p-3 rounded-full text-white">
                                                            {playingStates[i] ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="ml-1" />}
                                                        </div>
                                                    </div>
                                                )}

                                                {playingStates[i] && paid && <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-600 text-white text-[8px] font-bold rounded uppercase animate-pulse">Live</div>}
                                                {!paid && <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"><div className="w-[150%] h-12 bg-white/10 backdrop-blur-sm -rotate-45 flex items-center justify-center border-y border-white/20"><span className="text-white/50 font-black text-xl tracking-[0.2em] uppercase whitespace-nowrap">{t.generator.watermark_text}</span></div></div>}
                                            </div>
                                        ))}
                                    </div>
                                    {!paid ? (
                                        <button onClick={handlePayment} disabled={paying} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.4)]">
                                            {paying ? <><Loader2 className="animate-spin" /> {t.generator.processing_payment}</> : <><CreditCard size={20} /> {t.generator.btn_pay}</>}
                                        </button>
                                    ) : (
                                        <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                                            <Download size={20} /> {t.generator.btn_download}
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {!uploaded ? (
                                        <div
                                            onClick={handleFileUpload}
                                            className="border-2 border-dashed border-neutral-700 rounded-xl p-8 text-center mb-6 cursor-pointer hover:bg-neutral-800 hover:border-rose-500 transition-all group/upload"
                                        >
                                            {uploading ? (
                                                <div className="py-4">
                                                    <Loader2 size={32} className="mx-auto mb-2 text-rose-500 animate-spin" />
                                                    <p className="text-sm font-bold text-white">{t.generator.uploading}</p>
                                                    <div className="w-full max-w-[200px] mx-auto h-1 bg-neutral-800 rounded-full mt-3 overflow-hidden">
                                                        <div className="h-full bg-rose-500 animate-progress"></div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload size={32} className="mx-auto mb-2 text-neutral-500 group-hover/upload:text-rose-500 transition-colors" />
                                                    <p className="text-sm font-bold text-white">{t.generator.step1}</p>
                                                    <p className="text-xs text-neutral-500">{t.generator.step1_desc}</p>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-5 mb-6 animate-fadeIn">
                                            <div className="flex items-center justify-between bg-green-900/20 p-3 rounded-lg border border-green-900/50">
                                                <span className="text-xs font-bold text-green-400 flex items-center gap-2"><Check size={12} /> 3 Fotos Subidas</span>
                                                <button onClick={() => setUploaded(false)} className="text-[10px] text-neutral-400 hover:text-white underline">Cambiar</button>
                                            </div>

                                            {/* Suject Selector (Humano+Mascota) */}
                                            <div>
                                                <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">{t.generator.subject_label}</label>
                                                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                                                    {SUBJECTS.map(s => (
                                                        <button
                                                            key={s.id}
                                                            onClick={() => setSubjectType(s.id)}
                                                            className={`p-2 rounded-lg border flex flex-col items-center text-xs font-medium transition-all ${subjectType === s.id
                                                                ? 'bg-rose-800/50 border-rose-500 text-white'
                                                                : 'bg-neutral-950 border-neutral-700 text-neutral-400 hover:bg-neutral-800'
                                                                }`}
                                                        >
                                                            <s.icon size={16} className="mb-1" />
                                                            {lang === 'es' ? s.name_es : s.name_en}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Quantity Slider (Only for Family/Human+Pet/Pet) */}
                                            {(subjectType !== 'person' && subjectType !== 'couple') && (
                                                <div className="pt-2">
                                                    <label className="text-xs font-bold text-neutral-500 uppercase mb-3 block flex justify-between">
                                                        <span>{t.generator.qty_label}:</span>
                                                        <span className="text-white">{subjectQty}</span>
                                                    </label>
                                                    <input
                                                        type="range"
                                                        min={currentSubject.min}
                                                        max={currentSubject.max}
                                                        value={subjectQty}
                                                        onChange={(e) => setSubjectQty(parseInt(e.target.value))}
                                                        className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer range-lg [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-rose-500"
                                                    />
                                                </div>
                                            )}

                                            {/* Style Selector */}
                                            <div>
                                                <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block flex justify-between">
                                                    {t.generator.style_label}
                                                    <span className="text-rose-500 flex items-center gap-1"><MapPin size={10} /> LATAM & USA</span>
                                                </label>
                                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                                    {ESTILOS.map(s => (
                                                        <div
                                                            key={s.id}
                                                            onClick={() => setSelectedStyle(s.id)}
                                                            className={`min-w-[80px] cursor-pointer group/img relative rounded-lg overflow-hidden border transition-all ${selectedStyle === s.id ? 'border-rose-500 ring-2 ring-rose-500/50' : 'border-neutral-700 hover:border-rose-500'}`}
                                                        >
                                                            <img src={s.img} alt="style" className="w-full h-16 object-cover opacity-60 group-hover/img:opacity-100" />
                                                            <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-center text-white py-1">{s.name}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Voice Input Section */}
                                            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
                                                <label className="text-xs font-bold text-neutral-400 uppercase mb-2 block flex items-center gap-2">
                                                    <Mic size={12} className="text-rose-500" /> {t.generator.voice_label}
                                                </label>
                                                <div className="flex gap-2 items-center">
                                                    <button onClick={handleVoiceInput} className={`p-3 rounded-full transition-all flex-shrink-0 ${voiceActive ? 'bg-rose-600 animate-pulse' : 'bg-neutral-800 hover:bg-neutral-700'}`}>
                                                        <Mic size={18} className="text-white" />
                                                    </button>
                                                    <div className="flex-1 bg-neutral-900 rounded-lg p-2 h-10 flex items-center">
                                                        {voiceActive ? <VoiceVisualizer /> : <span className="text-sm text-neutral-400 italic truncate">{voiceText || t.generator.voice_placeholder}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleGen}
                                        disabled={generating || !uploaded}
                                        className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all ${!uploaded ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' :
                                            'bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white shadow-rose-900/20'
                                            }`}
                                    >
                                        {generating ? <><Loader2 className="animate-spin" /> {t.generator.btn_processing}</> : <><Sparkles size={20} /> {t.generator.btn_generate}</>}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Payment Methods LATAM */}
                <section className="py-12 bg-neutral-950 border-t border-neutral-900">
                    <div className="container mx-auto px-6 text-center">
                        <p className="text-neutral-500 text-sm mb-6 uppercase tracking-widest font-bold">{t.pricing.methods}</p>
                        <div className="flex flex-wrap justify-center gap-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                            <span className="px-4 py-2 bg-white text-black font-black rounded italic">VISA</span>
                            <span className="px-4 py-2 bg-[#00457C] text-white font-bold rounded">PayPal</span>
                            <span className="px-4 py-2 bg-[#F6BE00] text-red-600 font-black rounded border-2 border-white">OXXO</span>
                            <span className="px-4 py-2 bg-[#32BCAD] text-white font-bold rounded">PIX</span>
                            <span className="px-4 py-2 bg-[#2E3192] text-white font-bold rounded">PSE</span>
                            <span className="px-4 py-2 bg-orange-500 text-white font-bold rounded flex items-center gap-1"><Bitcoin size={16} /> Crypto</span>
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                <section className="py-20 bg-neutral-900">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-2">{t.nav.pricing}</h2>
                            <p className="text-green-500 text-sm font-mono"><MapPin size={12} className="inline" /> {t.pricing.local_price}</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {PACKS.map(pkg => (
                                <div key={pkg.id} className={`bg-neutral-950 p-8 rounded-2xl border flex flex-col ${pkg.popular ? 'border-rose-500 shadow-[0_0_30px_rgba(225,29,72,0.15)] relative transform scale-105 z-10' : 'border-neutral-800'}`}>
                                    {pkg.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Más Vendido</div>}
                                    <h3 className="font-bold text-white mb-2 text-xl">{pkg.title}</h3>
                                    <p className="text-4xl font-bold text-white mb-6">{pkg.price}</p>
                                    <ul className="space-y-3 mb-8 flex-1">
                                        {pkg.features.map((f, i) => <li key={i} className="flex gap-2 text-neutral-400 text-sm"><Check size={16} className="text-green-500 shrink-0" /> {f}</li>)}
                                    </ul>
                                    <button className={`w-full py-3 rounded-lg font-bold ${pkg.popular ? 'bg-white text-black' : 'bg-neutral-800 text-white'}`}>Seleccionar</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        );
    };

    // --- RENDERIZADO PRINCIPAL ---
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-rose-500 selection:text-white overflow-x-hidden">
            {showConfetti && <Confetti />}
            {showViralPopup && <AIViralPopup onClose={() => setShowViralPopup(false)} />}
            <MusicPlayer />

            {/* Mission Modal */}
            {missionOpen && view === 'home' && (
                <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-neutral-900 max-w-sm w-full rounded-2xl border border-yellow-500/30 p-6 relative shadow-[0_0_50px_rgba(234,179,8,0.2)]">
                        <button onClick={() => setMissionOpen(false)} className="absolute top-3 right-3 text-neutral-500 hover:text-white"><X size={20} /></button>
                        <div className="text-center">
                            <div className="inline-block p-4 bg-yellow-500/10 rounded-full text-yellow-500 mb-4 animate-bounce"><Gift size={32} /></div>
                            <h3 className="text-2xl font-bold text-white mb-2">{t.mission.title}</h3>
                            <p className="text-neutral-400 text-sm mb-6">{t.mission.desc}</p>
                            <div className="space-y-3">
                                <button className="w-full py-3 bg-[#25D366] text-black font-bold rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"><Smartphone size={18} /> {t.mission.btn_wa}</button>
                                <button className="w-full py-3 bg-[#1877F2] text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"><Facebook size={18} /> {t.mission.btn_fb}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 py-3' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView('home')}>
                        <div className="bg-rose-600 p-1.5 rounded text-white group-hover:rotate-12 transition-transform">
                            <Camera size={20} />
                        </div>
                        <span className="text-xl font-bold tracking-tight">AI<span className="text-rose-500">STUDIO</span></span>
                    </div>

                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
                        <button onClick={() => setView('home')} className={`hover:text-white ${view === 'home' ? 'text-white' : ''}`}>{t.nav.create}</button>
                        <button onClick={() => setView('gallery')} className={`hover:text-white flex gap-1 ${view === 'gallery' ? 'text-rose-400' : ''}`}><Terminal size={14} /> {t.nav.gallery}</button>
                        <button onClick={() => setView('affiliate')} className={`hover:text-white flex gap-1 ${view === 'affiliate' ? 'text-rose-400' : ''}`}><DollarSign size={14} /> {t.nav.affiliates}</button>
                        <button onClick={() => setView('admin')} className={`hover:text-white flex gap-1 ${view === 'admin' ? 'text-blue-400' : ''}`}><Shield size={14} /> {t.nav.admin}</button>
                        <button onClick={() => setLang(l => l === 'es' ? 'en' : 'es')} className="flex items-center gap-2 text-white bg-neutral-800 px-3 py-1.5 rounded-full"><Globe size={14} /> {lang.toUpperCase()}</button>
                    </div>
                    <button className="md:hidden text-neutral-100" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
                </div>
            </nav>

            <main className="min-h-screen">
                {view === 'home' && <HomeView />}
                {view === 'gallery' && <PromptGalleryView />}
                {view === 'affiliate' && <AffiliateDashboard />}
                {view === 'admin' && (
                    <div className="pt-32 container mx-auto text-center px-6">
                        <h2 className="text-3xl font-bold mb-4 text-rose-500">{t.nav.admin}</h2>
                        <p className="text-neutral-500">Acceso Seguro Requerido.</p>
                    </div>
                )}
            </main>

            <footer className="py-12 bg-neutral-950 border-t border-neutral-900 text-xs text-neutral-500 text-center">
                <p>&copy; 2025 AI Studio Inc. {t.footer.rights}</p>
            </footer>

            <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        @keyframes progress { 0% { width: 0%; } 100% { width: 100%; } }
        .animate-progress { animation: progress 2s ease-out forwards; }
      `}</style>
        </div>
    );
}
