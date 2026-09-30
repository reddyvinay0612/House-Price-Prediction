import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { History, Trash2, ArrowUpRight, MapPin } from 'lucide-react';
import { formatIndianPrice } from '../../utils/formatters';

/**
 * Recent Indian Property Estimates Table with local storage restoration
 */
export function RecentEstimates({ onSelectEstimate }) {
  const { recentEstimates, clearEstimates } = useApp();
  const { t } = useTranslation();

  if (!recentEstimates || recentEstimates.length === 0) {
    return null;
  }

  return (
    <Card
      title="Recent Property Estimates History (हाल के मूल्यांकन)"
      subtitle="Saved locally on your device in browser storage for instant review."
      accent="none"
      className="shadow-sm"
      action={
        <Button variant="ghost" size="sm" onClick={clearEstimates} className="text-xs text-govred hover:text-govred-dark">
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Clear History
        </Button>
      }
    >
      <div className="overflow-x-auto">
        <table className="gov-table w-full text-xs">
          <thead>
            <tr>
              <th>Date / Time</th>
              <th>City & Locality</th>
              <th>Configuration</th>
              <th>ML Model</th>
              <th className="text-right">Estimated Price</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {recentEstimates.map((item) => {
              const formattedDate = new Date(item.timestamp).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const city = item.city || item.inputs?.city || 'Bengaluru';
              const locality = item.locality || item.inputs?.locality || item.Neighborhood || 'Whitefield';
              const sqft = item.total_sqft || item.inputs?.total_sqft || item.GrLivArea || 1200;
              const bhk = item.bhk || item.inputs?.bhk || 2;
              const bath = item.bath || item.inputs?.bath || 2;
              const priceText = item.formatted_price || formatIndianPrice(item.price_in_lakhs || 45.0);

              return (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="text-slate-500 whitespace-nowrap">{formattedDate}</td>
                  <td>
                    <div className="font-bold text-navy-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-saffron shrink-0" />
                      <span>{locality}, {city}</span>
                    </div>
                  </td>
                  <td className="text-slate-600">
                    {Number(sqft).toLocaleString('en-IN')} sq.ft • {bhk} BHK • {bath} Bath
                  </td>
                  <td className="text-slate-500 text-[11px]">{item.model_name || 'Gradient Boosting'}</td>
                  <td className="text-right font-extrabold text-navy-900 font-mono">
                    {priceText}
                  </td>
                  <td className="text-center">
                    {onSelectEstimate && (
                      <button
                        type="button"
                        onClick={() => onSelectEstimate(item)}
                        className="inline-flex items-center text-[11px] font-bold text-navy-700 hover:text-saffron-dark transition p-1"
                        title="Restore this estimate into form"
                      >
                        <span>Restore</span>
                        <ArrowUpRight className="w-3 h-3 ml-0.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default RecentEstimates;
