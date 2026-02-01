import jsPDF from 'jspdf';

interface SummarySection {
  heading: string;
  points: string[];
}

interface SummaryData {
  title: string;
  sections: SummarySection[];
  patientId?: string;
  generatedDate?: string;
}

export const generatePDF = (summaryData: SummaryData): void => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add text with word wrap
  const addText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize: number,
    isBold: boolean = false
  ): number => {
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    
    lines.forEach((line: string, index: number) => {
      if (y + (index * fontSize * 0.35) > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(line, x, y + (index * fontSize * 0.35));
    });
    
    return y + (lines.length * fontSize * 0.35);
  };

  // Add header with gradient effect (simulated with colored rectangle)
  pdf.setFillColor(30, 41, 59); // slate-800
  pdf.rect(0, 0, pageWidth, 40, 'F');

  // Logo/Icon placeholder
  pdf.setFillColor(59, 130, 246); // blue-500
  pdf.circle(margin, 20, 8, 'F');
  
  // Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.text('CareInsight', margin + 12, 22);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text('Privacy-Safe Health Record Summarizer', margin + 12, 28);

  yPosition = 50;

  // Document Title
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  yPosition = addText(summaryData.title, margin, yPosition, contentWidth, 20, true);
  yPosition += 8;

  // Add metadata
  if (summaryData.patientId || summaryData.generatedDate) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    
    if (summaryData.patientId) {
      pdf.text(`Patient ID: ${summaryData.patientId}`, margin, yPosition);
      yPosition += 5;
    }
    
    if (summaryData.generatedDate) {
      pdf.text(`Generated: ${summaryData.generatedDate}`, margin, yPosition);
      yPosition += 5;
    }
    
    yPosition += 5;
  }

  // Add divider line
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Process sections
  summaryData.sections.forEach((section, sectionIndex) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = margin;
    }

    // Section heading
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    yPosition = addText(section.heading, margin, yPosition, contentWidth, 16, true);
    yPosition += 8;

    // Section points
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.setTextColor(50, 50, 50);

    section.points.forEach((point, pointIndex) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin;
      }

      // Bullet point
      pdf.circle(margin + 2, yPosition - 1, 1, 'F');
      
      // Point text with word wrap
      const pointText = point;
      const lines = pdf.splitTextToSize(pointText, contentWidth - 8);
      
      lines.forEach((line: string, lineIndex: number) => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin + 6, yPosition + (lineIndex * 5));
      });
      
      yPosition += lines.length * 5 + 3;
    });

    // Add spacing between sections
    yPosition += 5;
  });

  // Add footer to all pages
  const pageCount = (pdf as any).internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    
    // Footer line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    // Footer text
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      'This document contains privacy-protected health information.',
      margin,
      pageHeight - 10
    );
    pdf.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - margin - 20,
      pageHeight - 10
    );
  }

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `CareInsight_Summary_${summaryData.patientId || 'report'}_${timestamp}.pdf`;

  // Save the PDF
  pdf.save(filename);
};

export const generatePDFFromElement = async (
  elementId: string,
  filename: string = 'document.pdf'
): Promise<void> => {
  const html2canvas = (await import('html2canvas')).default;
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save(filename);
};
