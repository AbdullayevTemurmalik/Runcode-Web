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
        <>
          {/* Mobil ko'rinish (Kichik ekranlar uchun qulay kartalar) */}
          <div className="block sm:hidden space-y-3">
            {orders.map((ord) => {
              const planTitle = ord.plan_name === '7_days'
                ? 'Plus Obuna (7 Kunlik)'
                : ord.plan_name === '1_month'
                ? 'Pro Obuna (1 Oylik)'
                : ord.plan_name === '2_months'
                ? 'Pro+ Obuna (2 Oylik)'
                : ord.plan_name === '3_months'
                ? 'Ultra Obuna (3 Oylik)'
                : (ord.plan_name || 'Standart');

              const methodLabel = ord.payment_method === 'apps' 
                ? 'Ilova (Click/Payme)' 
                : ord.payment_method === 'bankomat' 
                ? 'Bankomat' 
                : ord.payment_method === 'payme' 
                ? 'Payme' 
                : 'Karta / Ilova';

              return (
                <div 
                  key={ord.id} 
                  className="p-4 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {planTitle}
                    </span>
                    {ord.status === 'approved' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                        Tasdiqlangan
                      </span>
                    ) : ord.status === 'rejected' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                        Rad etilgan
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                        Kutilmoqda
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100 dark:border-gray-800/60">
                    <span className="font-mono font-bold text-gray-900 dark:text-white">
                      {(ord.amount || 0).toLocaleString()} so'm
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-[11px]">
                      {methodLabel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                    <span>Buyurtma #{ord.id}</span>
                    <span>{formatDate(ord.created_at)}</span>
                  </div>

                  {ord.status === 'rejected' && ord.rejection_reason && (
                    <p className="text-[11px] text-rose-500 dark:text-rose-400 bg-rose-500/10 p-2 rounded-xl">
                      Sabab: {ord.rejection_reason}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Planshet va Desktop jadval ko'rinishi */}
          <div className="hidden sm:block bg-white dark:bg-gray-800/80 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
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
                        {ord.plan_name === '7_days'
                          ? 'Plus Obuna (7 Kunlik)'
                          : ord.plan_name === '1_month'
                          ? 'Pro Obuna (1 Oylik)'
                          : ord.plan_name === '2_months'
                          ? 'Pro+ Obuna (2 Oylik)'
                          : ord.plan_name === '3_months'
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
        </>
      )}
    </div>
  );
};
