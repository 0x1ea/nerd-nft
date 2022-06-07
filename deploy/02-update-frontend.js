const {
  frontEndContractsFile,
  frontEndAbiFile,
} = require("../helper-hardhat-config")
const fs = require("fs")
const { network } = require("hardhat")

module.exports = async () => {
  if (process.env.UPDATE_FRONT_END) {
    console.log("Writing to front end...")
    updateContractAddresses()
    updateAbi()
    console.log("Front end written!")
  }
}

async function updateAbi() {
  const nerd = await ethers.getContract("Nerd")
  fs.writeFileSync(
    frontEndAbiFile,
    nerd.interface.format(ethers.utils.FormatTypes.json)
  )
}

async function updateContractAddresses() {
  const nerd = await ethers.getContract("Nerd")
  const contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractsFile, "utf8")
  )
  if (network.config.chainId.toString() in contractAddresses) {
    if (
      !contractAddresses[network.config.chainId.toString()].includes(
        nerd.address
      )
    ) {
      contractAddresses[network.config.chainId.toString()].push(nerd.address)
    }
  } else {
    contractAddresses[network.config.chainId.toString()] = [nerd.address]
  }
  fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]
