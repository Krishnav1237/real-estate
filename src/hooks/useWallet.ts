// src/hooks/useWallet.ts
import { useState, useEffect } from 'react';
import aptosService from '../services/aptosService';

export function useWallet() {
    const [address, setAddress] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isPetraInstalled, setIsPetraInstalled] = useState(false);

    useEffect(() => {
        // Check if Petra wallet is installed
        setIsPetraInstalled(aptosService.isPetraInstalled());

        // Check if already connected
        const checkConnection = async () => {
            if (!aptosService.isPetraInstalled()) return;

            try {
                const isConnected = await window.aptos?.isConnected();
                if (isConnected) {
                    const account = await window.aptos?.account();
                    if (account) {
                        setAddress(account.address);
                        setIsConnected(true);
                    }
                }
            } catch (error) {
                console.error("Error checking wallet connection:", error);
            }
        };

        checkConnection();
    }, []);

    const connect = async () => {
        try {
            if (!aptosService.isPetraInstalled()) {
                throw new Error("Petra wallet is not installed");
            }

            const newAddress = await aptosService.connectPetra();
            setAddress(newAddress);
            setIsConnected(true);
            return newAddress;
        } catch (error) {
            console.error("Error connecting wallet:", error);
            throw error;
        }
    };

    const disconnect = async () => {
        try {
            if (aptosService.isPetraInstalled()) {
                await aptosService.disconnectPetra();
            }
            setAddress(null);
            setIsConnected(false);
        } catch (error) {
            console.error("Error disconnecting wallet:", error);
        }
    };

    return {
        address,
        isConnected,
        isPetraInstalled,
        connect,
        disconnect
    };
}