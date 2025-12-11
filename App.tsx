import React, { useState, Component, ErrorInfo } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Family } from './pages/Family';
import { Pricing } from './pages/Pricing';
import { Settings } from './pages/Settings';
import { LayoutDashboard, Users, CalendarDays, Settings as SettingsIcon, LogOut, Menu, Crown, Sparkles, CheckCircle2, AlertTriangle, RefreshCcw, X } from 'lucide-react';
import { cn } from './lib/utils';
import { Button } from './components/ui/Button';
import { ToastProvider, useToast } from './components/ui/Toast';
import { CURRENT_USER } from './services/mockData';
import { motion, AnimatePresence } from 'framer-motion';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary Component
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-[#FDFBF9]">
          <div className="bg-red-50 p-4 rounded-full mb-4">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-500 max-w-md mb-8">
            Our team has been notified. Please try refreshing the page.
          </p>
          <Button onClick={() => window.location.reload()} className="gap-2">
            <RefreshCcw className="h-4 w-4" /> Reload LUNA
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simple Router implementation
const VIEWS = {
  DASHBOARD: 'dashboard',
  FAMILY: 'family',
  CALENDAR: 'calendar',
  PRICING: 'pricing',
  ONBOARDING: 'onboarding',
  SETTINGS: 'settings',
};

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState(VIEWS.DASHBOARD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleCompleteOnboarding = () => {
    // Mock updating user state
    CURRENT_USER.onboardingComplete = true;
    toast({
      type: 'success',
      title: 'Setup Complete',
      description: 'Your profile has been updated.'
    });
    setCurrentView(VIEWS.DASHBOARD);
  };

  const handleSignOut = () => {
    toast({
      type: 'info',
      title: 'Signing Out',
      description: 'See you soon, Elena.'
    });
    // Mock delay then reload
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const renderView = () => {
    switch (currentView) {
      case VIEWS.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} />;
      case VIEWS.FAMILY:
        return <Family />;
      case VIEWS.PRICING:
        return <Pricing onNavigate={setCurrentView} />;
      case VIEWS.SETTINGS:
        return <Settings onNavigate={setCurrentView} />;
      case VIEWS.ONBOARDING:
        return (
          <div className="max-w-lg mx-auto mt-8 text-center space-y-6 animate-fade-in pb-20">
             <div className="h-20 w-20 bg-luna-amethyst-100 rounded-full flex items-center justify-center mx-auto text-luna-amethyst-600 shadow-sm">
               <Sparkles className="h-10 w-10" />
             </div>
             <div>
               <h2 className="text-3xl font-display font-bold text-gray-900">Let's finish your setup</h2>
               <p className="text-gray-500 mt-2">
                 We need a few more details to personalize your cycle intelligence.
               </p>
             </div>
             
             {/* Mock form steps */}
             <div className="bg-white p-8 rounded-2xl border shadow-sm text-left space-y-6">
                <div className="space-y-3">
                   <label className="text-sm font-semibold text-gray-700">Average Cycle Length</label>
                   <div className="h-12 bg-gray-50 rounded-lg border border-gray-200 w-full flex items-center px-4 text-gray-500">
                      28 Days
                   </div>
                </div>
                <div className="space-y-3">
                   <label className="text-sm font-semibold text-gray-700">Last Period Start</label>
                   <div className="h-12 bg-gray-50 rounded-lg border border-gray-200 w-full flex items-center px-4 text-gray-500">
                      Select date...
                   </div>
                </div>
                <div className="space-y-3">
                   <label className="text-sm font-semibold text-gray-700">Primary Goal</label>
                   <div className="grid grid-cols-2 gap-3">
                      <div className="border-2 border-luna-amethyst-500 bg-luna-amethyst-50 text-luna-amethyst-700 p-3 rounded-xl font-medium text-sm text-center cursor-pointer">
                        Productivity
                      </div>
                      <div className="border border-gray-200 p-3 rounded-xl font-medium text-sm text-center text-gray-600 hover:bg-gray-50 cursor-pointer">
                        Wellness
                      </div>
                   </div>
                </div>
             </div>

             <Button size="lg" className="w-full h-12 text-base shadow-lg shadow-luna-amethyst-500/20" variant="luna" onClick={handleCompleteOnboarding}>
                Complete Setup
             </Button>
             
             <button onClick={() => setCurrentView(VIEWS.DASHBOARD)} className="text-sm text-gray-400 hover:text-gray-600">
                Skip for now
             </button>
          </div>
        );
      case VIEWS.CALENDAR:
        return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center p-6 animate-fade-in">
             <div className="h-24 w-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <CalendarDays className="h-10 w-10 text-blue-500" />
             </div>
             <h2 className="text-2xl font-display font-bold text-gray-900">Calendar Sync Active</h2>
             <p className="text-gray-500 max-w-md mt-2 leading-relaxed">
               Your Google Calendar events are synced. View them on the Dashboard with intelligent cycle overlays.
             </p>
             <Button className="mt-8" variant="outline" onClick={() => setCurrentView(VIEWS.DASHBOARD)}>Back to Dashboard</Button>
          </div>
        );
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  const NavItem = ({ view, icon: Icon, label, highlight = false }: { view: string; icon: any; label: string; highlight?: boolean }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setMobileMenuOpen(false);
      }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left group",
        currentView === view
          ? "bg-luna-amethyst-50 text-luna-amethyst-700 font-medium"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
        highlight && "text-luna-amethyst-600"
      )}
    >
      <Icon className={cn(
        "h-5 w-5 transition-colors", 
        currentView === view ? "text-luna-amethyst-600" : (highlight ? "text-luna-amethyst-500" : "text-gray-400")
      )} />
      {label}
      {highlight && (
        <span className="ml-auto text-xs bg-luna-amethyst-100 text-luna-amethyst-700 px-2 py-0.5 rounded-full font-bold">
          PRO
        </span>
      )}
    </button>
  );

  return (
      <div className="min-h-screen bg-[#FDFBF9] flex font-sans">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-gray-200 bg-white fixed h-full inset-y-0 z-50">
          <div className="p-8">
            <h1 className="text-2xl font-display font-bold tracking-tight text-luna-amethyst-900 cursor-pointer" onClick={() => setCurrentView(VIEWS.DASHBOARD)}>LUNA.</h1>
          </div>
          
          <nav className="flex-1 px-4 space-y-1">
            <NavItem view={VIEWS.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
            <NavItem view={VIEWS.CALENDAR} icon={CalendarDays} label="Calendar" />
            <NavItem view={VIEWS.FAMILY} icon={Users} label="Family" />
            
            <div className="pt-4 pb-2">
               <div className="h-px bg-gray-100 mx-2 mb-4"></div>
               <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Account</p>
               <NavItem view={VIEWS.PRICING} icon={Sparkles} label="Upgrade Plan" highlight />
            </div>
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={() => setCurrentView(VIEWS.SETTINGS)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 w-full transition-colors rounded-xl",
                currentView === VIEWS.SETTINGS 
                  ? "bg-luna-amethyst-50 text-luna-amethyst-700 font-medium" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <SettingsIcon className={cn("h-5 w-5", currentView === VIEWS.SETTINGS && "text-luna-amethyst-600")} />
              Settings
            </button>
             <button 
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl w-full mt-1 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 relative">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-40 shadow-sm">
             <span className="text-xl font-display font-bold text-luna-amethyst-900">LUNA.</span>
             <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
               <Menu className="h-6 w-6" />
             </button>
          </div>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 right-0 w-3/4 max-w-sm bg-white shadow-2xl z-50 lg:hidden flex flex-col"
                >
                   <div className="p-4 border-b flex items-center justify-between">
                      <span className="text-xl font-display font-bold text-luna-amethyst-900">Menu</span>
                      <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                        <X className="h-6 w-6" />
                      </button>
                   </div>
                   <div className="p-4 space-y-2 flex-1 overflow-y-auto">
                      <NavItem view={VIEWS.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
                      <NavItem view={VIEWS.CALENDAR} icon={CalendarDays} label="Calendar" />
                      <NavItem view={VIEWS.FAMILY} icon={Users} label="Family" />
                      <div className="h-px bg-gray-100 my-2"></div>
                      <NavItem view={VIEWS.PRICING} icon={Sparkles} label="Upgrade Plan" highlight />
                      <NavItem view={VIEWS.SETTINGS} icon={SettingsIcon} label="Settings" />
                      <div className="h-px bg-gray-100 my-2"></div>
                      <button 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleSignOut();
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors font-medium"
                      >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                      </button>
                   </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div className="max-w-7xl mx-auto p-4 md:p-8">
            {renderView()}
          </div>
        </main>
      </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  </ErrorBoundary>
);

export default App;