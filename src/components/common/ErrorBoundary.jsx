import React from "react";
import { strings } from "../../utils/constants/localizedStrings";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error boundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>{strings.errorPage}</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
