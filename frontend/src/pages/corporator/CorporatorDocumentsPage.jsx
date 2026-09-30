import React from 'react';
import { Table } from '../../components/Table';
import { FileArchive, Download } from 'lucide-react';

export const CorporatorDocumentsPage = () => {
  const documents = [
    { id: 'doc-1', title: 'Ward 24 Monsoon Drainage Plan 2026', category: 'Works', size: '2.4 MB', date: '2026-06-15' },
    { id: 'doc-2', title: 'General Body Resolution #142/2026', category: 'Meetings', size: '1.1 MB', date: '2026-05-20' },
    { id: 'doc-3', title: 'Shivaji Park Beautification Tender Order', category: 'Proposals', size: '4.8 MB', date: '2026-04-10' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
          DOCUMENT REPOSITORY
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Ward 24 Document Repository</h2>
        <p className="text-xs text-slate-500">Official ward tenders, meeting resolutions, proposals, and administrative orders.</p>
      </div>

      <Table headers={['Document Title', 'Category', 'File Size', 'Uploaded Date', 'Action']}>
        {documents.map((d) => (
          <tr key={d.id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-slate-900">{d.title}</td>
            <td className="px-6 py-4 font-bold text-blue-600">{d.category}</td>
            <td className="px-6 py-4 text-slate-500 font-mono">{d.size}</td>
            <td className="px-6 py-4 text-slate-500">{d.date}</td>
            <td className="px-6 py-4">
              <button onClick={() => alert(`Downloading ${d.title}`)} className="text-blue-600 font-bold hover:underline flex items-center">
                <Download className="w-3.5 h-3.5 mr-1" /> Download
              </button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};
