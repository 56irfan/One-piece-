import { useState, useEffect, useRef } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

// ── FIREBASE INITIALIZATION ──
const firebaseConfig = {
  apiKey: "AIzaSyA1APVkDwnBQjmj6VBOfPFb036d8KEqDdc",
  authDomain: "arise-app-c49a3.firebaseapp.com",
  databaseURL: "https://arise-app-c49a3-default-rtdb.firebaseio.com",
  projectId: "arise-app-c49a3",
  storageBucket: "arise-app-c49a3.firebasestorage.app",
  messagingSenderId: "890346357822",
  appId: "1:890346357822:web:56b278c74348c63df3fd6f"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.database();

// ── BILINGUAL CORE TRANSLATIONS ──
const TRANS = {
  en: {
    selectLanguage: "SELECT YOUR LANGUAGE",
    morningCrew: "⚓ PIRATE CREW",
    crewRegistration: "◈ CREW REGISTRATION",
    grandLineJourney: "Start your journey in the Grand Line. Sign in with Google below.",
    googleLogin: "Sign in with Google",
    securedSystem: "SECURED BY THE PIRATE KING'S DATABASE",
    welcomeCaptain: "Welcome, Captain!",
    startFitness: "Start your fitness journey today.",
    newCrew: "New Crew",
    newCrewSub: "First time voyage",
    oldCaptain: "Old Captain",
    oldCaptainSub: "Already have an account",
    chooseChar: "Choose Your Character",
    chooseCharSub: "Select your visual identity",
    chooseGoal: "Choose Your Goal",
    chooseGoalSub: "What is your main target?",
    loseWeight: "Lose Weight",
    loseWeightSub: "Burn fat",
    buildMuscle: "Build Muscle",
    buildMuscleSub: "Increase strength",
    stayFit: "Stay Fit",
    stayFitSub: "Maintain endurance",
    choosePart: "Choose Body Part",
    choosePartSub: "Where should we train?",
    fullBody: "Full Body",
    arms: "Arms",
    chest: "Chest",
    abs: "Abs",
    legs: "Legs",
    pirateName: "Your Pirate Name",
    pirateNameSub: "This will be your legend identity",
    pirateNamePlaceholder: "Captain name...",
    bodyInfoTitle: "Your Body Info",
    bodyInfoSub: "Enter parameters to configure your Haki strength",
    ageLabel: "AGE",
    weightLabel: "WEIGHT (KG)",
    heightLabel: "HEIGHT",
    feet: "Feet",
    inches: "Inches",
    saveProgressTitle: "Save Your Progress",
    saveProgressSub: "Backup your voyage statistics in the cloud.",
    saveProgressDesc: "Connect your real Google Account so you never lose your workout log.",
    continueGoogle: "Continue with Google",
    skipGuest: "Skip for now (Guest Mode)",
    home: "HOME",
    quests: "QUESTS",
    body: "BODY",
    crew: "CREW",
    todayVoyage: "TODAY'S VOYAGE",
    totalDone: "Total Done",
    levelUp: "NAKAMA UP!",
    levelUpSub: "You reached a new level!",
    bossChallenges: "⚔️ BOSS BATTLES",
    bossSub: "Extreme custom achievements to secure huge bounty XP!",
    lockTerminal: "This objective is locked",
    weightHistory: "⚓ WEIGHT HISTORY",
    targetAnalysis: "🏴‍☠️ TARGET ANALYSIS",
    idealRange: "Ideal Weight Range",
    currentStatus: "Current Status",
    diffIdeal: "Difference",
    logTodayWeight: "+ LOG TODAY'S WEIGHT",
    hakiAttributes: "⚔️ HAKI ATTRIBUTES",
    allAchievements: "ACHIEVEMENTS",
    leaderboardTitle: "LEADERBOARD",
    contactSupport: "📞 SUPPORT CONTACT",
    accountActions: "⚓ ACCOUNT",
    settings: "Settings",
    logout: "🚪 LOGOUT",
    deleteAccount: "🗑️ DELETE ACCOUNT",
    saveSuccess: "Workout log synchronized",
    confirmDelete: "Are you sure? This will delete all your character progress permanently from the database."
  },
  bn: {
    selectLanguage: "ভাষা বেছে নাও",
    morningCrew: "⚓ পাইরেট ক্রু",
    crewRegistration: "◈ ক্রু রেজিস্ট্রেশন",
    grandLineJourney: "Grand Line-এ যাত্রা শুরু করুন। আপনার Google দিয়ে লগইন করুন।",
    googleLogin: "Google দিয়ে লগইন",
    securedSystem: "জলদস্যু সম্রাট ডাটাবেস দ্বারা সুরক্ষিত",
    welcomeCaptain: "স্বাগতম, ক্যাপ্টেন!",
    startFitness: "আজ থেকেই শুরু করুন আপনার ফিটনেস জার্নি।",
    newCrew: "নতুন ক্রু",
    newCrewSub: "প্রথমবার যাত্রা",
    oldCaptain: "পুরানো ক্যাপ্টেন",
    oldCaptainSub: "আগে থেকেই অ্যাকাউন্ট আছে",
    chooseChar: "আপনার ক্যারেক্টার বেছে নিন",
    chooseCharSub: "আপনার রূপ বেছে নিন",
    chooseGoal: "আপনার লক্ষ্য বেছে নিন",
    chooseGoalSub: "আপনার প্রধান লক্ষ্য কী?",
    loseWeight: "ওজন কমান",
    loseWeightSub: "মেদ ঝরানো",
    buildMuscle: "মাসল বৃদ্ধি",
    buildMuscleSub: "শক্তি বৃদ্ধি",
    stayFit: "ফিট থাকুন",
    stayFitSub: "সহনশীলতা বজায় রাখা",
    choosePart: "শরীরের অংশ বেছে নিন",
    choosePartSub: "কোথায় কসরত করতে চান?",
    fullBody: "পুরো শরীর",
    arms: "হাত",
    chest: "বুক",
    abs: "পেট / কোর",
    legs: "পা",
    pirateName: "আপনার পাইরেট নাম",
    pirateNameSub: "এটিই হবে আপনার জলদস্যু পরিচয়",
    pirateNamePlaceholder: "ক্যাপ্টেনের নাম...",
    bodyInfoTitle: "আপনার শারীরিক তথ্য",
    bodyInfoSub: "আপনার হ্যাকি শক্তি নির্ধারণ করতে তথ্য দিন",
    ageLabel: "বয়স",
    weightLabel: "ওজন (কেজি)",
    heightLabel: "উচ্চতা",
    feet: "ফুট",
    inches: "ইঞ্চি",
    saveProgressTitle: "প্রোগ্রেস সেভ করুন",
    saveProgressSub: "মেঘের দেশে আপনার ক্রু ডেটা সেভ রাখুন।",
    saveProgressDesc: "গুগল অ্যাকাউন্ট যুক্ত করলে আপনার কোয়েস্ট হিস্টরি কখনোই হারাবে না।",
    continueGoogle: "গুগল দিয়ে চালিয়ে যান",
    skipGuest: "এখন বাদ দিন (গেস্ট মোড)",
    home: "হোম",
    quests: "কোয়েস্টস",
    body: "বডি",
    crew: "ক্রু",
    todayVoyage: "আজকের অভিযান",
    totalDone: "মোট সম্পন্ন",
    levelUp: "লেভেল আপ!",
    levelUpSub: "আপনি একটি নতুন লেভেলে পৌঁছেছেন!",
    bossChallenges: "⚔️ বস যুদ্ধ",
    bossSub: "অতিরিক্ত বাউন্টি পয়েন্ট অর্জনের অনন্য চ্যালেঞ্জসমূহ!",
    lockTerminal: "এই লক্ষ্যটি লক করা রয়েছে",
    weightHistory: "⚓ ওজনের গ্রাফ",
    targetAnalysis: "🏴‍☠️ লক্ষ্য বিশ্লেষণ",
    idealRange: "আদর্শ ওজনের সীমা",
    currentStatus: "বর্তমান অবস্থা",
    diffIdeal: "পার্থক্য",
    logTodayWeight: "+ আজকের ওজন লগ করুন",
    hakiAttributes: "⚔️ হ্যাকি অ্যাট্রিবিউটস",
    allAchievements: "অর্জনসমূহ",
    leaderboardTitle: "লিডারবোর্ড",
    contactSupport: "📞 যোগাযোগ",
    accountActions: "⚓ অ্যাকাউন্ট",
    settings: "সেটিংস",
    logout: "🚪 লগআউট",
    deleteAccount: "🗑️ অ্যাকাউন্ট ডিলিট করুন",
    saveSuccess: "ওয়ার্কআউট তথ্য সিঙ্ক করা হয়েছে",
    confirmDelete: "আপনি কি নিশ্চিত? এটি আপনার সম্পূর্ণ ক্যারেক্টার ও ব্যাটল ডেটা চিরতরে মুছে ফেলবে।"
  }
};

const QT = [
  { id: 1, title: { en: "Morning Push-ups", bn: "সকালের পুশ-আপস" }, desc: { en: "3 sets × 20 reps", bn: "৩ সেট × ২০ বার" }, xp: 50, stat: "strength", cat: "fitness", icon: "💪" },
  { id: 2, title: { en: "Squats", bn: "স্কোয়াটস" }, desc: { en: "3 sets × 30 reps", bn: "৩ সেট × ৩০ বার" }, xp: 50, stat: "strength", cat: "fitness", icon: "🦵" },
  { id: 3, title: { en: "Plank Hold", bn: "প্ল্যাঙ্ক হোল্ড" }, desc: { en: "3 sets × 60 seconds", bn: "৩ সেট × ৬০ সেকেন্ড" }, xp: 40, stat: "endurance", cat: "fitness", icon: "🧘" },
  { id: 4, title: { en: "Pull-ups", bn: "পুল-আপস" }, desc: { en: "3 sets × 10 reps", bn: "৩ সেট × ১০ বার" }, xp: 60, stat: "strength", cat: "fitness", icon: "🏋️" },
  { id: 5, title: { en: "Jumping Jacks", bn: "জাম্পিং জ্যাকস" }, desc: { en: "3 sets × 50 reps", bn: "৩ সেট × ৫০ বার" }, xp: 30, stat: "agility", cat: "fitness", icon: "🤸" },
  { id: 6, title: { en: "Running / Walk", bn: "দৌড়ানো / হাঁটা" }, desc: { en: "30 minutes cardio", bn: "৩০ মিনিট কার্ডিও" }, xp: 70, stat: "endurance", cat: "fitness", icon: "🏃" },
  { id: 7, title: { en: "Lunges", bn: "লাঞ্জেস" }, desc: { en: "3 sets × 20 reps each leg", bn: "৩ সেট × ২০ বার প্রতি পায়ে" }, xp: 45, stat: "strength", cat: "fitness", icon: "🦶" },
  { id: 8, title: { en: "Burpees", bn: "বারপিস" }, desc: { en: "3 sets × 15 reps", bn: "৩ সেট × ১৫ বার" }, xp: 65, stat: "agility", cat: "fitness", icon: "💥" },
  { id: 9, title: { en: "Read a Book", bn: "বই পড়া" }, desc: { en: "30 minutes reading", bn: "৩০ মিনিট পড়া" }, xp: 60, stat: "intelligence", cat: "mind", icon: "📖" },
  { id: 10, title: { en: "Study / Learn", bn: "পড়াশোনা / নতুন শেখা" }, desc: { en: "1 hour focused study", bn: "১ ঘন্টা মনোযোগ দিয়ে পড়াশোনা" }, xp: 80, stat: "intelligence", cat: "mind", icon: "🎓" },
  { id: 11, title: { en: "Meditation", bn: "মেডিটেশন" }, desc: { en: "15 minutes mindfulness", bn: "১৫ মিনিট মনোযোগ অনুশীলন" }, xp: 50, stat: "vitality", cat: "mind", icon: "🌿" },
  { id: 12, title: { en: "Journal Writing", bn: "দিনলিপি লেখা" }, desc: { en: "Write today's thoughts", bn: "আজকের চিন্তাভাবনা ডায়েরিতে লিখুন" }, xp: 35, stat: "intelligence", cat: "mind", icon: "✍️" },
  { id: 13, title: { en: "Drink Water", bn: "পানি পান" }, desc: { en: "8 glasses throughout day", bn: "সারাদিনে ৮ গ্লাস পানি পান" }, xp: 30, stat: "vitality", cat: "health", icon: "💧" },
  { id: 14, title: { en: "Sleep 8 Hours", bn: "৮ ঘন্টা ঘুম" }, desc: { en: "Full night rest", bn: "সারাদিন পর চমৎকার বিশ্রাম" }, xp: 60, stat: "vitality", cat: "health", icon: "😴" },
  { id: 15, title: { en: "Healthy Meal", bn: "স্বাস্থ্যকর খাবার" }, desc: { en: "Eat nutritious food", bn: "পুষ্টিকর খাবার খাওয়া" }, xp: 40, stat: "vitality", cat: "health", icon: "🥗" },
  { id: 16, title: { en: "No Junk Food", bn: "জাঙ্ক ফুড এড়িয়ে চলা" }, desc: { en: "Avoid processed food", bn: "প্রক্রিয়াজাত খাবার বা ভাজাপোড়া বাদ দিন" }, xp: 50, stat: "vitality", cat: "health", icon: "🚫" },
  { id: 17, title: { en: "Social Interaction", bn: "অর্থপূর্ণ আলোচনা" }, desc: { en: "Meaningful conversation", bn: "পরিবার বা বন্ধুদের সাথে ভালো সময় কাটানো" }, xp: 40, stat: "charisma", cat: "social", icon: "🤝" },
  { id: 18, title: { en: "Help Someone", bn: "কাউকে সাহায্য করা" }, desc: { en: "Do something kind", bn: "দয়ালু বা পরোপকারী কোনো কাজ" }, xp: 45, stat: "charisma", cat: "social", icon: "💙" }
];

const BOSSES = [
  { id: 1, name: { en: "Kaido the Dragon", bn: "ড্রাগন কাইডো" }, hp: 1000, reward: 500, desc: { en: "Complete ALL quests for 7 days straight — The Strongest Creature", bn: "টানা ৭ দিন সব কোয়েস্ট পূর্ণ করো — সবচেয়ে শক্তিশালী দানব" }, icon: "🐉", diff: "YONKO", color: "#D62828" },
  { id: 2, name: { en: "Doflamingo", bn: "দফ্লামিংগো" }, hp: 500, reward: 200, desc: { en: "Do 100 push-ups in a single day — Conqueror's Strings", bn: "একদিনে ১০০টি পুশ-আপ করো — কনকারার্স সুতা" }, icon: "🦩", diff: "WARLORD", color: "#FB8500" },
  { id: 3, name: { en: "Big Mom", bn: "বিগ মম" }, hp: 700, reward: 300, desc: { en: "Study for 5 hours in a single day — Soul Pocus", bn: "একদিনে ৫ ঘন্টা পড়াশোনা করো — সৌল পোকাস" }, icon: "👑", diff: "YONKO", color: "#FFB703" },
  { id: 4, name: { en: "Smoker", bn: "স্মোকার" }, hp: 300, reward: 100, desc: { en: "Run 5km without stopping — Pursue the Pirates", bn: "থামা ছাড়া ৫ কিলোমিটার রান করো — জলদস্যু তাড়া" }, icon: "💨", diff: "MARINE", color: "#023E8A" },
  { id: 5, name: { en: "Blackbeard", bn: "ব্ল্যাকবেয়ার্ড" }, hp: 400, reward: 150, desc: { en: "Eat clean for 14 consecutive days — Darkness Power", bn: "টানা ১৪ দিন পুষ্টিকর খাবার খাও — অন্ধকার শক্তি" }, icon: "☠️", diff: "YONKO", color: "#3D2B1F" },
  { id: 6, name: { en: "Rob Lucci", bn: "রব লুচ্চি" }, hp: 600, reward: 250, desc: { en: "Sleep before 10PM for 7 days — CP9 Agent", bn: "টানা ৭ দিন রাত ১০টার আগেই ঘুমাও — সিপিলু অভিযাত্রী" }, icon: "🐆", diff: "CP0", color: "#8B9BB4" },
];

const SC = {
  strength: { icon: "⚔️", color: "#D62828", label: "Strength" },
  intelligence: { icon: "🧠", color: "#023E8A", label: "Intelligence" },
  agility: { icon: "⚡", color: "#FFB703", label: "Agility" },
  vitality: { icon: "❤️", color: "#FB8500", label: "Vitality" },
  endurance: { icon: "🛡️", color: "#0353A4", label: "Endurance" },
  charisma: { icon: "✨", color: "#22c55e", label: "Charisma" }
};

const AT = [
  { id: 1, title: { en: "First Bounty", bn: "প্রথম বাউন্টি" }, desc: { en: "Complete your first quest", bn: "তোমার প্রথম কোয়েস্ট পূর্ণ করো" }, icon: "💰" },
  { id: 2, title: { en: "Pirate Crew", bn: "পাইরেট ক্রু" }, desc: { en: "Reach Level 5", bn: "লেভেল ৫ অর্জন করো" }, icon: "⚓" },
  { id: 3, title: { en: "Will of D", bn: "উইল অফ ডি" }, desc: { en: "Have a 7-day streak", bn: "টানা ৭ দিন ওজনের বা ওয়ার্কআউটের রেকর্ড গড়ো" }, icon: "🔥" },
  { id: 4, title: { en: "Conqueror's Haki", bn: "কনকারার্স হ্যাকি" }, desc: { en: "Complete 50 quests in total", bn: "মোট ৫০টি কোয়েস্ট পুর্ণ করো" }, icon: "👑" },
  { id: 5, title: { en: "Pirate King", bn: "জলদস্যু সম্রাট" }, desc: { en: "Reach Level 20", bn: "সর্বোচ্চ লেভেল ২০ অর্জন করো" }, icon: "🏴‍☠️" },
  { id: 6, title: { en: "Balanced Crew", bn: "ভারসাম্যপূর্ণ ক্রু" }, desc: { en: "Get all attribute stats above 50", bn: "সবগুলো অ্যাট্রিবিউট স্ট্যাট ৫০ এর উপরে নিন" }, icon: "⚖️" }
];

function getRank(level: number) {
  if (level >= 20) return { r: "KING", c: "#FFB703", lb: { en: "Pirate King", bn: "জলদস্যু সম্রাট" }, icon: "🏴‍☠️" };
  if (level >= 15) return { r: "YONKO", c: "#D62828", lb: { en: "Emperor", bn: "সমুদ্রের সম্রাট" }, icon: "👑" };
  if (level >= 10) return { r: "NAKAMA", c: "#FB8500", lb: { en: "Straw Hat Pirate", bn: "অগ্রগামী নাবিক" }, icon: "⚓" };
  if (level >= 5) return { r: "ROOKIE", c: "#023E8A", lb: { en: "Supernova", bn: "সুপারনোভা" }, icon: "🗡️" };
  return { r: "E", c: "#8B9BB4", lb: { en: "East Blue Pirate", bn: "শিক্ষানবিস জলদস্যু" }, icon: "⛵" };
}

function getXpLimit(level: number) {
  return level * level * 100;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [pirateLang, setPirateLang] = useState<'en' | 'bn' | null>(() => {
    return (localStorage.getItem('pirateLang') as 'en' | 'bn') || null;
  });

  // Main UI states
  const [navTab, setNavTab] = useState<'dashboard' | 'quests' | 'body' | 'crew'>('dashboard');
  const [questFilter, setQuestFilter] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [selectedBoss, setSelectedBoss] = useState<typeof BOSSES[0] | null>(null);
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);
  const [notification, setNotification] = useState<{ text: string; color: string } | null>(null);

  // Profile status model (Default fallback)
  const [userProfile, setUserProfile] = useState({
    playerName: 'Captain Nakama',
    birthYear: 2000,
    age: 26,
    level: 1,
    xp: 0,
    streak: 1,
    totalQuestsDone: 0,
    lang: 'bn',
    stats: { strength: 10, intelligence: 10, agility: 10, vitality: 10, endurance: 10, charisma: 10 },
    weight: 70,
    height: 172,
    heightFeet: 5,
    heightInch: 7,
    character: 'boy',
    goal: 'fit',
    focusArea: 'full',
    weightHistory: [] as Array<{ date: string; w: number }>,
    achievements: AT.map((a, idx) => ({ id: a.id, unlocked: idx === 0 })),
    questsProgress: QT.map(q => ({ id: q.id, done: false })),
    lastQuestReset: new Date().toDateString()
  });

  // Onboarding parameters
  const [onboardStep, setOnboardStep] = useState<number | null>(null);
  const [obSetup, setObSetup] = useState({
    character: 'boy',
    goal: 'fit',
    focusArea: 'full',
    playerName: '',
    birthYear: 2000,
    weight: 70,
    heightFeet: 5,
    heightInch: 7
  });

  // ── TRIGGER BANNER NOTIFICATION ──
  const triggerNotif = (text: string, color: string = "#FFB703") => {
    setNotification({ text, color });
    setTimeout(() => setNotification(null), 3000);
  };

  // ── FIREBASE AUTH STREAM ──
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        await syncUserFromCloud(user.uid);
      } else {
        setCurrentUser(null);
        // Load fallback native profile from localstorage
        const localData = localStorage.getItem('guest_profile');
        if (localData) {
          try {
            setUserProfile(JSON.parse(localData));
          } catch (e) {
            // keep default
          }
        }
        setIsInitializing(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // ── ATOM SYNCHRONIZER ──
  const syncUserFromCloud = async (uid: string) => {
    try {
      const snap = await db.ref(`players/${uid}`).get();
      if (snap.exists()) {
        const val = snap.val();
        // Check day boundary resets
        const todayStr = new Date().toDateString();
        let finalProfile = { ...val };
        if (finalProfile.lastQuestReset !== todayStr) {
          finalProfile.questsProgress = QT.map(q => ({ id: q.id, done: false }));
          if (finalProfile.lastQuestReset) {
            finalProfile.streak = (finalProfile.streak || 1) + 1;
          }
          finalProfile.lastQuestReset = todayStr;
          await db.ref(`players/${uid}`).set(finalProfile);
        }
        setUserProfile(finalProfile);
      } else {
        // Run setup
        setOnboardStep(1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsInitializing(false);
    }
  };

  const saveData = async (newProfile: typeof userProfile) => {
    setUserProfile(newProfile);
    if (currentUser) {
      setSavingStatus(true);
      try {
        await db.ref(`players/${currentUser.uid}`).set(newProfile);
      } catch (err) {
        // Fallback local persistence
      } finally {
        setSavingStatus(false);
      }
    } else {
      localStorage.setItem('guest_profile', JSON.stringify(newProfile));
    }
  };

  // ── GOOGLE authentication popup ──
  const handleGoogleLogin = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await auth.signInWithPopup(provider);
      if (result.user) {
        setCurrentUser(result.user);
        await syncUserFromCloud(result.user.uid);
        triggerNotif("Welcome back to the Grand Line!", "#FFB703");
      }
    } catch (err: any) {
      triggerNotif("Google login aborted: " + (err.message || err), "#D62828");
    }
  };

  // ── ONBOARDING PROCESSOR ──
  const finishOnboarding = async (signedInUser: firebase.User | null = currentUser) => {
    const totalInch = (obSetup.heightFeet * 12) + obSetup.heightInch;
    const finalHeightCm = Math.round(totalInch * 2.54);
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const newProfile = {
      playerName: obSetup.playerName || 'Straw Hat Captain',
      birthYear: obSetup.birthYear,
      age: new Date().getFullYear() - obSetup.birthYear,
      level: 1,
      xp: 0,
      streak: 1,
      totalQuestsDone: 0,
      lang: pirateLang || 'bn',
      stats: { strength: 15, intelligence: 15, agility: 15, vitality: 15, endurance: 15, charisma: 15 },
      weight: obSetup.weight,
      height: finalHeightCm,
      heightFeet: obSetup.heightFeet,
      heightInch: obSetup.heightInch,
      character: obSetup.character,
      goal: obSetup.goal,
      focusArea: obSetup.focusArea,
      weightHistory: [{ date: today, w: obSetup.weight }],
      achievements: AT.map((a, idx) => ({ id: a.id, unlocked: idx === 0 })),
      questsProgress: QT.map(q => ({ id: q.id, done: false })),
      lastQuestReset: new Date().toDateString()
    };

    if (signedInUser) {
      setSavingStatus(true);
      await db.ref(`players/${signedInUser.uid}`).set(newProfile);
      setSavingStatus(false);
    } else {
      localStorage.setItem('guest_profile', JSON.stringify(newProfile));
    }

    setUserProfile(newProfile);
    setOnboardStep(null);
    triggerNotif("Set Sail, Captain! ⛵", "#FFB703");
  };

  const handleOnboardSignAndFinish = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await auth.signInWithPopup(provider);
      if (result.user) {
        setCurrentUser(result.user);
        await finishOnboarding(result.user);
      }
    } catch (e: any) {
      triggerNotif("Sign in failed: " + e.message, "#D62828");
    }
  };

  // ── INTUITIVE WORKOUT LOGGING ENGINE ──
  const completeQuest = (id: number) => {
    const updatedProgress = userProfile.questsProgress.map(q => {
      if (q.id === id) return { ...q, done: true };
      return q;
    });

    const targetQuest = QT.find(q => q.id === id);
    if (!targetQuest) return;

    if (navigator.vibrate) {
      navigator.vibrate(100);
    }

    let earnedXp = targetQuest.xp;
    let newXp = userProfile.xp + earnedXp;
    let newLevel = userProfile.level;
    let triggeredLevelUp = false;

    while (newXp >= getXpLimit(newLevel)) {
      newXp -= getXpLimit(newLevel);
      newLevel++;
      triggeredLevelUp = true;
    }

    // Increment corresponding Attribute
    const statKey = targetQuest.stat as keyof typeof userProfile.stats;
    const currentStatVal = userProfile.stats[statKey] || 10;
    const newStats = {
      ...userProfile.stats,
      [statKey]: Math.min(100, currentStatVal + 3)
    };

    const newQuestsCount = (userProfile.totalQuestsDone || 0) + 1;

    // Check achievement unlock conditions
    const updatedAchievements = userProfile.achievements.map(a => {
      let isUnlocked = a.unlocked;
      if (a.id === 1) isUnlocked = true; // First Bounty
      if (a.id === 2 && newLevel >= 5) isUnlocked = true; // Level 5 Supernova
      if (a.id === 3 && userProfile.streak >= 7) isUnlocked = true; // Will of D
      if (a.id === 4 && newQuestsCount >= 50) isUnlocked = true; // Conqueror's Haki
      if (a.id === 5 && newLevel >= 20) isUnlocked = true; // Pirate King
      if (a.id === 6 && (Object.values(newStats) as number[]).every(v => v >= 50)) isUnlocked = true; // Balanced Crew
      return { ...a, unlocked: isUnlocked };
    });

    const nextProfile = {
      ...userProfile,
      questsProgress: updatedProgress,
      xp: newXp,
      level: newLevel,
      stats: newStats,
      totalQuestsDone: newQuestsCount,
      achievements: updatedAchievements
    };

    saveData(nextProfile);

    if (triggeredLevelUp) {
      setShowLevelUp(newLevel);
      setTimeout(() => setShowLevelUp(null), 4000);
    } else {
      triggerNotif(`+${earnedXp} XP — ${targetQuest.title[pirateLang || 'en']} Completes!`, "#22c55e");
    }
  };

  const currentBmi = parseFloat((userProfile.weight / ((userProfile.height / 100) ** 2)).toFixed(1));
  const getBmiStatus = (bmi: number) => {
    if (bmi < 18.5) return { l: pirateLang === 'bn' ? 'ওজন কম (Underweight)' : 'Underweight', c: '#023E8A' };
    if (bmi < 25) return { l: pirateLang === 'bn' ? 'আদর্শ ওজন (Normal ✓)' : 'Normal ✓', c: '#22c55e' };
    if (bmi < 30) return { l: pirateLang === 'bn' ? 'অতিরিক্ত ওজন (Overweight)' : 'Overweight', c: '#FFB703' };
    return { l: pirateLang === 'bn' ? 'স্থূলতা (Obese)' : 'Obese', c: '#D62828' };
  };
  const bmiIndicator = getBmiStatus(currentBmi);

  // Ideal weight markers
  const idealMin = (18.5 * ((userProfile.height / 100) ** 2)).toFixed(1);
  const idealMax = (24.9 * ((userProfile.height / 100) ** 2)).toFixed(1);
  const diffFromIdeal = (userProfile.weight - 21.7 * ((userProfile.height / 100) ** 2)).toFixed(1);

  const doneCount = userProfile.questsProgress.filter(q => q.done).length;
  const currentLangCode = pirateLang || 'en';

  // ── ONBOARD INITIALS GAUGE ──
  const dummyBmi = parseFloat((obSetup.weight / ((((obSetup.heightFeet * 12) + obSetup.heightInch) * 2.54 / 100) ** 2)).toFixed(1));

  // --- RENDERING ROUTINES ---

  if (isInitializing) {
    return (
      <div className="fixed inset-0 bg-[#060e1a] flex flex-col items-center justify-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFB703] mb-4"></div>
        <div className="cinzel text-[#FFB703] text-sm tracking-wider font-bold">⚓ SETTING SAIL...</div>
        <div className="text-gray-400 text-xs mt-1">Connecting to Grand Line Database</div>
      </div>
    );
  }

  // SCREEN 1: Language Picker
  if (!pirateLang) {
    return (
      <div className="fixed inset-0 bg-ocean-glow flex flex-col items-center justify-center p-6 z-50">
        <div className="w-full max-w-sm glass p-8 text-center border-[#FFB703] border-opacity-30">
          <div className="float-animation mb-6">
            <img src="/icon-512.png" className="w-24 h-24 mx-auto rounded-3xl shadow-lg border border-[#FFB703] border-opacity-20" alt="Irfan App Logo" />
          </div>
          <div className="cinzel text-xs text-gray-500 tracking-widest mb-1">⚓ PIRATE CREW</div>
          <h1 className="pirate text-3xl text-[#FFB703] mb-1">ভাষা বেছে নাও</h1>
          <div className="cinzel text-xxs text-gray-400 tracking-wider mb-6">SELECT YOUR LANGUAGE</div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setPirateLang('bn');
                localStorage.setItem('pirateLang', 'bn');
              }}
              className="btn btn-gold w-full p-4 rounded-xl flex items-center justify-between text-[#0A1628] font-bold text-sm"
            >
              <span>🇧🇩 বাংলা</span>
              <span>→</span>
            </button>
            <button
              onClick={() => {
                setPirateLang('en');
                localStorage.setItem('pirateLang', 'en');
              }}
              className="glass hover:bg-white/10 w-full p-4 rounded-xl flex items-center justify-between text-white font-bold text-sm"
            >
              <span>🇺🇸 English</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 2: Login Gate
  if (!currentUser && onboardStep === null && !localStorage.getItem('guest_profile')) {
    return (
      <div className="fixed inset-0 bg-ocean-glow flex flex-col items-center justify-center p-6 z-50">
        <div className="w-full max-w-sm glass p-8 text-center relative">
          <div className="absolute top-2 left-2 text-gold/30">✦</div>
          <div className="absolute top-2 right-2 text-gold/30">✦</div>
          <div className="absolute bottom-2 left-2 text-gold/30">✦</div>
          <div className="absolute bottom-2 right-2 text-gold/30">✦</div>

          <div className="float-animation mb-4">
            <img src="/icon-512.png" className="w-24 h-24 mx-auto rounded-3xl shadow-xl" alt="Nakama Logo" />
          </div>

          <h2 className="pirate text-4xl text-[#FFB703] tracking-wider mb-1">IRFAN</h2>
          <div className="cinzel text-[10px] text-gray-400 tracking-widest mb-4">{TRANS[currentLangCode].morningCrew}</div>

          <div className="inline-block py-1 px-4 border border-[#FFB703]/40 bg-[#FFB703]/10 rounded mb-6">
            <span className="cinzel text-xs text-[#FFB703] font-bold">⚓ BOUNTY: ∞ BELI ⚓</span>
          </div>

          <p className="text-sm leading-relaxed text-gray-300 mb-6 font-serif">
            {TRANS[currentLangCode].grandLineJourney}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white text-gray-800 p-4 rounded-xl flex items-center justify-center gap-3 font-semibold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>{TRANS[currentLangCode].googleLogin}</span>
            </button>

            <button
              onClick={() => {
                // Initialize default guest session with clean structure
                saveData(userProfile);
                triggerNotif("Sailing as Guest!", "#023E8A");
              }}
              className="text-xs text-gray-400 hover:text-white transition-colors duration-150 py-2 mt-2 underline"
            >
              {TRANS[currentLangCode].skipGuest}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 3: Interactive Onboarding Multi-Step Dialog
  if (onboardStep !== null) {
    return (
      <div className="fixed inset-0 bg-[#060e1a] text-white flex flex-col z-50 overflow-y-auto px-6 py-10 justify-center items-center">
        <div className="w-full max-w-sm flex flex-col items-center">
          {/* Progress gauge */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5, 6].map((st) => (
              <div
                key={st}
                className={`h-2 rounded-full transition-all duration-300 ${onboardStep === st ? 'w-8 bg-[#FFB703]' : 'w-2 bg-white/20'}`}
              ></div>
            ))}
          </div>

          {/* STEP 1: Entrance */}
          {onboardStep === 1 && (
            <div className="text-center glass p-8 w-full">
              <img src="/icon-512.png" className="w-24 h-24 rounded-3xl mx-auto mb-6 shadow-xl border border-gold/20 float-animation" alt="Irfan pirate logo" />
              <h2 className="pirate text-3xl text-[#FFB703] mb-1">{TRANS[currentLangCode].welcomeCaptain}</h2>
              <p className="text-sm text-gray-300 mb-8">{TRANS[currentLangCode].startFitness}</p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setOnboardStep(2)}
                  className="ob-opt w-full border border-gold/30 bg-gold/5 p-4 rounded-xl flex items-center justify-between text-left"
                >
                  <div>
                    <div className="cinzel text-sm text-white font-bold">{TRANS[currentLangCode].newCrew}</div>
                    <div className="text-xs text-gray-400">{TRANS[currentLangCode].newCrewSub}</div>
                  </div>
                  <span>→</span>
                </button>

                <button
                  onClick={handleGoogleLogin}
                  className="ob-opt w-full border border-white/10 bg-white/5 p-4 rounded-xl flex items-center justify-between text-left"
                >
                  <div>
                    <div className="cinzel text-sm text-white font-bold">{TRANS[currentLangCode].oldCaptain}</div>
                    <div className="text-xs text-gray-400">{TRANS[currentLangCode].oldCaptainSub}</div>
                  </div>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Character configuration */}
          {onboardStep === 2 && (
            <div className="glass p-8 w-full text-center">
              <h3 className="cinzel text-lg text-gold font-bold mb-2">{TRANS[currentLangCode].chooseChar}</h3>
              <p className="text-xs text-gray-400 mb-6">{TRANS[currentLangCode].chooseCharSub}</p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { setObSetup({ ...obSetup, character: 'boy' }); setOnboardStep(3); }}
                  className={`p-4 rounded-xl flex items-center gap-4 text-left border ${obSetup.character === 'boy' ? 'border-[#FFB703] bg-[#FFB703]/10' : 'border-white/10 bg-white/5'}`}
                >
                  <span className="text-3xl">👦</span>
                  <div>
                    <div className="font-bold">Pirate Boy</div>
                    <div className="text-xxs text-gray-400">ছেলে</div>
                  </div>
                </button>

                <button
                  onClick={() => { setObSetup({ ...obSetup, character: 'girl' }); setOnboardStep(3); }}
                  className={`p-4 rounded-xl flex items-center gap-4 text-left border ${obSetup.character === 'girl' ? 'border-[#FFB703] bg-[#FFB703]/10' : 'border-white/10 bg-white/5'}`}
                >
                  <span className="text-3xl">👧</span>
                  <div>
                    <div className="font-bold">Pirate Girl</div>
                    <div className="text-xxs text-gray-400">মেয়ে</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Goals specification */}
          {onboardStep === 3 && (
            <div className="glass p-8 w-full text-center">
              <h3 className="cinzel text-lg text-gold font-bold mb-2">{TRANS[currentLangCode].chooseGoal}</h3>
              <p className="text-xs text-gray-400 mb-6">{TRANS[currentLangCode].chooseGoalSub}</p>

              <div className="flex flex-col gap-3">
                {[
                  { id: 'lose', label: TRANS[currentLangCode].loseWeight, sub: TRANS[currentLangCode].loseWeightSub, emoji: "🔥" },
                  { id: 'muscle', label: TRANS[currentLangCode].buildMuscle, sub: TRANS[currentLangCode].buildMuscleSub, emoji: "🏋️" },
                  { id: 'fit', label: TRANS[currentLangCode].stayFit, sub: TRANS[currentLangCode].stayFitSub, emoji: "⚡" }
                ].map(go => (
                  <button
                    key={go.id}
                    onClick={() => { setObSetup({ ...obSetup, goal: go.id }); setOnboardStep(4); }}
                    className={`p-4 rounded-xl flex items-center gap-4 text-left border ${obSetup.goal === go.id ? 'border-[#FFB703] bg-[#FFB703]/10' : 'border-white/10 bg-white/5'}`}
                  >
                    <span className="text-2xl">{go.emoji}</span>
                    <div>
                      <div className="font-bold text-sm text-white">{go.label}</div>
                      <div className="text-xxs text-gray-400">{go.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Focus segments selection */}
          {onboardStep === 4 && (
            <div className="glass p-8 w-full text-center">
              <h3 className="cinzel text-lg text-gold font-bold mb-2">{TRANS[currentLangCode].choosePart}</h3>
              <p className="text-xs text-gray-400 mb-6">{TRANS[currentLangCode].choosePartSub}</p>

              <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
                {[
                  { id: 'full', label: TRANS[currentLangCode].fullBody, sub: "All system parameters", emoji: "🤸" },
                  { id: 'arms', label: TRANS[currentLangCode].arms, sub: "Honed upper Haki strength", emoji: "💪" },
                  { id: 'chest', label: TRANS[currentLangCode].chest, sub: "Chest defense plates", emoji: "🛡️" },
                  { id: 'abs', label: TRANS[currentLangCode].abs, sub: "Core power reserves", emoji: "🔮" },
                  { id: 'legs', label: TRANS[currentLangCode].legs, sub: "Vanguard running speed", emoji: "🦵" }
                ].map(fo => (
                  <button
                    key={fo.id}
                    onClick={() => { setObSetup({ ...obSetup, focusArea: fo.id }); setOnboardStep(5); }}
                    className={`p-3 rounded-xl flex items-center gap-4 text-left border ${obSetup.focusArea === fo.id ? 'border-[#FFB703] bg-[#FFB703]/10' : 'border-white/10 bg-white/5'}`}
                  >
                    <span className="text-xl">{fo.emoji}</span>
                    <div>
                      <div className="font-bold text-xs text-white">{fo.label}</div>
                      <div className="text-[10px] text-gray-400">{fo.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Pirate name picker */}
          {onboardStep === 5 && (
            <div className="glass p-8 w-full text-center">
              <h3 className="cinzel text-lg text-gold font-bold mb-1">{TRANS[currentLangCode].pirateName}</h3>
              <p className="text-xs text-gray-400 mb-6">{TRANS[currentLangCode].pirateNameSub}</p>

              <input
                type="text"
                placeholder={TRANS[currentLangCode].pirateNamePlaceholder}
                value={obSetup.playerName}
                onChange={(e) => setObSetup({ ...obSetup, playerName: e.target.value.slice(0, 18) })}
                className="w-full text-center p-4 bg-white/10 border border-gold/30 rounded-xl mb-6 font-semibold"
              />

              <button
                onClick={() => {
                  if (!obSetup.playerName.trim()) return triggerNotif("Please set your captain name!", "#D62828");
                  setOnboardStep(6);
                }}
                className="btn btn-gold w-full py-4 rounded-xl tracking-wider text-xs font-bold"
              >
                NEXT →
              </button>
            </div>
          )}

          {/* STEP 6: Physical biometric inputs */}
          {onboardStep === 6 && (
            <div className="glass p-8 w-full">
              <h3 className="cinzel text-lg text-gold text-center font-bold mb-1">{TRANS[currentLangCode].bodyInfoTitle}</h3>
              <p className="text-xxs text-gray-400 text-center mb-6">{TRANS[currentLangCode].bodyInfoSub}</p>

              <div className="flex flex-col gap-4">
                {/* Age */}
                <div>
                  <span className="text-xxs text-gray-400 tracking-wider font-bold block mb-1">{TRANS[currentLangCode].ageLabel}</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setObSetup({ ...obSetup, birthYear: obSetup.birthYear - 1 })} className="adj-btn">-</button>
                    <div className="flex-1 text-center font-bold text-lg text-gold">{new Date().getFullYear() - obSetup.birthYear} Yrs</div>
                    <button onClick={() => setObSetup({ ...obSetup, birthYear: obSetup.birthYear + 1 })} className="adj-btn">+</button>
                  </div>
                </div>

                {/* Weight */}
                <div>
                  <span className="text-xxs text-gray-400 tracking-wider font-bold block mb-1">{TRANS[currentLangCode].weightLabel}</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setObSetup({ ...obSetup, weight: Math.max(30, obSetup.weight - 0.5) })} className="adj-btn">-</button>
                    <div className="flex-1 text-center font-bold text-lg text-gold">{obSetup.weight} kg</div>
                    <button onClick={() => setObSetup({ ...obSetup, weight: obSetup.weight + 0.5 })} className="adj-btn">+</button>
                  </div>
                </div>

                {/* Height */}
                <div>
                  <span className="text-xxs text-gray-400 tracking-wider font-bold block mb-1">{TRANS[currentLangCode].heightLabel}</span>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="text-[10px] text-gray-400 text-center">{TRANS[currentLangCode].feet}</div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setObSetup({ ...obSetup, heightFeet: Math.max(3, obSetup.heightFeet - 1) })} className="adj-btn text-xs">-</button>
                        <span className="font-bold text-gold text-lg flex-1 text-center">{obSetup.heightFeet}</span>
                        <button onClick={() => setObSetup({ ...obSetup, heightFeet: Math.min(8, obSetup.heightFeet + 1) })} className="adj-btn text-xs">+</button>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="text-[10px] text-gray-400 text-center">{TRANS[currentLangCode].inches}</div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setObSetup({ ...obSetup, heightInch: Math.max(0, obSetup.heightInch - 1) })} className="adj-btn text-xs">-</button>
                        <span className="font-bold text-gold text-lg flex-1 text-center">{obSetup.heightInch}</span>
                        <button onClick={() => setObSetup({ ...obSetup, heightInch: Math.min(11, obSetup.heightInch + 1) })} className="adj-btn text-xs">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center text-gold font-serif font-bold text-sm mt-5 mb-4 border-t border-gold/10 pt-4">
                BMI Estimation: {dummyBmi}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleOnboardSignAndFinish}
                  className="btn btn-gold flex-1 py-4 rounded-xl tracking-wider text-xs font-bold"
                >
                  {TRANS[currentLangCode].continueGoogle}
                </button>
                <button
                  onClick={() => finishOnboarding(null)}
                  className="btn btn-ghost flex-1 py-4 rounded-xl tracking-wider text-xxs font-bold"
                >
                  GUEST SKIP
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // CORE APPLICATION INTERFACES
  const rankObj = getRank(userProfile.level);
  const totalXpRequired = getXpLimit(userProfile.level);
  const xpPercentage = Math.min((userProfile.xp / totalXpRequired) * 100, 100);

  return (
    <div className="min-h-screen bg-ocean-glow text-[#FDF8EC] select-none flex flex-col max-w-md mx-auto relative pb-24 shadow-2xl">
      {/* Dynamic Watermark Indicator */}
      <div className="fixed bottom-24 right-4 z-40 pointer-events-none select-none opacity-20 text-right">
        <div className="pirate text-gold tracking-widest text-xs leading-none">IRFAN</div>
        <div className="font-serif text-[8px] uppercase tracking-wider text-white">One Piece Crew v2.0</div>
      </div>

      {/* Synchronizing Indicator */}
      {savingStatus && (
        <div className="fixed top-3 right-3 bg-gold/15 backdrop-blur border border-gold/30 rounded-lg text-xxs text-gold py-1 px-2 z-50 flex items-center gap-2">
          <span>⚓ Syncing...</span>
        </div>
      )}

      {/* Global Notification system */}
      {notification && (
        <div
          style={{ borderColor: notification.color, boxShadow: `0 0 20px ${notification.color}60` }}
          className="fixed top-6 left-1/2 -translate-x-1/2 bg-[#112240] border backdrop-blur px-5 py-3 rounded-full font-bold text-xs tracking-wide text-center z-50 animate-bounce"
        >
          {notification.text}
        </div>
      )}

      {/* Level Up Flash Modal Overlay */}
      {showLevelUp !== null && (
        <div className="fixed inset-0 z-50 bg-[#000000e0] flex flex-col items-center justify-center animate-fade-in">
          <div className="text-center p-6 scale-95 animate-pulse">
            <img src="/icon-512.png" className="w-28 h-28 rounded-3xl mx-auto mb-4 shadow-[0_0_40px_rgba(255,183,3,0.6)]" alt="Straw hat skull icon" />
            <h1 className="pirate text-5xl text-gold font-bold">{TRANS[currentLangCode].levelUp}</h1>
            <p className="text-white text-base font-serif mt-2">{TRANS[currentLangCode].levelUpSub}</p>
            <div className="inline-block px-4 py-2 bg-gold/20 text-gold rounded font-bold mt-4">
              Level {showLevelUp} — {getRank(showLevelUp).lb[currentLangCode]}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* TAB A: HOME / DASHBOARD */}
      {/* ──────────────────────────────────────────────────────── */}
      {navTab === 'dashboard' && (
        <div className="p-4 flex flex-col space-y-4">
          {/* Header Row */}
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏴‍☠️</span>
              <span className="cinzel text-[10px] text-gray-400 tracking-wider">STRAW HAT SYSTEM</span>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="w-10 h-10 border border-white/10 backdrop-blur bg-white/5 rounded-xl flex items-center justify-center text-sm"
            >
              ⚙️
            </button>
          </div>

          {/* Title Row with Streak */}
          <div className="flex justify-between items-center">
            <h2 className="pirate text-3xl tracking-wide bg-gradient-to-r from-gold to-orange-400 bg-clip-text text-transparent">NAKAMA</h2>
            <div className="py-1 px-3 bg-[#112240] border border-orange-400/30 text-orange-400 rounded-xl font-bold font-serif text-xs">
              🔥 {userProfile.streak} {currentLangCode === 'bn' ? 'দিন' : 'Day'}{userProfile.streak !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Wanted Poster Card */}
          <div className="glass-gold p-5 text-left relative flex flex-col">
            <div className="absolute top-2 left-2 text-gold/25">✦</div>
            <div className="absolute top-2 right-2 text-gold/25">✦</div>
            <div className="absolute bottom-2 left-2 text-gold/25">✦</div>
            <div className="absolute bottom-2 right-2 text-gold/25">✦</div>

            <div className="flex items-center gap-4">
              {/* Badge Visual */}
              <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-3xl`} style={{ borderColor: rankObj.c, background: `${rankObj.c}1A` }}>
                {rankObj.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div onClick={() => setShowNameModal(true)} className="flex items-center gap-2 cursor-pointer group">
                  <span className="cinzel text-[17px] font-bold text-white overflow-hidden text-ellipsis whitespace-nowrap">{userProfile.playerName}</span>
                  <span className="text-gray-400 text-xs">✏️</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="cinzel text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ color: rankObj.c, background: `${rankObj.c}22` }}>
                    {rankObj.r}
                  </span>
                  <span className="text-xxs text-gray-400">•</span>
                  <span className="text-[11px] text-gray-300 font-serif">{rankObj.lb[currentLangCode]}</span>
                </div>
                <div className="cinzel text-xl text-gold font-black mt-1">Lv.{userProfile.level}</div>
              </div>
            </div>

            {/* EXP Bar wrapper */}
            <div className="mt-4 border-t border-white/5 pt-3">
              <div className="flex justify-between items-center text-[10px] text-gray-400 mb-1">
                <span>BOUNTY REWARDS (XP)</span>
                <span>{userProfile.xp} / {totalXpRequired}</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-red-600 to-[#FFB703] h-full rounded-full" style={{ width: `${xpPercentage}%` }}></div>
              </div>
            </div>
          </div>

          {/* Mini Statistics panel */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { l: "Quests", v: `${doneCount}/${QT.length}`, emoji: "📜", c: "text-blue-400" },
              { l: "Completed", v: userProfile.totalQuestsDone || 0, emoji: "✅", c: "text-green-400" },
              { l: "Awards", v: `${userProfile.achievements.filter(a => a.unlocked).length}/${AT.length}`, emoji: "🏆", c: "text-gold" }
            ].map((st, i) => (
              <div key={i} className="glass p-3 text-center flex flex-col items-center">
                <span className="text-xl mb-1">{st.emoji}</span>
                <span className={`cinzel text-base font-bold ${st.c} h-6`}>{st.v}</span>
                <span className="text-[10px] text-gray-400 block tracking-tight mt-0.5">{st.l}</span>
              </div>
            ))}
          </div>

          {/* Today's Voyage overview */}
          <div className="card text-left flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <span className="cinzel text-[10px] font-bold text-gray-400 uppercase tracking-widest">{TRANS[currentLangCode].todayVoyage}</span>
              <span className="text-xs font-bold text-[#22c55e]">
                {Math.round((doneCount / QT.length) * 100)}%
              </span>
            </div>
            {/* Voyage progress bar */}
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-4">
              <div className="bg-gradient-to-r from-[#FB8500] to-[#FFB703] h-full rounded-full" style={{ width: `${(doneCount / QT.length) * 100}%` }}></div>
            </div>

            <div className="divide-y divide-white/5">
              {QT.filter(q => !userProfile.questsProgress.find(p => p.id === q.id)?.done)
                .slice(0, 3)
                .map(q => (
                  <div key={q.id} className="flex items-center gap-3 py-3">
                    <span className="text-2xl w-8 text-center">{q.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="cinzel text-xs font-bold text-white overflow-hidden text-ellipsis whitespace-nowrap">{q.title[currentLangCode]}</div>
                      <div className="text-[11px] font-serif text-gray-400">{q.desc[currentLangCode]}</div>
                    </div>
                    <span className="cinzel text-xs font-bold text-[#FFB703] pl-2">+{q.xp}</span>
                  </div>
                ))}
              {QT.filter(q => !userProfile.questsProgress.find(p => p.id === q.id)?.done).length === 0 && (
                <div className="text-center py-4 text-xs font-serif text-[#22c55e]">
                  🎉 All standard daily quests locked in for today!
                </div>
              )}
            </div>

            <button onClick={() => setNavTab('quests')} className="border-t border-white/5 py-2 mt-2 w-full text-center text-gold/85 hover:text-white text-xxs font-bold uppercase tracking-wider">
              VIEW ALL QUESTS →
            </button>
          </div>

          {/* Quick Body status */}
          <div className="card text-left flex items-center justify-between">
            <div>
              <span className="cinzel text-[9px] font-bold text-gray-400 block tracking-widest">BODY STATUS</span>
              <span className="cinzel text-3xl font-extrabold block mt-0.5" style={{ color: bmiIndicator.c }}>{currentBmi}</span>
              <span className="text-xs font-serif block mt-0.5" style={{ color: bmiIndicator.c }}>{bmiIndicator.l}</span>
            </div>
            <div className="text-right">
              <span className="cinzel text-[9px] text-gray-400 block uppercase">Weight</span>
              <span className="cinzel text-xl font-bold block">{userProfile.weight}<span className="text-xs text-gray-400"> kg</span></span>
              <span className="text-[10px] text-gray-400 font-serif block mt-0.5">{userProfile.height} cm</span>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* TAB B: DAILY QUESTS & BOSS BATTLES */}
      {/* ──────────────────────────────────────────────────────── */}
      {navTab === 'quests' && (
        <div className="p-4 flex flex-col space-y-4">
          <div className="flex justify-between items-center mt-2">
            <div>
              <span className="cinzel text-[9px] text-gray-400 block tracking-widest">GRAND LINE MISSION</span>
              <h2 className="pirate text-2xl text-gold tracking-wider">DAILY QUESTS</h2>
            </div>
            <span className="cinzel text-[#22c55e] text-sm font-bold">{doneCount}/{QT.length}</span>
          </div>

          {/* Filtering row */}
          <div className="flex gap-1 overflow-x-auto pb-1 max-w-full">
            {['all', 'fitness', 'mind', 'health', 'social'].map(fKey => (
              <button
                key={fKey}
                onClick={() => setQuestFilter(fKey)}
                className={`py-1.5 px-3 rounded-full cinzel text-[9px] tracking-wider border transition-all duration-150 ${questFilter === fKey ? 'bg-red-600 border-red-500 text-white font-bold' : 'bg-white/5 border-white/10 text-gray-400'}`}
              >
                {fKey.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Interactive list of quests */}
          <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
            {QT.filter(q => questFilter === 'all' || q.cat === questFilter).map(q => {
              const isQuestDone = userProfile.questsProgress.find(p => p.id === q.id)?.done;
              const charStat = SC[q.stat as keyof typeof SC];

              return (
                <div key={q.id} className={`quest-row ${isQuestDone ? 'done' : ''}`}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 border ${isQuestDone ? 'bg-white/5 border-white/10' : 'bg-gold/10'}`}>
                    {isQuestDone ? '✅' : q.icon}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className={`cinzel text-xs font-bold leading-tight ${isQuestDone ? 'text-gray-505 line-through opacity-70' : 'text-white'}`}>
                      {q.title[currentLangCode]}
                    </div>
                    <div className="text-[10px] font-serif text-gray-400 mt-0.5">{q.desc[currentLangCode]}</div>
                    <div className="flex gap-2 mt-1.5">
                      <span className="text-[8px] font-bold py-0.5 px-2 rounded-full text-gold bg-gold/10">+{q.xp} XP</span>
                      <span className="text-[8px] font-bold py-0.5 px-2 rounded-full border border-white/5" style={{ color: charStat.color, background: `${charStat.color}15` }}>
                        {charStat.icon} +3
                      </span>
                    </div>
                  </div>

                  {!isQuestDone && (
                    <button
                      onClick={() => completeQuest(q.id)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/12 active:scale-90 transition-transform"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* ⚔️ BOSS BATTLES SUB-SECTION */}
          <div className="pt-4 border-t border-white/5">
            <span className="cinzel text-[9px] text-[#D62828] block tracking-widest font-bold mb-1">⚠️ DANGER ZONE</span>
            <h3 className="pirate text-2xl text-red-500 mb-4 tracking-wider">⚔️ BOSS BATTLES</h3>

            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 text-left font-serif">
              <span className="text-xs text-red-400 block font-bold uppercase tracking-wider mb-0.5">☠️ Boss Battle Warnings</span>
              <p className="text-xxs text-gray-300 leading-normal">Extreme weekly achievements. Complete them in real life to claim massive Bounty XP!</p>
            </div>

            <div className="flex flex-col gap-3">
              {BOSSES.map(b => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBoss(b)}
                  className="glass p-4 text-left border-l-[3px] shadow hover:translate-y-[-2px] transition-transform duration-100 cursor-pointer"
                  style={{ borderLeftColor: b.color }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl flex-shrink-0 w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">{b.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <span className="cinzel text-xs font-bold text-white overflow-hidden text-ellipsis whitespace-nowrap">{b.name[currentLangCode]}</span>
                        <span className="text-[8px] tracking-wider px-2 py-0.5 rounded-full font-bold" style={{ color: b.color, background: `${b.color}20` }}>
                          {b.diff}
                        </span>
                      </div>
                      <div className="flex gap-3 text-[10px] mt-1 text-gray-400 font-serif">
                        <span className="text-red-400">❤️ {b.hp} HP</span>
                        <span className="text-gold">🎁 +{b.reward} XP</span>
                      </div>
                      <div className="mt-2 text-[11px] text-gray-300 bg-black/20 p-2 rounded leading-relaxed">{b.desc[currentLangCode]}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* TAB C: PHYSICAL BODY BIO TRACKER */}
      {/* ──────────────────────────────────────────────────────── */}
      {navTab === 'body' && (
        <div className="p-4 flex flex-col space-y-4 text-left">
          <div className="mt-2">
            <span className="cinzel text-[9px] text-gray-400 block tracking-widest">PHYSICAL HEALTH MATRIX</span>
            <h2 className="pirate text-2xl text-[#FB8500] tracking-wider">BODY TRACKER</h2>
          </div>

          {/* BMI Dial Card */}
          <div className="glass p-5 border-opacity-35" style={{ borderColor: bmiIndicator.c }}>
            <div className="text-center mb-4">
              <span className="cinzel text-[9px] text-gray-400 block tracking-widest">DATA MASS RATIO</span>
              <span className="cinzel text-5xl font-black block mt-1" style={{ color: bmiIndicator.c }}>{currentBmi}</span>
              <span className="text-sm font-serif block mt-1" style={{ color: bmiIndicator.c }}>{bmiIndicator.l}</span>
            </div>

            {/* Slider bar indicator */}
            <div className="mb-4">
              <div className="relative h-2 rounded-full w-full bg-gradient-to-r from-blue-700 via-green-600 via-yellow-500 to-red-600">
                <div
                  className="absolute top-1/2 -translate-y-1/2 -ml-1 w-3.5 h-3.5 bg-white border border-black/40 rounded-full shadow"
                  style={{ left: `${Math.min(Math.max(((currentBmi - 15) / 25) * 100, 0), 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>15</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40</span>
              </div>
            </div>

            {/* Manual increments step fields */}
            <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
              <div>
                <span className="cinzel text-[9px] text-gray-400 tracking-wider">WEIGHT (KG)</span>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => {
                    const nextW = Math.round((Math.max(30, userProfile.weight - 0.5)) * 10) / 10;
                    saveData({ ...userProfile, weight: nextW });
                  }} className="adj-btn text-xs font-bold">-</button>
                  <span className="cinzel font-bold text-center flex-1">{userProfile.weight}</span>
                  <button onClick={() => {
                    const nextW = Math.round((userProfile.weight + 0.5) * 10) / 10;
                    saveData({ ...userProfile, weight: nextW });
                  }} className="adj-btn text-xs font-bold">+</button>
                </div>
              </div>

              <div>
                <span className="cinzel text-[9px] text-gray-400 tracking-wider">HEIGHT (CM)</span>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => {
                    const nextH = Math.max(100, userProfile.height - 1);
                    saveData({ ...userProfile, height: nextH });
                  }} className="adj-btn text-xs font-bold">-</button>
                  <span className="cinzel font-bold text-center flex-1">{userProfile.height}</span>
                  <button onClick={() => {
                    const nextH = Math.min(250, userProfile.height + 1);
                    saveData({ ...userProfile, height: nextH });
                  }} className="adj-btn text-xs font-bold">+</button>
                </div>
              </div>
            </div>
          </div>

          {/* Weight graph tracking representation custom SVG */}
          <div className="card">
            <span className="cinzel text-[10px] text-gray-400 font-bold block uppercase tracking-wider mb-4">{TRANS[currentLangCode].weightHistory}</span>
            <div className="flex items-end justify-between gap-1 h-24 mb-4">
              {userProfile.weightHistory && userProfile.weightHistory.length > 0 ? (
                userProfile.weightHistory.map((it, idx) => {
                  const minW = Math.min(...userProfile.weightHistory.map(w => w.w));
                  const maxW = Math.max(...userProfile.weightHistory.map(w => w.w));
                  const range = maxW - minW || 1;
                  const relativeHeight = `${Math.max(25, 25 + ((it.w - minW) / range) * 75)}%`;

                  const isLast = idx === userProfile.weightHistory.length - 1;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full select-none">
                      <span className="text-[8px] text-gray-400 font-serif leading-none">{it.w}</span>
                      <div
                        className={`w-full rounded-t transition-all ${isLast ? 'bg-[#FFB703] border-t border-[#FFB703]/50 shadow-[0_0_12px_rgba(255,183,3,0.4)]' : 'bg-[#0353A4]/60'}`}
                        style={{ height: relativeHeight }}
                      ></div>
                      <span className="text-[7.5px] text-gray-400 font-sans leading-none">{it.date.replace(/^\w+\s/, '')}</span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center w-full py-6 text-xs text-gray-500 font-serif">No weight logs registered yet.</div>
              )}
            </div>

            <button onClick={() => setShowWeightModal(true)} className="btn btn-ghost w-full py-3 rounded-xl text-xxs tracking-wider font-bold">
              + LOG TODAY'S WEIGHT ENTRY
            </button>
          </div>

          {/* Core Target analyses */}
          <div className="card">
            <span className="cinzel text-[10px] text-gray-400 font-bold block tracking-wider mb-2">{TRANS[currentLangCode].targetAnalysis}</span>
            <div className="divide-y divide-white/5 font-serif text-sm">
              <div className="flex justify-between py-2.5">
                <span className="text-gray-300">{TRANS[currentLangCode].idealRange}</span>
                <span className="cinzel text-green-400 font-bold">{idealMin} – {idealMax} kg</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-gray-300">{TRANS[currentLangCode].currentStatus}</span>
                <span className="cinzel font-bold" style={{ color: bmiIndicator.c }}>BMI {currentBmi}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-gray-300">{TRANS[currentLangCode].diffIdeal}</span>
                <span className="cinzel font-bold text-gray-400">{parseFloat(diffFromIdeal) > 0 ? '+' : ''}{diffFromIdeal} kg</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* TAB D: CREW STATUS & STATS & ACHIEVEMENTS */}
      {/* ──────────────────────────────────────────────────────── */}
      {navTab === 'crew' && (
        <div className="p-4 flex flex-col space-y-4 text-left">
          <div className="mt-2">
            <span className="cinzel text-[9px] text-gray-400 block tracking-widest">STRAW HAT STATUS CHRONICLES</span>
            <h2 className="pirate text-2xl text-gold tracking-wider">CREW STATUS</h2>
          </div>

          {/* Overview parameters list */}
          <div className="glass-gold p-4">
            <div className="grid grid-cols-2 gap-2">
              {[
                { l: "Name", v: userProfile.playerName },
                { l: "Rank Type", v: rankObj.r, c: rankObj.c },
                { l: "Level Limit", v: `Lv. ${userProfile.level}` },
                { l: "Crew Class", v: rankObj.lb[currentLangCode] },
                { l: "Total XP Gathered", v: userProfile.xp.toLocaleString() },
                { l: "Quest Recurrent Streak", v: `${userProfile.streak} Days`, c: "text-[#FB8500]" }
              ].map((it, idx) => (
                <div key={idx} className="bg-white/5 border border-white/5 p-3 rounded-xl">
                  <span className="cinzel text-[8.5px] text-gray-400 block uppercase tracking-wider">{it.l}</span>
                  <span className={`cinzel text-xs font-bold block mt-1 overflow-hidden text-ellipsis whitespace-nowrap ${it.c || 'text-white'}`}>{it.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Haki Habilitation Attribute columns */}
          <div className="card">
            <span className="cinzel text-[10px] text-gray-400 tracking-wider font-bold block uppercase mb-4">{TRANS[currentLangCode].hakiAttributes}</span>
            <div className="space-y-4">
              {Object.entries(userProfile.stats).map(([k, v]) => {
                const spec = SC[k as keyof typeof SC];
                if (!spec) return null;
                return (
                  <div key={k}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{spec.icon}</span>
                        <span className="cinzel text-xs text-gray-300 tracking-wide font-semibold">{spec.label}</span>
                      </div>
                      <span className="cinzel text-xs font-bold" style={{ color: spec.color }}>{v || 10}</span>
                    </div>

                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${v || 10}%`, background: `linear-gradient(90deg, ${spec.color}, ${spec.color}aa)` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements badge showcase */}
          <div className="pt-4 border-t border-white/5">
            <span className="cinzel text-[9.5px] text-gray-400 tracking-widest font-bold block uppercase">{TRANS[currentLangCode].allAchievements}</span>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {AT.map(a => {
                const isUnlocked = userProfile.achievements.find(p => p.id === a.id)?.unlocked;
                return (
                  <div key={a.id} className={`p-3 rounded-2xl border flex items-center gap-3 relative overflow-hidden ${isUnlocked ? 'bg-[#FFB703]/5 border-[#FFB703]/25' : 'bg-white/2 border-white/5'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 border ${isUnlocked ? 'bg-[#FFB703]/10 border-[#FFB703]/30' : 'bg-white/5 border-white/10'}`}>
                      {isUnlocked ? a.icon : '🔒'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className={`cinzel text-[10px] font-bold ${isUnlocked ? 'text-[#FFB703]' : 'text-gray-400'}`}>{a.title[currentLangCode]}</div>
                      <div className="text-[9px] font-serif text-gray-400 mt-0.5 leading-tight">{a.desc[currentLangCode]}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard visualization */}
          <div className="pt-4 border-t border-white/5">
            <span className="cinzel text-[9.5px] text-gold tracking-widest font-bold block uppercase">{TRANS[currentLangCode].leaderboardTitle}</span>
            <div className="mt-3 flex flex-col space-y-1.5">
              {[
                { name: userProfile.playerName, level: userProfile.level, xp: userProfile.xp, icon: rankObj.icon, isMe: true },
                { name: "Monkey D. Luffy", level: 99, xp: 99999, icon: "🏴‍☠️", isMe: false },
                { name: "Roronoa Zoro", level: 55, xp: 25000, icon: "⚔️", isMe: false },
                { name: "Nami", level: 40, xp: 12000, icon: "🍊", isMe: false },
                { name: "Sanji", level: 35, xp: 8000, icon: "🚬", isMe: false },
              ]
                .sort((a, b) => b.level - a.level || b.xp - a.xp)
                .map((p, index) => {
                  const medals = ["🥇", "🥈", "🥉"];
                  return (
                    <div key={index} className={`flex items-center gap-3 p-3 rounded-xl border ${p.isMe ? 'bg-[#FFB703]/15 border-[#FFB703]/40' : 'bg-white/5 border-white/10'}`}>
                      <span className="cinzel font-black text-xs min-w-[20px] text-center text-gold">{index < 3 ? medals[index] : `#${index + 1}`}</span>
                      <span className="text-lg">{p.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`cinzel text-xs font-bold truncate ${p.isMe ? 'text-[#FFB703]' : 'text-white'}`}>{p.name}</div>
                        <div className="text-[10px] font-serif text-gray-400">Lv.{p.level} • {p.xp.toLocaleString()} Bounty XP</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ── STICKY GLASS BOTTOM NAVIGATION BAR ── */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#060e1acc]/80 backdrop-blur-md border-t border-white/10 flex py-2 px-1 z-40 shadow-xl">
        <button onClick={() => setNavTab('dashboard')} className={`flex-1 flex flex-col items-center py-1 rounded-xl transition ${navTab === 'dashboard' ? 'text-gold' : 'text-gray-400'}`}>
          <span className="text-xl">🏠</span>
          <span className="text-[8px] font-bold cinzel mt-0.5">{TRANS[currentLangCode].home}</span>
        </button>
        <button onClick={() => setNavTab('quests')} className={`flex-1 flex flex-col items-center py-1 rounded-xl transition ${navTab === 'quests' ? 'text-gold' : 'text-gray-400'}`}>
          <span className="text-xl">⚔️</span>
          <span className="text-[8px] font-bold cinzel mt-0.5">{TRANS[currentLangCode].quests}</span>
        </button>
        <button onClick={() => setNavTab('body')} className={`flex-1 flex flex-col items-center py-1 rounded-xl transition ${navTab === 'body' ? 'text-gold' : 'text-gray-400'}`}>
          <span className="text-xl">⚖️</span>
          <span className="text-[8px] font-bold cinzel mt-0.5">{TRANS[currentLangCode].body}</span>
        </button>
        <button onClick={() => setNavTab('crew')} className={`flex-1 flex flex-col items-center py-1 rounded-xl transition ${navTab === 'crew' ? 'text-gold' : 'text-gray-400'}`}>
          <span className="text-xl">☠️</span>
          <span className="text-[8px] font-bold cinzel mt-0.5">{TRANS[currentLangCode].crew}</span>
        </button>
      </nav>

      {/* ──────────────────────────────────────────────────────── */}
      {/* SETTINGS OVERLAY SLIDE-OUT PANEL */}
      {/* ──────────────────────────────────────────────────────── */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setShowSettings(false)}>
          <div className="w-full max-w-sm glass p-6 flex flex-col text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="cinzel text-[9px] text-gray-400 tracking-wider">SYSTEM PANEL</span>
                <h4 className="cinzel text-base font-bold text-[#FFB703]">⚙️ {TRANS[currentLangCode].settings}</h4>
              </div>
              <button onClick={() => setShowSettings(false)} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs">✕</button>
            </div>

            {/* Language settings */}
            <div className="mb-6">
              <span className="cinzel text-[9px] text-gray-400 font-bold block uppercase mb-2">🌐 Language</span>
              <select
                value={pirateLang || 'bn'}
                onChange={(e) => {
                  const nextL = e.target.value as 'en' | 'bn';
                  setPirateLang(nextL);
                  localStorage.setItem('pirateLang', nextL);
                }}
                className="w-full bg-[#0a1628] border border-white/12 py-3 px-4 rounded-xl text-xs text-white uppercase cinzel font-bold font-sans"
              >
                <option value="en">🇺🇸 English</option>
                <option value="bn">🇧🇩 বাংলা</option>
              </select>
            </div>

            {/* Support section */}
            <div className="mb-6 border-t border-white/5 pt-4">
              <span className="cinzel text-[9px] text-gray-400 font-bold block uppercase mb-2">{TRANS[currentLangCode].contactSupport}</span>
              <a
                href="https://wa.me/8801817358567"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl"
              >
                <span className="text-2xl">💬</span>
                <div>
                  <span className="cinzel text-xs font-bold text-green-400 block font-sans">Captain WhatsApp</span>
                  <span className="text-xxs text-gray-400 block mt-0.5">+880 1817-358567</span>
                </div>
              </a>
            </div>

            {/* Action buttons */}
            <div className="mt-auto border-t border-white/5 pt-4 flex flex-col gap-2">
              <button
                onClick={async () => {
                  await auth.signOut();
                  localStorage.removeItem('guest_profile');
                  window.location.reload();
                }}
                className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl text-xxs font-bold cinzel tracking-widest hover:bg-white/10"
              >
                {TRANS[currentLangCode].logout}
              </button>

              {currentUser && (
                <button
                  onClick={async () => {
                    if (confirm(TRANS[currentLangCode].confirmDelete)) {
                      await db.ref(`players/${currentUser.uid}`).remove();
                      await currentUser.delete();
                      window.location.reload();
                    }
                  }}
                  className="w-full py-3 bg-red-600/10 border border-red-500/20 text-red-500 rounded-xl text-xxs font-bold cinzel tracking-widest hover:bg-red-600/20"
                >
                  {TRANS[currentLangCode].deleteAccount}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SELECTED BOSS CHALLENGE SPECS */}
      {selectedBoss && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setSelectedBoss(null)}>
          <div className="w-full max-w-sm glass p-6 text-center relative border-opacity-40" style={{ borderColor: selectedBoss.color }} onClick={(e) => e.stopPropagation()}>
            <span className="text-4xl block mb-2">{selectedBoss.icon}</span>
            <h4 className="cinzel text-lg font-bold block" style={{ color: selectedBoss.color }}>{selectedBoss.name[currentLangCode]}</h4>
            <span className="text-xxs tracking-wider px-2 py-0.5 rounded-full font-bold inline-block mt-0.5" style={{ color: selectedBoss.color, background: `${selectedBoss.color}20` }}>
              {selectedBoss.diff}
            </span>

            <div className="bg-white/5 border border-white/5 rounded-xl p-3 my-4 text-left">
              <span className="cinzel text-[8.5px] text-gray-400 tracking-wider block font-bold mb-1">📜 GOAL OBJECTIVES</span>
              <p className="text-xs text-gray-100 font-serif leading-relaxed">{selectedBoss.desc[currentLangCode]}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-red-500/5 border border-red-500/15 py-3.5 px-2 rounded-xl">
                <span className="cinzel text-[8px] text-red-400 block">DAMAGE TARGET HP</span>
                <span className="cinzel text-lg font-bold text-red-500 mt-1 block">⚔️ {selectedBoss.hp}</span>
              </div>
              <div className="bg-gold/5 border border-gold/15 py-3.5 px-2 rounded-xl">
                <span className="cinzel text-[8px] text-gold block">BOUNTY REWARD XP</span>
                <span className="cinzel text-lg font-bold text-gold mt-1 block">🎁 +{selectedBoss.reward}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <button
                onClick={() => {
                  setSelectedBoss(null);
                  triggerNotif(`Accepted Challenge: ${selectedBoss.name[currentLangCode]}!`, selectedBoss.color);
                }}
                className="btn btn-gold w-full py-3.5 rounded-xl text-xxs font-bold uppercase tracking-wider"
              >
                ⚓ ACCEPT CHALLENGE VOYAGE
              </button>
              <button onClick={() => setSelectedBoss(null)} className="btn btn-ghost w-full py-2.5 rounded-xl text-[10px] uppercase font-bold tracking-wider">
                RETREAT BASECAMP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RITUAL NAME EDIT MODAL */}
      {showNameModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setShowNameModal(false)}>
          <div className="w-full max-w-sm glass p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <span className="cinzel text-gold text-sm font-bold block uppercase mb-4">✏️ EDIT PIRATE NAME</span>

            <input
              type="text"
              placeholder="Captain name..."
              maxLength={18}
              value={userProfile.playerName}
              onChange={(e) => setUserProfile({ ...userProfile, playerName: e.target.value })}
              className="w-full text-center p-4 bg-white/5 border border-white/10 rounded-xl mb-4 font-semibold text-sm"
            />

            <button
              onClick={() => {
                if (!userProfile.playerName.trim()) return triggerNotif("Name cannot be empty!", "#D62828");
                saveData(userProfile);
                setShowNameModal(false);
                triggerNotif("Captain identity updated!", "#22c55e");
              }}
              className="btn btn-gold w-full py-3 rounded-xl uppercase tracking-wider text-xs font-bold"
            >
              CONFIRM IDENTITY
            </button>
          </div>
        </div>
      )}

      {/* WEIGHT LOGGER ENTRY MODAL */}
      {showWeightModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setShowWeightModal(false)}>
          <div className="w-full max-w-sm glass p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <span className="cinzel text-gold text-sm font-bold block uppercase mb-4">⚖️ LOG DAILY WEIGHT</span>

            <div className="flex items-center gap-4 justify-center mb-6">
              <button
                onClick={() => setUserProfile({ ...userProfile, weight: Math.round((Math.max(30, userProfile.weight - 0.5)) * 10) / 10 })}
                className="adj-btn text-lg"
              >
                -
              </button>
              <div className="min-w-[100px]">
                <span className="cinzel text-4xl block font-black text-white">{userProfile.weight}</span>
                <span className="text-xxs text-gray-500 uppercase font-sans">kilograms</span>
              </div>
              <button
                onClick={() => setUserProfile({ ...userProfile, weight: Math.round((userProfile.weight + 0.5) * 10) / 10 })}
                className="adj-btn text-lg"
              >
                +
              </button>
            </div>

            <button
              onClick={() => {
                const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                // Check if already registered today
                let currentHistory = [...userProfile.weightHistory];
                const matchedIdx = currentHistory.findIndex(h => h.date === todayStr);

                if (matchedIdx !== -1) {
                  currentHistory[matchedIdx].w = userProfile.weight;
                } else {
                  if (currentHistory.length >= 7) currentHistory.shift();
                  currentHistory.push({ date: todayStr, w: userProfile.weight });
                }

                saveData({ ...userProfile, weightHistory: currentHistory });
                setShowWeightModal(false);
                triggerNotif("⚖️ Weight logged properly!", "#FB8500");
              }}
              className="btn btn-gold w-full py-3.5 rounded-xl uppercase tracking-wider font-bold text-xs"
            >
              COMMIT RECORDENTRY
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
