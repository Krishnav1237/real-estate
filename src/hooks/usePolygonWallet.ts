// src/hooks/usePolygonWallet.ts
import { useState, useEffect } from 'react';
import polygonService from '../services/polygonService';

// Define typed Ethereum provider interfaces
interface EthereumProvider {
    isMetaMask?: boolean;
    selectedAddress?: string;
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    on(event: 'accountsChanged', listener: (accounts: string[]) => void): void;
    on(event: 'chainChanged', listener: (chainId: string) => void): void;
    on(event: string, listener: (payload: unknown) => void): void;
    removeAllListeners(event: string): void;
}

declare global {
    interface Window {
        ethereum?: EthereumProvider;
    }
}

export function usePolygonWallet() {
    const [address, setAddress] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
    const [chainId, setChainId] = useState<number | null>(null);

    useEffect(() => {
        // Check if MetaMask is installed
        setIsMetaMaskInstalled(polygonService.isMetaMaskInstalled());

        // Check if already connected
        const checkConnection = async () => {
            if (!polygonService.isMetaMaskInstalled()) return;

            try {
                if (window.ethereum?.selectedAddress) {
                    setAddress(window.ethereum.selectedAddress);
                    setIsConnected(true);

                    // Get chain ID
                    const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
                    setChainId(parseInt(chainIdHex as string, 16));
                }
            } catch (error) {
                console.error("Error checking wallet connection:", error);
            }
        };

        checkConnection();

        // Setup event listeners for MetaMask
        if (window.ethereum) {
            // Type-safe event handlers using specialized overloads
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAddress(accounts[0]);
                    setIsConnected(true);
                } else {
                    setAddress(null);
                    setIsConnected(false);
                }
            });

            window.ethereum.on('chainChanged', (chainId) => {
                setChainId(parseInt(chainId, 16));
            });
        }

        return () => {
            // Remove listeners
            if (window.ethereum) {
                window.ethereum.removeAllListeners('accountsChanged');
                window.ethereum.removeAllListeners('chainChanged');
            }
        };
    }, []);

    const connect = async () => {
        try {
            const newAddress = await polygonService.connectMetaMask();
            setAddress(newAddress);
            setIsConnected(true);

            // Get chain ID
            if (window.ethereum) {
                const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
                setChainId(parseInt(chainIdHex as string, 16));
            }

            return newAddress;
        } catch (error) {
            console.error("Error connecting wallet:", error);
            throw error;
        }
    };

    const disconnect = async () => {
        try {
            await polygonService.disconnectMetaMask();
            setAddress(null);
            setIsConnected(false);
        } catch (error) {
            console.error("Error disconnecting wallet:", error);
        }
    };

    const switchToPolygon = async () => {
        if (!window.ethereum) return;

        try {
            // Switch to Polygon mainnet
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x89' }], // 137 in hex
            });
        } catch (error: unknown) {
            // Cast to get the code property if it exists
            const ethError = error as { code?: number };

            // If the chain is not added, add it
            if (ethError.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: '0x89',
                            chainName: 'Polygon Mainnet',
                            nativeCurrency: {
                                name: 'MATIC',
                                symbol: 'MATIC',
                                decimals: 18,
                            },
                            rpcUrls: ['https://polygon-rpc.com/'],
                            blockExplorerUrls: ['https://polygonscan.com/'],
                        },
                    ],
                });
            } else {
                console.error("Error switching network:", error);
                throw error;
            }
        }
    };

    return {
        address,
        isConnected,
        isMetaMaskInstalled,
        chainId,
        connect,
        disconnect,
        switchToPolygon
    };
}