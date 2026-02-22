export interface LetterContentConfig {
  envelopePreviewTitle: string;
  recipient: string;
  paragraphs: string[];
  highlightQuote: string;
  songQuote: {
    lines: string[];
    source: string;
  };
  signatureName: string;
  signatureDate: string;
  nextButtonText: string;
  marqueeLines: [string, string, string];
}

export const letterContent: LetterContentConfig = {
  envelopePreviewTitle: 'A Letter For You',
  recipient: '致 范宏泰：',
  paragraphs: [
    '范部，这三年你的包容与照顾，我一直都记在心里。偶然间注意到了你的生日，我不确定这个时间是否准确，但真心希望可以再次与你分享这些碎碎念的记忆并送上一些祝福。',
    '从大一去看演唱会，到大二在大雨里陪你取手机的劳动周，再到大三我们依然并肩而行……总有那么一些时刻，我包围在你的那份善意之中。',
  ],
  highlightQuote: '感恩与你的相遇',
  songQuote: {
    lines: [
      '我走过的路 只有希望',
      '希望你我讲过的话 放在心肝里',
      '总有那么一天',
    ],
    source: '—《憨人》',
  },
  signatureName: '永远的朋友，陈佳玮',
  signatureDate: '2026.2.23',
  nextButtonText: '继续走吧',
  marqueeLines: [
    '未来的你 会一帆风顺',
    '如果你忘了我 就让风替代我 说出对你的感谢',
    '如果能有一天 再一次重返光荣 记得找我 我的好朋友',
  ],
};
