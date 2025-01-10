import fs from 'fs';
import solc from 'solc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findImports(importPath) {
    let fullPath;
    if (importPath.startsWith('@openzeppelin/')) {
        fullPath = path.resolve(__dirname, '../node_modules', importPath);
    } else {
        fullPath = path.resolve(__dirname, '../contracts', importPath);
    }
    
    try {
        const content = fs.readFileSync(fullPath, 'utf8');
        return { contents: content };
    } catch (error) {
        console.error('Error reading import:', importPath, error);
        return { error: 'File not found' };
    }
}

function compileContract(contractName) {
    const contractPath = path.resolve(__dirname, '../contracts', contractName);
    const content = fs.readFileSync(contractPath, 'utf8');

    const input = {
        language: 'Solidity',
        sources: {
            [contractName]: {
                content: content
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            },
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

    if (output.errors) {
        output.errors.forEach(error => {
            console.error(error.formattedMessage);
        });
        if (output.errors.some(error => error.severity === 'error')) {
            throw new Error('Compilation failed');
        }
    }

    const contractFileName = path.parse(contractName).name;
    const artifactsDir = path.resolve(__dirname, '../artifacts/contracts');
    fs.mkdirSync(artifactsDir, { recursive: true });

    const artifact = {
        abi: output.contracts[contractName][contractFileName].abi,
        bytecode: output.contracts[contractName][contractFileName].evm.bytecode.object
    };

    fs.writeFileSync(
        path.resolve(artifactsDir, `${contractFileName}.json`),
        JSON.stringify(artifact, null, 2)
    );

    console.log(`Compiled ${contractFileName} successfully`);
    return artifact;
}

try {
    console.log('Compiling contracts...');
    compileContract('RealEstateToken.sol');
    compileContract('RealEstateMarketplace.sol');
    console.log('Compilation completed successfully!');
} catch (error) {
    console.error('Compilation failed:', error);
    process.exit(1);
} 