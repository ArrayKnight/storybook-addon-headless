import React, { Component, ErrorInfo, ReactNode } from 'react'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

interface State {
    error: string | null
    stack: string | null
}

export class ErrorBoundary extends Component<Props, State> {
    public static getDerivedStateFromError(error: Error): State {
        return { error: error.message, stack: error.stack ?? null }
    }

    public state: State = {
        error: null,
        stack: null,
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({
            error: error.message,
            stack: error.stack
                ? `${error.stack}\n\n${errorInfo.componentStack}`
                : errorInfo.componentStack,
        })
    }

    public render(): ReactNode {
        const { error, stack } = this.state

        if (error) {
            return (
                <>
                    <h1>Something went wrong.</h1>
                    <p>{error}</p>
                    <pre>
                        <code>{stack}</code>
                    </pre>
                </>
            )
        }

        return this.props.children
    }
}
