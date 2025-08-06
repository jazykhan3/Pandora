import React, { useState } from "react";
import { ArrowLeft, Send, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Feedback() {
  const navigate = useNavigate();
  
  const [appFeedback, setAppFeedback] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [advancedFeedback, setAdvancedFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if at least one field has content
    if (!appFeedback.trim() && !aiFeedback.trim() && !advancedFeedback.trim()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call to send email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would send to pandauracares@mail.com
      const emailBody = createEmailBody();
      console.log('Feedback submission:', emailBody);
      
      setSubmitStatus('success');
      
      // Clear form after successful submission
      setTimeout(() => {
        setAppFeedback("");
        setAiFeedback("");
        setAdvancedFeedback("");
        setSubmitStatus('idle');
      }, 3000);
      
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const createEmailBody = () => {
    let body = "";
    
    if (appFeedback.trim()) {
      body += "— Feedback About the App —\n" + appFeedback.trim() + "\n\n";
    }
    
    if (aiFeedback.trim()) {
      body += "— Feedback About the AI —\n" + aiFeedback.trim() + "\n\n";
    }
    
    if (advancedFeedback.trim()) {
      body += "— Advanced Feedback —\n" + advancedFeedback.trim() + "\n\n";
    }
    
    body += `Submitted on: ${new Date().toLocaleString()}\n`;
    body += `User Session: ${Math.random().toString(36).substr(2, 9)}`;
    
    return body;
  };

  const hasContent = appFeedback.trim() || aiFeedback.trim() || advancedFeedback.trim();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-light px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-background rounded-md transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-secondary" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-primary">Feedback</h1>
            <p className="text-sm text-secondary">Help us improve Pandaura AS</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-2">We'd love to hear from you</h2>
          <p className="text-muted">
            Your feedback helps us build better automation tools. Share your thoughts in any or all sections below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* App Feedback */}
          <div className="bg-surface border border-light rounded-lg p-6">
            <h3 className="text-lg font-semibold text-primary mb-2">
              Your thoughts on the app
            </h3>
            <p className="text-sm text-muted mb-4">
              What's been working well? What's been frustrating? Tell us anything about your experience with Pandaura.
            </p>
            <textarea
              value={appFeedback}
              onChange={(e) => setAppFeedback(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-light rounded-md text-primary placeholder-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
              placeholder="Share your experience with the app..."
              rows={6}
              maxLength={2000}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted">
                Optional • Be as detailed as you'd like
              </span>
              <span className="text-xs text-muted">
                {appFeedback.length}/2000
              </span>
            </div>
          </div>

          {/* AI Feedback */}
          <div className="bg-surface border border-light rounded-lg p-6">
            <h3 className="text-lg font-semibold text-primary mb-2">
              Your thoughts on the AI
            </h3>
            <p className="text-sm text-muted mb-4">
              How helpful has the AI been for you? Any moments it surprised you—or totally missed the mark?
            </p>
            <textarea
              value={aiFeedback}
              onChange={(e) => setAiFeedback(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-light rounded-md text-primary placeholder-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
              placeholder="Tell us about your AI assistant experience..."
              rows={6}
              maxLength={2000}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted">
                Optional • We're always improving the AI
              </span>
              <span className="text-xs text-muted">
                {aiFeedback.length}/2000
              </span>
            </div>
          </div>

          {/* Advanced Feedback */}
          <div className="bg-surface border border-light rounded-lg p-6">
            <h3 className="text-lg font-semibold text-primary mb-2">
              Want to go deeper?
            </h3>
            <p className="text-sm text-muted mb-4">
              If you've got technical notes, feature requests, or specific examples — we'd love to hear them here.
            </p>
            <textarea
              value={advancedFeedback}
              onChange={(e) => setAdvancedFeedback(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-light rounded-md text-primary placeholder-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
              placeholder="Share technical feedback, feature requests, or specific examples..."
              rows={6}
              maxLength={3000}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted">
                Optional • Technical details welcome
              </span>
              <span className="text-xs text-muted">
                {advancedFeedback.length}/3000
              </span>
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-surface border border-light rounded-lg p-6">
            {submitStatus === 'success' && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800">
                  Thanks — we seriously read every message. ✅
                </span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800">
                  Something went wrong. Try again or email us directly at pandauracares@mail.com. ❌
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">
                Your feedback goes directly to <span className="font-mono">pandauracares@mail.com</span>
              </p>
              
              <button
                type="submit"
                disabled={!hasContent || isSubmitting}
                className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-md shadow-sm transition-all duration-200 flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Feedback
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted">
            All feedback is sent securely and never shared with third parties. 
            We read everything and use it to improve Pandaura AS.
          </p>
        </div>
      </div>
    </div>
  );
}