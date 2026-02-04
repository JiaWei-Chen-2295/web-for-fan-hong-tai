import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Quote, Music } from 'lucide-react';
import { TransitionProps } from '../types';

export const SceneLetter: React.FC<TransitionProps> = ({ onNext }) => {
  return (
    <div className="relative w-full h-full bg-[#1e1e1e] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Spotlight Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[80%] bg-gradient-to-b from-white/10 to-transparent blur-[100px] pointer-events-none" />

      {/* Letter Container */}
      <motion.div
        initial={{ rotateX: 90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="bg-[#fdfaf1] w-full max-w-sm rounded-sm shadow-2xl relative overflow-hidden"
        style={{ transformPerspective: 1000, transformOrigin: "top" }}
      >
        {/* Paper Texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50"></div>

        {/* Top Decorative Strip */}
        <div className="h-2 bg-[#d14444] w-full relative">
          <div className="absolute bottom-0 w-full h-[1px] bg-black/10"></div>
        </div>

        <div className="p-8 pb-10 relative">
          {/* Reading Light Scan Effect */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ duration: 3, delay: 1, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none"
          />

          <Quote className="w-6 h-6 text-[#d14444]/20 absolute top-6 left-6" />

          <div className="space-y-6 font-serif text-[#2c2c2c] leading-relaxed">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="text-sm text-[#444] space-y-4 leading-relaxed">
              <p>致 范宏泰：</p>
              <p>这一年无论是你的陪伴还是照顾，我其实一直都记在心里。偶然间留心到了你的生日，虽不确定这个惊喜是否完全合你的心意，但真心希望这些碎碎念的记忆能让你感到温暖。</p>
              <p>从大一一起抢票看演唱会，到大二在大雨里陪你取手机的劳动周，再到大三我们依然并肩而行……总有那么一些瞬间，让我深深感受到你的那份善意与包容。</p>
              <p className="font-bold text-[#d14444] text-base italic">“那一夜，没有你真的完全不行。”</p>
              <p>你这么真诚且优秀的人，未来一定会拥有稳稳的幸福。生日快乐，希望你永远是你自己。</p>
              <p className="font-bold italic">未来，麻烦你也别忘了我呀。 :)</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8 }}
              className="relative py-6 my-6 px-4"
            >
              {/* Lyrics Decoration */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-orange-400 via-amber-400 to-transparent opacity-60" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none">
                <Music className="w-24 h-24 rotate-12" />
              </div>

              <p className="text-sm italic text-[#4a4a4a] leading-relaxed font-medium relative z-10">
                “我走过的路 只有希望<br />
                希望你我讲过的话 放在心肝里<br />
                总有那么一天”
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-[1px] w-4 bg-black/10"></div>
                <span className="text-[10px] tracking-widest text-[#888] font-bold uppercase">—《憨人》</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="space-y-3 mt-8"
            >
              {[
                "未来的你 会一帆风顺",
                "如果你忘了我 就让风替代我 说出对你的感谢",
                "如果能有一天 再一次重返光荣 记得找我 我的好朋友"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="w-1 h-1 rounded-full bg-amber-400 group-hover:scale-150 transition-transform"></div>
                  <p className="text-xs text-[#666] italic tracking-wide">{text}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2 }}
              className="pt-6 border-t border-[#d14444]/10 mt-6 text-right"
            >
              <p className="text-sm font-bold text-[#2c2c2c]">永远的朋友，陈佳玮</p>
              <p className="font-handwritten text-lg text-[#d14444] mt-1">2026.2.23</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Next Button */}
      <motion.button
        onClick={onNext}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4 }}
        className="mt-10 flex items-center gap-2 text-white font-bold hover:text-white transition-colors uppercase text-xs tracking-widest bg-white/10 px-6 py-3 rounded-full border border-white/20"
      >
        <span>最后的惊喜</span>
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
};