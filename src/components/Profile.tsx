import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import React from 'react';
import { apiGet } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { LogOut, Phone, User, GraduationCap, Users } from 'lucide-react';
import { useSettings, getPrimaryColor, getLightBg } from '../context/SettingsContext';

interface ProfileResponse {
  profile_picture: string;
  personal_info: {
    "نام": string;
    "نام پدر": string;
    "نام پدرکلان": string;
    "نام فامیلی": string;
    "ملیت": string;
    "زبان مادری": string;
    "جنسیت": string;
  };
  education_info: {
    "درجه": string;
    "پوهنتون": string;
    "دیپارتمنت": string;
    "سمستر": string;
    "سال کانکور": string;
    "نمره کانکور": string;
    "ID کانکور": string;
  };
  contact_info: {
    "شماره تماس": string;
  };
  family_info: {
    "relation": string;
    "name": string;
    "job": string;
    "phone": string;
  };
}

export default function Profile() {
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const { color } = useSettings();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiGet('/profile') as unknown as ProfileResponse;
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 flex flex-col items-center space-y-6">
        <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
        <div className="w-48 h-8 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
        <div className="w-full h-40 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!data) return null;

  const InfoCard = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden mb-4"
    >
      <div className={`px-4 py-3 ${getLightBg(color)} dark:bg-slate-700/50 bg-opacity-50 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2`}>
        <Icon size={16} className={getPrimaryColor(color)} />
        <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">{title}</h3>
      </div>
      <div className="p-4 space-y-3">
        {children}
      </div>
    </motion.div>
  );

  const InfoRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-700/50 last:border-0 pb-2 last:pb-0">
      <span className="text-xs text-slate-400 font-medium">{label}</span>
      <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{value}</span>
    </div>
  );

  return (
    <div className="p-4 pb-24">
      <div className="flex flex-col items-center mb-8 pt-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative"
        >
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg bg-slate-200 dark:bg-slate-700">
            <img src={data.profile_picture} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-slate-800 dark:text-white mt-4"
        >
          {data.personal_info["نام"]} {data.personal_info["نام فامیلی"]}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-500 dark:text-slate-400"
        >
          {data.education_info["دیپارتمنت"]}
        </motion.p>
      </div>

      <InfoCard title="اطلاعات شخصی" icon={User}>
        <InfoRow label="نام پدر" value={data.personal_info["نام پدر"]} />
        <InfoRow label="نام پدرکلان" value={data.personal_info["نام پدرکلان"]} />
        <InfoRow label="ملیت" value={data.personal_info["ملیت"]} />
        <InfoRow label="جنسیت" value={data.personal_info["جنسیت"]} />
      </InfoCard>

      <InfoCard title="تحصیلات" icon={GraduationCap}>
        <InfoRow label="پوهنتون" value={data.education_info["پوهنتون"]} />
        <InfoRow label="درجه" value={data.education_info["درجه"]} />
        <InfoRow label="سمستر" value={data.education_info["سمستر"]} />
        <InfoRow label="آیدی کانکور" value={data.education_info["ID کانکور"]} />
      </InfoCard>

      <InfoCard title="تماس" icon={Phone}>
        <InfoRow label="شماره تماس" value={data.contact_info["شماره تماس"]} />
      </InfoCard>

      <InfoCard title="تماس فامیلی" icon={Users}>
        <InfoRow label="نام" value={data.family_info.name} />
        <InfoRow label="نسبت" value={data.family_info.relation} />
        <InfoRow label="شماره" value={data.family_info.phone} />
      </InfoCard>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileTap={{ scale: 0.98 }}
        onClick={logout}
        className="w-full mt-4 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
      >
        <LogOut size={20} />
        خروج
      </motion.button>
    </div>
  );
}
