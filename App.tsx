import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  BrainCircuit, 
  Send, 
  Menu, 
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Lightbulb,
  ArrowRight,
  Play,
  User,
  Check,
  X as XIcon,
  School,
  Link as LinkIcon,
  Plus,
  MapPin,
  Search,
  LogOut,
  Edit3,
  RefreshCw,
  Info,
  Lock,
  Mail,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { UserContext, Role, Language, ChatMessage } from './types';
import { generateAIResponse } from "./services/gemini";


// --- CONSTANTS ---
const REGIONS = [
  "Toshkent shahri",
  "Toshkent viloyati",
  "Andijon viloyati",
  "Buxoro viloyati",
  "Farg'ona viloyati",
  "Jizzax viloyati",
  "Xorazm viloyati",
  "Namangan viloyati",
  "Navoiy viloyati",
  "Qashqadaryo viloyati",
  "Samarqand viloyati",
  "Sirdaryo viloyati",
  "Surxondaryo viloyati",
  "Qoraqalpog'iston Respublikasi"
];

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  en: {
    welcome: "Welcome to Dialog.uz",
    selectRole: "Select your role",
    enterDetails: "Enter your details",
    firstName: "First Name",
    lastName: "Last Name",
    enterPlatform: "Enter Platform",
    student: "Student",
    teacher: "Teacher",
    parent: "Parent",
    language: "Language",
    hello: "Hello",
    readyToLearn: "Ready to learn something new today?",
    startChallenge: "Start Daily Challenge",
    progress: "My Learning Progress",
    analyze: "Analyze",
    streak: "Current Streak",
    tasksDone: "Tasks Done",
    recommended: "Recommended For You",
    dashboard: "Dashboard",
    generatePlan: "Generate Lesson Plan",
    classAvg: "Class Performance",
    attendance: "Attendance",
    pendingReviews: "Pending Reviews",
    atRisk: "At Risk",
    subjectPerf: "Subject Performance",
    aiInsights: "AI Insights",
    learningGap: "Learning Gap Detected",
    genExercise: "Generate Exercise",
    engagementAlert: "Engagement Alert",
    viewActivity: "View Activity",
    childProgress: "'s Progress",
    avgGrade: "Avg Grade",
    homework: "Homework",
    weeklyActivity: "Weekly Activity",
    aiRecs: "AI Recommendations",
    upcoming: "Upcoming",
    askSomething: "Ask something...",
    days: "Days",
    noData: "No data yet",
    correct: "Correct!",
    incorrect: "Try Again",
    region: "Region",
    selectRegion: "Select Region",
    schoolNum: "School Number",
    enterSchoolNum: "e.g. 42",
    class: "Class",
    enterClass: "Enter Class (1-4 only)",
    addClass: "Add Class",
    manageClasses: "Manage Classes",
    studentId: "Student ID",
    enterStudentId: "Enter Child's Student ID",
    findChild: "Find Child",
    childFound: "Child Linked Successfully",
    childNotFound: "Child Not Found",
    yourId: "Your Student ID",
    copy: "Copy",
    myStudents: "My Students",
    noClasses: "No classes added yet.",
    addClassPlaceholder: "e.g. 3-B",
    selectStudent: "Select a student to view details",
    noStudentsInClass: "No students registered in this class yet.",
    settings: "Settings",
    profile: "Profile",
    aboutApp: "About App",
    logout: "Logout",
    editProfile: "Edit Profile",
    save: "Save",
    age: "Age",
    refresh: "Refresh Data",
    aboutText: "Dialog.uz is an AI-powered educational platform designed for primary schools (Grades 1-4) to connect students, teachers, and parents.",
    email: "Email",
    password: "Password",
    login: "Login",
    register: "Register",
    haveAccount: "Already have an account?",
    needAccount: "Need an account?",
    invalidCreds: "Invalid email or password",
    emailExists: "Email already registered",
    invalidGrade: "Only grades 1-4 are supported.",
    selectGrade: "Select Grade",
    classLetter: "Letter",
    credentials: "Login Details"
  },
  uz: {
    welcome: "Dialog.uz ga xush kelibsiz",
    selectRole: "Rolingizni tanlang",
    enterDetails: "Ma'lumotlaringizni kiriting",
    firstName: "Ism",
    lastName: "Familiya",
    enterPlatform: "Kirish",
    student: "O'quvchi",
    teacher: "O'qituvchi",
    parent: "Ota-ona",
    language: "Til",
    hello: "Salom",
    readyToLearn: "Bugun yangi narsa o'rganamizmi?",
    startChallenge: "Kunlik vazifani boshlash",
    progress: "Mening natijalarim",
    analyze: "Tahlil qilish",
    streak: "Faollik davri",
    tasksDone: "To'g'ri javoblar",
    recommended: "Siz uchun tavsiyalar",
    dashboard: "Boshqaruv paneli",
    generatePlan: "Dars rejasini tuzish",
    classAvg: "Sinf ko'rsatkichlari",
    attendance: "Davomat",
    pendingReviews: "Tekshirish kutilmoqda",
    atRisk: "Xavf ostida",
    subjectPerf: "Fanlar bo'yicha ko'rsatkich",
    aiInsights: "AI Xulosalari",
    learningGap: "Bo'shliq aniqlandi",
    genExercise: "Mashq yaratish",
    engagementAlert: "Diqqat talab",
    viewActivity: "Mashg'ulotni ko'rish",
    childProgress: "ning natijalari",
    avgGrade: "O'rtacha baho",
    homework: "Uy vazifasi",
    weeklyActivity: "Haftalik faollik",
    aiRecs: "AI Tavsiyalari",
    upcoming: "Kelgusi",
    askSomething: "Savol bering...",
    days: "Kun",
    noData: "Ma'lumot yo'q",
    correct: "To'g'ri!",
    incorrect: "Xato",
    region: "Viloyat",
    selectRegion: "Viloyatni tanlang",
    schoolNum: "Maktab raqami",
    enterSchoolNum: "masalan, 42",
    class: "Sinf",
    enterClass: "Sinfni kiriting (faqat 1-4)",
    addClass: "Sinf qo'shish",
    manageClasses: "Sinflarni boshqarish",
    studentId: "O'quvchi ID raqami",
    enterStudentId: "Farzandingiz ID raqamini kiriting",
    findChild: "Farzandni topish",
    childFound: "Muvaffaqiyatli bog'landi",
    childNotFound: "O'quvchi topilmadi",
    yourId: "Sizning ID raqamingiz",
    copy: "Nusxalash",
    myStudents: "Mening o'quvchilarim",
    noClasses: "Hozircha sinflar yo'q.",
    addClassPlaceholder: "masalan, 3-B",
    selectStudent: "Tafsilotlarni ko'rish uchun o'quvchini tanlang",
    noStudentsInClass: "Bu sinfda hali o'quvchilar ro'yxatdan o'tmagan.",
    settings: "Sozlamalar",
    profile: "Profil",
    aboutApp: "Dastur haqida",
    logout: "Chiqish",
    editProfile: "Profilni tahrirlash",
    save: "Saqlash",
    age: "Yosh",
    refresh: "Yangilash",
    aboutText: "Dialog.uz - bu boshlang'ich sinflar (1-4) uchun mo'ljallangan, o'quvchi, o'qituvchi va ota-onalarni bog'lovchi ta'lim platformasi.",
    email: "Email",
    password: "Parol",
    login: "Kirish",
    register: "Ro'yxatdan o'tish",
    haveAccount: "Akkauntingiz bormi?",
    needAccount: "Ro'yxatdan o'tmaganmisiz?",
    invalidCreds: "Email yoki parol xato",
    emailExists: "Bu email allaqachon ro'yxatdan o'tgan",
    invalidGrade: "Faqat 1-4 sinflar qo'llab-quvvatlanadi.",
    selectGrade: "Sinfni tanlang",
    classLetter: "Harf",
    credentials: "Kirish ma'lumotlari"
  },
  ru: {
    welcome: "Добро пожаловать в Dialog.uz",
    selectRole: "Выберите роль",
    enterDetails: "Введите данные",
    firstName: "Имя",
    lastName: "Фамилия",
    enterPlatform: "Войти",
    student: "Ученик",
    teacher: "Учитель",
    parent: "Родитель",
    language: "Язык",
    hello: "Привет",
    readyToLearn: "Готов узнать что-то новое?",
    startChallenge: "Начать задание дня",
    progress: "Мой прогресс",
    analyze: "Анализировать",
    streak: "Серия активности",
    tasksDone: "Правильные ответы",
    recommended: "Рекомендовано для тебя",
    dashboard: "Панель управления",
    generatePlan: "Создать план урока",
    classAvg: "Показатели класса",
    attendance: "Посещаемость",
    pendingReviews: "Ожидают проверки",
    atRisk: "В зоне риска",
    subjectPerf: "Успеваемость по предметам",
    aiInsights: "AI Инсайты",
    learningGap: "Обнаружен пробел",
    genExercise: "Создать упражнение",
    engagementAlert: "Внимание",
    viewActivity: "Посмотреть активность",
    childProgress: ": Прогресс",
    avgGrade: "Ср. оценка",
    homework: "Дом. задание",
    weeklyActivity: "Недельная активность",
    aiRecs: "Рекомендации AI",
    upcoming: "Предстоящие",
    askSomething: "Спросите что-нибудь...",
    days: "Дней",
    noData: "Нет данных",
    correct: "Верно!",
    incorrect: "Ошибка",
    region: "Регион",
    selectRegion: "Выберите регион",
    schoolNum: "Номер школы",
    enterSchoolNum: "напр. 42",
    class: "Класс",
    enterClass: "Введите класс (только 1-4)",
    addClass: "Добавить класс",
    manageClasses: "Управление классами",
    studentId: "ID Ученика",
    enterStudentId: "Введите ID ребенка",
    findChild: "Найти ребенка",
    childFound: "Успешно связано",
    childNotFound: "Ученик не найден",
    yourId: "Ваш ID",
    copy: "Копировать",
    myStudents: "Мои ученики",
    noClasses: "Классы еще не добавлены.",
    addClassPlaceholder: "напр. 3-B",
    selectStudent: "Выберите ученика для просмотра",
    noStudentsInClass: "В этом классе пока нет учеников.",
    settings: "Настройки",
    profile: "Профиль",
    aboutApp: "О приложении",
    logout: "Выйти",
    editProfile: "Редактировать профиль",
    save: "Сохранить",
    age: "Возраст",
    refresh: "Обновить",
    aboutText: "Dialog.uz — это образовательная AI-платформа для начальной школы (1-4 классы).",
    email: "Email",
    password: "Пароль",
    login: "Войти",
    register: "Регистрация",
    haveAccount: "Уже есть аккаунт?",
    needAccount: "Нет аккаунта?",
    invalidCreds: "Неверный email или пароль",
    emailExists: "Email уже зарегистрирован",
    invalidGrade: "Поддерживаются только 1-4 классы.",
    selectGrade: "Выберите класс",
    classLetter: "Буква",
    credentials: "Данные для входа"
  }
};

// --- Empty Initial Data ---
const EMPTY_STUDENT_DATA = [
  { name: 'Mon', score: 0, focus: 0 },
  { name: 'Tue', score: 0, focus: 0 },
  { name: 'Wed', score: 0, focus: 0 },
  { name: 'Thu', score: 0, focus: 0 },
  { name: 'Fri', score: 0, focus: 0 },
];

interface Stats {
  streak: number;
  tasksDone: number;
  lastVisitDate: string;
  data: typeof EMPTY_STUDENT_DATA;
}

// --- Components ---

const LoginScreen: React.FC<{ 
  onLogin: (user: UserContext, stats: Stats) => void 
}> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState<Role>('student');
  const [lang, setLang] = useState<Language>('uz');
  
  // Auth Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // Role specific fields (Register only)
  const [region, setRegion] = useState('');
  const [schoolNum, setSchoolNum] = useState('');
  
  // New Creative Grade Selection
  const [gradeLevel, setGradeLevel] = useState<number | null>(null);
  const [classLetter, setClassLetter] = useState('');

  const [targetStudentId, setTargetStudentId] = useState('');
  
  const [error, setError] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [linkedChild, setLinkedChild] = useState<UserContext | null>(null);

  const t = TRANSLATIONS[lang];

  // Helper to generate a random ID
  const generateId = () => Math.random().toString(36).substr(2, 6).toUpperCase();

  const handleParentLink = () => {
    setIsLinking(true);
    const savedUsers = JSON.parse(localStorage.getItem('dialog_users_db') || '[]');
    const cleanId = targetStudentId.trim().toUpperCase();
    const foundChild = savedUsers.find((u: UserContext) => u.studentId === cleanId && u.role === 'student');
    
    setTimeout(() => {
      if (foundChild) {
        setLinkedChild(foundChild);
        setError('');
      } else {
        setError(t.childNotFound);
        setLinkedChild(null);
      }
      setIsLinking(false);
    }, 800);
  };

  const handleLoginSubmit = () => {
      const savedUsers = JSON.parse(localStorage.getItem('dialog_users_db') || '[]');
      const foundUser = savedUsers.find((u: UserContext) => 
        u.email === email && 
        u.password === password && 
        u.role === role 
      );
      
      if (foundUser) {
          let stats = { streak: 0, tasksDone: 0, lastVisitDate: '', data: EMPTY_STUDENT_DATA };
          if (foundUser.role === 'student' && foundUser.studentId) {
             const allStats = JSON.parse(localStorage.getItem('dialog_global_stats') || '{}');
             if (allStats[foundUser.studentId]) stats = allStats[foundUser.studentId];
          }
          onLogin(foundUser, stats);
      } else {
          setError(t.invalidCreds);
      }
  };

  const handleRegisterSubmit = () => {
    if (!email || !password || !firstName || !lastName) {
      setError(lang === 'uz' ? "Barcha maydonlarni to'ldiring" : "All fields required");
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem('dialog_users_db') || '[]');
    if (savedUsers.find((u: UserContext) => u.email === email)) {
        setError(t.emailExists);
        return;
    }

    const baseUser = {
      id: generateId(),
      email,
      password,
      role,
      language: lang,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
    };

    let fullUser: UserContext = { ...baseUser };
    const fullSchoolName = region && schoolNum ? `${region}, ${schoolNum}-maktab` : '';

    if (role === 'student') {
      if (!region || !schoolNum || !gradeLevel || !classLetter) { 
          setError(lang === 'uz' ? "Sinf ma'lumotlari to'liq emas" : "Class details missing"); 
          return; 
      }
      
      const fullClassName = `${gradeLevel}-${classLetter.toUpperCase()}`;

      fullUser = {
        ...fullUser,
        studentId: generateId(), 
        schoolName: fullSchoolName,
        className: fullClassName,
        grade: gradeLevel,
        age: 6 + gradeLevel, 
        subjects: ['Math', 'Reading', 'Science', 'English'],
      };
    } 
    else if (role === 'teacher') {
      if (!region || !schoolNum) { setError("Fields missing"); return; }
      fullUser = {
        ...fullUser,
        schoolName: fullSchoolName,
        age: 30, 
        classesTaught: [], 
        subjectsTaught: [], 
      };
    } 
    else if (role === 'parent') {
      if (!linkedChild) { setError(t.enterStudentId); return; }
      fullUser = {
        ...fullUser,
        childId: linkedChild.studentId,
        childName: linkedChild.name,
        childSchool: linkedChild.schoolName,
        childClass: linkedChild.className,
      };
    }

    const defaultStats: Stats = { streak: 0, tasksDone: 0, lastVisitDate: '', data: EMPTY_STUDENT_DATA };
    savedUsers.push(fullUser);
    localStorage.setItem('dialog_users_db', JSON.stringify(savedUsers));
    
    if (role === 'student') {
        const globalStats = JSON.parse(localStorage.getItem('dialog_global_stats') || '{}');
        globalStats[fullUser.studentId!] = defaultStats;
        localStorage.setItem('dialog_global_stats', JSON.stringify(globalStats));
    }

    onLogin(fullUser, defaultStats);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 transition-all">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BrainCircuit className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Dialog.uz AI</h1>
          <p className="text-slate-500 mt-2">{t.welcome}</p>
        </div>

        {/* Language & Toggle */}
        <div className="flex gap-2 justify-center mb-6">
            {(['uz', 'ru', 'en'] as Language[]).map((l) => (
            <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${lang === l ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {l}
            </button>
            ))}
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
            <button onClick={() => { setIsRegistering(false); setError(''); }} className={`flex-1 py-2 text-sm font-medium rounded-md ${!isRegistering ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>{t.login}</button>
            <button onClick={() => { setIsRegistering(true); setError(''); }} className={`flex-1 py-2 text-sm font-medium rounded-md ${isRegistering ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>{t.register}</button>
        </div>

        <div className="space-y-4">
          
          {/* Role Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">{t.selectRole}</label>
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-lg">
            {(['student', 'teacher', 'parent'] as Role[]).map((r) => (
                <button
                key={r}
                onClick={() => { setRole(r); setLinkedChild(null); }}
                className={`py-2 px-2 rounded-md text-xs font-medium capitalize transition-all ${role === r ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                >
                {t[r]}
                </button>
            ))}
            </div>
          </div>

          {/* LOGIN OR REGISTER: Common Fields */}
          <div className="space-y-3">
             <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">{t.email}</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
                    placeholder="name@example.com"
                    />
                </div>
             </div>
             <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">{t.password}</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
                    placeholder="••••••••"
                    />
                </div>
             </div>
          </div>

          {/* REGISTER ONLY FIELDS */}
          {isRegistering && (
             <div className="space-y-4 animate-in fade-in slide-in-from-top-2 border-t border-slate-100 pt-4">

                {/* Name */}
                <div className="flex gap-2">
                    <input type="text" placeholder={t.firstName} value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-1/2 px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-900" />
                    <input type="text" placeholder={t.lastName} value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-1/2 px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-900" />
                </div>

                {/* Role Specifics */}
                {(role === 'student' || role === 'teacher') && (
                    <div className="space-y-3">
                        <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-900">
                            <option value="">{t.selectRegion}</option>
                            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <div>
                            <input type="text" placeholder={t.schoolNum} value={schoolNum} onChange={(e) => setSchoolNum(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-900" />
                        </div>
                        
                        {/* CREATIVE GRADE SELECTION FOR STUDENTS */}
                        {role === 'student' && (
                             <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">{t.selectGrade}</label>
                                <div className="flex gap-2">
                                   {[1, 2, 3, 4].map(g => (
                                     <button
                                       key={g}
                                       onClick={() => setGradeLevel(g)}
                                       className={`flex-1 aspect-square rounded-xl font-bold text-lg flex items-center justify-center transition-all ${
                                          gradeLevel === g 
                                          ? 'bg-indigo-600 text-white shadow-lg scale-105' 
                                          : 'bg-white border-2 border-slate-200 text-slate-400 hover:border-indigo-300'
                                       }`}
                                     >
                                       {g}
                                     </button>
                                   ))}
                                   <div className="flex-1">
                                       <input 
                                         type="text" 
                                         placeholder={t.classLetter} 
                                         value={classLetter} 
                                         onChange={(e) => setClassLetter(e.target.value.toUpperCase())} 
                                         maxLength={1}
                                         className="w-full h-full text-center text-lg font-bold border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 bg-white text-slate-900 uppercase placeholder:text-sm placeholder:font-normal"
                                       />
                                   </div>
                                </div>
                             </div>
                        )}
                    </div>
                )}

                {role === 'parent' && (
                    <div className="space-y-2">
                         <div className="flex gap-2">
                            <input type="text" placeholder="Student ID (e.g. 5X9A2)" value={targetStudentId} onChange={(e) => setTargetStudentId(e.target.value)} className="flex-1 px-4 py-2 border border-slate-200 rounded-xl uppercase font-mono bg-white text-slate-900" />
                            <button onClick={handleParentLink} disabled={!targetStudentId || isLinking} className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl"><LinkIcon className="w-5 h-5"/></button>
                         </div>
                         {linkedChild && <div className="p-3 bg-emerald-50 text-emerald-900 text-sm font-bold rounded-lg flex items-center gap-2"><CheckCircle className="w-4 h-4"/> {linkedChild.name}</div>}
                    </div>
                )}
             </div>
          )}
          
          {error && <p className="text-red-500 text-xs text-center font-medium bg-red-50 p-2 rounded-lg">{error}</p>}

          <button
            onClick={isRegistering ? handleRegisterSubmit : handleLoginSubmit}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors mt-6 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
          >
            {isRegistering ? t.register : t.login} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- SETTINGS MODAL ---

interface SettingsModalProps {
  context: UserContext;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onUpdateProfile: (updatedContext: UserContext) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ context, isOpen, onClose, onLogout, onUpdateProfile }) => {
  const t = TRANSLATIONS[context.language];
  const [activeTab, setActiveTab] = useState<'profile' | 'about'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  
  // Edit States
  const [firstName, setFirstName] = useState(context.firstName);
  const [lastName, setLastName] = useState(context.lastName);
  const [age, setAge] = useState(context.age?.toString() || '');
  
  // For students - edit class
  const [gradeLevel, setGradeLevel] = useState<number | null>(null);
  const [classLetter, setClassLetter] = useState('');

  // Initial Data Load
  useEffect(() => {
    if (context.role === 'student' && context.className) {
        const parts = context.className.split('-');
        if (parts.length >= 1) setGradeLevel(parseInt(parts[0]) || null);
        if (parts.length >= 2) setClassLetter(parts[1]);
    }
  }, [context]);
  
  if (!isOpen) return null;

  const handleSave = () => {
    let finalClassName = context.className;
    
    // Construct class name if student
    if (context.role === 'student') {
        if (gradeLevel && classLetter) {
            finalClassName = `${gradeLevel}-${classLetter.toUpperCase()}`;
        }
    }

    const updatedUser: UserContext = {
       ...context,
       firstName,
       lastName,
       name: `${firstName} ${lastName}`,
       age: parseInt(age) || context.age,
       className: finalClassName
    };
    onUpdateProfile(updatedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" /> {t.settings}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'profile' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}
          >
            {t.profile}
          </button>
          <button 
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'about' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}
          >
            {t.aboutApp}
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'profile' ? (
            <div className="space-y-4">
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600">
                    {firstName[0]}
                 </div>
                 <div>
                   <p className="font-bold text-slate-800">{context.name}</p>
                   <p className="text-xs text-slate-500 capitalize">{t[context.role]}</p>
                   {context.role === 'student' && <p className="text-xs text-indigo-500 font-mono mt-1">ID: {context.studentId}</p>}
                 </div>
               </div>
               
               {/* CREDENTIALS SECTION */}
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                   <h4 className="text-xs font-bold text-slate-400 uppercase">{t.credentials}</h4>
                   <div>
                       <label className="text-xs text-slate-500 block mb-1">{t.email}</label>
                       <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-white px-3 py-2 rounded-lg border border-slate-200">
                           <Mail className="w-4 h-4 text-slate-400" /> {context.email}
                       </div>
                   </div>
                   <div>
                       <label className="text-xs text-slate-500 block mb-1">{t.password}</label>
                       <div className="flex items-center gap-2 relative">
                           <input 
                             type={showPassword ? "text" : "password"} 
                             value={context.password} 
                             readOnly 
                             className="w-full text-sm font-medium text-slate-700 bg-white px-3 py-2 pl-9 rounded-lg border border-slate-200 focus:outline-none"
                           />
                           <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
                           <button 
                             onClick={() => setShowPassword(!showPassword)}
                             className="absolute right-3 text-slate-400 hover:text-indigo-600"
                           >
                               {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                           </button>
                       </div>
                   </div>
               </div>

               <div className="space-y-3 border-t border-slate-100 pt-3">
                 <div className="flex gap-2">
                   <div className="flex-1">
                     <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">{t.firstName}</label>
                     <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-900" />
                   </div>
                   <div className="flex-1">
                     <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">{t.lastName}</label>
                     <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-900" />
                   </div>
                 </div>

                 {/* Age and Class Inputs */}
                 <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">{t.age}</label>
                        <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-900" />
                    </div>
                 </div>
                 
                 {/* CREATIVE GRADE SELECTOR IN SETTINGS (For Student) */}
                 {context.role === 'student' && (
                     <div className="space-y-1 pt-2">
                        <label className="text-xs text-slate-500 font-bold uppercase block">{t.class}</label>
                        <div className="flex gap-2">
                           {[1, 2, 3, 4].map(g => (
                             <button
                               key={g}
                               onClick={() => setGradeLevel(g)}
                               className={`flex-1 aspect-square rounded-xl font-bold text-lg flex items-center justify-center transition-all ${
                                  gradeLevel === g 
                                  ? 'bg-indigo-600 text-white shadow-lg scale-105' 
                                  : 'bg-white border-2 border-slate-200 text-slate-400 hover:border-indigo-300'
                               }`}
                             >
                               {g}
                             </button>
                           ))}
                           <div className="flex-1">
                               <input 
                                 type="text" 
                                 placeholder={t.classLetter} 
                                 value={classLetter} 
                                 onChange={(e) => setClassLetter(e.target.value.toUpperCase())} 
                                 maxLength={1}
                                 className="w-full h-full text-center text-lg font-bold border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 bg-white text-slate-900 uppercase placeholder:text-sm placeholder:font-normal"
                               />
                           </div>
                        </div>
                     </div>
                 )}
               </div>

               <button onClick={handleSave} className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold mt-4 flex items-center justify-center gap-2 hover:bg-indigo-700">
                 <Check className="w-4 h-4" /> {t.save}
               </button>

               <button onClick={onLogout} className="w-full border border-red-200 text-red-600 py-2 rounded-xl font-semibold mt-2 flex items-center justify-center gap-2 hover:bg-red-50">
                 <LogOut className="w-4 h-4" /> {t.logout}
               </button>
            </div>
          ) : (
            <div className="text-center space-y-4">
               <BrainCircuit className="w-12 h-12 text-indigo-600 mx-auto" />
               <h3 className="font-bold text-xl">Dialog.uz AI</h3>
               <p className="text-sm text-slate-500 leading-relaxed">
                 {t.aboutText}
               </p>
               <div className="text-xs text-slate-400 mt-8">
                 Version 1.0.0 • Primary School Edition
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ... ChatWidget, Header, StudentDashboard, TeacherDashboard (Same as before) ...
// Including them simplified or as is to maintain file integrity

interface ChatWidgetProps {
    context: UserContext;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    messages: ChatMessage[];
    isLoading: boolean;
    onSendMessage: (message: string) => void;
  }
  
  const ChatWidget: React.FC<ChatWidgetProps> = ({ 
    context, 
    isOpen, 
    setIsOpen, 
    messages, 
    isLoading, 
    onSendMessage 
  }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const t = TRANSLATIONS[context.language];
  
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
  
    useEffect(scrollToBottom, [messages, isOpen]);
  
    const handleSend = () => {
      if (!input.trim() || isLoading) return;
      onSendMessage(input);
      setInput('');
    };
  
    if (!isOpen) {
      return (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-all z-50 hover:scale-105"
        >
          <MessageSquare className="w-7 h-7" />
        </button>
      );
    }
  
    return (
      <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-slate-200">
        <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5" />
            <span className="font-semibold font-display">Dialog.uz AI</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-500 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
  
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg) => {
            const isCorrect = msg.text.startsWith('[CORRECT]');
            const isIncorrect = msg.text.startsWith('[INCORRECT]');
            
            const displayText = msg.text
              .replace('[CORRECT]', '')
              .replace('[INCORRECT]', '')
              .trim();
  
            return (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex flex-col gap-1 max-w-[80%]">
                   {(isCorrect || isIncorrect) && (
                     <div className={`text-xs font-bold uppercase flex items-center gap-1 ${isCorrect ? 'text-emerald-600' : 'text-red-500'}`}>
                        {isCorrect ? <Check className="w-3 h-3"/> : <XIcon className="w-3 h-3"/>}
                        {isCorrect ? t.correct : t.incorrect}
                     </div>
                   )}
                  <div
                    className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                    } ${isCorrect ? 'border-emerald-200 bg-emerald-50' : ''} ${isIncorrect ? 'border-red-100 bg-red-50' : ''}`}
                  >
                    {displayText}
                  </div>
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-100 flex gap-1">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
  
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.askSomething}
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

const Header: React.FC<{ context: UserContext; onOpenSettings: () => void }> = ({ context, onOpenSettings }) => {
    const t = TRANSLATIONS[context.language];
    const displaySchool = context.schoolName || context.childSchool;
    const displayClass = context.className || context.childClass;
  
    return (
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-slate-800 font-display hidden sm:block">Dialog.uz</span>
        </div>
        <div className="flex items-center gap-4">
          {displaySchool && (
             <div className="hidden md:flex flex-col items-end mr-4 border-r border-slate-100 pr-4">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1 text-right">
                 <School className="w-3 h-3" /> {displaySchool}
               </span>
               {displayClass && <span className="text-sm font-semibold text-slate-700">{displayClass}</span>}
             </div>
          )}
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-800">{context.name}</span>
            <span className="text-xs text-slate-500 capitalize">{t[context.role]}</span>
          </div>
          <button onClick={onOpenSettings} className="w-10 h-10 bg-slate-100 rounded-full overflow-hidden border border-slate-200 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
             <User className="w-6 h-6 text-slate-900" />
          </button>
        </div>
      </header>
    );
  };

const StudentDashboard: React.FC<{ 
  context: UserContext; 
  onTriggerChat: (msg: string) => void;
  stats: Stats;
}> = ({ context, onTriggerChat, stats }) => {
  const t = TRANSLATIONS[context.language];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg group">
        <div className="relative z-10">
          <h2 className="text-3xl font-display font-bold mb-2">{t.hello}, {context.firstName}! 🚀</h2>
          <p className="text-blue-100 mb-6">{t.readyToLearn}</p>
          <button 
            onClick={() => onTriggerChat(context.language === 'uz' ? "Bugungi kunlik vazifamni bajarishga tayyorman. Birinchi topshiriq nima?" : "I'm ready for my daily challenge! What is the first interactive task?")}
            className="bg-white text-indigo-600 px-6 py-2 rounded-full font-bold shadow-md hover:scale-105 transition-transform flex items-center gap-2"
          >
            {t.startChallenge} <Play className="w-4 h-4 fill-indigo-600" />
          </button>
        </div>
        <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-10 translate-y-10 group-hover:scale-110 transition-transform duration-700">
          <BookOpen className="w-64 h-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" /> {t.progress}
            </h3>
            <button 
              onClick={() => onTriggerChat("Analyze my progress")}
              className="text-xs text-indigo-600 font-bold hover:underline"
            >
              {t.analyze}
            </button>
          </div>
          <div className="h-64 w-full relative">
            {stats.tasksDone === 0 && stats.streak === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-lg">
                  <p className="text-slate-400 font-medium">{t.noData}</p>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="focus" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats & Streak & ID */}
        <div className="space-y-6">
          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
             <p className="text-xs text-indigo-600 font-bold uppercase mb-1">{t.yourId}</p>
             <div className="flex items-center justify-between">
                <code className="text-2xl font-mono font-bold text-indigo-900 bg-white px-2 py-1 rounded border border-indigo-200">{context.studentId}</code>
                <button 
                  onClick={() => navigator.clipboard.writeText(context.studentId || '')}
                  className="text-indigo-500 hover:text-indigo-700 text-xs font-semibold"
                >
                  {t.copy}
                </button>
             </div>
             <p className="text-[10px] text-indigo-400 mt-2">Share this with your parent to link accounts.</p>
          </div>

          <div className={`bg-orange-50 p-6 rounded-2xl border border-orange-100 ${stats.streak === 0 ? 'opacity-75' : ''}`}>
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">{t.streak}</p>
                <h4 className="text-2xl font-bold text-slate-800">{stats.streak} {t.days} 🔥</h4>
              </div>
            </div>
          </div>
          
          <div className={`bg-emerald-50 p-6 rounded-2xl border border-emerald-100 ${stats.tasksDone === 0 ? 'opacity-75' : ''}`}>
             <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">{t.tasksDone}</p>
                <h4 className="text-2xl font-bold text-slate-800">{stats.tasksDone}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeacherDashboard: React.FC<{ 
  context: UserContext; 
  onTriggerChat: (msg: string) => void;
  onAddClass: (newClass: string) => void;
}> = ({ context, onTriggerChat, onAddClass }) => {
  const t = TRANSLATIONS[context.language];
  const [selectedClass, setSelectedClass] = useState(context.classesTaught?.[0] || '');
  const [newClassInput, setNewClassInput] = useState('');
  const [showAddClass, setShowAddClass] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // State for students list
  const [studentsInClass, setStudentsInClass] = useState<UserContext[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedStudentStats, setSelectedStudentStats] = useState<Stats | null>(null);

  // Fetch students when class is selected
  useEffect(() => {
     if (!selectedClass) return;
     
     const allUsers = JSON.parse(localStorage.getItem('dialog_users_db') || '[]');
     // STRICT FILTERING: Must match School String exactly and Class Name
     const students = allUsers.filter((u: UserContext) => 
        u.role === 'student' && 
        u.schoolName === context.schoolName && 
        u.className === selectedClass
     );
     setStudentsInClass(students);
     setSelectedStudentId(null);
     setSelectedStudentStats(null);
  }, [selectedClass, context.schoolName, refreshKey]);

  // Fetch stats when student is selected
  useEffect(() => {
     if (!selectedStudentId) return;
     
     const allStats = JSON.parse(localStorage.getItem('dialog_global_stats') || '{}');
     const stats = allStats[selectedStudentId];
     if (stats) {
         setSelectedStudentStats(stats);
     } else {
         // Default empty stats if none found
         setSelectedStudentStats({
            streak: 0, 
            tasksDone: 0, 
            lastVisitDate: '', 
            data: EMPTY_STUDENT_DATA
         });
     }
  }, [selectedStudentId, refreshKey]);

  const handleAddClass = () => {
    if (newClassInput.trim()) {
        const upperClass = newClassInput.trim().toUpperCase();
        onAddClass(upperClass);
        setSelectedClass(upperClass);
        setNewClassInput('');
        setShowAddClass(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const hasData = selectedStudentStats && selectedStudentStats.tasksDone > 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header & Class Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t.dashboard}</h2>
          <div className="flex items-center gap-2 mt-1">
             <School className="w-4 h-4 text-slate-400" />
             <p className="text-slate-500">{context.schoolName}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
          <button onClick={handleRefresh} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600" title={t.refresh}>
             <RefreshCw className="w-4 h-4" />
          </button>
          
          {(context.classesTaught && context.classesTaught.length > 0) ? (
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {context.classesTaught?.map(c => <option key={c} value={c}>{t.class} {c}</option>)}
            </select>
          ) : (
            <span className="text-sm text-slate-400 italic">{t.noClasses}</span>
          )}

          {showAddClass ? (
            <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newClassInput}
                  onChange={(e) => setNewClassInput(e.target.value)}
                  placeholder={t.addClassPlaceholder}
                  className="w-24 px-2 py-1 border border-slate-200 rounded text-sm text-slate-900 bg-white"
                  autoFocus
                />
                <button onClick={handleAddClass} className="bg-indigo-600 text-white px-2 py-1 rounded text-sm hover:bg-indigo-700"><Check className="w-4 h-4"/></button>
                <button onClick={() => setShowAddClass(false)} className="bg-slate-200 text-slate-600 px-2 py-1 rounded text-sm hover:bg-slate-300"><XIcon className="w-4 h-4"/></button>
            </div>
          ) : (
             <button onClick={() => setShowAddClass(true)} className="flex items-center gap-1 text-sm text-indigo-600 font-bold hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors border border-indigo-100">
                <Plus className="w-4 h-4" /> {t.addClass}
             </button>
          )}

          <button 
            disabled={!selectedClass}
            onClick={() => onTriggerChat(context.language === 'uz' ? `Matematika ${selectedClass}-sinf uchun haftalik dars rejasi tuzing.` : `Draft a lesson plan for Class ${selectedClass}.`)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <BookOpen className="w-4 h-4" /> {t.generatePlan}
          </button>
        </div>
      </div>

      {/* Roster & Student Selection */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
         <h4 className="text-sm font-bold text-slate-600 uppercase mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" /> {t.myStudents} ({studentsInClass.length})
         </h4>
         
         {studentsInClass.length > 0 ? (
             <div className="flex flex-wrap gap-3">
                 {studentsInClass.map(student => (
                     <button
                        key={student.studentId}
                        onClick={() => setSelectedStudentId(student.studentId!)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 ${
                            selectedStudentId === student.studentId
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-white'
                        }`}
                     >
                        <User className="w-4 h-4" />
                        {student.name}
                     </button>
                 ))}
             </div>
         ) : (
            <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                {t.noStudentsInClass}
            </div>
         )}
      </div>

      {/* Selected Student Stats */}
      {selectedStudentId && selectedStudentStats ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8">
              <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                  {studentsInClass.find(s => s.studentId === selectedStudentId)?.name} Statistics
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                { label: t.tasksDone, val: selectedStudentStats.tasksDone, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" }, 
                { label: t.streak, val: `${selectedStudentStats.streak} Days`, icon: Lightbulb, color: "text-orange-600 bg-orange-50" },
                ].map((stat, i) => (
                <div key={i} className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4`}>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                    <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                    <h4 className="text-xl font-bold text-slate-800">{stat.val}</h4>
                    </div>
                </div>
                ))}
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hasData ? selectedStudentStats.data : EMPTY_STUDENT_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
              </div>
          </div>
      ) : (
          <div className="text-center py-12 text-slate-400">
              {studentsInClass.length > 0 ? t.selectStudent : ''}
          </div>
      )}
    </div>
  );
};

const ParentDashboard: React.FC<{ 
    context: UserContext; 
    onTriggerChat: (msg: string) => void;
}> = ({ context, onTriggerChat }) => {
  const t = TRANSLATIONS[context.language];
  const childName = context.childName || "Child";
  const [childStats, setChildStats] = useState<Stats | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Logic: Fetch the child's real stats from global storage
  useEffect(() => {
    if (context.childId) {
        const allStats = JSON.parse(localStorage.getItem('dialog_global_stats') || '{}');
        const found = allStats[context.childId];
        if (found) {
            setChildStats(found);
        }
    }
  }, [context.childId, refreshKey]);

  // Dynamic Calculations
  const hasData = childStats && childStats.tasksDone > 0;
  
  const avgGrade = useMemo(() => {
     if (!childStats || childStats.tasksDone === 0) return 0;
     const scores = childStats.data.map(d => d.score).filter(s => s > 0);
     if (scores.length === 0) return 0;
     return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [childStats]);

  const homeworkRate = useMemo(() => {
      if (!childStats) return 0;
      // Simple logic: 5 tasks = 100% completion for the week goal
      return Math.min(100, childStats.tasksDone * 20);
  }, [childStats]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center border-2 border-indigo-100">
               <span className="text-2xl font-bold text-slate-500">{childName[0]}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{childName}{t.childProgress}</h2>
              <p className="text-slate-500 flex items-center gap-2">
                 <School className="w-4 h-4" /> {context.childSchool} • {context.childClass}
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
             <button onClick={() => setRefreshKey(prev => prev+1)} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600" title={t.refresh}>
                <RefreshCw className="w-4 h-4" />
             </button>
             <div className="text-right px-4 border-r border-slate-100">
               <p className="text-xs text-slate-500 uppercase">{t.avgGrade}</p>
               <p className="font-bold text-lg text-slate-900">{avgGrade > 0 ? `${avgGrade}%` : "-"}</p>
             </div>
             <div className="text-right px-4">
               <p className="text-xs text-slate-500 uppercase">{t.homework}</p>
               <p className="font-bold text-lg text-slate-900">{homeworkRate > 0 ? `${homeworkRate}%` : "0%"}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-6">{t.weeklyActivity}</h3>
            <div className="h-64 relative">
              {!hasData && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-lg">
                    <p className="text-slate-400 font-medium">{t.noData}</p>
                </div>
              )}
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hasData ? childStats!.data : EMPTY_STUDENT_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" name="Grades" stroke="#4f46e5" strokeWidth={3} />
                  <Line type="monotone" dataKey="focus" name="Focus Time (min)" stroke="#cbd5e1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
               <BrainCircuit className="w-5 h-5 text-indigo-600" /> {t.aiRecs}
             </h3>
             <ul className="space-y-4">
                <p className="text-sm text-slate-500 italic text-center py-4">
                    {hasData 
                     ? (context.language === 'uz' ? "Farzandingiz faol! Yana 10 daqiqa o'qish tavsiya etiladi." : "Your child is active! 10 mins more reading recommended.")
                     : (context.language === 'uz' ? "Tavsiyalar olish uchun farzandingiz faol bo'lishi kerak." : "Waiting for child activity to generate recommendations.")}
                </p>
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserContext | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Current session stats (only relevant if role is student)
  const [myStats, setMyStats] = useState<Stats>({
    streak: 0,
    tasksDone: 0,
    lastVisitDate: '',
    data: EMPTY_STUDENT_DATA
  });

  // Load persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('dialog_user');
    if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        
        if (parsedUser.role === 'student' && parsedUser.studentId) {
            const allStats = JSON.parse(localStorage.getItem('dialog_global_stats') || '{}');
            if (allStats[parsedUser.studentId]) {
                setMyStats(allStats[parsedUser.studentId]);
            }
        }
    }
  }, []);

  const handleLogin = (newUser: UserContext, initialStats: Stats) => {
    localStorage.setItem('dialog_user', JSON.stringify(newUser));
    setUser(newUser);
    setMyStats(initialStats);

    const greeting: ChatMessage = {
      id: 'init',
      role: 'model',
      text: newUser.language === 'uz' 
        ? `Salom, ${newUser.firstName}! Men Dialog.uz AI yordamchisiman. Bugun nimani o'rganamiz?`
        : `Hello, ${newUser.firstName}! I am Dialog.uz AI assistant. What shall we learn today?`,
      timestamp: new Date()
    };
    setMessages([greeting]);
  };

  const handleLogout = () => {
    localStorage.removeItem('dialog_user');
    setUser(null);
    setMessages([]);
    setChatOpen(false);
    setSettingsOpen(false);
  };

  const handleUpdateProfile = (updatedUser: UserContext) => {
    setUser(updatedUser);
    localStorage.setItem('dialog_user', JSON.stringify(updatedUser));
    
    // Also update in global DB
    const allUsers = JSON.parse(localStorage.getItem('dialog_users_db') || '[]');
    const idx = allUsers.findIndex((u: UserContext) => u.id === updatedUser.id);
    if (idx !== -1) {
        allUsers[idx] = updatedUser;
        localStorage.setItem('dialog_users_db', JSON.stringify(allUsers));
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!user) return;
    
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    const responseText = await generateAIResponse(text, user, history);

    const newAiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newAiMsg]);
    setIsLoading(false);

    // Strict Stats update logic for STUDENT
    // Fix: Write to Local Storage IMMEDIATELY for parents/teachers to see
    if (user.role === 'student' && responseText.includes('[CORRECT]')) {
       setMyStats(prev => {
           const currentDayIndex = 4; // Mock Fri
           const newData = [...prev.data];
           const currentDay = newData[currentDayIndex];
           
           newData[currentDayIndex] = {
               ...currentDay,
               score: Math.min(100, currentDay.score + 10) 
           };

           const newStats = {
               ...prev,
               tasksDone: prev.tasksDone + 1,
               data: newData
           };
           
           // SAVE TO GLOBAL DB IMMEDIATELY
           if (user.studentId) {
             const allStats = JSON.parse(localStorage.getItem('dialog_global_stats') || '{}');
             allStats[user.studentId] = newStats;
             localStorage.setItem('dialog_global_stats', JSON.stringify(allStats));
           }

           return newStats;
       });
    }
  };
  
  const handleTeacherAddClass = (newClass: string) => {
     if (user && user.role === 'teacher') {
         const updatedUser = { 
             ...user, 
             classesTaught: [...(user.classesTaught || []), newClass] 
         };
         handleUpdateProfile(updatedUser);
     }
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header context={user} onOpenSettings={() => setSettingsOpen(true)} />
      
      {user.role === 'student' && (
        <StudentDashboard 
           context={user} 
           onTriggerChat={(msg) => { setChatOpen(true); handleSendMessage(msg); }}
           stats={myStats}
        />
      )}

      {user.role === 'teacher' && (
        <TeacherDashboard 
           context={user} 
           onTriggerChat={(msg) => { setChatOpen(true); handleSendMessage(msg); }}
           onAddClass={handleTeacherAddClass}
        />
      )}

      {user.role === 'parent' && (
        <ParentDashboard 
           context={user} 
           onTriggerChat={(msg) => { setChatOpen(true); handleSendMessage(msg); }}
        />
      )}

      <ChatWidget 
        context={user}
        isOpen={chatOpen}
        setIsOpen={setChatOpen}
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />

      <SettingsModal 
        context={user}
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onLogout={handleLogout}
        onUpdateProfile={handleUpdateProfile}
      />
    </div>
  );
};

export default App;