// src/hooks/useContracts.ts
import { useState, useCallback } from 'react';
import aptosService from '../services/aptosService';

// Interface for the marketplace contract
export function useMarketplace() {
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
                const txHash = await aptosService.listItemWithPetra(
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
                const txHash = await aptosService.buyItemWithPetra(listingId);
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
                const txHash = await aptosService.cancelListingWithPetra(listingId);
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
                const details = await aptosService.getListingDetails(listingId);
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

    const getMockListings = useCallback(
        async (limit?: number) => {
            setLoading(true);
            setError(null);
            try {
                const listings = await aptosService.getMockListings(limit);
                setLoading(false);
                return listings;
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
        getMockListings,
        loading,
        error
    };
}