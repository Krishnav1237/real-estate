import { ethers } from 'ethers';

import marketplaceAbiJson from '../abis/Marketplace.json';
const marketplaceAbi = { abi: marketplaceAbiJson };
const MARKETPLACE_ADDRESS = "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8";

export interface PolygonListing {
    id: string;
    seller: string;
    price: number;
    title: string;
    description: string;
    imageUrl: string;
    status: number;
    createdAt: number;
    tokenPrice?: number;
    totalTokens?: number;
    availableTokens?: number;
    verified?: boolean;
    expectedReturn?: number;
    investmentPeriod?: string;
    source: 'polygon';
}

class PolygonService {
    private provider: ethers.providers.Web3Provider | null = null;
    private signer: ethers.Signer | null = null;
    private marketplace: ethers.Contract | null = null;

    constructor() {
        if (window.ethereum) {
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
        }
    }

    isMetaMaskInstalled(): boolean {
        return !!(window.ethereum && window.ethereum.isMetaMask);
    }

    async connectMetaMask(): Promise<string> {
        if (!this.provider) {
            throw new Error("MetaMask is not installed");
        }

        try {
            const accounts = await this.provider.send('eth_requestAccounts', []);
            this.signer = this.provider.getSigner();
            this.initializeContracts();
            return accounts[0];
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
            throw error;
        }
    }

    async disconnectMetaMask(): Promise<void> {
        this.signer = null;
        this.marketplace = null;
    }

    private initializeContracts() {
        if (!this.signer) return;
        this.marketplace = new ethers.Contract(
            MARKETPLACE_ADDRESS,
            marketplaceAbi.abi,
            this.signer
        );
    }

    async listItemWithMetaMask(
        price: number,
        name: string,
        description: string,
        imageUrl: string
    ): Promise<string> {
        if (!this.marketplace || !this.signer) {
            throw new Error("Wallet not connected");
        }

        try {
            const weiPrice = ethers.utils.parseEther(price.toString());
            const tx = await this.marketplace.listItem(weiPrice, name, description, imageUrl);
            const receipt = await tx.wait();
            return receipt.transactionHash;
        } catch (error) {
            console.error("Error listing item:", error);
            throw error;
        }
    }

    async buyItemWithMetaMask(listingId: number): Promise<string> {
        if (!this.marketplace || !this.signer) {
            throw new Error("Wallet not connected");
        }

        try {
            const listing = await this.marketplace.listings(listingId);
            const tx = await this.marketplace.buyItem(listingId, { value: listing.price });
            const receipt = await tx.wait();
            return receipt.transactionHash;
        } catch (error) {
            console.error("Error buying item:", error);
            throw error;
        }
    }

    async cancelListingWithMetaMask(listingId: number): Promise<string> {
        if (!this.marketplace || !this.signer) {
            throw new Error("Wallet not connected");
        }

        try {
            const tx = await this.marketplace.cancelListing(listingId);
            const receipt = await tx.wait();
            return receipt.transactionHash;
        } catch (error) {
            console.error("Error cancelling listing:", error);
            throw error;
        }
    }

    async getListingDetails(listingId: number): Promise<PolygonListing | null> {
        if (!this.provider) return null;

        try {
            const readOnlyContract = new ethers.Contract(
                MARKETPLACE_ADDRESS,
                marketplaceAbi.abi,
                this.provider
            );

            const details = await readOnlyContract.getListingDetails(listingId);

            return {
                id: listingId.toString(),
                seller: details[0],
                price: Number(ethers.utils.formatEther(details[1])),
                title: details[2],
                description: details[3],
                imageUrl: details[4],
                status: details[5],
                createdAt: details[6].toNumber(),
                source: 'polygon'
            };
        } catch (error) {
            console.error("Error getting listing details:", error);
            return null;
        }
    }

    async getFeePercentage(): Promise<number> {
        if (!this.provider) return 0;

        try {
            const readOnlyContract = new ethers.Contract(
                MARKETPLACE_ADDRESS,
                marketplaceAbi.abi,
                this.provider
            );

            const basisPoints = await readOnlyContract.getFeePercentage();
            return Number(basisPoints) / 100; // Convert basis points to percentage
        } catch (error) {
            console.error("Error getting fee percentage:", error);
            return 0;
        }
    }

    async getBalance(address: string): Promise<number> {
        if (!this.provider) return 0;

        try {
            const balanceWei = await this.provider.getBalance(address);
            return Number(ethers.utils.formatEther(balanceWei));
        } catch (error) {
            console.error("Error getting account balance:", error);
            return 0;
        }
    }
}

const polygonService = new PolygonService();
export default polygonService;