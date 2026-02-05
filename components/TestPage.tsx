import React from 'react';
import { motion } from 'framer-motion';

export const TestPage: React.FC = () => {
    const fonts = [
        {
            name: 'Serif',
            desc: 'Noto Serif SC',
            className: 'font-serif',
            sampleCN: '海内存知己',
            sampleEN: 'Elegant Night',
            color: 'text-amber-300' // Brighter gold
        },
        {
            name: 'Handwritten',
            desc: 'Zhi Mang Xing',
            className: 'font-handwritten',
            sampleCN: '天涯若比邻',
            sampleEN: 'Writing Flow',
            color: 'text-rose-300' // Brighter peach/rose
        },
        {
            name: 'Brush',
            desc: 'Ma Shan Zheng',
            className: 'font-brush',
            sampleCN: '壮志凌云',
            sampleEN: 'Brush Stroke',
            color: 'text-white'
        },
        {
            name: 'Display',
            desc: 'Plus Jakarta',
            className: 'font-display',
            sampleCN: '美好时光',
            sampleEN: 'Modern 123',
            color: 'text-cyan-300' // Changed from dark blue to bright cyan for contrast
        },
        {
            name: 'Sans',
            desc: 'Be Vietnam',
            className: 'font-sans',
            sampleCN: '系统预览',
            sampleEN: 'Clean UI',
            color: 'text-gray-100' // Brighter white/gray
        }
    ];

    return (
        <div className="min-h-screen bg-dusk-dark text-paper-base p-4 flex flex-col items-center justify-center">
            {/* Compact Header */}
            <motion.header
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm flex justify-between items-end mb-4 px-2 border-b border-white/10 pb-2"
            >
                <div>
                    <h1 className="text-lg font-bold font-sans text-white/90">Font Render Check</h1>
                    <p className="text-[10px] text-white/50 font-mono">v1.1 • Compact Mode</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-green-400 font-mono">LIVE</span>
                </div>
            </motion.header>

            {/* Font Grid - Core Focus */}
            <div className="w-full max-w-sm grid gap-3">
                {fonts.map((font, idx) => (
                    <motion.div
                        key={font.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group relative bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between hover:bg-white/10 transition-colors overflow-hidden"
                    >
                        {/* Left: Info */}
                        <div className="flex flex-col z-10">
                            <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold font-mono mb-1">
                                {font.name} <span className="opacity-50">/ {font.desc}</span>
                            </span>
                            <div className={`${font.className} text-3xl mb-1 ${font.color}`}>
                                {font.sampleCN}
                            </div>
                            <div className={`${font.className} text-lg text-white/80`}>
                                {font.sampleEN}
                            </div>
                        </div>

                        {/* Right: Large Char Visual */}
                        <div className={`text-3xl opacity-20 group-hover:opacity-40 transition-opacity ${font.className} ${font.color}`}>
                            Aa
                        </div>

                        {/* Background Gradient Hint */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                ))}
            </div>

            {/* Animation Status - Compact Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-sm mt-4 grid grid-cols-2 gap-3"
            >
                <div className="bg-white/5 rounded-lg p-2 flex items-center gap-3 border border-white/5">
                    <motion.div
                        className="w-8 h-8 rounded-full bg-gradient-to-tr from-sunset-gold to-sunset-orange"
                        animate={{ scale: [1, 0.8, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="flex flex-col">
                        <span className="text-[10px] text-white/40 uppercase">Scale Engine</span>
                        <span className="text-xs font-mono text-white/70">Running</span>
                    </div>
                </div>

                <div className="bg-white/5 rounded-lg p-2 flex items-center gap-3 border border-white/5">
                    <motion.div
                        className="w-8 h-8 rounded-lg bg-primary-blue"
                        animate={{ rotate: 180 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="flex flex-col">
                        <span className="text-[10px] text-white/40 uppercase">Rotation</span>
                        <span className="text-xs font-mono text-white/70">Running</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
