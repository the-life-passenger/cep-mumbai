import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-200">
          <Compass className="w-8 h-8" />
        </div>

        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
          404 — Page Not Found
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed">
          The public service page you are looking for has been moved or does not exist in our community directory.
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-bold hover:bg-slate-800 transition shadow"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-50 text-teal-800 text-xs sm:text-sm font-semibold hover:bg-teal-100 border border-teal-200 transition"
          >
            <span>Browse Services</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
