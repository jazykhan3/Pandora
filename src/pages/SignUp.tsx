import React, { useState } from 'react';
import SignUpWelcome from '../components/signup/SignUpWelcome';
import SignUpAccountBasics from '../components/signup/SignUpAccountBasics';
import SignUpSecurity from '../components/signup/SignUpSecurity';
import SignUpIdentity from '../components/signup/SignUpIdentity';
import SignUpConsent from '../components/signup/SignUpConsent';
import SignUpEnvironment from '../components/signup/SignUpEnvironment';
import SignUpFinish from '../components/signup/SignUpFinish';

const steps = [
  SignUpWelcome,
  SignUpAccountBasics,
  SignUpSecurity,
  SignUpIdentity,
  SignUpConsent,
  SignUpEnvironment,
  SignUpFinish,
];

export default function SignUp() {
  const [step, setStep] = useState(0);
  const StepComponent = steps[step];

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden py-20 px-4">
      {step === steps.length - 1 ? (
        <SignUpFinish />
      ) : (
        <StepComponent nextStep={nextStep} prevStep={prevStep} />
      )}
    </div>
  );
}
