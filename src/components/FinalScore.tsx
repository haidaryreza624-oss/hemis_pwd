import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { apiGet } from '../api/api';
import { ChevronDown, ChevronUp, Award } from 'lucide-react';
import { useSettings, getPrimaryColor, getLightBg } from '../context/SettingsContext';

interface Subject {
  number: number;
  name: string;
  year: string;
  first_chance: number | null;
  second_chance: number | null;
  third_chance: number | null;
  fourth_chance: number | null;
  credits: number;
  pass_score: number;
  pass_chance: number;
  weighted_score: number;
}

interface SemesterResult {
  year: string;
  semester: number;
  result_metric: number;
  grade: string;
  passed: string;
  semester_promotion: string;
  semester_credits: number;
  passed_credits: number;
}

interface Semester {
  semester_number: number;
  subjects: Subject[];
  semester_result: SemesterResult | null;
}

interface FinalScoreResponse {
  semesters: Semester[];
  final_result: {
    subjects_count: number;
    total_credits: number;
    total_score: number;
    average_score: number;
    passed_semesters: number;
  };
}

export default function FinalScore() {
  const [data, setData] = useState<FinalScoreResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const { color } = useSettings();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiGet('/final-score') as unknown as FinalScoreResponse;
        setData(result);
        // Select the last semester by default
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

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse w-full mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data) return <div className="p-4 text-center text-slate-500 dark:text-slate-400">داده‌ای موجود نیست</div>;

  const currentSemester = data.semesters.find(s => s.semester_number === selectedSemester);

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">نتایج نهایی</h2>
        <div className={`${getLightBg(color)} dark:bg-slate-800 ${getPrimaryColor(color)} px-3 py-1 rounded-full text-xs font-bold`}>
          میانگین کل: {data.final_result.average_score}
        </div>
      </div>

      {/* Semester Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
        {data.semesters.map((semester) => (
          <button
            key={semester.semester_number}
            onClick={() => setSelectedSemester(semester.semester_number)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${selectedSemester === semester.semester_number
              ? `${getPrimaryColor(color).replace('text-', 'bg-')} text-white shadow-md`
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700'
              }`}
          >
            سمستر {semester.semester_number}
          </button>
        ))}
      </div>

      {currentSemester && (
        <motion.div
          key={currentSemester.semester_number}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
        >
          <div className="p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className={`bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm ${getPrimaryColor(color)}`}>
                <Award size={20} />
              </div>
              <div className="text-right">
                <h3 className="font-bold text-slate-800 dark:text-white">سمستر {currentSemester.semester_number}</h3>
                {currentSemester.semester_result && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    درجه: {currentSemester.semester_result.grade} • {currentSemester.semester_result.result_metric}%
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-50 dark:divide-slate-700">
            {currentSemester.subjects.map((subject) => (
              <div key={subject.number} className="p-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex-1 pl-4">
                  <h4 className="font-medium text-slate-800 dark:text-slate-200 text-sm">{subject.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">کریدیت: {subject.credits}</p>
                </div>
                <div className="text-left">
                  <span className={`text-lg font-bold ${(subject.pass_score || 0) >= 90 ? 'text-emerald-500' :
                    (subject.pass_score || 0) >= 80 ? 'text-blue-500' :
                      (subject.pass_score || 0) >= 70 ? 'text-amber-500' : 'text-red-500'
                    }`}>
                    {subject.pass_score}
                  </span>
                </div>
              </div>
            ))}
            {currentSemester.semester_result && (
              <div className={`p-4 ${getLightBg(color)} dark:bg-slate-700/30 bg-opacity-50 text-xs text-slate-600 dark:text-slate-300 flex justify-between`}>
                <span>مجموع کریدیت: {currentSemester.semester_result.semester_credits}</span>
                <span>کامیاب: {currentSemester.semester_result.passed}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
