
import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FAMILY_MEMBERS } from '../services/mockData';
import { PhaseIndicator } from '../components/luna/PhaseIndicator'; 
import { PHASE_CONFIG, FAMILY_ALERT_TYPES } from '../constants';
import { MessageCircle, BellRing, HeartHandshake, Send, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { useToast } from '../components/ui/Toast';

export const Family: React.FC = () => {
  const { toast } = useToast();
  const [inviteSent, setInviteSent] = useState(false);

  const handleNudge = (memberName: string, nudgeType: string, icon: string) => {
    toast({
      type: 'success',
      title: 'Nudge Sent',
      description: `Sent "${nudgeType}" to ${memberName}.`
    });
  };

  const handleInvite = () => {
    setInviteSent(true);
    toast({
      type: 'success',
      title: 'Invitation Sent',
      description: 'We sent an email to complete the setup.'
    });
    setTimeout(() => setInviteSent(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header>
        <h1 className="text-3xl font-display font-bold text-gray-900">Family Circle</h1>
        <p className="text-gray-500">Stay connected with your daughter's wellness.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FAMILY_MEMBERS.map((member) => (
          <Card key={member.id} className="overflow-hidden border-luna-amethyst-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-24 bg-gradient-to-r from-luna-amethyst-100 to-white relative">
                <div className="absolute -bottom-8 left-6">
                    <img src={member.avatarUrl} alt={member.name} className="w-16 h-16 rounded-full border-4 border-white shadow-md bg-white" />
                </div>
            </div>
            <CardContent className="pt-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{member.name}</h2>
                        <p className="text-sm text-gray-500">{member.relationship}</p>
                    </div>
                    <div className={cn("px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide", 
                        PHASE_CONFIG[member.phase].bgColor, "bg-opacity-20 text-gray-800")}>
                        {PHASE_CONFIG[member.phase].name} {PHASE_CONFIG[member.phase].emoji}
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
                    <div className="text-xs text-gray-400 font-medium uppercase mb-2">Current Status</div>
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                        <MessageCircle className="h-4 w-4 text-luna-amethyst-500" />
                        "{member.statusMessage}"
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-900">Send a quick nudge:</p>
                    <div className="grid grid-cols-2 gap-2">
                        <Button 
                            variant="outline" 
                            className="justify-start gap-2 h-auto py-3 hover:bg-luna-amethyst-50 hover:text-luna-amethyst-700 hover:border-luna-amethyst-200"
                            onClick={() => handleNudge(member.name, FAMILY_ALERT_TYPES.JUST_SAYING_HI.label, FAMILY_ALERT_TYPES.JUST_SAYING_HI.icon)}
                        >
                            <span>{FAMILY_ALERT_TYPES.JUST_SAYING_HI.icon}</span>
                            <span className="text-xs truncate">{FAMILY_ALERT_TYPES.JUST_SAYING_HI.label}</span>
                        </Button>
                        <Button 
                            variant="outline" 
                            className="justify-start gap-2 h-auto py-3 hover:bg-luna-amethyst-50 hover:text-luna-amethyst-700 hover:border-luna-amethyst-200"
                            onClick={() => handleNudge(member.name, 'Have a good day', '🌟')}
                        >
                             <span>🌟</span>
                            <span className="text-xs truncate">Have a good day</span>
                        </Button>
                         <Button 
                            variant="outline" 
                            className="justify-start gap-2 h-auto py-3 hover:bg-luna-amethyst-50 hover:text-luna-amethyst-700 hover:border-luna-amethyst-200"
                            onClick={() => handleNudge(member.name, 'Sending chocolate', '🍫')}
                        >
                             <span>🍫</span>
                            <span className="text-xs truncate">Sending chocolate</span>
                        </Button>
                        <Button 
                            variant="outline" 
                            className="justify-start gap-2 h-auto py-3 text-luna-amethyst-700 border-luna-amethyst-200 bg-luna-amethyst-50 hover:bg-luna-amethyst-100"
                            onClick={() => handleNudge(member.name, 'Need support?', 'Heart')}
                        >
                             <HeartHandshake className="h-4 w-4" />
                            <span className="text-xs truncate">Need support?</span>
                        </Button>
                    </div>
                </div>
            </CardContent>
          </Card>
        ))}

        {/* Invite Card */}
        <Card 
            className="border-dashed border-2 flex items-center justify-center p-6 text-center cursor-pointer hover:bg-gray-50 transition-all border-gray-300 hover:border-luna-amethyst-300 group"
            onClick={!inviteSent ? handleInvite : undefined}
        >
            <div>
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors",
                    inviteSent ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-luna-amethyst-500 group-hover:shadow-sm"
                )}>
                    {inviteSent ? <Check className="h-6 w-6" /> : <BellRing className="h-6 w-6" />}
                </div>
                <h3 className="font-semibold text-gray-900">{inviteSent ? 'Invite Sent!' : 'Invite Family Member'}</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                    {inviteSent ? 'Check your email for confirmation.' : 'Add a daughter to share cycle updates and support each other.'}
                </p>
                {!inviteSent && (
                    <Button className="mt-4" variant="secondary">Send Invite</Button>
                )}
            </div>
        </Card>
      </div>
    </div>
  );
};
