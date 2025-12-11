
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, CreditCard, FileText, ChevronRight, Shield, Crown, AlertCircle } from 'lucide-react';
import { getUserSubscription, UserSubscription } from '../lib/billing/subscription';
import { cn, formatDate } from '../lib/utils';

interface SettingsProps {
  onNavigate: (view: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
  const [sub, setSub] = useState<UserSubscription | null>(null);

  useEffect(() => {
    getUserSubscription().then(setSub);
  }, []);

  // Mock billing history data
  const billingHistory = [
    { id: 1, date: new Date('2023-10-01'), amount: '$14.99', status: 'Paid', invoice: 'INV-2023-001' },
    { id: 2, date: new Date('2023-09-01'), amount: '$14.99', status: 'Paid', invoice: 'INV-2023-002' },
    { id: 3, date: new Date('2023-08-01'), amount: '$14.99', status: 'Paid', invoice: 'INV-2023-003' },
  ];

  return (
    <div className="animate-fade-in pb-20">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500">Manage your subscription and billing details.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-white text-luna-amethyst-700 font-medium rounded-xl border border-luna-amethyst-100 shadow-sm transition-all">
             <CreditCard className="h-5 w-5" /> Subscription & Billing
          </button>
           <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 font-medium rounded-xl transition-colors">
             <User className="h-5 w-5" /> Profile
          </button>
           <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 font-medium rounded-xl transition-colors">
             <Shield className="h-5 w-5" /> Privacy
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Subscription Card */}
          <Card className="overflow-hidden border-luna-amethyst-100">
             <div className="bg-gradient-to-r from-luna-amethyst-50 to-white p-6 border-b border-luna-amethyst-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-luna-amethyst-600">
                      <Crown className="h-6 w-6" />
                   </div>
                   <div>
                      <h3 className="font-bold text-gray-900 text-lg">{sub?.planName || 'Loading...'}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                          sub?.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        )}>
                          {sub?.status}
                        </span>
                        {sub?.isTrial && sub.trialEndsAt && (
                          <span className="text-xs text-luna-amethyst-600 flex items-center gap-1">
                             <AlertCircle className="h-3 w-3" />
                             Trial ends {formatDate(sub.trialEndsAt)}
                          </span>
                        )}
                      </div>
                   </div>
                </div>
                <Button onClick={() => onNavigate('pricing')} variant="luna" size="sm">
                  {sub?.isPro ? 'Change Plan' : 'Upgrade to Pro'}
                </Button>
             </div>
             <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <div className="flex flex-col space-y-1">
                         <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Billing Interval</span>
                         <span className="font-medium text-gray-900">Monthly</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                         <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Payment Method</span>
                         <span className="font-medium text-gray-900 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-gray-900" />
                            Visa ending in 4242
                         </span>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="flex flex-col space-y-1">
                         <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Next Invoice</span>
                         <span className="font-medium text-gray-900">
                           {sub?.isActive && sub.plan !== 'FREE' 
                             ? formatDate(new Date(Date.now() + 86400000 * 15)) 
                             : 'N/A'}
                         </span>
                      </div>
                      <div className="flex flex-col space-y-1">
                         <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Member Since</span>
                         <span className="font-medium text-gray-900">Oct 2023</span>
                      </div>
                   </div>
                </div>
             </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              {sub?.plan === 'FREE' ? (
                <div className="text-center py-8 text-gray-500">
                  No billing history available for free plan.
                </div>
              ) : (
                <div className="space-y-3">
                  {billingHistory.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                             <FileText className="h-5 w-5" />
                          </div>
                          <div>
                             <p className="font-medium text-gray-900">{invoice.amount}</p>
                             <p className="text-xs text-gray-500">{formatDate(invoice.date)}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <span className="text-xs font-medium px-2 py-1 rounded bg-green-50 text-green-700 border border-green-100">Paid</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
                             <ChevronRight className="h-4 w-4" />
                          </Button>
                       </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full text-xs text-gray-500 hover:text-gray-900 mt-2">
                    View All Invoices
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {sub?.isPro && (
            <div className="pt-6 border-t border-gray-200">
               <h4 className="font-medium text-gray-900 mb-2">Subscription Management</h4>
               <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 w-full sm:w-auto">
                  Cancel Subscription
               </Button>
               <p className="text-xs text-gray-500 mt-2">
                 Canceling will downgrade you to the Free plan at the end of your current billing period.
               </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
