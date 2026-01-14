import React from 'react';
import { Button, Result } from 'antd';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console (in production, you might want to send this to a logging service)
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You could also log to an external service here
    // errorLoggingService.log(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    // Optionally reload the page
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '20px'
        }}>
          <Result
            status="error"
            title="Something went wrong"
            subTitle="The application encountered an unexpected error. Please try refreshing the page."
            extra={[
              <Button type="primary" key="reload" onClick={this.handleReset}>
                Reload Page
              </Button>,
              <Button key="home" onClick={() => window.location.href = '/'}>
                Go Home
              </Button>
            ]}
          >
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div style={{
                textAlign: 'left',
                background: '#f5f5f5',
                padding: '20px',
                borderRadius: '4px',
                marginTop: '20px'
              }}>
                <h3>Error Details (Development Only):</h3>
                <p style={{ color: '#cf1322', fontWeight: 'bold' }}>
                  {this.state.error.toString()}
                </p>
                <details style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
                  <summary>Stack Trace</summary>
                  {this.state.errorInfo?.componentStack}
                </details>
              </div>
            )}
          </Result>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
