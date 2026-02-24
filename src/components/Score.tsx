import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { apiGet } from '../api/api';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSettings, getLightBg, getPrimaryColor } from '../context/SettingsContext';

interface SubjectScore {
  number: number;
  name: string;
  credits: number;
  attendance: number;
  absent: number;
  homework_10: number;
  activity_10: number;
  midterm_20: number;
  final_60: number;
  total_100: number;
  status: string;
  final_approval: string;
}

interface SemesterScore {
  semester_number: number;
  subjects: SubjectScore[];
}

interface ScoreResponse {
  semesters: SemesterScore[];
}

export default function Score() {
  const [data, setData] = useState<ScoreResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const { color } = useSettings();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiGet('/score') as unknown as ScoreResponse;
        setData(result);
        if (result && result.semesters.length > 0) {
          // Preselect the first semester by default
          setSelectedSemester(result.semesters[0].semester_number);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSubject = (id: string) => {
    setExpandedSubject(expandedSubject === id ? null : id);
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse w-full mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data) return <div className="p-4 text-center text-slate-500 dark:text-slate-400">داده‌ای موجود نیست</div>;

  const currentSemester = data.semesters.find(s => s.semester_number === selectedSemester);

  return (
    <div className="p-4 space-y-6 pb-24">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">نمرات تفصیلی</h2>
      
      {/* Semester Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
        {data.semesters.map((semester) => (
          <button
            key={semester.semester_number}
            onClick={() => setSelectedSemester(semester.semester_number)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              selectedSemester === semester.semester_number
                ? `${getPrimaryColor(color).replace('text-', 'bg-')} text-white shadow-md`
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700'
            }`}
          >
            سمستر {semester.semester_number}
          </button>
        ))}
      </div>

      {currentSemester && (
        <div className="space-y-3">
          {currentSemester.subjects.map((subject) => {
            const uniqueId = `sem${currentSemester.semester_number}-sub${subject.number}`;
            const isExpanded = expandedSubject === uniqueId;
            
            return (
              <motion.div
                key={uniqueId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
              >
                <button
                  onClick={() => toggleSubject(uniqueId)}
                  className="w-full p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 text-right">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                      subject.total_100 >= 55 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {subject.total_100}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white text-sm">{subject.name}</h4>
                      <p className="text-xs text-slate-400">{subject.status}</p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="text-slate-400" size={18} />
                  ) : (
                    <ChevronDown className="text-slate-400" size={18} />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-px mb-4" />
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                        <span className="text-slate-400 block mb-1">کارخانگی</span>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{subject.homework_10}/10</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                        <span className="text-slate-400 block mb-1">فعالیت</span>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{subject.activity_10}/10</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                        <span className="text-slate-400 block mb-1">وسط سمستر</span>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{subject.midterm_20}/20</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                        <span className="text-slate-400 block mb-1">نهایی</span>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{subject.final_60}/60</span>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                      <span>حاضر: {subject.attendance}</span>
                      <span>غیرحاضر: {subject.absent}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
