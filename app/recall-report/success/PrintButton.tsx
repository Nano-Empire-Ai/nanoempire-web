"use client";

import React from 'react';

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="mt-4 px-6 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 print:hidden"
    >
      Export PDF
    </button>
  );
}
