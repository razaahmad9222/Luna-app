
import React, { useState, useEffect } from 'react';
import { PhaseIndicator } from '../components/luna/PhaseIndicator';
import { CyclePhase, WeatherData, QuoteData, MealData, ArtData, BioWeatherInsight } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Calendar as CalendarIcon, Zap, Brain, Heart, CheckCircle2, Check, X, AlertTriangle, RefreshCcw, CloudSun, Quote, Thermometer, Utensils, Palette, ArrowRight, Shirt, Apple, Sparkles } from 'lucide-react';
import { MOCK_SUGGESTIONS, MOCK_EVENTS, CURRENT_USER, generateBioWeatherInsight } from '../services/mockData';
import { ExternalService } from '../services/external';
import { formatTime, cn } from '../lib/utils';
import { EVENT_TYPE_CONFIG } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';

interface DashboardProps {
  onNavigate?: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [suggestions, setSuggestions] = useState(MOCK_SUGGESTIONS);
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("Good morning");
  
  // External API State
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [art, setArt] = useState<ArtData | null>(null);
  const [bioInsight, setBioInsight] = useState<BioWeatherInsight | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    let isMounted = true;
    const loadDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Parallel fetch for premium feel (fastest possible load)
        const [weatherData, quoteData, artData] = await Promise.all([
          ExternalService.getWeather(),
          ExternalService.getDailyQuote(),
          ExternalService.getDailyArt(),
          // Artificial delay for UI smoothness
          new Promise(resolve => setTimeout(resolve, 1500))
        ]);

        if (isMounted) {
          setSuggestions(MOCK_SUGGESTIONS);
          setEvents(MOCK_EVENTS);
          setWeather(weatherData);
          setQuote(quoteData);
          setArt(artData);
          
          // Generate Bio-Weather Insight
          if (weatherData) {
            const insight = generateBioWeatherInsight(CURRENT_USER.phase || CyclePhase.LUTEAL, weatherData);
            setBioInsight(insight);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load dashboard data. Please check your connection.");
          toast({
            type: 'error',
            title: 'Connection Error',
            description: 'Could not fetch latest cycle data. Please try again.'
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadDashboardData();

    return () => { isMounted = false; };
  }, [toast]);

  const handleSuggestionAction = async (id: string, action: 'accept' | 'dismiss') => {
    setActionLoading(id);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
      toast({
        type: action === 'accept' ? 'success' : 'info',
        title: action === 'accept' ? 'Suggestion Applied' : 'Suggestion Dismissed',
        description: action === 'accept' ? 'Your schedule has been optimized.' : 'We won\'t show this again.'
      });
    } catch (err) {
      toast({
        type: 'error',
        title: 'Action Failed',
        description: 'Could not process your request. Try again.'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const showOnboardingPrompt = !isLoading && !CURRENT_USER.onboardingComplete;

  if (error) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center text-center p-8 animate-fade-in">
        <div className="bg-red-50 p-4 rounded-full mb-4 shadow-sm">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Unable to load dashboard</h3>
        <p className="text-gray-500 max-w-sm mt-2 mb-6 leading-relaxed">{error}</p>
        <Button onClick={handleRetry} variant="outline" className="gap-2">
          <RefreshCcw className="h-4 w-4" /> Reload Page
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
            {isLoading ? (
              <Skeleton className="h-10 w-64" />
            ) : (
              `${greeting}, Elena`
            )}
          </h1>
          <div className="mt-2 text-gray-500">
             {isLoading ? <Skeleton className="h-5 w-48" /> : "Here is your cycle intelligence for today."}
          </div>
        </div>
        <div className="flex gap-2">
           {isLoading ? (
              <Skeleton className="h-10 w-32 rounded-full" />
           ) : weather && (
             <div className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-luna-amethyst-50">
                <CloudSun className="h-5 w-5 text-luna-amethyst-400" />
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-bold text-gray-700">{weather.temperature}°C</span>
                  <span className="text-[10px] text-gray-400 uppercase font-medium">{ExternalService.getWeatherContext(weather.weatherCode)}</span>
                </div>
             </div>
           )}
           <Button variant="luna" disabled={isLoading} className={isLoading ? "opacity-50" : ""}>Daily Check-in</Button>
        </div>
      </header>

      {/* Onboarding Prompt */}
      {showOnboardingPrompt && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-2"
        >
          <div className="bg-gradient-to-r from-luna-amethyst-50 to-white border border-luna-amethyst-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between shadow-sm gap-4">
             <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="h-10 w-10 shrink-0 rounded-full bg-white border border-luna-amethyst-200 flex items-center justify-center shadow-sm text-luna-amethyst-600 font-bold text-sm">
                   {CURRENT_USER.onboardingStep || 1}
                </div>
                <div>
                   <h4 className="font-semibold text-luna-amethyst-950 text-sm">Setup Incomplete</h4>
                   <p className="text-xs text-luna-amethyst-700/80">Complete step {CURRENT_USER.onboardingStep} to unlock full insights.</p>
                </div>
             </div>
             <Button size="sm" variant="luna" className="h-9 text-xs gap-1 w-full sm:w-auto shadow-sm" onClick={() => onNavigate?.('onboarding')}>
                Continue Setup <ArrowRight className="h-3 w-3" />
             </Button>
          </div>
        </motion.div>
      )}

      {/* Intelligence Briefing Widget */}
      {isLoading ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 h-auto md:h-40 animate-pulse">
           <div className="flex-1 space-y-3 w-full">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-full max-w-lg" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-32 mt-2" />
           </div>
           <div className="hidden md:block h-24 w-px bg-gray-200"></div>
           <div className="shrink-0 flex items-center gap-4 opacity-70 w-full md:w-auto">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-2 flex-1 md:flex-none">
                 <Skeleton className="h-3 w-24" />
                 <Skeleton className="h-4 w-32" />
              </div>
           </div>
        </div>
      ) : (quote && weather && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-luna-amethyst-900 to-luna-amethyst-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex-1 space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-luna-amethyst-200 text-xs font-bold uppercase tracking-widest">
              <Quote className="h-3 w-3" /> Executive Mantra
            </div>
            <p className="font-display text-xl md:text-2xl leading-relaxed italic opacity-90">
              "{quote.content}"
            </p>
            <p className="text-sm text-luna-amethyst-300">— {quote.author}</p>
          </div>
          <div className="h-px w-full md:w-px md:h-24 bg-white/20"></div>
          <div className="shrink-0 flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
               <Thermometer className="h-6 w-6 text-luna-gold-300" />
            </div>
            <div>
               <p className="text-xs text-luna-amethyst-200 font-medium uppercase">Bio-Weather Analysis</p>
               <p className="text-sm font-medium mt-1">
                 {weather.temperature > 20 ? "Warm day." : "Cool day."} 
                 <span className="opacity-80 ml-1">
                   {CyclePhase.LUTEAL === CURRENT_USER.phase ? "Stay hydrated." : "Great for a run."}
                 </span>
               </p>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Hero Phase Indicator */}
      <section>
        {isLoading ? (
          <Skeleton className="h-64 w-full rounded-2xl" />
        ) : (
          <PhaseIndicator phase={CyclePhase.LUTEAL} day={22} />
        )}
      </section>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col: Schedule & Fit */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Today's Schedule</CardTitle>
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 border border-transparent">
                       <div className="flex flex-col items-center min-w-[60px] gap-2">
                         <Skeleton className="h-4 w-12" />
                         <Skeleton className="h-8 w-px bg-gray-200" />
                       </div>
                       <div className="flex-1 space-y-2">
                         <Skeleton className="h-5 w-3/4" />
                         <div className="flex gap-2">
                           <Skeleton className="h-5 w-24 rounded-full" />
                           <Skeleton className="h-5 w-20 rounded-full" />
                         </div>
                       </div>
                    </div>
                  ))
                ) : (
                  events.map((event, idx) => {
                    const score = event.fitScore || 0;
                    let fitColor = 'bg-red-100 text-red-700';
                    let FitIcon = AlertTriangle;

                    if (score > 80) {
                        fitColor = 'bg-green-100 text-green-700';
                        FitIcon = CheckCircle2;
                    } else if (score >= 50) {
                        fitColor = 'bg-amber-100 text-amber-700';
                        FitIcon = AlertTriangle;
                    }

                    return (
                      <motion.div 
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                      >
                        <div className="flex flex-col items-center min-w-[60px]">
                          <span className="text-sm font-bold text-gray-900">{formatTime(event.startTime)}</span>
                          <div className="h-8 w-px bg-gray-200 my-1"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{event.title}</h4>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                              {EVENT_TYPE_CONFIG[event.eventType].emoji} {EVENT_TYPE_CONFIG[event.eventType].label}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1", fitColor)}>
                              <FitIcon className="h-3 w-3" />
                              Cycle Fit: {score}%
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-semibold text-gray-900 flex items-center gap-2">
              Luna AI Suggestions
              {isLoading && <Skeleton className="h-4 w-4 rounded-full" />}
            </h3>
            
            {isLoading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <Skeleton className="h-40 rounded-xl" />
                 <Skeleton className="h-40 rounded-xl" />
               </div>
            ) : suggestions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {suggestions.map((sugg) => (
                    <motion.div
                      key={sugg.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    >
                      <Card className="border-l-4 border-l-luna-amethyst-500 bg-gradient-to-br from-white to-luna-amethyst-50 h-full shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md flex items-center gap-2 text-luna-amethyst-900">
                            <Zap className="h-4 w-4 text-luna-amethyst-600" />
                            {sugg.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-6 min-h-[40px]">{sugg.body}</p>
                          <div className="flex gap-2 mt-auto">
                            <Button 
                              size="sm" 
                              variant="luna"
                              className="flex-1 h-9 text-xs relative shadow-none"
                              disabled={actionLoading === sugg.id}
                              onClick={() => handleSuggestionAction(sugg.id, 'accept')}
                            >
                              {actionLoading === sugg.id ? (
                                <RefreshCcw className="h-3 w-3 animate-spin" />
                              ) : (
                                <>
                                  <Check className="h-3 w-3 mr-1.5" /> Accept
                                </>
                              )}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex-1 h-9 text-xs hover:bg-gray-50 text-gray-600 border-gray-200"
                              disabled={actionLoading === sugg.id}
                              onClick={() => handleSuggestionAction(sugg.id, 'dismiss')}
                            >
                              <X className="h-3 w-3 mr-1.5" /> Dismiss
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200"
              >
                <CheckCircle2 className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">All suggestions reviewed for today</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Col: Bio-Weather Engine & Lifestyle */}
        <div className="space-y-6">
          
          {/* Bio-Weather Engine Card (New High-Value Feature) */}
          <Card className="border-luna-amethyst-200 shadow-md bg-gradient-to-b from-white to-luna-amethyst-50/30">
            <CardHeader className="pb-4 border-b border-gray-100">
               <CardTitle className="text-luna-amethyst-900 flex items-center gap-2 text-lg">
                 <Sparkles className="h-5 w-5 text-luna-amethyst-500" /> Bio-Weather Engine
               </CardTitle>
               <p className="text-xs text-gray-500">Daily optimization based on phase & temp.</p>
            </CardHeader>
            <CardContent className="p-0">
               {isLoading || !bioInsight ? (
                 <div className="p-6 space-y-4">
                   <Skeleton className="h-20 w-full" />
                   <Skeleton className="h-20 w-full" />
                 </div>
               ) : (
                 <div className="divide-y divide-gray-100">
                    {/* Wardrobe Section */}
                    <div className="p-5 space-y-3 hover:bg-white/50 transition-colors">
                       <div className="flex items-center gap-2 mb-1">
                          <Shirt className="h-4 w-4 text-gray-400" />
                          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Wardrobe</h4>
                       </div>
                       <div>
                          <p className="font-display font-bold text-lg text-gray-900 leading-tight mb-1">{bioInsight.wardrobe.summary}</p>
                          <p className="text-sm text-gray-600 leading-relaxed">{bioInsight.wardrobe.details}</p>
                       </div>
                       <div className="flex flex-wrap gap-2 pt-1">
                          {bioInsight.wardrobe.outfitTags.map(tag => (
                             <span key={tag} className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200">
                               {tag}
                             </span>
                          ))}
                       </div>
                    </div>

                    {/* Nutrition Section */}
                    <div className="p-5 space-y-3 hover:bg-white/50 transition-colors">
                       <div className="flex items-center gap-2 mb-1">
                          <Apple className="h-4 w-4 text-gray-400" />
                          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide">High-Performance Fuel</h4>
                       </div>
                       <div>
                          <p className="font-display font-bold text-lg text-gray-900 leading-tight mb-1">{bioInsight.nutrition.focus}</p>
                          <p className="text-sm text-gray-600 leading-relaxed">{bioInsight.nutrition.details}</p>
                       </div>
                       <div className="flex items-center gap-2 pt-1">
                          <span className="text-[10px] uppercase font-bold text-luna-amethyst-600">Power Foods:</span>
                          <div className="flex gap-1.5">
                            {bioInsight.nutrition.powerIngredients.map(ing => (
                              <span key={ing} className="text-[10px] font-medium bg-luna-amethyst-100 text-luna-amethyst-700 px-2 py-1 rounded-full">
                                {ing}
                              </span>
                            ))}
                          </div>
                       </div>
                    </div>
                 </div>
               )}
            </CardContent>
          </Card>
          
          {/* Daily Muse (Art) */}
           <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">Daily Inspiration</h3>
              
              {isLoading || !art ? (
                <Skeleton className="h-40 rounded-xl" />
              ) : (
                <Card className="overflow-hidden group cursor-pointer border-transparent shadow-md hover:shadow-lg transition-all">
                   <div className="h-40 bg-gray-900 relative">
                     <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                     <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-luna-gold-300 mb-1">
                          <Palette className="h-3 w-3" /> Daily Muse
                        </div>
                        <h4 className="font-display font-bold text-lg leading-tight truncate">{art.title}</h4>
                        <p className="text-xs text-gray-300 mt-0.5">{art.artist}, {art.date}</p>
                     </div>
                   </div>
                </Card>
              )}
           </div>

           <Card className="bg-luna-amethyst-900 text-white border-none">
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-10 bg-white/20 rounded-lg shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-20 bg-white/20" />
                    <Skeleton className="h-12 w-full bg-white/20" />
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-luna-gold-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Pro Tip</h4>
                    <p className="text-luna-amethyst-100 text-sm mt-1">
                      Your focus is high today. Tackle that complex spreadsheet before 2 PM.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
