import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Home as HomeIcon, Calculator } from "lucide-react";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="text-center py-16 px-4 space-y-6 max-w-lg mx-auto">
      <div className="inline-flex p-4 bg-amber-100 border border-amber-300 text-gov-goldDark">
        <AlertTriangle className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
          HTTP 404 — Record Not Found
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-gov-navy font-serif">
          Requested Portal Page Not Found
        </h1>
        <p className="text-xs text-slate-600 leading-relaxed">
          The URL or system resource you requested does not exist or has been relocated within the Department of Housing Analytics portal repository.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-200">
        <Link to="/">
          <Button variant="primary" size="md">
            <HomeIcon className="w-4 h-4 mr-2" />
            Return to Homepage
          </Button>
        </Link>
        <Link to="/estimate">
          <Button variant="outline" size="md">
            <Calculator className="w-4 h-4 mr-2" />
            Launch Valuation Service
          </Button>
        </Link>
      </div>
    </div>
  );
}
