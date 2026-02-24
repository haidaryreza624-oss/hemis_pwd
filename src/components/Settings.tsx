import { motion } from 'motion/react';
import { useSettings, Color, Theme, Font, getPrimaryBg, getPrimaryColor, getLightBg } from '../context/SettingsContext';
import { Moon, Sun, Type, Palette, Check, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { theme, setTheme, color, setColor, font, setFont } = useSettings();

  const colors: Color[] = ['indigo', 'emerald', 'rose', 'amber', 'blue', 'violet'];
  const fonts: { id: Font; label: string; family: string }[] = [
    { id: 'وزیر', label: 'وزیر', family: 'وزیر' },
    { id: 'شبنم', label: 'شبنم', family: 'شبنم' },
    { id: 'نازنین', label: 'نازنین', family: 'نازنین' },
  ];

  const navigate = useNavigate();

  const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 mb-4">
      <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-white">
        <Icon size={20} className={getPrimaryColor(color)} />
        <h3 className="font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="p-4 pb-24 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">تنظیمات</h2>
      </div>

      <Section title="رنگ اصلی (Color)" icon={Palette}>
        <div className="grid grid-cols-6 gap-2">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-full aspect-square rounded-full flex items-center justify-center transition-transform ${
                getPrimaryBg(c)
              } ${color === c ? 'scale-110 ring-2 ring-offset-2 ring-slate-300 dark:ring-slate-600' : 'opacity-70 hover:opacity-100'}`}
            >
              {color === c && <Check size={16} className="text-white" />}
            </button>
          ))}
        </div>
      </Section>

      <Section title="دربارهٔ اپلیکیشن" icon={Info}>
        <button
          onClick={() => navigate('/dashboard/about')}
          className={`w-full flex items-center gap-4 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700`}
        >
          <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${getLightBg(color)}`}>
            <Info className={getPrimaryColor(color)} />
          </div>
          <div className="text-right">
            <div className="font-medium text-slate-800 dark:text-white">دربارهٔ اپلیکیشن</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">اطلاعات مربوط به این اپلیکیشن و نسخهٔ آن</div>
          </div>
        </button>
      </Section>

      <Section title="فونت (Font)" icon={Type}>
        <div className="space-y-2">
          {fonts.map((f) => (
            <button
              key={f.id}
              onClick={() => setFont(f.id)}
              className={`w-full p-3 rounded-xl text-right flex items-center justify-between border transition-all ${
                font === f.id
                  ? `${getLightBg(color)} ${getPrimaryColor(color)} border-transparent`
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
              style={{ fontFamily: f.family }}
            >
              <span>{f.label}</span>
              {font === f.id && <Check size={16} />}
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}
