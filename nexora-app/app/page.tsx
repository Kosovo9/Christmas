import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">

        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(112,0,255,0.2) 0%, transparent 70%)' }}></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full glass-panel text-sm font-medium text-secondary mb-4">
            🚀 100x Performance Speed
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
            Build at <span className="text-gradient">Light Speed</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Nexora provides the ultimate foundation for next-generation web applications.
            Powered by Next.js, Cloudflare, and cutting-edge design.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a href="/christmas" className="btn btn-primary text-lg px-8 py-4">
              Start Creating Christmas Magic
            </a>
            <a href="#" className="btn btn-secondary text-lg px-8 py-4">
              View Documentation
            </a>
          </div>
        </div>

        {/* Floating Elements Animation (CSS only for now) */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-accent rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </main>

      {/* Simple Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm glass-panel mx-4 mb-4">
        <p>© 2024 Nexora App. All rights reserved.</p>
      </footer>
    </div>
  );
}
