import './globals.css';
import type { ReactNode } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import ScrollGradient from '../components/ScrollGradient';
import Preloader from '../components/Preloader';

export const metadata = {
  title: 'CareInsight - Privacy-Safe Health Record Summarizer',
  description: 'Summarize medical reports without exposing personal data. AI-powered health management system with multi-language support.',
  keywords: 'health records, medical summarizer, healthcare, AI, privacy, patient care, electronic health records, EHR, medical reports, health data, patient management, doctor dashboard, medical AI, health technology, clinical summaries, HIPAA compliant, secure healthcare, medical data privacy, health information system, patient records, medical documentation, healthcare software, telemedicine, digital health, medical records management, AI healthcare, machine learning healthcare, natural language processing medical, healthcare analytics, patient portal, medical diagnosis, treatment recommendations, health monitoring, clinical decision support, medical record redaction, PHI protection, patient data security, healthcare compliance, medical record summarization, clinical notes, discharge summaries, lab reports, radiology reports, pathology reports, medication management, prescription tracking, patient history, medical charts, healthcare informatics, health information exchange, interoperability healthcare, medical record keeping, patient confidentiality, healthcare data protection, medical information system, clinical data management, healthcare IT, health tech, digital medical records, online health records, cloud healthcare, medical cloud storage, healthcare database, patient information system, medical workflow, clinical workflow, healthcare automation, AI medical assistant, smart healthcare, connected health, mHealth, telehealth, remote patient monitoring, virtual care, e-health, healthcare innovation, medical technology, health informatics, clinical informatics, biomedical informatics, healthcare solutions, medical software, hospital information system, clinic management, practice management, medical practice software, healthcare platform, health record system, medical record system, patient engagement, healthcare communication, medical collaboration, care coordination, continuity of care, patient outcomes, quality of care, healthcare efficiency, medical productivity, clinical efficiency, healthcare optimization, medical data analytics, predictive healthcare, personalized medicine, precision medicine, patient-centered care, value-based care, population health, public health informatics, health data science, medical data science, healthcare big data, medical insights, clinical insights, evidence-based medicine, clinical guidelines, medical protocols, treatment plans, care plans, patient education, health literacy, medical terminology, ICD codes, CPT codes, medical coding, medical billing, healthcare administration, medical office software, EMR system, electronic medical records, personal health records, PHR, health record app, medical record app, healthcare app, health app, patient app, doctor app, medical professional tools, healthcare tools, clinical tools, diagnostic tools, medical device integration, lab integration, pharmacy integration, healthcare interoperability, HL7, FHIR, health data standards, medical data exchange, healthcare API, medical API, health information technology, HIT, healthcare cybersecurity, medical data breach prevention, patient data protection, GDPR healthcare, data privacy regulations, healthcare regulations, medical compliance, clinical compliance, healthcare auditing, medical record auditing, quality assurance healthcare, patient safety, medication safety, adverse event reporting, clinical trial management, research data management, medical research, clinical research, healthcare research, patient registry, disease registry, health outcomes research, healthcare quality improvement, clinical quality measures, performance metrics healthcare, healthcare KPIs, medical benchmarking, healthcare reporting, clinical reporting, medical dashboards, healthcare dashboards, real-time healthcare data, healthcare alerts, clinical alerts, patient notifications, healthcare messaging, secure messaging healthcare, HIPAA secure messaging, encrypted healthcare communication',
  authors: [{ name: 'CareInsight Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'CareInsight - Privacy-Safe Health Record Summarizer',
    description: 'AI-powered health management system with multi-language support and secure medical record summarization',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CareInsight - Privacy-Safe Health Record Summarizer',
    description: 'AI-powered health management system with multi-language support',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/LOGO NOBGN.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Jost:ital,wght@0,100..900;1,100..900&family=Monda:wght@400..700&family=Montserrat:wght@400;700&family=Righteous&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Preloader />
        <ScrollGradient />
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
