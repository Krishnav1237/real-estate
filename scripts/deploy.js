import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Contract ABIs
const RealEstateToken = JSON.parse(
    fs.readFileSync(
        path.resolve(__dirname, '../artifacts/contracts/RealEstateToken.json'),
        'utf8'
    )
);
const RealEstateMarketplace = JSON.parse(
    fs.readFileSync(
        path.resolve(__dirname, '../artifacts/contracts/RealEstateMarketplace.json'),
        'utf8'
    )
);

async function main() {
    // Connect to the network
    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log('Deploying contracts with the account:', wallet.address);

    try {
        // Deploy RealEstateToken
        console.log('Deploying RealEstateToken...');
        const RealEstateTokenFactory = new ethers.ContractFactory(
            RealEstateToken.abi,
            RealEstateToken.bytecode,
            wallet
        );
        const realEstateToken = await RealEstateTokenFactory.deploy({
            gasLimit: 3000000
        });
        await realEstateToken.deployed();
        console.log('RealEstateToken deployed to:', realEstateToken.address);

        // Deploy RealEstateMarketplace with 2.5% platform fee
        console.log('Deploying RealEstateMarketplace...');
        const platformFeeRate = 250; // 2.5%
        const RealEstateMarketplaceFactory = new ethers.ContractFactory(
            RealEstateMarketplace.abi,
            RealEstateMarketplace.bytecode,
            wallet
        );
        const realEstateMarketplace = await RealEstateMarketplaceFactory.deploy(
            realEstateToken.address,
            platformFeeRate,
            {
                gasLimit: 3000000
            }
        );
        await realEstateMarketplace.deployed();
        console.log('RealEstateMarketplace deployed to:', realEstateMarketplace.address);

        // Save the contract addresses
        const addresses = {
            RealEstateToken: realEstateToken.address,
            RealEstateMarketplace: realEstateMarketplace.address
        };

        // Create config directory if it doesn't exist
        const configDir = path.resolve(__dirname, '../src/config');
        fs.mkdirSync(configDir, { recursive: true });

        fs.writeFileSync(
            path.resolve(configDir, 'contracts.json'),
            JSON.stringify(addresses, null, 2)
        );
        console.log('Contract addresses saved to src/config/contracts.json');
        console.log('Deployment completed successfully!');
    } catch (error) {
        console.error('Error during deployment:', error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 