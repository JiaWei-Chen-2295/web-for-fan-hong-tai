import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Coffee, GraduationCap, Mic, Ticket, Cake, HandHeart, Sparkles, ChevronDown } from 'lucide-react';
import { TransitionProps } from '../types';

interface MemoryNodeProps {
    title: string;
    desc?: string;
    img: string;
    icon: React.ElementType;
    color: string;
    delay: number;
    side: 'left' | 'right';
}

const MemoryNode: React.FC<MemoryNodeProps> = ({ title, desc, img, icon: Icon, color, delay, side }) => {
    // Generate random values for "uncertainty" floating effect
    const randomDuration = 3 + Math.random() * 2;
    const randomDao = Math.random() < 0.5 ? 1 : -1;

    return (
        <motion.div
            initial={{
                opacity: 0,
                x: side === 'left' ? -30 : 30,
                y: 20,
                rotate: side === 'left' ? -5 : 5
            }}
            whileInView={{
                opacity: 1,
                x: 0,
                y: 0,
                rotate: 0
            }}
            // Continuous "floating" motion for uncertainty/drifting
            animate={{
                y: [0, -4 * randomDao, 0],
                rotate: [0, 1 * randomDao, 0],
            }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
                // Entrance
                type: "spring",
                stiffness: 200,
                damping: 12,
                delay,
                // Floating loop
                y: {
                    duration: randomDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 2
                },
                rotate: {
                    duration: randomDuration * 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }
            }}
            className={`relative flex gap-4 mb-16 ${side === 'right' ? 'flex-row-reverse' : 'flex-row'}`}
        >
            {/* Icon Column */}
            <div className="flex flex-col items-center z-10 shrink-0 w-10 relative">
                {/* Connection thread */}
                <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: '100%' }}
                    transition={{ duration: 1, delay: delay + 0.2 }}
                    className="absolute top-10 bottom-[-4rem] w-[1px] bg-gradient-to-b from-white/20 to-transparent"
                />

                <motion.div
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`rounded-full p-2 shadow-[0_0_15px_rgba(255,255,255,0.2)] bg-[#221a10] border-2 cursor-pointer z-10`}
                    style={{ borderColor: color }}
                >
                    <Icon className="w-4 h-4" style={{ color: color }} />
                </motion.div>
            </div>

            {/* Content Card */}
            <div className={`flex flex-col gap-3 flex-1 ${side === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
                <motion.div
                    whileHover={{
                        scale: 1.03,
                        rotate: Math.random() * 2 - 1,
                        filter: "brightness(1.1)"
                    }}
                    className="bg-white/5 p-1 rounded-xl backdrop-blur-sm border border-white/10 overflow-hidden shadow-xl w-full max-w-[260px] cursor-pointer group relative"
                >
                    {/* Glass glare effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none"></div>

                    <div className="aspect-[4/3] bg-cover bg-center rounded-lg transition-all duration-700 group-hover:scale-105 group-hover:blur-[0.5px] group-hover:sepia-[0.3]"
                        style={{ backgroundImage: `url('${img}')` }}>
                    </div>
                </motion.div>

                <div className="relative">
                    <motion.h3
                        initial={{ opacity: 0, filter: "blur(4px)" }}
                        whileInView={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, delay: delay + 0.3 }}
                        className="text-white text-lg font-bold leading-snug tracking-wide"
                    >
                        {title}
                    </motion.h3>

                    {desc && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1, delay: delay + 0.5, ease: "circOut" }}
                            className="text-[#cbb290] text-sm mt-1 leading-relaxed mix-blend-screen"
                        >
                            {desc}
                        </motion.p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export const SceneTimeline: React.FC<TransitionProps> = ({ onNext }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ container: containerRef });
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="relative w-full h-full bg-[#221a10] text-white overflow-hidden">
            {/* Scroll Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 z-50 bg-white/10">
                <motion.div
                    className="h-full bg-gradient-to-r from-orange-400 to-amber-200 origin-left"
                    style={{ scaleX }}
                />
            </div>

            <div
                ref={containerRef}
                className="w-full h-full overflow-y-auto no-scrollbar pb-32"
            >

                {/* Intro Quote Section */}
                <div className="pt-20 px-8 pb-10 text-center relative z-10">
                    <motion.p
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 1 }}
                        className="font-serif text-[#cbb290] text-lg leading-loose italic"
                    >
                        “当初遇见你，其实有个挺尴尬的乌龙：宿管阿姨弄错了柜子锁的顺序，让我上去换一下，我以为那个柜子是你的，还冲过去特淡定地跟人家商量要换……谁知道最后认错了人。现在想想，那场大型尴尬现场居然是我们友谊的开端。”
                        <span className="block text-xs mt-3 opacity-50 not-italic sans-serif tracking-widest">—— 我们故事的开始</span>
                    </motion.p>
                </div>

                {/* Timeline Container */}
                <div className="relative px-6 py-4 shrink-0">
                    {/* Vertical Line */}
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "100%" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-white/10 to-transparent"
                    ></motion.div>

                    <MemoryNode
                        title="拼杯奶茶的默契"
                        desc="2023.09.13 · 我第一次喝学校的奶茶，和你一起拼的杯。"
                        img="/assets/hu_shang_a_yi.jpg"
                        icon={Coffee}
                        color="#f49d25"
                        delay={0.2}
                        side="left"
                    />

                    <MemoryNode
                        title="军训那年的你"
                        desc="2023.09.27 · 你还记得你军训的样子吗？在操场候场打棍的照片。"
                        img="/assets/jun_xun.jpg"
                        icon={GraduationCap}
                        color="#84cc16"
                        delay={0.3}
                        side="right"
                    />

                    <MemoryNode
                        title="你的成名曲"
                        desc="2023.10.16 · 学生会周会唱歌的那个瞬间，舞台上的光都聚在你身上。"
                        img="/assets/cheng_ming_qu.jpg"
                        icon={Mic}
                        color="#3b82f6"
                        delay={0.4}
                        side="left"
                    />

                    <MemoryNode
                        title="义无反顾的陪伴"
                        desc="2024.05.22 · 你那天看着我纠结，义无反顾决定陪我去。"
                        img="/assets/pei_ban.jpg"
                        icon={Ticket}
                        color="#fca5a5"
                        delay={0.5}
                        side="right"
                    />

                    <MemoryNode
                        title="买蛋糕的路上"
                        desc="2024.11.12 · 和你一起去买蛋糕的路上，记录着简单的快乐。"
                        img="/assets/dan_gao.jpg"
                        icon={Cake}
                        color="#fbbf24"
                        delay={0.6}
                        side="left"
                    />

                    <MemoryNode
                        title="劳动周你的照顾"
                        desc="2025.04.18 · 感谢你劳动周的照顾。还记得吗？那天下大雨陪你去拿修好的手机。"
                        img="/assets/lao_dong_zhou.jpg"
                        icon={HandHeart}
                        color="#e879f9"
                        delay={0.7}
                        side="right"
                    />
                </div>


                <div className="flex justify-center mt-12 mb-20 shrink-0">
                    <motion.button
                        onClick={onNext}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative px-8 py-3 bg-[#6BA3D6] text-white font-bold tracking-widest rounded-full shadow-[0_10px_20px_-5px_rgba(107,163,214,0.4)] border border-white/20 overflow-hidden hover:shadow-[0_15px_30px_-5px_rgba(107,163,214,0.6)] transition-all"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span className="relative flex items-center gap-2">
                            下一章 <ChevronDown className="w-4 h-4 animate-bounce" />
                        </span>
                    </motion.button>
                </div>
            </div>
        </div>
    );
};