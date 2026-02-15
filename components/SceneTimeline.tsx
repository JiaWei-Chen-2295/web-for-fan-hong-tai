import React, { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../utils/gsap-setup';
import { useHoverTap } from '../hooks/useHoverTap';
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
    scroller: React.RefObject<HTMLDivElement | null>;
}

const MemoryNode: React.FC<MemoryNodeProps> = ({ title, desc, img, icon: Icon, color, delay, side, scroller }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const threadRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);

    const randomDuration = useRef(3 + Math.random() * 2).current;
    const randomDao = useRef(Math.random() < 0.5 ? 1 : -1).current;

    useHoverTap(iconRef, { scale: 1.1, rotation: 180 });
    useHoverTap(imageRef, { scale: 1.03, filter: 'brightness(1.1)' });

    // Use IntersectionObserver instead of ScrollTrigger for reliable
    // scroll-triggered reveal inside a custom scroller container.
    useEffect(() => {
        const card = cardRef.current;
        const scrollerEl = scroller.current;
        if (!card) return;

        // Initial hidden state
        gsap.set(card, {
            opacity: 0,
            x: side === 'left' ? -30 : 30,
            y: 20,
            rotation: side === 'left' ? -5 : 5,
        });
        if (threadRef.current) gsap.set(threadRef.current, { height: 0 });
        if (titleRef.current) gsap.set(titleRef.current, { opacity: 0, filter: 'blur(4px)' });
        if (descRef.current) gsap.set(descRef.current, { opacity: 0 });

        const tweens: gsap.core.Tween[] = [];

        const animateIn = () => {
            // Card entrance
            tweens.push(gsap.to(card, {
                opacity: 1, x: 0, y: 0, rotation: 0,
                duration: 0.8,
                delay,
                ease: 'back.out(1.5)',
                onComplete: () => {
                    tweens.push(gsap.to(card, {
                        y: -4 * randomDao,
                        rotation: 1 * randomDao,
                        duration: randomDuration,
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut',
                    }));
                },
            }));

            // Connection thread
            if (threadRef.current) {
                tweens.push(gsap.to(threadRef.current, {
                    height: 'auto',
                    duration: 1,
                    delay: delay + 0.2,
                    ease: 'power2.out',
                }));
            }

            // Title entrance
            if (titleRef.current) {
                tweens.push(gsap.to(titleRef.current, {
                    opacity: 1, filter: 'blur(0px)',
                    duration: 0.8,
                    delay: delay + 0.3,
                    ease: 'power2.out',
                }));
            }

            // Description entrance
            if (descRef.current) {
                tweens.push(gsap.to(descRef.current, {
                    opacity: 1,
                    duration: 1,
                    delay: delay + 0.5,
                    ease: 'circ.out',
                }));
            }
        };

        if (!scrollerEl) {
            // Fallback: animate in immediately if scroller unavailable
            animateIn();
            return () => { tweens.forEach(t => t.kill()); };
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateIn();
                        observer.unobserve(card);
                    }
                });
            },
            { root: scrollerEl, threshold: 0.1 },
        );

        observer.observe(card);

        return () => {
            observer.disconnect();
            tweens.forEach(t => t.kill());
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            ref={cardRef}
            className={`relative flex gap-4 mb-16 ${side === 'right' ? 'flex-row-reverse' : 'flex-row'}`}
        >
            {/* Icon Column */}
            <div className="flex flex-col items-center z-10 shrink-0 w-10 relative">
                {/* Connection thread */}
                <div
                    ref={threadRef}
                    className="absolute top-10 bottom-[-4rem] w-[1px] bg-gradient-to-b from-white/20 to-transparent"
                />

                <div
                    ref={iconRef}
                    className={`rounded-full p-2 shadow-[0_0_15px_rgba(255,255,255,0.2)] bg-[#221a10] border-2 cursor-pointer z-10`}
                    style={{ borderColor: color }}
                >
                    <Icon className="w-4 h-4" style={{ color: color }} />
                </div>
            </div>

            {/* Content Card */}
            <div className={`flex flex-col gap-3 flex-1 ${side === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
                <div
                    ref={imageRef}
                    className="bg-white/5 p-1 rounded-xl backdrop-blur-sm border border-white/10 overflow-hidden shadow-xl w-full max-w-[260px] cursor-pointer group relative"
                >
                    {/* Glass glare effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none"></div>

                    <div className="aspect-[4/3] bg-cover bg-center rounded-lg transition-all duration-700 group-hover:scale-105 group-hover:blur-[0.5px] group-hover:sepia-[0.3]"
                        style={{ backgroundImage: `url('${img}')` }}>
                    </div>
                </div>

                <div className="relative">
                    <h3
                        ref={titleRef}
                        className="text-white text-lg font-bold leading-snug tracking-wide"
                    >
                        {title}
                    </h3>

                    {desc && (
                        <p
                            ref={descRef}
                            className="text-[#cbb290] text-sm mt-1 leading-relaxed mix-blend-screen"
                        >
                            {desc}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export const SceneTimeline: React.FC<TransitionProps> = ({ onNext }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const verticalLineRef = useRef<HTMLDivElement>(null);
    const introQuoteRef = useRef<HTMLParagraphElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useHoverTap(buttonRef, { scale: 1.05 }, { scale: 0.95 });

    // Scroll progress bar
    useGSAP(() => {
        if (!progressBarRef.current || !containerRef.current) return;

        gsap.fromTo(progressBarRef.current,
            { scaleX: 0 },
            {
                scaleX: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    scroller: containerRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 0.3,
                },
            },
        );
    }, { scope: containerRef });

    // Vertical line animation
    useGSAP(() => {
        if (verticalLineRef.current) {
            gsap.fromTo(verticalLineRef.current,
                { height: 0 },
                { height: '100%', duration: 1.5, ease: 'power2.inOut' },
            );
        }
    }, { scope: containerRef });

    // Intro quote entrance
    useGSAP(() => {
        if (introQuoteRef.current) {
            gsap.fromTo(introQuoteRef.current,
                { opacity: 0, y: 20, filter: 'blur(10px)' },
                { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power2.out' },
            );
        }
    }, { scope: containerRef });

    // Refresh ScrollTrigger after mount — must wait for the scene entrance
    // animation (800ms in App.tsx) to finish so the container has correct dimensions.
    useEffect(() => {
        const timer = setTimeout(() => ScrollTrigger.refresh(), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative w-full h-full bg-[#221a10] text-white overflow-hidden">
            {/* Scroll Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 z-50 bg-white/10">
                <div
                    ref={progressBarRef}
                    className="h-full bg-gradient-to-r from-orange-400 to-amber-200 origin-left"
                    style={{ transform: 'scaleX(0)' }}
                />
            </div>

            <div
                ref={containerRef}
                className="w-full h-full overflow-y-auto no-scrollbar pb-32"
            >

                {/* Intro Quote Section */}
                <div className="pt-20 px-8 pb-10 text-center relative z-10">
                    <p
                        ref={introQuoteRef}
                        className="font-serif text-[#cbb290] text-lg leading-loose italic"
                    >
                        "当初遇见你，其实有个挺尴尬的乌龙：宿管阿姨弄错了柜子锁的顺序，让我上去换一下，我以为那个柜子是你的，还冲过去特淡定地跟人家商量要换……谁知道最后认错了人。现在想想，那场大型尴尬现场居然是我们友谊的开端。"
                        <span className="block text-xs mt-3 opacity-50 not-italic sans-serif tracking-widest">—— 我们故事的开始</span>
                    </p>
                </div>

                {/* Timeline Container */}
                <div className="relative px-6 py-4 shrink-0">
                    {/* Vertical Line */}
                    <div
                        ref={verticalLineRef}
                        className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-white/10 to-transparent"
                    ></div>

                    <MemoryNode
                        title="拼杯奶茶的默契"
                        desc="2023.09.13 · 我第一次喝学校的奶茶，和你一起拼的杯。"
                        img="/assets/hu_shang_a_yi.jpg"
                        icon={Coffee}
                        color="#f49d25"
                        delay={0.2}
                        side="left"
                        scroller={containerRef}
                    />

                    <MemoryNode
                        title="军训那年的你"
                        desc="2023.09.27 · 你还记得你军训的样子吗？在操场候场打棍的照片。"
                        img="/assets/jun_xun.jpg"
                        icon={GraduationCap}
                        color="#84cc16"
                        delay={0.3}
                        side="right"
                        scroller={containerRef}
                    />

                    <MemoryNode
                        title="你的成名曲"
                        desc="2023.10.16 · 学生会周会唱歌的那个瞬间，舞台上的光都聚在你身上。"
                        img="/assets/cheng_ming_qu.jpg"
                        icon={Mic}
                        color="#3b82f6"
                        delay={0.4}
                        side="left"
                        scroller={containerRef}
                    />

                    <MemoryNode
                        title="义无反顾的陪伴"
                        desc="2024.05.22 · 你那天看着我纠结，义无反顾决定陪我去。"
                        img="/assets/pei_ban.jpg"
                        icon={Ticket}
                        color="#fca5a5"
                        delay={0.5}
                        side="right"
                        scroller={containerRef}
                    />

                    <MemoryNode
                        title="买蛋糕的路上"
                        desc="2024.11.12 · 和你一起去买蛋糕的路上，记录着简单的快乐。"
                        img="/assets/dan_gao.jpg"
                        icon={Cake}
                        color="#fbbf24"
                        delay={0.6}
                        side="left"
                        scroller={containerRef}
                    />

                    <MemoryNode
                        title="劳动周你的照顾"
                        desc="2025.04.18 · 感谢你劳动周的照顾。还记得吗？那天下大雨陪你去拿修好的手机。"
                        img="/assets/lao_dong_zhou.jpg"
                        icon={HandHeart}
                        color="#e879f9"
                        delay={0.7}
                        side="right"
                        scroller={containerRef}
                    />
                </div>


                <div className="flex justify-center mt-12 mb-20 shrink-0">
                    <button
                        ref={buttonRef}
                        onClick={onNext}
                        className="group relative px-8 py-3 bg-[#6BA3D6] text-white font-bold tracking-widest rounded-full shadow-[0_10px_20px_-5px_rgba(107,163,214,0.4)] border border-white/20 overflow-hidden hover:shadow-[0_15px_30px_-5px_rgba(107,163,214,0.6)] transition-all"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span className="relative flex items-center gap-2">
                            下一章 <ChevronDown className="w-4 h-4 animate-bounce" />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};
