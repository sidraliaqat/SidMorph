import React from 'react';
import { ShieldCheck, HardDrive, Cpu, KeyRound } from 'lucide-react';

export const PrivacySection: React.FC = () => {
  return (
    <section className="py-24 bg-[#563727] text-white border-b border-white/8">
      <div className="max-w-5xl mx-auto px-6 space-y-12">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-mono text-[#D9E48A] uppercase tracking-widest">
            Privacy & Architectural Boundaries
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium">
            Anonymous Workspace Architecture
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            SidMorph eliminates personal accounts, passwords, and user tracking. Your documents belong solely to your active local workspace session.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#372C2E]/70 border border-white/10 p-6 rounded space-y-3">
            <div className="flex items-center gap-2 text-[#D9E48A]">
              <HardDrive className="w-4 h-4" />
              <h4 className="font-mono text-xs uppercase tracking-wider text-white">Local-First Workspace Scoping</h4>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              When you open SidMorph, your browser initializes a cryptographic workspace identifier stored in local storage. All document retrieval, versioning, and analysis calls are isolated to this identifier without requiring an email address or credentials.
            </p>
          </div>

          <div className="bg-[#372C2E]/70 border border-white/10 p-6 rounded space-y-3">
            <div className="flex items-center gap-2 text-[#D9E48A]">
              <KeyRound className="w-4 h-4" />
              <h4 className="font-mono text-xs uppercase tracking-wider text-white">Server-Side Secret Isolation</h4>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              All AI provider API keys remain exclusively within server environment configurations. No secret keys or credentials are ever transmitted to or exposed inside browser JavaScript.
            </p>
          </div>

          <div className="bg-[#372C2E]/70 border border-white/10 p-6 rounded space-y-3">
            <div className="flex items-center gap-2 text-[#D9E48A]">
              <Cpu className="w-4 h-4" />
              <h4 className="font-mono text-xs uppercase tracking-wider text-white">Model Processing Integrity</h4>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Text sent for transformation is processed transiently for the requested morph or verification analysis. Documents are never sold, indexed in public search results, or retained for public foundation model retraining.
            </p>
          </div>

          <div className="bg-[#372C2E]/70 border border-white/10 p-6 rounded space-y-3">
            <div className="flex items-center gap-2 text-[#D9E48A]">
              <ShieldCheck className="w-4 h-4" />
              <h4 className="font-mono text-xs uppercase tracking-wider text-white">User Control & Erasure</h4>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              You maintain unilateral control over your drafts. Deleting a document or clearing your workspace immediately erases the local document records and associated analytical histories.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
