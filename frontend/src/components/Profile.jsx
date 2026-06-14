import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Mail, Shield, User } from 'lucide-react';

export default function Profile() {
  const username = localStorage.getItem('username') || 'Unknown User';
  const email = localStorage.getItem('email') || 'No email';
  const role = localStorage.getItem('role') || 'ROLE_USER';

  return (
    <div className="flex justify-center mt-8">
      <Card className="w-full max-w-md border-border shadow-sm">
        <CardContent className="pt-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-4xl font-bold mb-6 border-4 border-background shadow-lg relative">
            {username.charAt(0).toUpperCase()}
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-success rounded-full border-2 border-background" />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-1">{username}</h2>
          
          <div className="flex items-center gap-2 text-muted-foreground mb-6">
            <Mail size={16} />
            <span>{email}</span>
          </div>
          
          <div className="w-full pt-6 border-t border-border mt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">Account Role</span>
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                <Shield size={14} />
                {role.replace('ROLE_', '')}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm mt-4">
              <span className="text-muted-foreground font-medium">Status</span>
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-success/10 text-success border border-success/20">
                Active
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
