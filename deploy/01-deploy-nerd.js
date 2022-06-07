const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  let args = []

  log("----------------------------------------------------")
  log("Deploying Nerd and waiting for confirmations...")
  const nerd = await deploy("Nerd", {
    from: deployer,
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  log(`Nerd deployed at ${nerd.address}`)

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(nerd.address, args)
  }
}

module.exports.tags = ["all", "fundme"]
