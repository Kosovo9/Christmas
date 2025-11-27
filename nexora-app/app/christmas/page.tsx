"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
    Camera, Upload, Mic, Play, Pause, Heart, Share2,
    Download, Lock, Sparkles, Users, Dog, Gift,
    CreditCard, BarChart3, Link as LinkIcon, CheckCircle2,
    Music, Volume2, VolumeX, Globe, ShieldCheck
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for Tailwind classes
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- MOCK DATA & CONSTANTS ---

const SUBJECTS = [
    { id: "person", label: "1 Persona", icon: <Users className="w-5 h-5" /> },
    { id: "couple", label: "Pareja", icon: <Heart className="w-5 h-5" /> },
    { id: "family", label: "Familia", icon: <Users className="w-5 h-5" /> }, // Users icon is standard for groups
    { id: "pet", label: "Mascota", icon: <Dog className="w-5 h-5" /> },
    { id: "hybrid", label: "Humano + Mascota", icon: <Sparkles className="w-5 h-5" /> },
];

const SCENARIOS = [
    { id: "studio", label: "Estudio Navideño Lujoso", image: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=300&q=80" },
    { id: "nyc", label: "Navidad en NYC", image: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&w=300&q=80" },
    { id: "cabin", label: "Cabaña en los Alpes", image: "https://images.unsplash.com/photo-1516728778615-2d590ea1855e?auto=format&fit=crop&w=300&q=80" },
    { id: "cyber", label: "Cyberpunk Christmas", image: "https://images.unsplash.com/photo-1535581652167-3d6b98c36cd9?auto=format&fit=crop&w=300&q=80" },
];

const VIP_PROMPTS = [
    { title: "Golden Hour Family", prompt: "Hyper-realistic family portrait, golden hour lighting, snowy pine forest background, matching red sweaters, 8k resolution, cinematic depth of field." },
    { title: "Cyberpunk Santa", prompt: "Futuristic Santa Claus, neon lights, cyberpunk city background, metallic suit, glowing visor, high contrast, synthwave aesthetic." },
    { title: "Cozy Cabin Pet", prompt: "Golden Retriever puppy sleeping by a fireplace, cozy log cabin interior, christmas stockings, warm lighting, fuzzy texture, photorealistic." },
];

// --- COMPONENTS ---

const TypewriterHero = () => {
    const words = ["Vivas", "Mágicas", "Únicas"];
    const [index, setIndex] = useState(0);
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            const currentWord = words[index % words.length];

            if (isDeleting) {
                setText(currentWord.substring(0, text.length - 1));
                if (text.length === 0) {
                    setIsDeleting(false);
                    setIndex((prev) => prev + 1);
                }
            } else {
                setText(currentWord.substring(0, text.length + 1));
                if (text.length === currentWord.length) {
                    setTimeout(() => setIsDeleting(true), 2000);
                    return;
                }
            }
        }, isDeleting ? 100 : 200);

        return () => clearTimeout(timer);
    }, [text, isDeleting, index, words]);

    return (
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-center mb-6">
            Fotos Navideñas <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-green-500">{text}</span>
            <span className="animate-pulse">|</span>
        </h1>
    );
};

const VoiceDirector = ({ onPromptChange }: { onPromptChange: (text: string) => void }) => {
    const [isListening, setIsListening] = useState(false);

    const toggleListening = () => {
        setIsListening(!isListening);
        if (!isListening) {
            // Simulate voice input
            setTimeout(() => {
                onPromptChange("Una foto familiar en la nieve con suéteres rojos y un perro Golden Retriever.");
                setIsListening(false);
            }, 3000);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={toggleListening}
                className={cn(
                    "absolute right-2 top-2 p-2 rounded-full transition-all duration-300",
                    isListening ? "bg-red-500/20 text-red-500 animate-pulse" : "hover:bg-white/10 text-gray-400"
                )}
            >
                <Mic className="w-5 h-5" />
            </button>
            {isListening && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2 flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ height: [10, 20, 10] }}
                            transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                            className="w-1 bg-red-500 rounded-full"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio("https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=christmas-magic-127024.mp3");
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.log("Audio play failed:", e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <button
            onClick={togglePlay}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all shadow-xl group"
        >
            {isPlaying ? (
                <div className="relative">
                    <Volume2 className="w-6 h-6 text-green-400" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                </div>
            ) : (
                <VolumeX className="w-6 h-6 text-gray-400 group-hover:text-white" />
            )}
        </button>
    );
};

const AffiliateDashboard = () => {
    return (
        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5 mt-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <BarChart3 className="text-green-500" /> Panel de Afiliados PRO
                </h2>
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
                    Nivel: Socio
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <p className="text-gray-400 text-sm mb-1">Ingresos Totales</p>
                    <p className="text-2xl font-bold text-white">$1,250.00 USD</p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <p className="text-gray-400 text-sm mb-1">Clicks en Link</p>
                    <p className="text-2xl font-bold text-white">3,420</p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <p className="text-gray-400 text-sm mb-1">Próximo Pago (Viernes)</p>
                    <p className="text-2xl font-bold text-green-400">$320.00 USD</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-white/10">
                    <p className="text-sm text-gray-300 mb-2">Tu Link Viral (30% Comisión)</p>
                    <div className="flex gap-2">
                        <code className="flex-1 bg-black/50 p-3 rounded-lg text-blue-300 font-mono text-sm">
                            aistudio.com/r/SOCIO-LATAM-001
                        </code>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText("aistudio.com/r/SOCIO-LATAM-001");
                                alert("Link copiado!");
                            }}
                            className="p-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                        >
                            <LinkIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Pagos vía:</span>
                    <div className="flex gap-2">
                        <span className="px-2 py-1 bg-white/5 rounded">PayPal</span>
                        <span className="px-2 py-1 bg-white/5 rounded">Stripe</span>
                        <span className="px-2 py-1 bg-white/5 rounded">OXXO</span>
                        <span className="px-2 py-1 bg-white/5 rounded">Crypto</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---

export default function ChristmasApp() {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [selectedSubject, setSelectedSubject] = useState("person");
    const [familyCount, setFamilyCount] = useState(3);
    const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [activeTab, setActiveTab] = useState("generator"); // generator, prompts, affiliates

    const handleGenerate = async () => {
        if (!disclaimerAccepted) {
            setShowDisclaimer(true);
            return;
        }

        setLoading(true);
        setGeneratedImage(null);

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: `${prompt} --subject ${selectedSubject} ${selectedSubject === 'family' ? `--count ${familyCount}` : ''}`
                }),
            });

            const data = await response.json();

            if (response.ok && data.output) {
                setGeneratedImage(Array.isArray(data.output) ? data.output[0] : data.output);
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#ef4444', '#22c55e', '#ffffff']
                });
            } else {
                alert("Error generating image. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("Error generating image.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-red-500/30">
            <MusicPlayer />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-40 bg-black/50 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <Sparkles className="text-red-500" />
                        <span>Nexora<span className="text-green-500">XMAS</span></span>
                    </div>
                    <div className="flex gap-4 text-sm font-medium">
                        <button
                            onClick={() => setActiveTab("generator")}
                            className={cn("hover:text-red-400 transition-colors", activeTab === "generator" && "text-red-500")}
                        >
                            Estudio
                        </button>
                        <button
                            onClick={() => setActiveTab("prompts")}
                            className={cn("hover:text-red-400 transition-colors", activeTab === "prompts" && "text-red-500")}
                        >
                            Galería VIP
                        </button>
                        <button
                            onClick={() => setActiveTab("affiliates")}
                            className={cn("hover:text-red-400 transition-colors", activeTab === "affiliates" && "text-red-500")}
                        >
                            Afiliados PRO
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-24 pb-12 px-4 max-w-5xl mx-auto relative">

                {activeTab === "generator" && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <TypewriterHero />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column: Controls */}
                            <div className="space-y-6">

                                {/* Upload Section */}
                                <div className="p-8 border-2 border-dashed border-white/20 rounded-2xl hover:border-red-500/50 transition-colors cursor-pointer group bg-white/5">
                                    <div className="flex flex-col items-center gap-4 text-gray-400 group-hover:text-white">
                                        <div className="p-4 rounded-full bg-white/5 group-hover:bg-red-500/20 transition-colors">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <p className="text-center">
                                            Arrastra 1-5 fotos aquí<br />
                                            <span className="text-xs opacity-60">Soporta JPG, PNG (Max 10MB)</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Subject Selector */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-400">¿Quién es el protagonista?</label>
                                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                        {SUBJECTS.map((s) => (
                                            <button
                                                key={s.id}
                                                onClick={() => setSelectedSubject(s.id)}
                                                className={cn(
                                                    "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-xs font-medium",
                                                    selectedSubject === s.id
                                                        ? "bg-red-500/20 border-red-500 text-white"
                                                        : "bg-white/5 border-transparent hover:bg-white/10 text-gray-400"
                                                )}
                                            >
                                                {s.icon}
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>

                                    {selectedSubject === 'family' && (
                                        <div className="pt-2 animate-in fade-in">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span>Miembros de la familia</span>
                                                <span className="text-red-400">{familyCount} personas</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="3"
                                                max="10"
                                                value={familyCount}
                                                onChange={(e) => setFamilyCount(parseInt(e.target.value))}
                                                className="w-full accent-red-500"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Prompt Input */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-400">Describe tu escenario mágico</label>
                                    <div className="relative">
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="Ej: Un perro Husky siberiano con gorro de santa en Times Square..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pr-12 text-lg focus:ring-2 focus:ring-red-500 outline-none min-h-[120px] resize-none"
                                        />
                                        <VoiceDirector onPromptChange={setPrompt} />
                                    </div>
                                </div>

                                {/* Disclaimer Checkbox */}
                                <div className="flex items-start gap-3 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                                    <div className="pt-1">
                                        <input
                                            type="checkbox"
                                            id="disclaimer"
                                            checked={disclaimerAccepted}
                                            onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-600 text-red-500 focus:ring-red-500 bg-transparent"
                                        />
                                    </div>
                                    <label htmlFor="disclaimer" className="text-xs text-gray-300 cursor-pointer">
                                        Acepto total responsabilidad por el uso de las imágenes generadas. Prohibido contenido ilegal o explícito. AI Studio no se hace responsable.
                                    </label>
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    className={cn(
                                        "w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg",
                                        loading
                                            ? "bg-gray-800 cursor-not-allowed text-gray-500"
                                            : "bg-gradient-to-r from-red-600 to-green-600 hover:from-red-500 hover:to-green-500 shadow-red-900/20"
                                    )}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="animate-spin">❄️</span> Generando Magia...
                                        </span>
                                    ) : (
                                        "Generar Foto Navideña ✨"
                                    )}
                                </button>
                            </div>

                            {/* Right Column: Preview */}
                            <div className="relative h-full min-h-[400px] bg-black/40 rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center">
                                {generatedImage ? (
                                    <div className="relative w-full h-full group">
                                        <Image
                                            src={generatedImage}
                                            alt="Generated"
                                            fill
                                            className="object-cover"
                                        />
                                        {/* Watermark Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                                            <p className="text-4xl font-black text-white rotate-[-45deg] tracking-widest border-4 border-white p-4">
                                                AI STUDIO PREVIEW
                                            </p>
                                        </div>

                                        {/* Controls Overlay */}
                                        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            <div className="flex gap-3">
                                                <button className="flex-1 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                                    <CreditCard className="w-4 h-4" />
                                                    Desbloquear ($49)
                                                </button>
                                                <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-colors">
                                                    <Share2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-600">
                                        <Gift className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                        <p>Tu obra maestra aparecerá aquí</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "prompts" && (
                    <div className="animate-in fade-in zoom-in duration-500">
                        <h2 className="text-3xl font-bold mb-8 text-center">Galería de Super Prompts VIP</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {VIP_PROMPTS.map((p, i) => (
                                <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-900 border border-white/10 hover:border-red-500/50 transition-all">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                    <div className="absolute bottom-0 p-6 w-full">
                                        <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                                        <p className="text-xs text-gray-400 line-clamp-2 mb-4">{p.prompt}</p>
                                        <button
                                            onClick={() => {
                                                setPrompt(p.prompt);
                                                setActiveTab("generator");
                                            }}
                                            className="w-full py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Usar este Prompt
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "affiliates" && (
                    <div className="animate-in fade-in slide-in-from-right duration-500">
                        <AffiliateDashboard />
                    </div>
                )}

            </main>

            {/* Disclaimer Modal (Fallback if checkbox missed) */}
            <AnimatePresence>
                {showDisclaimer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-gray-900 border border-white/10 p-8 rounded-2xl max-w-md w-full shadow-2xl"
                        >
                            <ShieldCheck className="w-12 h-12 text-yellow-500 mb-4 mx-auto" />
                            <h3 className="text-xl font-bold text-center mb-4">Responsabilidad Legal</h3>
                            <p className="text-gray-400 text-sm text-center mb-6">
                                Para continuar, debes aceptar que te haces totalmente responsable por el contenido generado.
                                AI Studio prohíbe estrictamente la generación de contenido ilegal, ofensivo o explícito.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDisclaimer(false)}
                                    className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => {
                                        setDisclaimerAccepted(true);
                                        setShowDisclaimer(false);
                                    }}
                                    className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold transition-colors"
                                >
                                    Acepto
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
