import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
    English: {
        // Navigation / Sidebar
        dashboard: "Dashboard",
        myJobs: "My Jobs",
        projects: "Projects",
        findWorkers: "Find Workers",
        postJob: "Post Job",
        applications: "Applications",
        profile: "Profile",
        messages: "Messages",
        settings: "Settings",
        logout: "Logout",
        findJobs: "Find Jobs",
        activeJobs: "Active Jobs",
        earnings: "Earnings",

        // Header
        goodMorning: "Good morning",
        goodAfternoon: "Good afternoon",
        goodEvening: "Good evening",
        welcomeBack: "Welcome back",
        headerSubtitleContractor: "Here's what's happening with your projects today.",
        headerSubtitleWorker: "Here's what's happening with your work",
        postNewJob: "Post New Job",

        // Settings
        appearance: "Appearance",
        themeDesc: "Toggle dark theme for the entire dashboard.",
        language: "Language",
        languageDesc: "Select your preferred language.",
        moreSettings: "More settings coming soon...",

        // Common
        loading: "Loading...",
        save: "Save",
        cancel: "Cancel",
        edit: "Edit",
        delete: "Delete"
    },
    Hindi: {
        // Navigation / Sidebar
        dashboard: "डैशबोर्ड",
        myJobs: "मेरी नौकरियां",
        projects: "प्रोजेक्ट्स",
        findWorkers: "श्रमिक खोजें",
        postJob: "नौकरी पोस्ट करें",
        applications: "आवेदन",
        profile: "प्रोफ़ाइल",
        messages: "संदेश",
        settings: "सेटिंग्स",
        logout: "लॉग आउट",
        findJobs: "नौकरियां खोजें",
        activeJobs: "सक्रिय नौकरियां",
        earnings: "कमाई",

        // Header
        goodMorning: "सुप्रभात",
        goodAfternoon: "शुभ दोपहर",
        goodEvening: "शुभ संध्या",
        welcomeBack: "वापसी पर स्वागत है",
        headerSubtitleContractor: "यहाँ देखें आज आपके प्रोजेक्ट्स के साथ क्या हो रहा है।",
        headerSubtitleWorker: "यहाँ देखें आज आपके काम के साथ क्या हो रहा है।",
        postNewJob: "नई नौकरी पोस्ट करें",

        // Settings
        appearance: "दिखावट (Appearance)",
        themeDesc: "पूरे डैशबोर्ड के लिए डार्क थीम टॉगल करें।",
        language: "भाषा (Language)",
        languageDesc: "अपनी पसंदीदा भाषा चुनें।",
        moreSettings: "और सेटिंग्स जल्द आ रही हैं...",

        // Common
        loading: "लोड हो रहा है...",
        save: "सहेजें",
        cancel: "रद्द करें",
        edit: "संपादित करें",
        delete: "हटाएं"
    },
    Gujarati: {
        // Navigation / Sidebar
        dashboard: "ડેશબોર્ડ",
        myJobs: "મારી નોકરીઓ",
        projects: "પ્રોજેક્ટ્સ",
        findWorkers: "કામદારો શોધો",
        postJob: "નોકરી પોસ્ટ કરો",
        applications: "અરજીઓ",
        profile: "પ્રોફાઇલ",
        messages: "સંદેશાઓ",
        settings: "સેટિંગ્સ",
        logout: "લૉગ આઉટ",
        findJobs: "નોકરીઓ શોધો",
        activeJobs: "સક્રિય નોકરીઓ",
        earnings: "કમાણી",

        // Header
        goodMorning: "શુભ સવાર",
        goodAfternoon: "શુભ બપોર",
        goodEvening: "શુભ સાંજ",
        welcomeBack: "પાછા ફરવા બદલ સ્વાગત છે",
        headerSubtitleContractor: "અહીં જુઓ આજે તમારા પ્રોજેક્ટ્સ સાથે શું થઈ રહ્યું છે.",
        headerSubtitleWorker: "અહીં જુઓ આજે તમારા કામ સાથે શું થઈ રહ્યું છે.",
        postNewJob: "નવી નોકરી પોસ્ટ કરો",

        // Settings
        appearance: "દેખાવ (Appearance)",
        themeDesc: "આખા ડેશબોર્ડ માટે ડાર્ક થીમ ટૉગલ કરો.",
        language: "ભાષા (Language)",
        languageDesc: "તમારી પસંદગીની ભાષા પસંદ કરો.",
        moreSettings: "વધુ સેટિંગ્સ ટૂંક સમયમાં આવી રહ્યા છે...",

        // Common
        loading: "લોડ થઈ રહ્યું છે...",
        save: "સાચવો",
        cancel: "રદ કરો",
        edit: "ફેરફાર કરો",
        delete: "કાઢી નાખો"
    }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState(() => {
        const savedLang = localStorage.getItem('language');
        return savedLang && translations[savedLang] ? savedLang : 'English';
    });

    const setLanguage = (lang) => {
        if (translations[lang]) {
            setLanguageState(lang);
            localStorage.setItem('language', lang);
        }
    };

    // Translation function
    const t = (key) => {
        return translations[language][key] || translations['English'][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
