
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Check, Star, Users, Crown, CreditCard, Bitcoin, X, Loader2, CheckCircle2, ShieldCheck, Zap, ArrowRightLeft, Coins } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { updateUserSubscription } from '../services/mockData';
import { ExternalService } from '../services/external';
import { getUserSubscription, UserSubscription } from '../lib/billing/subscription';

interface PricingProps {
  onNavigate?: (view: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onNavigate }) => {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [checkoutPlan, setCheckoutPlan] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);

  useEffect(() => {
    // Load data
    ExternalService.getCryptoPrice().then(setBtcPrice);
    getUserSubscription().then(setCurrentSubscription);
  }, []);

  const plans = [
    {
      id: 'pro',
      name: 'Luna Pro',
      description: 'Individual cycle intelligence for executive performance.',
      price: billingInterval === 'monthly' ? 14.99 : 11.99,
      type: 'PRO_MONTHLY', // Simplified mapping for this demo
      period: 'mo',
      icon: Crown,
      features: [
        'Advanced Cycle Predictions',
        'Daily Energy & Focus Forecasts',
        'Calendar Sync & Optimization',
        'Executive Performance Insights',
        'Nutrition & Workout Alignment',
      ],
      cta: 'Start Pro Trial',
      popular: true,
      color: 'luna-amethyst',
    },
    {
      id: 'family',
      name: 'Luna Family',
      description: 'The ultimate connection for mother & daughter health.',
      price: billingInterval === 'monthly' ? 24.99 : 19.99,
      type: 'FAMILY_DUO', // Simplified mapping for this demo
      period: 'mo',
      icon: Users,
      features: [
        'Everything in Luna Pro',
        'Connect with Daughter (up to 3)',
        'Real-time Wellness Alerts',
        '"Know without asking" Dashboard',
        'Family Cycle Education',
        'Shared Calendar Overlays',
      ],
      cta: 'Get Family Plan',
      popular: false,
      color: 'rose',
    },
  ];

  const handleSubscribe = async () => {
    setProcessing(true);
    // Simulate API delay for payment/plan change processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update user state (mock)
    // In a real app, this would be a server action handling Stripe updates
    updateUserSubscription(checkoutPlan.type);
    
    // Refresh local state
    const updatedSub = await getUserSubscription();
    setCurrentSubscription(updatedSub);

    setProcessing(false);
    setSuccess(true);
    
    // Redirect after success
    setTimeout(() => {
      onNavigate?.('dashboard');
    }, 2000);
  };

  const getPrice = () => {
    if (!checkoutPlan) return 0;
    let price = checkoutPlan.price;
    if (billingInterval === 'yearly') price = price * 12;
    if (paymentMethod === 'crypto') price = price * 0.95; // 5% Discount
    return price.toFixed(2);
  };

  const getCryptoAmount = () => {
    const totalUSD = parseFloat(getPrice() as string);
    if (!btcPrice) return '---';
    return (totalUSD / btcPrice).toFixed(6);
  };

  const getSavings = () => {
    if (!checkoutPlan || paymentMethod !== 'crypto') return 0;
    let price = checkoutPlan.price;
    if (billingInterval === 'yearly') price = price * 12;
    return (price * 0.05).toFixed(2);
  }

  const getPlanActionType = (planType: string) => {
    if (!currentSubscription) return 'subscribe';
    
    // Map simplified plan types for comparison
    const currentIsPro = currentSubscription.plan.includes('PRO');
    const currentIsFamily = currentSubscription.plan.includes('FAMILY');
    const targetIsPro = planType.includes('PRO');
    const targetIsFamily = planType.includes('FAMILY');

    if (currentSubscription.plan === planType) return 'current';
    if (currentIsPro && targetIsFamily) return 'upgrade';
    if (currentIsFamily && targetIsPro) return 'downgrade'; // Or switch
    if (currentSubscription.plan === 'FREE') return 'subscribe';
    
    return 'switch';
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20 relative">
      <div className="text-center space-y-4 max-w-2xl mx-auto pt-8">
        <h1 className="text-4xl font-display font-bold text-gray-900">
          Invest in your <span className="text-transparent bg-clip-text bg-gradient-to-r from-luna-amethyst-600 to-luna-amethyst-400">energy</span>.
        </h1>
        <p className="text-gray-500 text-lg">
          Choose the plan that fits your lifestyle. Optimize your performance or connect deeply with your family.
        </p>

        {/* Billing Toggle */}
        <div className="flex justify-center mt-8">
          <div className="bg-gray-100 p-1 rounded-xl flex items-center cursor-pointer relative select-none">
            <div 
              className={cn(
                "w-32 py-2 text-sm font-medium rounded-lg text-center transition-all z-10",
                billingInterval === 'monthly' ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900"
              )}
              onClick={() => setBillingInterval('monthly')}
            >
              Monthly
            </div>
            <div 
              className={cn(
                "w-32 py-2 text-sm font-medium rounded-lg text-center transition-all z-10 relative",
                billingInterval === 'yearly' ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900"
              )}
              onClick={() => setBillingInterval('yearly')}
            >
              Yearly
              <span className="absolute -top-3 -right-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                SAVE 20%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-12">
        {plans.map((plan, idx) => {
          const actionType = getPlanActionType(plan.type);
          const isCurrent = actionType === 'current';

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={cn(
                "relative h-full transition-all duration-200 border-2 flex flex-col", 
                plan.popular && !isCurrent ? "border-luna-amethyst-500 shadow-xl scale-[1.02]" : "border-gray-100 hover:border-luna-amethyst-200 hover:shadow-lg",
                isCurrent && "border-gray-200 bg-gray-50/50"
              )}>
                {plan.popular && !isCurrent && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-luna-amethyst-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" /> Most Popular
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Current Plan
                  </div>
                )}
                <CardHeader className="text-center pb-2 pt-8">
                  <div className={cn("mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors", 
                    plan.id === 'pro' ? "bg-luna-amethyst-100 text-luna-amethyst-600" : "bg-rose-100 text-rose-600"
                  )}>
                    <plan.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                  <p className="text-gray-500 text-sm mt-2 h-10 px-4">{plan.description}</p>
                </CardHeader>
                <CardContent className="text-center flex-1 flex flex-col">
                  <div className="my-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-400 ml-1">/{plan.period}</span>
                    </div>
                    {billingInterval === 'yearly' && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        Billed ${Math.floor(plan.price * 12)} yearly
                      </p>
                    )}
                  </div>

                  <div className="space-y-4 text-left mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-gray-600">
                        <div className="mt-0.5 rounded-full bg-green-100 p-0.5 shrink-0">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={cn(
                      "w-full h-12 text-base font-semibold shadow-sm",
                      isCurrent && "opacity-50 cursor-default hover:bg-transparent hover:text-gray-900"
                    )} 
                    variant={isCurrent ? 'outline' : (plan.popular ? 'luna' : 'outline')}
                    onClick={() => !isCurrent && setCheckoutPlan(plan)}
                    disabled={isCurrent}
                  >
                    {isCurrent ? 'Current Plan' : (
                      actionType === 'upgrade' ? 'Upgrade Plan' :
                      actionType === 'downgrade' ? 'Switch Plan' :
                      actionType === 'switch' ? 'Switch Plan' :
                      plan.cta
                    )}
                  </Button>
                  {!isCurrent && (
                    <p className="text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> 7-day free trial, cancel anytime.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="max-w-3xl mx-auto mt-16 text-center pb-8">
        <h3 className="font-semibold text-gray-900 mb-6 text-sm uppercase tracking-wider">Trusted by executives from</h3>
        <div className="flex justify-center gap-12 grayscale opacity-40">
           {/* Mock logos text for simplicity */}
           <span className="font-display font-bold text-xl tracking-tight">VOGUE</span>
           <span className="font-display font-bold text-xl tracking-tight">FORBES</span>
           <span className="font-display font-bold text-xl tracking-tight">GOOP</span>
           <span className="font-display font-bold text-xl tracking-tight">HBR</span>
        </div>
      </div>

      {/* Confirmation/Checkout Modal */}
      <AnimatePresence>
        {checkoutPlan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => !processing && setCheckoutPlan(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 max-h-[90vh] flex flex-col"
            >
              {success ? (
                <div className="p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600"
                  >
                    <CheckCircle2 className="h-10 w-10" />
                  </motion.div>
                  <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Welcome to {checkoutPlan.name}!</h2>
                  <p className="text-gray-500 mb-8">Your subscription has been updated. Redirecting you to your dashboard...</p>
                  <div className="flex items-center gap-2 text-luna-amethyst-600 text-sm font-medium">
                     <Loader2 className="h-4 w-4 animate-spin" /> Redirecting...
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b flex items-center justify-between bg-gray-50/50">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">
                        {getPlanActionType(checkoutPlan.type) === 'subscribe' ? 'Checkout' : 'Confirm Change'}
                      </h3>
                      <p className="text-sm text-gray-500">
                         {getPlanActionType(checkoutPlan.type) === 'downgrade' 
                            ? `Switch to ${checkoutPlan.name}` 
                            : `Upgrade to ${checkoutPlan.name}`}
                      </p>
                    </div>
                    <button 
                      onClick={() => !processing && setCheckoutPlan(null)}
                      className={cn("p-2 rounded-full hover:bg-gray-100 transition-colors", processing ? "opacity-50 cursor-not-allowed" : "text-gray-400 hover:text-gray-600")}
                      disabled={processing}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="p-6 space-y-6 overflow-y-auto">
                    {/* Payment Method Selection */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700 block">Select Payment Method</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div 
                          className={cn(
                            "border-2 rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center gap-2",
                            paymentMethod === 'card' 
                              ? "border-luna-amethyst-500 bg-luna-amethyst-50 text-luna-amethyst-700 ring-1 ring-luna-amethyst-500" 
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          )}
                          onClick={() => !processing && setPaymentMethod('card')}
                        >
                          <CreditCard className="h-6 w-6" />
                          <span className="text-sm font-semibold">Card</span>
                        </div>
                        <div 
                          className={cn(
                            "border-2 rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center gap-2 relative overflow-hidden",
                            paymentMethod === 'crypto' 
                              ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500" 
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          )}
                          onClick={() => !processing && setPaymentMethod('crypto')}
                        >
                          <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                            -5% OFF
                          </div>
                          <div className="flex items-center gap-1">
                            <Bitcoin className="h-6 w-6" />
                            <Coins className="h-4 w-4 opacity-70" />
                          </div>
                          <span className="text-sm font-semibold">Crypto</span>
                          <span className="text-[10px] text-gray-500 leading-tight">BTC, ETH, USDC, +</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-xl p-5 space-y-3 border border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{checkoutPlan.name} ({billingInterval})</span>
                        <span className="font-medium text-gray-900">${checkoutPlan.price} {billingInterval === 'yearly' && 'x 12'}</span>
                      </div>
                      
                      {paymentMethod === 'crypto' ? (
                         <>
                           <div className="flex justify-between text-sm text-green-600 font-medium">
                            <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> Crypto Discount (5%)</span>
                            <span>-${getSavings()}</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 pt-1 border-t border-gray-200 mt-2">
                            <span>Current BTC Rate</span>
                            <span>{btcPrice ? `$${btcPrice.toLocaleString()}` : 'Loading...'}</span>
                          </div>

                          {/* Major Altcoins Acceptance */}
                          <div className="mt-3 bg-white rounded border border-blue-100 p-2">
                            <p className="text-[10px] font-semibold text-gray-500 uppercase mb-1">Accepted Coins:</p>
                            <div className="flex flex-wrap gap-1.5">
                              {['BTC', 'ETH', 'USDC', 'LTC', 'DAI', 'DOGE', 'BCH', 'MATIC'].map(coin => (
                                <span key={coin} className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-medium border border-gray-200">
                                  {coin}
                                </span>
                              ))}
                            </div>
                          </div>
                         </>
                      ) : (
                        <div className="text-xs text-gray-400 italic">
                          Tip: Pay with Crypto to save 5%
                        </div>
                      )}

                       {/* Pro-ration note (visual only for mockup) */}
                       {currentSubscription?.plan !== 'FREE' && (
                         <div className="flex justify-between text-sm text-gray-500 pt-1 border-t border-gray-200 mt-2 border-dashed">
                           <span>Prorated credit</span>
                           <span>-$0.00</span>
                         </div>
                       )}
                      
                       <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
                        <span className="text-gray-900 font-semibold">Total due today</span>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-gray-900 block">${getPrice()}</span>
                          {paymentMethod === 'crypto' && (
                            <span className="text-xs font-mono text-luna-amethyst-600 block">
                              ≈ {getCryptoAmount()} BTC
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full h-12 text-lg font-medium shadow-md transition-all active:scale-[0.98]" 
                      variant="luna"
                      onClick={handleSubscribe}
                      disabled={processing}
                    >
                      {processing ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                         getPlanActionType(checkoutPlan.type) === 'downgrade' ? 'Confirm Switch' :
                        (paymentMethod === 'card' ? 'Pay with Stripe' : 'Pay with Coinbase')
                      )}
                    </Button>
                    
                    <div className="text-center space-y-2">
                      <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> Secure SSL 256-bit encrypted payment
                      </p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
