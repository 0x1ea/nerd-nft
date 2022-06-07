const networkConfig = {
  31337: {
    name: "localhost",
  },
  // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
  // Default one is ETH/USD contract on Kovan
  4: {
    name: "rinkeby",
  },
}

const developmentChains = ["hardhat", "localhost"]
const frontEndContractsFile = process.env.ADDRESS
const frontEndAbiFile = process.env.ABI

module.exports = {
  networkConfig,
  developmentChains,
  frontEndContractsFile,
  frontEndAbiFile,
}
