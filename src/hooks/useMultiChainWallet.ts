// src/hooks/useMultiChainWallet.ts
import { useState, useCallback } from 'react';
import { useWallet } from './useWallet'; // Aptos wallet
import { usePolygonWallet } from './usePolygonWallet'; // Polygon wallet

export type BlockchainType = 'aptos' | 'polygon';

export function useMultiChainWallet() {
    const [activeChain, setActiveChain] = useState<BlockchainType>('aptos');

    const aptosWallet = useWallet();
    const polygonWallet = usePolygonWallet();

    // Get values from the active wallet
    const isConnected = activeChain === 'aptos' ? aptosWallet.isConnected : polygonWallet.isConnected;
    const address = activeChain === 'aptos' ? aptosWallet.address : polygonWallet.address;

    const connect = useCallback(async (chain: BlockchainType) => {
        setActiveChain(chain);
        if (chain === 'aptos') {
            return aptosWallet.connect();
        } else {
            return polygonWallet.connect();
        }
    }, [aptosWallet, polygonWallet]);

    const disconnect = useCallback(async () => {
        if (activeChain === 'aptos') {
            await aptosWallet.disconnect();
        } else {
            await polygonWallet.disconnect();
        }
    }, [activeChain, aptosWallet, polygonWallet]);

    const switchChain = useCallback((chain: BlockchainType) => {
        setActiveChain(chain);
    }, []);

    return {
        activeChain,
        address,
        isConnected,
        isPetraInstalled: aptosWallet.isPetraInstalled,
        isMetaMaskInstalled: polygonWallet.isMetaMaskInstalled,
        chainId: polygonWallet.chainId,
        connect,
        disconnect,
        switchChain,
        switchToPolygon: polygonWallet.switchToPolygon,
        aptosWallet,
        polygonWallet
    };
}