/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';

import { Header } from './components/Header';
import { EmptyChatHero } from './components/EmptyChatHero';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Sidebar } from './components/Sidebar';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SettingsModal } from './components/SettingsModal';
import { BrochureModal } from './components/BrochureModal';
import LoginPage from "./LoginPage";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

import {
  AppSettings,
  ChatSession,
  Message,
  CollegeCategoryKey
} from './types';

import { processCollegeQuery } from './services/apiConnector';
import { playMessageSound } from './utils/sound';
import { getPreferredName } from './utils/preferredName';

import {
  SUGGESTED_QUICK_CHIPS,
  CATEGORIES,
  COLLEGE_INFO
} from './data/collegeData';

import {
  GraduationCap,
  Bot
} from 'lucide-react';


const DEFAULT_SETTINGS: AppSettings = {

  backendMode: 'custom_api',
  
  customApiUrl:
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001/predict',

  apiAuthToken: '',

  simulatedDelayMs: 400,

  voiceReadout: true,

  soundEffects: true,

  confidenceThreshold: 0.3,

  mobileViewOnly: false,

  theme: 'dark',

};


function generateId(): string {

  return (
    Math.random()
      .toString(36)
      .substring(2, 11)
    +
    Date.now()
      .toString(36)
  );

}


function getFormattedTime(): string {

  const now = new Date();

  return now.toLocaleTimeString(
    [],
    {
      hour: '2-digit',
      minute: '2-digit'
    }
  );

}


export default function App() {

  // ============================================================
  // FIREBASE AUTHENTICATION
  // ============================================================

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ============================================================
  // SETTINGS
  // ============================================================

  const [settings, setSettings] =
    useState<AppSettings>(() => {

      try {

        const saved =
          localStorage.getItem(
            'college_chatbot_settings'
          );

        if (saved) {

          const parsed =
            JSON.parse(saved);

          return {
            ...DEFAULT_SETTINGS,
            ...parsed,
            customApiUrl: DEFAULT_SETTINGS.customApiUrl,
          };

        }

        return DEFAULT_SETTINGS;

      } catch {

        return DEFAULT_SETTINGS;

      }

    });


  const handleLogin = (user: User) => {
    setCurrentUser(user);

    const freshSession: ChatSession = {
      id: generateId(),
      title: 'New College Enquiry',
      createdAt: new Date().toLocaleDateString(),
      updatedAt: getFormattedTime(),
      messages: [],
    };

    setSessions([freshSession]);
    setActiveSessionId(freshSession.id);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isDark =
    settings.theme !== 'light';

  const preferredName = getPreferredName(currentUser);


  // ============================================================
  // APPLY THEME
  // ============================================================

  useEffect(() => {

    if (isDark) {

      document.documentElement.classList.add(
        'dark'
      );

      document.documentElement.classList.remove(
        'light'
      );

    } else {

      document.documentElement.classList.remove(
        'dark'
      );

      document.documentElement.classList.add(
        'light'
      );

    }

  }, [isDark]);


  const handleToggleTheme = () => {

    setSettings(
      (prev) => ({

        ...prev,

        theme:
          prev.theme === 'light'
            ? 'dark'
            : 'light',

      })
    );

  };


  // ============================================================
  // CHAT SESSIONS
  // ============================================================

  const [sessions, setSessions] =
    useState<ChatSession[]>(() => {

      try {

        const saved =
          localStorage.getItem(
            'college_chatbot_sessions'
          );

        if (saved) {

          const parsed =
            JSON.parse(saved);

          if (
            Array.isArray(parsed)
            &&
            parsed.length > 0
          ) {

            return parsed;

          }

        }

      } catch {

        // Ignore localStorage errors

      }


      const initialId =
        generateId();


      return [

        {

          id: initialId,

          title:
            'New College Enquiry',

          createdAt:
            new Date()
              .toLocaleDateString(),

          updatedAt:
            getFormattedTime(),

          messages: [],

        }

      ];

    });


  // ============================================================
  // APP STATES
  // ============================================================

  const [

    activeSessionId,

    setActiveSessionId

  ] = useState<string>(

    () =>
      sessions[0]?.id
      ||
      generateId()

  );


  const [

    isLoading,

    setIsLoading

  ] = useState<boolean>(false);


  const [

    isHistoryOpen,

    setIsHistoryOpen

  ] = useState<boolean>(false);


  // Hidden settings state
  // We will use this later for Admin access

  const [

    isSettingsOpen,

    setIsSettingsOpen

  ] = useState<boolean>(false);


  const [

    isBrochureOpen,

    setIsBrochureOpen

  ] = useState<boolean>(false);


  const messagesEndRef =
    useRef<HTMLDivElement>(null);


  // ============================================================
  // SAVE SETTINGS
  // ============================================================

  useEffect(() => {

    try {

      localStorage.setItem(

        'college_chatbot_settings',

        JSON.stringify(settings)

      );

    } catch {

      // Ignore localStorage errors

    }

  }, [settings]);


  // ============================================================
  // SAVE CHAT SESSIONS
  // ============================================================

  useEffect(() => {

    try {

      localStorage.setItem(

        'college_chatbot_sessions',

        JSON.stringify(sessions)

      );

    } catch {

      // Ignore localStorage errors

    }

  }, [sessions]);


  // ============================================================
  // ACTIVE SESSION
  // ============================================================

  const activeSession =

    sessions.find(
      (s) =>
        s.id === activeSessionId
    )

    ||

    sessions[0];


  // ============================================================
  // AUTO SCROLL
  // ============================================================

  const scrollToBottom = () => {

    messagesEndRef.current
      ?.scrollIntoView({

        behavior: 'smooth'

      });

  };


  useEffect(() => {

    scrollToBottom();

  }, [

    activeSession?.messages,

    isLoading

  ]);


  // ============================================================
  // SEND MESSAGE
  // ============================================================

  const handleSendMessage =
    async (

      text: string,

      categoryHint?: CollegeCategoryKey

    ) => {


      if (

        !text.trim()

        ||

        isLoading

      ) {

        return;

      }


      const userMessage: Message = {

        id:
          generateId(),

        sender:
          'user',

        text:
          text.trim(),

        timestamp:
          getFormattedTime(),

        category:
          categoryHint,

      };


      // Play send sound

      if (
        settings.soundEffects
      ) {

        playMessageSound(
          'send'
        );

      }


      const updatedMessages = [

        ...(activeSession?.messages || []),

        userMessage

      ];


      const sessionTitle =

        activeSession.messages.length === 0

          ?

          text.length > 35

            ?

            text.slice(
              0,
              32
            )
            +
            '...'

            :

            text

          :

          activeSession.title;


      // Update user message

      setSessions(

        (prev) =>

          prev.map(

            (s) =>

              s.id === activeSessionId

                ?

                {

                  ...s,

                  title:
                    sessionTitle,

                  updatedAt:
                    getFormattedTime(),

                  messages:
                    updatedMessages,

                }

                :

                s

          )

      );


      setIsLoading(true);


      try {


        // ====================================================
        // SEND TO BACKEND
        // ====================================================

        const responsePayload =

          await processCollegeQuery(

            text,

            settings,

            activeSession.messages

          );


        const botMessage: Message = {

          id:
            generateId(),

          sender:
            'bot',

          text:
            responsePayload.text,

          timestamp:
            getFormattedTime(),

          category:
            responsePayload.category,

          confidence:
            responsePayload.confidence,

          relatedQuestions:
            responsePayload.relatedQuestions,

          actionData:
            responsePayload.actionData,

        };


        // Play receive sound

        if (
          settings.soundEffects
        ) {

          playMessageSound(
            'receive'
          );

        }


        // Add bot response

        setSessions(

          (prev) =>

            prev.map(

              (s) =>

                s.id === activeSessionId

                  ?

                  {

                    ...s,

                    updatedAt:
                      getFormattedTime(),

                    messages: [

                      ...updatedMessages,

                      botMessage

                    ],

                  }

                  :

                  s

            )

        );


      } catch (err) {


        console.error(

          'Error handling query:',

          err

        );


        const errorMessage: Message = {

          id:
            generateId(),

          sender:
            'bot',

          text:

            `We are currently updating our admissions records. You can directly contact the Admissions Helpline at **${COLLEGE_INFO.contact.helpline}** or retry in a moment.`,

          timestamp:
            getFormattedTime(),

          category:
            'admissions',

          relatedQuestions:

            SUGGESTED_QUICK_CHIPS
              .slice(0, 3),

        };


        setSessions(

          (prev) =>

            prev.map(

              (s) =>

                s.id === activeSessionId

                  ?

                  {

                    ...s,

                    messages: [

                      ...updatedMessages,

                      errorMessage

                    ],

                  }

                  :

                  s

            )

        );


      } finally {


        setIsLoading(false);


      }


    };


  // ============================================================
  // SELECT CATEGORY
  // ============================================================

  const handleSelectCategory =

    (
      categoryKey:
        CollegeCategoryKey
    ) => {


      const categoryInfo =

        CATEGORIES.find(

          (c) =>
            c.key === categoryKey

        );


      const query =

        categoryInfo

          ?

          categoryInfo.sampleQuestions[0]

          :

          `Tell me about ${categoryKey}`;


      handleSendMessage(

        query,

        categoryKey

      );


    };


  // ============================================================
  // NEW CHAT
  // ============================================================

  const handleNewChat = () => {


    const newSession: ChatSession = {

      id:
        generateId(),

      title:
        'New College Enquiry',

      createdAt:
        new Date()
          .toLocaleDateString(),

      updatedAt:
        getFormattedTime(),

      messages: [],

    };


    setSessions(

      (prev) => [

        newSession,

        ...prev

      ]

    );


    setActiveSessionId(

      newSession.id

    );


  };


  // ============================================================
  // DELETE CHAT
  // ============================================================

  const handleDeleteSession = (

    id: string

  ) => {


    setSessions(

      (prev) => {


        const remaining =

          prev.filter(

            (s) =>
              s.id !== id

          );


        if (
          remaining.length === 0
        ) {


          const fresh = {

            id:
              generateId(),

            title:
              'New College Enquiry',

            createdAt:
              new Date()
                .toLocaleDateString(),

            updatedAt:
              getFormattedTime(),

            messages: [],

          };


          setActiveSessionId(
            fresh.id
          );


          return [

            fresh

          ];

        }


        if (
          activeSessionId === id
        ) {

          setActiveSessionId(

            remaining[0].id

          );

        }


        return remaining;


      }

    );


  };


  // ============================================================
  // RENAME CHAT
  // ============================================================

  const handleRenameSession = (

    id: string,

    newTitle: string

  ) => {


    setSessions(

      (prev) =>

        prev.map(

          (s) =>

            s.id === id

              ?

              {

                ...s,

                title:
                  newTitle

              }

              :

              s

        )

    );


  };


  // ============================================================
  // CLEAR ALL CHATS
  // ============================================================

  const handleClearAllChats = () => {


    const fresh = {

      id:
        generateId(),

      title:
        'New College Enquiry',

      createdAt:
        new Date()
          .toLocaleDateString(),

      updatedAt:
        getFormattedTime(),

      messages: [],

    };


    setSessions([

      fresh

    ]);


    setActiveSessionId(

      fresh.id

    );


  };


  // ============================================================
  // CHECK IF CHAT IS EMPTY
  // ============================================================

  const isChatEmpty =

    !activeSession?.messages

    ||

    activeSession.messages.length === 0;


  // ============================================================
  // AUTH GATE
  // ============================================================

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#09090b]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="text-sm text-white/50">Loading...</div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // ============================================================
  // UI
  // ============================================================

  return (

    <div

      className={`w-full min-w-0 h-[100dvh] overflow-hidden flex transition-colors duration-200 ${
        isDark

          ?

          'text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200'

          :

          'text-slate-800 selection:bg-emerald-200 selection:text-emerald-900'

      }`}

      style={{

        background:

          isDark

            ?

            'radial-gradient(circle at top right, #062820 0%, #020606 100%)'

            :

            'radial-gradient(circle at top right, #e8f8f2 0%, #f4faf7 45%, #ffffff 100%)'

      }}

    >


      {/* ======================================================
          LEFT SIDEBAR
      ====================================================== */}

      {!settings.mobileViewOnly && (

        <div className="hidden md:flex h-full">

          <Sidebar

            sessions={sessions}

            activeSessionId={
              activeSessionId
            }

            onSelectSession={
              (id) =>
                setActiveSessionId(id)
            }

            onNewChat={
              handleNewChat
            }

            onDeleteSession={
              handleDeleteSession
            }

            onRenameSession={
              handleRenameSession
            }

            settings={
              settings
            }

            currentUser={
              currentUser
            }

            preferredName={
              preferredName
            }

            onLogout={
              handleLogout
            }

          />

        </div>

      )}


      {/* ======================================================
          MAIN APP
      ====================================================== */}

      <div

        className={`flex-1 flex flex-col h-full min-w-0 overflow-hidden ${
          settings.mobileViewOnly

            ?

            isDark

              ?

              'w-[calc(100vw-1rem)] max-w-[420px] mx-auto my-2 sm:my-4 rounded-[24px] sm:rounded-[36px] border-2 sm:border-4 border-emerald-900/40 shadow-2xl overflow-hidden h-[calc(100dvh-1rem)] sm:h-[95vh]'

              :

              'w-[calc(100vw-1rem)] max-w-[420px] mx-auto my-2 sm:my-4 rounded-[24px] sm:rounded-[36px] border-2 sm:border-4 border-emerald-300 shadow-2xl overflow-hidden h-[calc(100dvh-1rem)] sm:h-[95vh] bg-white'

            :

            ''

        }`}

      >


        {/* ====================================================
            HEADER
        ==================================================== */}

        <Header

          onNewChat={
            handleNewChat
          }

          onOpenHistory={
            () =>
              setIsHistoryOpen(true)
          }

          onOpenBrochure={
            () =>
              setIsBrochureOpen(true)
          }

          onOpenSettings={
            () =>
              setIsSettingsOpen(true)
          }

          settings={
            settings
          }

          onToggleMobileView={
            () =>

              setSettings({

                ...settings,

                mobileViewOnly:

                  !settings.mobileViewOnly

              })

          }

          onToggleTheme={
            handleToggleTheme
          }

          chatCount={
            sessions.length
          }

        />


        {/* ====================================================
            CHAT AREA
        ==================================================== */}

        <main className="flex-1 min-w-0 flex flex-col overflow-x-hidden overflow-y-auto px-2 sm:px-6 md:px-8 pt-2 sm:pt-4 pb-4 sm:pb-10 no-scrollbar">


          {isChatEmpty ? (


            <EmptyChatHero

              onSelectPrompt={
                (
                  prompt,
                  catKey
                ) =>

                  handleSendMessage(

                    prompt,

                    catKey as CollegeCategoryKey

                  )
              }

              onOpenBrochure={
                () =>
                  setIsBrochureOpen(true)
              }

              preferredName={
                preferredName
              }

              isDark={
                isDark
              }

            />


          ) : (


            <div className="max-w-4xl w-full min-w-0 mx-auto py-2 pb-8 space-y-4">


              {/* Session Banner */}

              <div className="flex items-center justify-center my-1">

                <div

                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border ${
                    isDark

                      ?

                      'bg-emerald-950/40 border-emerald-900/40 text-emerald-400/90'

                      :

                      'bg-emerald-100/70 border-emerald-300 text-emerald-800'

                  }`}

                >

                  <GraduationCap

                    className={`w-3.5 h-3.5 ${
                      isDark

                        ?

                        'text-emerald-400'

                        :

                        'text-emerald-700'

                    }`}

                  />

                  <span>

                    College Enquiry • {COLLEGE_INFO.name}

                  </span>

                </div>

              </div>


              {/* Messages */}

              {activeSession.messages.map(

                (message) => (

                  <ChatMessage

                    key={
                      message.id
                    }

                    message={
                      message
                    }

                    onSelectSuggestion={
                      (q) =>
                        handleSendMessage(q)
                    }

                    onOpenBrochure={
                      () =>
                        setIsBrochureOpen(true)
                    }

                    isDark={
                      isDark
                    }

                  />

                )

              )}


              {/* Typing Indicator */}

              {isLoading && (

                <div className="flex items-start gap-2.5 sm:gap-3.5 my-3.5 sm:my-4 animate-in fade-in duration-200">


                  <div

                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center border shadow-md shrink-0 select-none ${
                      isDark

                        ?

                        'bg-gradient-to-br from-emerald-500/20 via-teal-500/30 to-emerald-600/40 border-emerald-400/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'

                        :

                        'bg-emerald-100 border-emerald-300 text-emerald-800 shadow-xs'

                    }`}

                  >

                    <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-400" />

                  </div>


                  <div

                    className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl rounded-tl-xs border backdrop-blur-xl flex items-center gap-3 ${
                      isDark

                        ?

                        'bg-[#081b12]/85 border-emerald-500/20 shadow-[0_10px_35px_rgba(0,0,0,0.6)]'

                        :

                        'bg-white/95 border-emerald-200 shadow-xs'

                    }`}

                  >

                    <div className="flex items-center gap-1.5 px-1">

                      <span
                        className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"
                        style={{
                          animationDelay: '0ms'
                        }}
                      />

                      <span
                        className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"
                        style={{
                          animationDelay: '150ms'
                        }}
                      />

                      <span
                        className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"
                        style={{
                          animationDelay: '300ms'
                        }}
                      />

                    </div>


                    <span

                      className={`text-xs font-medium tracking-tight ${
                        isDark

                          ?

                          'text-emerald-300'

                          :

                          'text-emerald-800'

                      }`}

                    >

                      Consulting official college records...

                    </span>

                  </div>

                </div>

              )}


              <div
                ref={
                  messagesEndRef
                }
              />

            </div>


          )}


        </main>


        {/* ====================================================
            CHAT INPUT
        ==================================================== */}

        <footer className="w-full shrink-0 relative z-20">

          <ChatInput

            onSend={
              (text) =>
                handleSendMessage(text)
            }

            isLoading={
              isLoading
            }

            onSelectCategory={
              handleSelectCategory
            }

            isDark={
              isDark
            }

          />

        </footer>


      </div>


      {/* ======================================================
          MOBILE HISTORY
      ====================================================== */}

      <HistoryDrawer

        isOpen={
          isHistoryOpen
        }

        onClose={
          () =>
            setIsHistoryOpen(false)
        }

        sessions={
          sessions
        }

        activeSessionId={
          activeSessionId
        }

        onSelectSession={
          (id) =>
            setActiveSessionId(id)
        }

        onNewSession={
          handleNewChat
        }

        onDeleteSession={
          handleDeleteSession
        }

        onRenameSession={
          handleRenameSession
        }

        currentUser={
          currentUser
        }

        preferredName={
          preferredName
        }

        onLogout={
          handleLogout
        }

        isDark={
          isDark
        }

      />


      {/* ======================================================
          SETTINGS MODAL
          Student preferences and support
      ====================================================== */}

      <SettingsModal

        isOpen={
          isSettingsOpen
        }

        onClose={
          () =>
            setIsSettingsOpen(false)
        }

        settings={
          settings
        }

        onSaveSettings={
          (newSettings) =>
            setSettings(newSettings)
        }

        onClearAllChats={
          handleClearAllChats
        }

        isDark={
          isDark
        }

      />


      {/* ======================================================
          BROCHURE MODAL
      ====================================================== */}

      <BrochureModal

        isOpen={
          isBrochureOpen
        }

        onClose={
          () =>
            setIsBrochureOpen(false)
        }

        onSelectCategory={
          handleSelectCategory
        }

        isDark={
          isDark
        }

      />


    </div>

  );

}