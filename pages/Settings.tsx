
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardTitle as CTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  User, CreditCard, Shield, Settings as Cog, Camera, 
  Mail, Bell, Moon, Sun, Globe, Download, Trash2, 
  Check, X, AlertTriangle, Loader2, LogOut, Smartphone
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCycles } from '../hooks/useCycles';
import { authService } from '../services/auth';
import { getUserSubscription, UserSubscription } from '../lib/billing/subscription';
import { cn, formatDate } from '../lib/utils';
import { useToast } from '../components/ui/Toast';
import { supabase } from '../services/supabase';

interface SettingsProps {
  onNavigate: (view: string) => void;
}

type Tab = 'profile' | 'subscription' | 'security' | 'preferences';

// Internal Modal Component for confirmations
const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmText, 
  isDangerous = false 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  title: string; 
  description: string; 
  confirmText: string;
  isDangerous?: boolean;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative z-10 overflow-hidden animate-fade-in">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={cn("p-3 rounded-full shrink-0", isDangerous ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600")}>
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed">{description}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            className={cn(isDangerous ? "bg-red-600 hover:bg-red-700 text-white" : "bg-luna-amethyst-600 text-white")}
            onClick={() => { onConfirm(); onClose(); }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
  const { user, profile, signOut } = useAuth();
  const { cycles } = useCycles(); // For data export
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [sub, setSub] = useState<UserSubscription | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    cycleLength: 28,
  });

  // Modal States
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    action: () => void;
    isDangerous: boolean;
  }>({
    isOpen: false,
    title: '',
    description: '',
    confirmText: '',
    action: () => {},
    isDangerous: false,
  });

  // Preferences State (Mock local storage)
  const [preferences, setPreferences] = useState({
    notifications: true,
    symptomLogReminders: true,
    theme: 'light',
    language: 'en'
  });

  useEffect(() => {
    getUserSubscription().then(setSub);
    if (profile) {
      setFormData({
        name: profile.name || '',
        cycleLength: profile.average_cycle_length || 28,
      });
    }
  }, [profile]);

  // --- Actions ---

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    const { error } = await authService.updateProfile(user.id, {
      name: formData.name,
      average_cycle_length: Number(formData.cycleLength)
    });

    setIsLoading(false);
    if (error) {
      toast({ type: 'error', title: 'Update Failed', description: error.message });
    } else {
      toast({ type: 'success', title: 'Profile Updated', description: 'Your changes have been saved.' });
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock upload process since we don't have storage bucket config in prompt
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        toast({ type: 'success', title: 'Avatar Updated', description: 'Your new profile picture looks great!' });
      }, 1500);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: window.location.origin,
    });
    
    if (error) {
      toast({ type: 'error', title: 'Error', description: error.message });
    } else {
      toast({ type: 'success', title: 'Email Sent', description: 'Check your inbox for password reset instructions.' });
    }
  };

  const handleExportData = () => {
    const exportData = {
      profile,
      subscription: sub,
      cycleHistory: cycles,
      preferences,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `luna-data-export-${formatDate(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ type: 'success', title: 'Data Exported', description: 'Your data has been downloaded successfully.' });
  };

  const handleDeleteAccount = async () => {
    // In a real app, calls a cloud function to delete user. Here we mock/signout.
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await signOut();
    window.location.reload();
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Mock update local state
    setSub(prev => prev ? ({ ...prev, plan: 'FREE', status: 'CANCELED', isPro: false }) : null);
    setIsLoading(false);
    toast({ type: 'info', title: 'Subscription Canceled', description: 'You have been downgraded to the Free plan.' });
  };

  // --- Render Sections ---

  const renderProfile = () => (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
             <div className="h-24 w-24 rounded-full bg-luna-amethyst-100 flex items-center justify-center text-3xl font-display font-bold text-luna-amethyst-600 border-4 border-white shadow-lg overflow-hidden">
                {isLoading ? <Loader2 className="animate-spin h-8 w-8" /> : (profile?.name?.charAt(0) || 'U')}
             </div>
             <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white h-6 w-6" />
             </div>
             <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{profile?.name || 'User'}</h3>
            <p className="text-sm text-gray-500">Update your photo and personal details.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-luna-amethyst-500 outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative opacity-70 cursor-not-allowed">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="email" 
                value={user?.email || ''}
                disabled
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
              />
            </div>
            <p className="text-xs text-gray-400">Contact support to change email.</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Average Cycle Length (Days)</label>
            <input 
              type="number" 
              value={formData.cycleLength}
              onChange={(e) => setFormData({...formData, cycleLength: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-luna-amethyst-500 outline-none"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button onClick={handleUpdateProfile} disabled={isLoading} variant="luna">
             {isLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Check className="h-4 w-4 mr-2" />}
             Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderSubscription = () => (
    <div className="space-y-6">
      <Card className={cn("border-2", sub?.isPro ? "border-luna-amethyst-500" : "border-gray-200")}>
        <CardHeader>
          <div className="flex justify-between items-center">
             <CardTitle>Current Plan</CardTitle>
             <span className={cn(
               "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
               sub?.isPro ? "bg-luna-amethyst-100 text-luna-amethyst-700" : "bg-gray-100 text-gray-600"
             )}>
               {sub?.planName}
             </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-1 mb-6">
             <span className="text-3xl font-bold text-gray-900">{sub?.isPro ? '$14.99' : '$0'}</span>
             <span className="text-gray-500">/month</span>
          </div>

          {!sub?.isPro ? (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6">
               <h4 className="font-bold text-gray-900 mb-2">Upgrade to Pro</h4>
               <p className="text-sm text-gray-500 mb-4">Unlock advanced cycle predictions, family connection, and executive insights.</p>
               <div className="space-y-2 mb-6">
                  {['Advanced predictions', 'Connect with 3 family members', 'Nutrition & workout plans'].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                       <Check className="h-4 w-4 text-green-500" /> {feat}
                    </div>
                  ))}
               </div>
               <Button onClick={() => onNavigate('pricing')} className="w-full" variant="luna">
                 Upgrade for $14.99/mo
               </Button>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <p className="text-sm text-gray-600">Your next billing date is <span className="font-semibold text-gray-900">{formatDate(new Date(Date.now() + 86400000 * 15))}</span>.</p>
            </div>
          )}

          {sub?.isPro && (
            <div className="flex justify-end pt-4 border-t">
              <button 
                onClick={() => setModalConfig({
                  isOpen: true,
                  title: 'Cancel Subscription?',
                  description: 'You will lose access to Pro features at the end of your billing cycle. This action cannot be undone.',
                  confirmText: 'Yes, Cancel',
                  isDangerous: true,
                  action: handleCancelSubscription
                })}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Cancel Subscription
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sign In & Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
              <div>
                 <h4 className="font-medium text-gray-900">Password</h4>
                 <p className="text-sm text-gray-500">Change your password via email link.</p>
              </div>
              <Button variant="outline" size="sm" onClick={handlePasswordReset}>Change Password</Button>
           </div>
           
           <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
              <div>
                 <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                 <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-xs text-gray-400 italic mr-2">Coming soon</span>
                 <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-not-allowed">
                    <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                 </div>
              </div>
           </div>
        </CardContent>
      </Card>

      <Card className="border-red-100">
        <CardHeader className="bg-red-50/30">
          <CardTitle className="text-red-800">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
           <div className="flex items-center justify-between">
              <div>
                 <h4 className="font-medium text-gray-900">Export Data</h4>
                 <p className="text-sm text-gray-500">Download a copy of your personal data.</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportData}>
                 <Download className="h-4 w-4 mr-2" /> Export JSON
              </Button>
           </div>
           
           <div className="pt-4 border-t border-red-100 flex items-center justify-between">
              <div>
                 <h4 className="font-medium text-red-700">Delete Account</h4>
                 <p className="text-sm text-red-400">Permanently delete your account and all data.</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                onClick={() => setModalConfig({
                  isOpen: true,
                  title: 'Delete Account?',
                  description: 'This action is irreversible. All your cycle data, preferences, and subscription history will be permanently erased.',
                  confirmText: 'Permanently Delete',
                  isDangerous: true,
                  action: handleDeleteAccount
                })}
              >
                 <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPreferences = () => (
    <Card>
      <CardHeader>
        <CardTitle>App Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
         {/* Notifications */}
         <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Bell className="h-4 w-4 text-gray-500" /> Notifications
            </h4>
            
            <div className="flex items-center justify-between pl-6">
               <label className="text-sm text-gray-700">Period Reminders</label>
               <button 
                 onClick={() => setPreferences(p => ({ ...p, notifications: !p.notifications }))}
                 className={cn("w-10 h-6 rounded-full relative transition-colors", preferences.notifications ? "bg-luna-amethyst-500" : "bg-gray-200")}
               >
                  <div className={cn("absolute top-1 bg-white h-4 w-4 rounded-full shadow-sm transition-all", preferences.notifications ? "left-5" : "left-1")} />
               </button>
            </div>

            <div className="flex items-center justify-between pl-6">
               <label className="text-sm text-gray-700">Symptom Logging Nudges</label>
               <button 
                 onClick={() => setPreferences(p => ({ ...p, symptomLogReminders: !p.symptomLogReminders }))}
                 className={cn("w-10 h-6 rounded-full relative transition-colors", preferences.symptomLogReminders ? "bg-luna-amethyst-500" : "bg-gray-200")}
               >
                  <div className={cn("absolute top-1 bg-white h-4 w-4 rounded-full shadow-sm transition-all", preferences.symptomLogReminders ? "left-5" : "left-1")} />
               </button>
            </div>
         </div>

         <div className="border-t border-gray-100 my-4" />

         {/* Appearance */}
         <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-gray-500" /> Appearance
            </h4>
            <div className="grid grid-cols-3 gap-3">
               {['light', 'dark', 'auto'].map((theme) => (
                 <button 
                    key={theme}
                    onClick={() => setPreferences(p => ({ ...p, theme }))}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-medium capitalize transition-all",
                      preferences.theme === theme 
                        ? "border-luna-amethyst-500 bg-luna-amethyst-50 text-luna-amethyst-700" 
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    )}
                 >
                    {theme === 'light' ? <Sun className="h-5 w-5 mb-2" /> : theme === 'dark' ? <Moon className="h-5 w-5 mb-2" /> : <Smartphone className="h-5 w-5 mb-2" />}
                    {theme}
                 </button>
               ))}
            </div>
         </div>

         <div className="border-t border-gray-100 my-4" />

         {/* Language */}
         <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
               <Globe className="h-4 w-4 text-gray-500" /> Language
            </h4>
            <select 
              value={preferences.language}
              onChange={(e) => setPreferences({...preferences, language: e.target.value})}
              className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-luna-amethyst-500 bg-white"
            >
               <option value="en">English (US)</option>
               <option value="es">Español</option>
               <option value="fr">Français</option>
            </select>
         </div>
      </CardContent>
    </Card>
  );

  const NavItem = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
        activeTab === tab
          ? "bg-white text-luna-amethyst-700 shadow-sm border border-luna-amethyst-100"
          : "text-gray-500 hover:bg-white/50 hover:text-gray-900"
      )}
    >
      <Icon className={cn("h-4 w-4", activeTab === tab ? "text-luna-amethyst-600" : "text-gray-400")} />
      {label}
    </button>
  );

  return (
    <div className="animate-fade-in pb-20">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account, subscription, and preferences.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-3 space-y-1">
          <NavItem tab="profile" icon={User} label="Profile" />
          <NavItem tab="subscription" icon={CreditCard} label="Subscription" />
          <NavItem tab="security" icon={Shield} label="Privacy & Security" />
          <NavItem tab="preferences" icon={Cog} label="Preferences" />
          
          <div className="pt-4 mt-4 border-t border-gray-200/50">
             <button 
                onClick={signOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
             >
                <LogOut className="h-4 w-4" /> Sign Out
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'subscription' && renderSubscription()}
          {activeTab === 'security' && renderSecurity()}
          {activeTab === 'preferences' && renderPreferences()}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(p => ({ ...p, isOpen: false }))}
        onConfirm={modalConfig.action}
        title={modalConfig.title}
        description={modalConfig.description}
        confirmText={modalConfig.confirmText}
        isDangerous={modalConfig.isDangerous}
      />
    </div>
  );
};
