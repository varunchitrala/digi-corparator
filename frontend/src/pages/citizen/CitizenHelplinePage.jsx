import React, { useState } from 'react';
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  ShieldAlert,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Building,
  UserCheck,
  ExternalLink,
  Flame,
  Truck,
  Droplets,
  Zap
} from 'lucide-react';
import { Button } from '../../components/Button';

export const CitizenHelplinePage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const emergencyContacts = [
    { title: 'Municipal Control Room (24x7)', number: '1800-233-1024', icon: PhoneCall, color: 'text-blue-600 bg-blue-50' },
    { title: 'Water Leakage & Supply Helpline', number: '0240-2334455', icon: Droplets, color: 'text-cyan-600 bg-cyan-50' },
    { title: 'Streetlight Breakdown Cell', number: '0240-2338899', icon: Zap, color: 'text-amber-600 bg-amber-50' },
    { title: 'Solid Waste & Garbage Van Dispatch', number: '0240-2331122', icon: Truck, color: 'text-emerald-600 bg-emerald-50' },
    { title: 'City Fire & Disaster Control', number: '101 / 0240-2335566', icon: Flame, color: 'text-rose-600 bg-rose-50' },
    { title: 'Ambulance & Health Emergency', number: '108 / 102', icon: ShieldAlert, color: 'text-purple-600 bg-purple-50' },
  ];

  const wardOfficers = [
    { name: 'Er. Suresh Kulkarni', designation: 'Executive Engineer (Water Supply)', phone: '+91 98765 43233', email: 'officer.water@demomunicipal.gov.in' },
    { name: 'Dr. Ramesh Shinde', designation: 'Ward Health & Sanitation Inspector', phone: '+91 98765 43234', email: 'health.ward24@demomunicipal.gov.in' },
    { name: 'Er. Nitin Jadhav', designation: 'Electrical Engineer (Streetlights)', phone: '+91 98765 43235', email: 'elec.ward24@demomunicipal.gov.in' },
    { name: 'Sunil Gaikwad', designation: 'Ward Administrative Officer', phone: '+91 98765 43225', email: 'wardadmin.ward24@demomunicipal.gov.in' },
  ];

  const faqs = [
    {
      q: 'How fast will my reported grievance be resolved?',
      a: 'Each category has a guaranteed Citizen Charter SLA: Solid waste overflow is attended within 12 hours, streetlights and water leakages within 24 hours, and road potholes within 72 hours. You can track real-time inspection updates under "My Complaints".'
    },
    {
      q: 'What if I am not satisfied with the complaint resolution?',
      a: 'When an officer marks a complaint as Resolved, you receive an alert to inspect the site. If the issue persists, you can click "Reopen Complaint" with photos and remarks, which automatically escalates the matter to the Department Head and Ward Corporator.'
    },
    {
      q: 'How do I obtain an official Tax Clearance (No Dues) Certificate?',
      a: 'Go to "Property & Water Tax" and ensure your outstanding balance is ₹0. Click "Generate Tax Clearance Certificate". The system will instantly issue a digitally signed, QR-code verifiable clearance certificate for bank loans or property registry.'
    },
    {
      q: 'How long does it take to process civic certificate applications (Birth/Death/Water)?',
      a: 'Birth and death certificates are digitally issued within 3-5 working days. Water connection site inspections occur within 7 working days. Once approved, download your digitally stamped PDF directly from "My Applications".'
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>24x7 WARD ASSISTANCE & CONNECT</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1.5">
            Ward 24 Helpline & Corporator Office
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect directly with your elected NagarSevak, ward engineering officers, and 24x7 municipal emergency departments.
          </p>
        </div>
      </div>

      {/* Main Corporator Office Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 border-2 border-white/20 flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0">
              AP
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider bg-blue-500/20 px-2.5 py-0.5 rounded-md">
                Elected NagarSevak &bull; Ward 24 (Shivaji Nagar)
              </span>
              <h2 className="text-2xl font-black text-white mt-1.5">Hon. Anand Patil</h2>
              <p className="text-xs text-blue-200 mt-1">
                Committed to transparent, responsive, and smart ward development for Shivaji Nagar citizens.
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-300">
                <div className="flex items-center space-x-1.5">
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono font-bold text-white">+91 98765 43224</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>corporator.ward24@demomunicipal.gov.in</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 text-xs space-y-2 shrink-0 md:w-80">
            <h4 className="font-bold text-white flex items-center">
              <MapPin className="w-4 h-4 mr-1.5 text-blue-300" /> Citizen Jan Sampark Karyalay
            </h4>
            <p className="text-slate-300 text-[11px]">
              Ward 24 Sub-Office, Town Hall Complex, Near Shivaji Statue, Shivaji Nagar.
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
              <span className="text-slate-300">Citizen Visiting Hours:</span>
              <span className="font-bold text-emerald-400">10:00 AM - 1:00 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Hotlines Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-slate-900 flex items-center">
          <ShieldAlert className="w-4 h-4 mr-1.5 text-rose-600" />
          Municipal Emergency Numbers & 24x7 Control Rooms
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {emergencyContacts.map((contact, idx) => {
            const Icon = contact.icon;
            return (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${contact.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{contact.title}</h4>
                    <p className="text-sm font-mono font-black text-slate-900 mt-0.5">{contact.number}</p>
                  </div>
                </div>
                <a
                  href={`tel:${contact.number.split('/')[0].trim()}`}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 transition-colors shrink-0 ml-2"
                >
                  <PhoneCall className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ward 24 Officer Directory */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <h3 className="text-sm font-black text-slate-900 flex items-center">
          <UserCheck className="w-4 h-4 mr-1.5 text-blue-600" />
          Ward 24 Assigned Civic Officers & Engineers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {wardOfficers.map((off, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900">{off.name}</h4>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  Ward 24
                </span>
              </div>
              <p className="text-slate-500 font-medium">{off.designation}</p>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                <span className="font-mono font-semibold text-slate-800">{off.phone}</span>
                <span className="text-slate-500 truncate max-w-[180px]">{off.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <h3 className="text-sm font-black text-slate-900 flex items-center">
          <HelpCircle className="w-4 h-4 mr-1.5 text-emerald-600" />
          Frequently Asked Questions (Citizen Portal FAQ)
        </h3>

        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-3.5 bg-slate-50 hover:bg-slate-100/80 text-xs font-bold text-slate-800 flex items-center justify-between transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              {openFaq === idx && (
                <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
