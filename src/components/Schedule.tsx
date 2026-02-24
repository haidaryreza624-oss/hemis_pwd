import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { apiGet } from '../api/api';
import { User, Calendar } from 'lucide-react';
import { useSettings, getPrimaryColor } from '../context/SettingsContext';

interface Course {
  "شماره": string;
  "سال": string;
  "نیم سال": string;
  "سمستر": string;
  "نام مضمون": string;
  "تعداد کریدت": string;
  "نام استاد": string;
}

type ScheduleResponse = [
  any[], // Weekly timetable (unused for now)
  Course[] // Course list
];

export default function Schedule() {
  const [data, setData] = useState<ScheduleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { color } = useSettings();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiGet('/schedule') as unknown as ScheduleResponse;
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
      <div className="space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data || !data[1]) return <div className="p-4 text-center text-slate-500 dark:text-slate-400">تقسیم اوقات موجود نیست</div>;

  const courses = data[1];

  return (
    <div className="p-4 space-y-4 pb-24">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">لیست مضامین</h2>
      {courses.map((item, index) => (
        <motion.div
          key={item["شماره"]}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden"
        >
          <div className={`absolute top-0 right-0 w-1 h-full ${getPrimaryColor(color).replace('text-', 'bg-')}`} />
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">{item["نام مضمون"]}</h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
              {item["تعداد کریدت"]} کریدیت
            </span>
          </div>
          
          <div className="flex flex-col gap-2 mt-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <User size={16} className={getPrimaryColor(color)} />
              <span>{item["نام استاد"]}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className={getPrimaryColor(color)} />
              <span>سمستر {item["سمستر"]} • {item["سال"]}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
