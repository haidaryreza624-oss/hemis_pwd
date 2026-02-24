import React from 'react';
import { motion } from 'motion/react';
import { useSettings, getPrimaryColor, getLightBg } from '../context/SettingsContext';
import { Info, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function About() {
    const { color } = useSettings();
    const navigate = useNavigate();

    const aboutText = `این اپلیکیشن یک پروژه‌ی مستقل است و هیچ‌گونه ارتباط، تأیید یا وابستگی رسمی با وب‌سایت‌ها یا سرویس‌های شخص ثالثی که ممکن است اطلاعات آن‌ها در اپ نمایش داده شود، ندارد.

اطلاعات نمایش‌داده‌شده در این اپلیکیشن صرفاً شامل داده‌های عمومی و در دسترس همگان است و فقط با هدف اطلاع‌رسانی و استفاده آموزشی ارائه می‌شود. این اپلیکیشن هیچ‌گونه ادعایی نسبت به مالکیت محتوای اشخاص ثالث، از جمله داده‌ها، نام‌ها، علائم تجاری یا لوگوها ندارد و کلیه حقوق مربوطه متعلق به صاحبان اصلی آن‌هاست.

ما تلاش می‌کنیم به منبع اصلی احترام بگذاریم و قصد جایگزینی، بازنشر گسترده یا ایجاد اختلال در خدمات وب‌سایت‌های اصلی را نداریم. هیچ‌گونه محتوای خصوصی، پولی یا محدودشده برای کاربران از طریق این اپلیکیشن دریافت یا نمایش داده نمی‌شود.

در صورتی که شما مالک محتوا یا گرداننده‌ی وب‌سایتی هستید و نسبت به نحوه استفاده از اطلاعات در این اپلیکیشن نگرانی یا اعتراضی دارید، لطفاً از طریق راه‌های ارتباطی زیر با ما تماس بگیرید تا در اسرع وقت موضوع بررسی شده و در صورت لزوم، اصلاح یا حذف محتوا انجام شود.`;

    return (
        <div className="p-4 pb-24">
            <div className="mb-4">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                    <ChevronLeft className="text-slate-600 dark:text-slate-300" />
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className={`bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700`}
            >
                <div className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-16 h-16 rounded-full ${getLightBg(color)} mb-3`}>
                        <Info size={24} className={getPrimaryColor(color)} />
                    </div>

                    <h3 className="text-center text-lg font-bold text-slate-800 dark:text-white mb-2">درباره</h3>

                    <hr className="w-full my-3 border-slate-100 dark:border-slate-700" />

                    <div className="text-right text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
                        {aboutText}

                        <div className="mt-4">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">راه ارتباطی:</div>
                            <a href="mailto:haidaryreza624@gmail.com" className={`${getPrimaryColor(color)} font-semibold text-sm`}>haidaryreza624@gmail.com</a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
