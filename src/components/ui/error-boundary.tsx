
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './button';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// Error boundary component class (needs to be a class component)
class ErrorBoundaryClass extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="flex flex-col items-center justify-center p-6 m-4 rounded-lg border border-red-200 bg-red-50 text-red-900">
          <AlertTriangle className="h-8 w-8 mb-4 text-red-500" />
          <h2 className="text-lg font-medium mb-2">Something went wrong</h2>
          <p className="text-sm text-red-700 mb-4">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <Button
            variant="outline"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Function component wrapper to use hooks with error boundary
export function ErrorBoundary({ children, fallback }: Props) {
  const { t } = useLanguage();
  
  const customFallback = fallback || (
    <div className="flex flex-col items-center justify-center p-6 m-4 rounded-lg border border-red-200 bg-red-50 text-red-900">
      <AlertTriangle className="h-8 w-8 mb-4 text-red-500" />
      <h2 className="text-lg font-medium mb-2">{t('error')}</h2>
      <p className="text-sm text-red-700 mb-4">
        {t('unableToLoadData')}
      </p>
      <Button
        variant="outline"
        onClick={() => window.location.reload()}
      >
        {t('refresh')}
      </Button>
    </div>
  );
  
  return <ErrorBoundaryClass fallback={customFallback}>{children}</ErrorBoundaryClass>;
}
