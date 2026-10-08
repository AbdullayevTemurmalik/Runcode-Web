import React from 'react';
import { CreditCard } from 'lucide-react';

export const DashboardOrdersTable = ({ orders, formatDate }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <CreditCard className="w-5 h-5 text-brand-500" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          To'lovlar Tarixi ({orders.length})
        </h2>
      </div>

      {orders.length === 0 ? (
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 text-center text-xs text-gray-500">
          To'lovlar tarixi mavjud emas
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800/80 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4">Tarif</th>
                  <th className="px-6 py-4">Summa</th>
                  <th className="px-6 py-4">Usul</th>
                  <th className="px-6 py-4">Holat</th>
                  <th className="px-6 py-4">Sana</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {ord.plan_name === '1_month' || ord.plan_name === 'plus'
                        ? 'Plus Obuna (1 Oylik)'
                        : ord.plan_name === '2_months' || ord.plan_name === 'pro'
                        ? 'Pro Obuna (2 Oylik)'
                        : ord.plan_name === '3_months' || ord.plan_name === 'ultra'
                        ? 'Ultra Obuna (3 Oylik)'
                        : (ord.plan_name || 'Standart')}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-gray-900 dark:text-white">
                      {(ord.amount || 0).toLocaleString()} so'm
                    </td>
                    <td className="px-6 py-4 capitalize text-gray-500">
                      {ord.payment_method === 'apps' ? 'Ilova (Click/Payme)' : ord.payment_method === 'bankomat' ? 'Bankomat' : ord.payment_method === 'payme' ? 'Payme' : 'Karta / Ilova'}
                    </td>
                    <td className="px-6 py-4">
                      {ord.status === 'approved' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                          Tasdiqlangan
                        </span>
                      ) : ord.status === 'rejected' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400" title={ord.rejection_reason}>
                          Rad etilgan: {ord.rejection_reason || 'Sabab ko\'rsatilmagan'}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                          Kutilmoqda
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-[11px] font-mono">
                      {formatDate(ord.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
