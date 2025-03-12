// src/types/window.d.ts
export {};

declare global {
    interface Window {
        ethereum?: {
            isMetaMask?: boolean;
            selectedAddress?: string;
            request: (request: {
                method: string;
                params?: unknown[];
            }) => Promise<unknown>;
            on: (event: string, callback: (payload: unknown) => void) => void;
            removeAllListeners: (event: string) => void;
        };
    }
}