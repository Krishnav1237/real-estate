// src/hooks/useMarketplace.ts
import { useState, useCallback } from 'react';
import marketplaceService, { UnifiedListing } from '../services/marketplaceService';
import { BlockchainType } from './useMultiChainWallet';

export function useMarketplace() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [listings, setListings] = useState<UnifiedListing[]>([]);

    const fetchListings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await marketplaceService.getAllListings();
            setListings(data);
            setLoading(false);
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            setLoading(false);
            return [];
        }
    }, []);

    const listItem = useCallback(
        async (
            chain: BlockchainType,
            price: number,
            name: string,
            description: string,
            imageUrl: string
        ) => {
            setLoading(true);
            setError(null);
            try {
                const txHash = await marketplaceService.listItem(
                    chain,
                    price,
                    name,
                    description,
                    imageUrl
                );
                setLoading(false);
                return txHash;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setError(errorMessage);
                setLoading(false);
                throw err;
            }
        },
        []
    );

    const buyItem = useCallback(
        async (chain: BlockchainType, listingId: number) => {
            setLoading(true);
            setError(null);
            try {
                const txHash = await marketplaceService.buyItem(chain, listingId);
                setLoading(false);
                return txHash;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setError(errorMessage);
                setLoading(false);
                throw err;
            }
        },
        []
    );

    const cancelListing = useCallback(
        async (chain: BlockchainType, listingId: number) => {
            setLoading(true);
            setError(null);
            try {
                const txHash = await marketplaceService.cancelListing(chain, listingId);
                setLoading(false);
                return txHash;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setError(errorMessage);
                setLoading(false);
                throw err;
            }
        },
        []
    );

    return {
        listings,
        loading,
        error,
        fetchListings,
        listItem,
        buyItem,
        cancelListing
    };
}