// src/hooks/usePolygonContracts.ts
import { useState, useCallback } from 'react';
import polygonService from '../services/polygonService';

export function usePolygonMarketplace() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const listItem = useCallback(
        async (
            price: number,
            name: string,
            description: string,
            imageUrl: string
        ) => {
            setLoading(true);
            setError(null);
            try {
                const txHash = await polygonService.listItemWithMetaMask(
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
        async (listingId: number) => {
            setLoading(true);
            setError(null);
            try {
                const txHash = await polygonService.buyItemWithMetaMask(listingId);
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
        async (listingId: number) => {
            setLoading(true);
            setError(null);
            try {
                const txHash = await polygonService.cancelListingWithMetaMask(listingId);
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

    const getListingDetails = useCallback(
        async (listingId: number) => {
            setLoading(true);
            setError(null);
            try {
                const details = await polygonService.getListingDetails(listingId);
                setLoading(false);
                return details;
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
        listItem,
        buyItem,
        cancelListing,
        getListingDetails,
        loading,
        error
    };
}