import React, { useState } from "react";
import { Building2, Users, ArrowLeft } from "lucide-react";
import { Button, Input } from "../ui";
import { useAuth } from "../../contexts/AuthContext";

interface SignUpOrgChoiceProps {
  nextStep: () => void;
  prevStep: () => void;
  onOrgChoice: (choice: 'create' | 'join', data?: any) => void;
}

export default function SignUpOrgChoice({ nextStep, prevStep, onOrgChoice }: SignUpOrgChoiceProps) {
  const [choice, setChoice] = useState<'create' | 'join' | null>(null);
  const [inviteCode, setInviteCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { validateInvite } = useAuth();

  const handleCreateOrg = () => {
    onOrgChoice('create');
    nextStep();
  };

  const handleValidateInvite = async () => {
    if (!inviteCode.trim()) {
      setValidationError('Please enter an invite code');
      return;
    }

    setIsValidating(true);
    setValidationError('');

    try {
      const result = await validateInvite(inviteCode.trim());
      
      if (result.valid) {
        onOrgChoice('join', {
          code: inviteCode.trim(),
          orgName: result.orgName,
          role: result.role,
          email: result.email
        });
        nextStep();
      } else {
        setValidationError(result.message || 'Invalid or expired invite code');
      }
    } catch (error) {
      setValidationError('Failed to validate invite code. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <button
            onClick={prevStep}
            className="mr-3 p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-secondary" />
          </button>
          <h2 className="text-xl font-semibold text-primary">Get Started</h2>
        </div>

        <p className="text-secondary mb-6">
          Choose how you'd like to begin with Pandaura AS:
        </p>

        <div className="space-y-4">
          {/* Create New Organization */}
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              choice === 'create' 
                ? 'border-accent bg-accent-light' 
                : 'border-light hover:border-accent/50'
            }`}
            onClick={() => setChoice('create')}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-md mr-4 ${
                choice === 'create' ? 'bg-accent text-white' : 'bg-gray-100 text-secondary'
              }`}>
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-primary">Create New Organization</h3>
                <p className="text-sm text-secondary">
                  Start fresh and set up your team's automation workspace
                </p>
              </div>
            </div>
          </div>

          {/* Join Existing Team */}
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              choice === 'join' 
                ? 'border-accent bg-accent-light' 
                : 'border-light hover:border-accent/50'
            }`}
            onClick={() => setChoice('join')}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-md mr-4 ${
                choice === 'join' ? 'bg-accent text-white' : 'bg-gray-100 text-secondary'
              }`}>
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-primary">Join Existing Team</h3>
                <p className="text-sm text-secondary">
                  Use an invite code to join your organization
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Invite Code Input */}
        {choice === 'join' && (
          <div className="mt-6 space-y-4">
            <div>
              <Input
                label="Invite Code"
                placeholder="Enter your invite code or paste invite link"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                error={validationError}
                disabled={isValidating}
              />
              <p className="text-xs text-muted mt-2">
                Contact your organization admin for an invite code
              </p>
            </div>
            
            <Button
              onClick={handleValidateInvite}
              disabled={!inviteCode.trim() || isValidating}
              className="w-full"
              loading={isValidating}
            >
              {isValidating ? 'Validating...' : 'Validate & Continue'}
            </Button>
          </div>
        )}

        {/* Continue Button for Create Org */}
        {choice === 'create' && (
          <div className="mt-6">
            <Button
              onClick={handleCreateOrg}
              className="w-full"
            >
              Continue to Organization Setup
            </Button>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-muted">
          <p>Need help? Contact your administrator or check your email for an invite.</p>
        </div>
      </div>
    </div>
  );
}
