import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpWelcome from '../components/signup/SignUpWelcome';
import SignUpOrgChoice from '../components/signup/SignUpOrgChoice';
import SignUpOrgSetup from '../components/signup/SignUpOrgSetup';
import SignUpAccountBasics from '../components/signup/SignUpAccountBasics';
import SignUpSecurity from '../components/signup/SignUpSecurity';
import SignUpConsent from '../components/signup/SignUpConsent';
import SignUpEnvironment from '../components/signup/SignUpEnvironment';
import SignUpFinish from '../components/signup/SignUpFinish';
import { useAuth } from '../contexts/AuthContext';

interface SignUpData {
  orgChoice: 'create' | 'join' | null;
  inviteData?: any;
  orgData?: any;
  accountData?: any;
  securityData?: any;
  consentData?: any;
  environmentData?: any;
}

export default function SignUp() {
  const [step, setStep] = useState(0);
  const [signUpData, setSignUpData] = useState<SignUpData>({
    orgChoice: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const { createOrganization, acceptInvite } = useAuth();
  const navigate = useNavigate();

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleOrgChoice = (choice: 'create' | 'join', data?: any) => {
    setSignUpData(prev => ({
      ...prev,
      orgChoice: choice,
      inviteData: choice === 'join' ? data : undefined
    }));
  };

  const handleOrgData = (data: any) => {
    setSignUpData(prev => ({ ...prev, orgData: data }));
  };

  const handleAccountData = (data: any) => {
    setSignUpData(prev => ({ ...prev, accountData: data }));
  };

  const handleSecurityData = (data: any) => {
    setSignUpData(prev => ({ ...prev, securityData: data }));
  };

  const handleConsentData = (data: any) => {
    setSignUpData(prev => ({ ...prev, consentData: data }));
  };

  const handleEnvironmentData = (data: any) => {
    setSignUpData(prev => ({ ...prev, environmentData: data }));
  };

  const handleSubmitSignUp = async () => {
    setIsLoading(true);
    
    try {
      if (signUpData.orgChoice === 'create') {
        // Create new organization
        const result = await createOrganization({
          orgName: signUpData.orgData.orgName,
          industry: signUpData.orgData.industry,
          size: signUpData.orgData.size,
          fullName: signUpData.accountData.fullName,
          email: signUpData.accountData.email,
          password: signUpData.accountData.password
        });

        if (result.success) {
          navigate('/home');
        } else {
          throw new Error(result.message || 'Failed to create organization');
        }
      } else if (signUpData.orgChoice === 'join') {
        // Accept invite and join organization
        const result = await acceptInvite({
          code: signUpData.inviteData.code,
          fullName: signUpData.accountData.fullName,
          email: signUpData.accountData.email,
          password: signUpData.accountData.password
        });

        if (result.success) {
          navigate('/home');
        } else {
          throw new Error(result.message || 'Failed to join organization');
        }
      }
    } catch (error) {
      console.error('Sign up error:', error);
      // Handle error - you might want to show an error message
      alert('Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <SignUpWelcome nextStep={nextStep} />;
      case 1:
        return (
          <SignUpOrgChoice
            nextStep={nextStep}
            prevStep={prevStep}
            onOrgChoice={handleOrgChoice}
          />
        );
      case 2:
        return (
          <SignUpOrgSetup
            nextStep={nextStep}
            prevStep={prevStep}
            onOrgData={handleOrgData}
            isJoining={signUpData.orgChoice === 'join'}
            inviteData={signUpData.inviteData}
          />
        );
      case 3:
        return (
          <SignUpAccountBasics
            nextStep={nextStep}
            prevStep={prevStep}
            onAccountData={handleAccountData}
            isJoining={signUpData.orgChoice === 'join'}
            inviteData={signUpData.inviteData}
          />
        );
      case 4:
        return (
          <SignUpSecurity
            nextStep={nextStep}
            prevStep={prevStep}
            onSecurityData={handleSecurityData}
          />
        );
      case 5:
        return (
          <SignUpConsent
            nextStep={nextStep}
            prevStep={prevStep}
            onConsentData={handleConsentData}
          />
        );
      case 6:
        return (
          <SignUpEnvironment
            nextStep={nextStep}
            prevStep={prevStep}
            onEnvironmentData={handleEnvironmentData}
          />
        );
      case 7:
        return (
          <SignUpFinish
            onComplete={handleSubmitSignUp}
            isLoading={isLoading}
            signUpData={signUpData}
          />
        );
      default:
        return <SignUpWelcome nextStep={nextStep} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden py-8 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-accent/5 to-transparent" />
      </div>
      
      <div className="z-10 w-full max-w-md">
        {/* Progress Indicator */}
        {step > 0 && step < 7 && (
          <div className="mb-8">
            <div className="flex justify-center mb-2">
              <span className="text-sm text-secondary">
                Step {step} of 6
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 6) * 100}%` }}
              />
            </div>
          </div>
        )}
        
        {renderStep()}
      </div>
    </div>
  );
}
