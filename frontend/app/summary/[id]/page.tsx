'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useLanguage } from '../../../contexts/LanguageContext';
import { generatePDF } from '../../../utils/pdfExport';

export default function SummaryViewPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [displayedText, setDisplayedText] = useState<string[][]>([]);
  const [displayedHeadings, setDisplayedHeadings] = useState<string[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentPoint, setCurrentPoint] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isTypingHeading, setIsTypingHeading] = useState(true);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', text: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState<SpeechSynthesisUtterance | null>(null);

  const summaryData = {
    title: t('healthRecordSummary') || 'Health Record Summary',
    sections: [
      {
        heading: t('keyFindings') || 'Key Findings',
        points: [
          t('summaryPoint1') || 'Blood glucose levels were elevated over 3 consecutive fasting readings, indicating potential diabetes management needs.',
          t('summaryPoint2') || 'Current medication includes Metformin 500mg taken daily for blood sugar control.',
          t('summaryPoint3') || 'No known allergies documented in the record.'
        ]
      },
      {
        heading: t('currentTreatment') || 'Current Treatment',
        points: [
          t('treatmentPoint1') || 'Patient is on Metformin 500mg daily regimen.',
          t('treatmentPoint2') || 'Regular monitoring of blood glucose levels is ongoing.',
          t('treatmentPoint3') || 'No adverse reactions reported with current medication.'
        ]
      },
      {
        heading: t('followUpPlan') || 'Follow-up Plan',
        points: [
          t('followUpPoint1') || 'Follow-up appointment recommended to assess treatment effectiveness.',
          t('followUpPoint2') || 'Continued monitoring of blood sugar levels advised.',
          t('followUpPoint3') || 'Review medication dosage if needed during next visit.'
        ]
      }
    ]
  };

  // Initialize displayed text array
  useEffect(() => {
    const initialDisplay = summaryData.sections.map(section => 
      section.points.map(() => '')
    );
    setDisplayedText(initialDisplay);
    setDisplayedHeadings(summaryData.sections.map(() => ''));
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (currentSection >= summaryData.sections.length) {
      setIsTypingComplete(true);
      return;
    }

    const section = summaryData.sections[currentSection];

    // Type heading first
    if (isTypingHeading) {
      if (currentChar < section.heading.length) {
        const timer = setTimeout(() => {
          setDisplayedHeadings(prev => {
            const newHeadings = [...prev];
            newHeadings[currentSection] = section.heading.substring(0, currentChar + 1);
            return newHeadings;
          });
          setCurrentChar(prev => prev + 1);
        }, 10);
        return () => clearTimeout(timer);
      } else {
        // Heading complete, move to points
        setIsTypingHeading(false);
        setCurrentChar(0);
        return;
      }
    }

    // Type points
    if (currentPoint >= section.points.length) {
      setCurrentSection(prev => prev + 1);
      setCurrentPoint(0);
      setCurrentChar(0);
      setIsTypingHeading(true);
      return;
    }

    const point = section.points[currentPoint];
    if (currentChar < point.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => {
          const newDisplay = [...prev];
          newDisplay[currentSection] = [...newDisplay[currentSection]];
          newDisplay[currentSection][currentPoint] = point.substring(0, currentChar + 1);
          return newDisplay;
        });
        setCurrentChar(prev => prev + 1);
      }, 5);

      return () => clearTimeout(timer);
    } else {
      // Move to next point
      setTimeout(() => {
        setCurrentPoint(prev => prev + 1);
        setCurrentChar(0);
      }, 50);
    }
  }, [currentSection, currentPoint, currentChar, isTypingHeading, summaryData.sections]);

  const handleCopy = () => {
    let text = summaryData.title + '\n\n';
    summaryData.sections.forEach(section => {
      text += section.heading + ':\n';
      section.points.forEach(point => {
        text += `• ${point}\n`;
      });
      text += '\n';
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    const pdfData = {
      title: summaryData.title,
      patientId: params.id as string,
      generatedDate: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      sections: summaryData.sections
    };
    
    generatePDF(pdfData);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    // Add user message
    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput('');
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      let response = '';
      const lowerInput = userMessage.toLowerCase();

      if (lowerInput.includes('glucose') || lowerInput.includes('blood sugar')) {
        response = 'Based on your summary, your blood glucose levels were elevated over 3 consecutive fasting readings. This indicates a need for diabetes management. Your current medication (Metformin 500mg daily) is helping control blood sugar levels. Continue monitoring and follow up with your doctor as recommended.';
      } else if (lowerInput.includes('medication') || lowerInput.includes('metformin')) {
        response = 'You are currently taking Metformin 500mg daily for blood sugar control. No adverse reactions have been reported. It\'s important to take this medication as prescribed and never skip doses without consulting your doctor.';
      } else if (lowerInput.includes('allergy') || lowerInput.includes('allergies')) {
        response = 'According to your health record, no known allergies are documented. However, if you develop any allergic reactions to medications or foods, make sure to inform your healthcare provider immediately.';
      } else if (lowerInput.includes('follow up') || lowerInput.includes('appointment')) {
        response = 'A follow-up appointment is recommended to assess treatment effectiveness. During this visit, your doctor may review your medication dosage and continued monitoring of blood sugar levels will be advised.';
      } else {
        response = 'I can help answer questions about your health summary. Feel free to ask about your glucose levels, medications, treatment plan, or follow-up recommendations.';
      }

      setChatMessages(prev => [...prev, { role: 'assistant', text: response }]);
      setIsThinking(false);
    }, 1000);
  };

  const handleTextToSpeech = () => {
    if (isSpeaking) {
      // Stop speaking
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeech(null);
      return;
    }

    // Prepare text to speak
    let textToSpeak = summaryData.title + '. ';
    summaryData.sections.forEach(section => {
      textToSpeak += section.heading + '. ';
      section.points.forEach(point => {
        textToSpeak += point + '. ';
      });
    });

    // Create speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Map language codes to speech synthesis lang codes
    const langMap: Record<string, string> = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'bn': 'bn-IN',
      'te': 'te-IN',
      'mr': 'mr-IN',
      'ta': 'ta-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'pa': 'pa-IN',
      'or': 'or-IN'
    };
    
    const speechLang = langMap[language] || 'en-IN';
    
    // Get available voices and try to find the appropriate language voice
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(voice => voice.lang.startsWith(speechLang)) || 
                       voices.find(voice => voice.lang.startsWith(language)) ||
                       voices.find(voice => voice.lang.startsWith('en'));
    
    if (targetVoice) {
      utterance.voice = targetVoice;
    }
    
    utterance.lang = speechLang;
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeech(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpeech(null);
    };

    setCurrentSpeech(utterance);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Load voices when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Load voices
      window.speechSynthesis.getVoices();
      
      // Some browsers require this event to load voices
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }

    // Cleanup on unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-[100px] pb-8">
        {/* Professional Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">{t('healthRecordSummary') || 'Health Summary'}</h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  {t('aiGenerated') || 'AI-generated summary'} • ID: {params.id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-green-900/30 text-green-300 text-xs font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                {isTypingComplete ? (t('complete') || 'Complete') : (t('generating') || 'Generating...')}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 hover:bg-slate-700 transition shadow-sm flex items-center gap-2 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copied ? (t('copied') || 'Copied!') : (t('copy') || 'Copy')}
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 rounded-lg bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 hover:bg-slate-700 transition shadow-sm flex items-center gap-2 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('downloadPDF') || 'Download PDF'}
            </button>
            <Link
              href={`/export?id=${params.id}`}
              className="px-4 py-2 rounded-lg bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 hover:bg-slate-700 transition shadow-sm flex items-center gap-2 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {t('share') || 'Share'}
            </Link>
            <Link
              href={`/recommendations/${params.id}`}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl flex items-center gap-2 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              {t('recommendations') || 'Recommendations'}
            </Link>
          </div>
        </div>

        {/* Professional Summary Card */}
        <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-600/50 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-950/30 to-purple-950/30 px-8 py-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t('medicalSummary') || 'Medical Summary'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">{t('medicalSummarySubtext') || 'AI-powered analysis of your health record'}</p>
              </div>
              
              {/* Text-to-Speech Button */}
              <button
                onClick={handleTextToSpeech}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm font-medium ${
                  isSpeaking 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                title={isSpeaking ? 'Stop reading' : 'Listen to summary'}
              >
                {isSpeaking ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                    </svg>
                    {t('stop') || 'Stop'}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    {t('listen') || 'Listen'}
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="p-8">
            {summaryData.sections.map((section, sectionIndex) => {
              // Show section if we've started typing it
              const isVisible = sectionIndex <= currentSection;
              const displayHeading = displayedHeadings[sectionIndex] || '';
              const showHeadingCursor = currentSection === sectionIndex && isTypingHeading && !isTypingComplete;
              
              return (
                <div key={sectionIndex} className={sectionIndex > 0 ? 'mt-10 pt-8 border-t border-slate-700' : ''} style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}>
                  {isVisible && (
                    <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-blue-900/30 flex items-center justify-center text-blue-400 text-sm font-bold">{sectionIndex + 1}</span>
                      {displayHeading}
                      {showHeadingCursor && (
                        <span className="inline-block w-0.5 h-5 bg-blue-400 ml-1 animate-pulse"></span>
                      )}
                    </h3>
                  )}
                  <ul className="space-y-2">
                    {section.points.map((point, pointIndex) => {
                      const displayText = displayedText[sectionIndex]?.[pointIndex] || '';
                      const showCursor = currentSection === sectionIndex && 
                                        currentPoint === pointIndex && 
                                        !isTypingHeading &&
                                        !isTypingComplete;
                      
                      // Show bullet point if we're in this section or past it, and heading is done
                      const isPointVisible = (sectionIndex < currentSection || 
                                            (sectionIndex === currentSection && !isTypingHeading && pointIndex <= currentPoint));
                      
                      return (
                        <li key={pointIndex} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors" style={{ opacity: isPointVisible ? 1 : 0, transition: 'opacity 0.4s ease-in-out' }}>
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-900/30 flex items-center justify-center mt-0.5">
                            <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <p className="text-slate-200 leading-relaxed flex-1">
                          {displayText}
                          {showCursor && (
                            <span className="inline-block w-0.5 h-5 bg-blue-400 ml-1 animate-pulse"></span>
                          )}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          </div>
        </div>

        {/* AI Assistant Interface */}
        <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-600/50 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-950/30 to-blue-950/30 px-6 py-4 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">AI Medical Assistant</h3>
                <p className="text-xs text-slate-400">Ask questions about your summary</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Ask anything about your health summary..."
                  className="w-full px-5 py-3.5 pr-12 rounded-xl border-2 border-slate-600 bg-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 focus:bg-slate-700 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  <kbd className="px-2 py-1 bg-slate-700 rounded">↵</kbd>
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isThinking}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl disabled:shadow-none flex items-center gap-2"
              >
                {isThinking ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Professional Chat Messages */}
        {chatMessages.length > 0 && (
          <div className="mt-6 bg-slate-700/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-600/50 overflow-hidden">
            <div className="bg-slate-900 px-6 py-3 border-b border-slate-700">
              <p className="text-xs font-medium text-slate-400">Conversation History</p>
            </div>
            <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'bg-slate-900 border border-slate-700 text-slate-200'
                  }`}>
                    <p className="text-sm leading-relaxed">
                      {msg.text}
                    </p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center shadow-md">
                      <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
              {isThinking && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
