export const REAL_ESTATE_TOKEN_ABI = [
  // Add only the ABI methods you're actually using in the frontend
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)"
];

export const REAL_ESTATE_MARKETPLACE_ABI = [
  // Add only the ABI methods you're actually using in the frontend
  "function listProperty(uint256 tokenId, uint256 price)",
  "function buyProperty(uint256 tokenId)",
  "function getListedProperties() view returns (uint256[])",
  "function getPropertyPrice(uint256 tokenId) view returns (uint256)"
]; 