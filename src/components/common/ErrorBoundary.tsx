import { Component, ErrorInfo, ReactNode } from 'react';
import ServerErrorPage from '../../pages/ServerErrorPage';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error("ErrorBoundary caught:", error);
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to your preferred logging service
    console.group('Application Error');
    console.error('Error:', error);
    console.error('Info:', errorInfo);
    console.groupEnd();
  }

  public render() {
    if (this.state.hasError) {
      return <ServerErrorPage />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
