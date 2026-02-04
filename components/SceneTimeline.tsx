import React from 'react';
import { motion } from 'framer-motion';
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
    return (
        <motion.div
            initial={{ opacity: 0, x: side === 'left' ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay, type: "spring" }}
            className={`relative flex gap-4 mb-12 ${side === 'right' ? 'flex-row-reverse' : 'flex-row'}`}
        >
            {/* Icon Column */}
            <div className="flex flex-col items-center z-10 shrink-0 w-10">
                <div className={`rounded-full p-2 shadow-[0_0_15px_rgba(255,255,255,0.2)] bg-[#221a10] border-2`} style={{ borderColor: color }}>
                    <Icon className="w-4 h-4" style={{ color: color }} />
                </div>
            </div>

            {/* Content Card */}
            <div className={`flex flex-col gap-3 flex-1 ${side === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
                <div className="bg-white/5 p-1 rounded-xl backdrop-blur-sm border border-white/10 overflow-hidden shadow-xl w-full max-w-[240px]">
                    <div className="aspect-[4/3] bg-cover bg-center rounded-lg"
                        style={{ backgroundImage: `url('${img}')` }}>
                    </div>
                </div>
                <div>
                    <h3 className="text-white text-lg font-bold leading-snug">{title}</h3>
                    {desc && <p className="text-[#cbb290] text-sm mt-1 leading-relaxed">{desc}</p>}
                </div>
            </div>
        </motion.div>
    );
};

export const SceneTimeline: React.FC<TransitionProps> = ({ onNext }) => {
    return (
        <div className="relative w-full h-full bg-[#221a10] text-white overflow-y-auto no-scrollbar pb-32">

            {/* Intro Quote Section */}
            <div className="pt-20 px-8 pb-10 text-center relative z-10">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
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
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>

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

            {/* Special Mayday Section */}
            <div className="mt-12 mx-6 relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-900 shadow-2xl border border-blue-500/30">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1459749411177-0473ef4884f3?q=80&w=2070&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
                <div className="relative p-6 text-center">
                    <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-3 animate-pulse" />
                    <h3 className="text-xl font-bold text-blue-100 mb-2">五月天缘分</h3>
                    <p className="text-sm text-blue-200/80 leading-relaxed font-medium">
                        是你帮助当时无助的我，<br />
                        才让我有机会去北京鸟巢见他们。
                    </p>
                </div>
            </div>

            <div className="flex justify-center mt-12 mb-20 shrink-0">
                <button onClick={onNext} className="group relative px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-bold tracking-widest overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative flex items-center gap-2">
                        下一章 <ChevronDown className="w-4 h-4 animate-bounce" />
                    </span>
                </button>
            </div>
        </div>
    );
};