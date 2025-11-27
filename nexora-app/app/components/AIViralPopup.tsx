// components/AIViralPopup.tsx - NANO BANANA SHIELD EDITION 🍌
// ESTRATEGIA: Solo aparece cuando el usuario intenta salir (Exit Intent)
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Gift, Shield, Sparkles, Facebook, Smartphone } from 'lucide-react';

interface AIViralPopupProps {
    onClose: () => void;
}

const MODAL_COUNT_KEY = 'nanoBananaShowCount';
const MAX_SHOWS = 2;

const AIViralPopup: React.FC<AIViralPopupProps> = ({ onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [shared, setShared] = useState(false);
    const [showSecurityAlert, setShowSecurityAlert] = useState(true);

    // 1. Exit Intent Detection - Detecta cuando el mouse sale por arriba
    const handleExitIntent = useCallback((event: MouseEvent) => {
        // Si el mouse se mueve hacia arriba y sale del viewport
        if (event.clientY < 50 && event.relatedTarget === null) {
            const currentCount = parseInt(sessionStorage.getItem(MODAL_COUNT_KEY) || '0', 10);

            if (currentCount < MAX_SHOWS) {
                setIsVisible(true);
                setShowSecurityAlert(true);
                // Desactivar listener inmediatamente
                document.removeEventListener('mouseout', handleExitIntent);
            }
        }
    }, []);

    // 2. Lógica de aparición: SOLO en exit intent (cuando intenten salir)
    useEffect(() => {
        const currentCount = parseInt(sessionStorage.getItem(MODAL_COUNT_KEY) || '0', 10);

        // Solo configurar exit intent si no se ha mostrado 2 veces
        if (currentCount < MAX_SHOWS) {
            document.addEventListener('mouseout', handleExitIntent);

            return () => {
                document.removeEventListener('mouseout', handleExitIntent);
            };
        }
    }, [handleExitIntent]);

    // 3. Cerrar modal y actualizar contador
    const handleClose = () => {
        setIsVisible(false);

        let currentCount = parseInt(sessionStorage.getItem(MODAL_COUNT_KEY) || '0', 10);
        currentCount++;
        sessionStorage.setItem(MODAL_COUNT_KEY, currentCount.toString());

        onClose();
    };

    // 4. Manejar compartir en redes sociales
    const handleShare = (platform: 'facebook' | 'whatsapp') => {
        const portfolioUrl = encodeURIComponent(window.location.href);
        const shareText = encodeURIComponent(
            "🎄 ¡Mira mi nueva foto IA gratis! 📸 La conseguí compartiendo aquí:"
        );

        if (platform === 'facebook') {
            window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${portfolioUrl}&quote=${shareText}`,
                '_blank',
                'width=600,height=400'
            );
        } else if (platform === 'whatsapp') {
            window.open(
                `https://api.whatsapp.com/send?text=${shareText}%20${portfolioUrl}`,
                '_blank'
            );
        }

        // Marcar como compartido
        setShared(true);

        // Incrementar contador de shares
        const shares = parseInt(sessionStorage.getItem('viralShares') || '0');
        sessionStorage.setItem('viralShares', (shares + 1).toString());

        // Mensaje de éxito
        setTimeout(() => {
            alert("🎁 ¡Gracias por compartir! Ahora puedes solicitar tu foto IA personalizada GRATIS. Contacta con nosotros para reclamar tu regalo.");
            handleClose();
        }, 2000);
    };

    if (!isVisible) return null;

    return (
        <div
            className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
            onClick={handleClose}
        >
            <div
                className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-yellow-900/20 border-3 border-yellow-500/50 rounded-xl max-w-md w-full p-8 relative shadow-[0_15px_35px_rgba(0,0,0,0.5)] animate-popIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-4 text-neutral-400 hover:text-white transition-colors text-3xl leading-none"
                    aria-label="Cerrar"
                >
                    ×
                </button>

                {/* Security Alert - Nano Banana Shield */}
                {showSecurityAlert && (
                    <div className="bg-neutral-800 border border-yellow-500/50 rounded-lg p-3 mb-5 text-center">
                        <p className="text-yellow-400 text-sm font-bold flex items-center justify-center gap-2">
                            <Shield size={16} className="text-yellow-500" />
                            ⚠️ Seguridad Activada: Contenido Protegido por Nano Banana Shield 🍌
                        </p>
                    </div>
                )}

                {/* Gift Icon */}
                <div className="flex justify-center mb-5">
                    <div className="text-6xl animate-bounce">
                        🎁
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-center mb-3 text-red-500">
                    Misión: Viraliza la Navidad
                </h2>

                {/* AI Generated Image Preview */}
                <div className="relative mb-5 rounded-lg overflow-hidden border-2 border-rose-500/50 shadow-lg">
                    <img
                        src="https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=600"
                        alt="Foto Navideña Generada por IA"
                        className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Sparkles size={12} fill="white" />
                        IA GENERADA
                    </div>
                </div>

                {/* Description */}
                <p className="text-white text-center mb-6 text-lg">
                    Comparte en 5 grupos de WhatsApp o en tu muro de Facebook y obtén{' '}
                    <span className="text-yellow-400 font-bold">1 FOTO IA GRATIS</span> para tu perfil.
                </p>

                {/* Share Buttons */}
                {!shared ? (
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => handleShare('whatsapp')}
                            className="w-full py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-lg flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg text-lg"
                        >
                            <Smartphone size={20} />
                            📱 Enviar a WhatsApp
                        </button>
                        <button
                            onClick={() => handleShare('facebook')}
                            className="w-full py-4 bg-[#4267B2] hover:bg-[#365899] text-white font-bold rounded-lg flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg text-lg"
                        >
                            <Facebook size={20} fill="white" />
                            f Postear en Facebook
                        </button>
                    </div>
                ) : (
                    <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 text-center animate-pulse">
                        <p className="text-green-400 font-bold flex items-center justify-center gap-2 text-lg">
                            <Sparkles size={20} />
                            ¡Compartido con éxito!
                        </p>
                        <p className="text-neutral-300 text-sm mt-2">
                            Preparando tu foto IA personalizada...
                        </p>
                    </div>
                )}

                {/* Footer */}
                <p className="text-neutral-500 text-xs text-center mt-6">
                    * Oferta válida por tiempo limitado. Una foto IA por usuario.
                </p>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          from { 
            opacity: 0;
            transform: scale(0.8);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-popIn {
          animation: popIn 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

export default AIViralPopup;
