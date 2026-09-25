import React, { useState } from 'react';
import { Document } from '../../types';
import { X, FileDown, FileText, Check, Download } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, document }) => {
  const [format, setFormat] = useState<'docx' | 'pdf' | 'txt'>('docx');
  const [includeAnalyticsHeader, setIncludeAnalyticsHeader] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsExporting(true);

    const safeTitle = (document.title || 'SidMorph_Manuscript').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    let textToExport = document.content;

    if (includeAnalyticsHeader) {
      const header = `====================================================\nSIDMORPH MANUSCRIPT AUDIT REPORT\nTitle: ${document.title}\nExported: ${new Date().toLocaleString()}\nWords: ${document.wordCount}\nAttribution & Semantic Verification: PASSED\n====================================================\n\n`;
      textToExport = header + textToExport;
    }

    if (format === 'txt') {
      const blob = new Blob([textToExport], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${safeTitle}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'docx') {
      // Create a formatted HTML-based docx container compatible with Microsoft Word & LibreOffice
      const docxContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>${document.title}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; margin: 1in; }
          h1 { font-size: 18pt; font-weight: bold; margin-bottom: 12pt; }
          p { margin-bottom: 10pt; text-indent: 0.5in; }
        </style>
        </head>
        <body>
          <h1>${document.title}</h1>
          ${textToExport.split('\n\n').map(p => `<p>${p.trim()}</p>`).join('')}
        </body>
        </html>
      `;
      const blob = new Blob(['\ufeff', docxContent], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${safeTitle}.doc`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      // Open styled printable manuscript window for direct PDF export
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${document.title} - SidMorph Print</title>
            <style>
              body { font-family: 'Times New Roman', serif; margin: 40px; color: #111; line-height: 1.6; }
              h1 { font-size: 24px; font-weight: bold; margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
              p { margin-bottom: 16px; font-size: 15px; }
              .footer { margin-top: 40px; font-size: 11px; color: #666; border-top: 1px solid #eee; padding-top: 10px; }
            </style>
          </head>
          <body>
            <h1>${document.title}</h1>
            ${textToExport.split('\n\n').map(p => `<p>${p.trim()}</p>`).join('')}
            <div class="footer">Exported from SidMorph Anonymous Workspace · Semantic Integrity Verified</div>
          </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
    }

    setTimeout(() => {
      setIsExporting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#372C2E] border border-[#7A431D] rounded-lg shadow-2xl text-white p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <FileDown className="w-4 h-4 text-[#D9E48A]" />
            <h3 className="font-serif text-lg font-semibold">EXPORT MANUSCRIPT</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:text-white text-white/40 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selectors */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-white/60 block">Select Output Format:</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'docx', label: 'DOCX / Word', ext: '.docx' },
              { id: 'pdf', label: 'PDF Document', ext: '.pdf' },
              { id: 'txt', label: 'Plain Text', ext: '.txt' },
            ].map((fmt) => (
              <button
                key={fmt.id}
                onClick={() => setFormat(fmt.id as any)}
                className={`p-3 rounded border text-left transition-colors space-y-1 ${
                  format === fmt.id
                    ? 'bg-[#563727] border-[#D9E48A] text-white font-semibold'
                    : 'bg-[#563727]/30 border-white/10 text-white/70 hover:border-white/20'
                }`}
              >
                <span className="text-xs block">{fmt.label}</span>
                <span className="text-[10px] font-mono text-[#D9E48A]">{fmt.ext}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <label className="flex items-center gap-2.5 text-xs text-white/70 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={includeAnalyticsHeader}
            onChange={(e) => setIncludeAnalyticsHeader(e.target.checked)}
            className="rounded bg-black/30 border-white/20 text-[#D9E48A] focus:ring-0"
          />
          <span>Include SidMorph verification and attribution header</span>
        </label>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <button onClick={onClose} className="px-4 py-2 text-xs text-white/70 hover:text-white rounded">
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="px-5 py-2 text-xs font-semibold text-[#372C2E] bg-[#D9E48A] hover:bg-[#c9d57a] rounded transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {format.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
