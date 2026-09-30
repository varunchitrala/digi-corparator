import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { Select } from '../../components/Select';
import { FileSpreadsheet, FileText, Download, Printer } from 'lucide-react';

export const CorporatorReportsPage = () => {
  const [reportType, setReportType] = useState('WARD_PERFORMANCE');
  const [format, setFormat] = useState('PDF');

  const handleExport = () => {
    alert(`Exporting ${reportType} report as ${format}...`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200">
          REPORTS & MIS GENERATOR
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Ward 24 Reports Exporter</h2>
        <p className="text-xs text-slate-500">Generate and export ward performance telemetry, complaint SLA reports, and fund utilization statements.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">Select Report Criteria</h3>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Report Type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            options={[
              { value: 'WARD_PERFORMANCE', label: 'Ward Performance Summary' },
              { value: 'COMPLAINT_SLA', label: 'Complaint SLA & Escalations Report' },
              { value: 'DEVELOPMENT_WORKS', label: 'Development Works Physical/Financial Progress' },
              { value: 'FUND_UTILIZATION', label: 'Fund Utilization Statement' },
              { value: 'OFFICER_PERFORMANCE', label: 'Field Officer Resolution Metrics' }
            ]}
          />
          <Select
            label="Export Format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            options={[
              { value: 'PDF', label: 'PDF Document (.pdf)' },
              { value: 'EXCEL', label: 'Excel Spreadsheet (.xlsx)' },
              { value: 'CSV', label: 'Comma-Separated Values (.csv)' },
              { value: 'PRINT', label: 'Printable Format' }
            ]}
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button variant="primary" onClick={handleExport} className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="w-4 h-4 mr-1.5" /> Export Report ({format})
          </Button>
        </div>
      </div>
    </div>
  );
};
