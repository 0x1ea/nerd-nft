// imports
const { ethers, run, network } = require("hardhat")

// async main
async function main() {
  const Nerd = await ethers.getContractFactory("Nerd")
  console.log("Deploying contract...")
  const nerd = await Nerd.deploy()
  await nerd.deployed()
  console.log(`Deployed NFT contract to: ${nerd.address}`)

  // what happens when we deploy to our hardhat network?
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...")
    await nerd.deployTransaction.wait(6)
    await verify(nerd.address, [])
  }

  const newTokenURI = "ipfs://QmdCgCqTbjFcfSxqyh1BnpMj37q1HUhviwscc5cgCq7jXd/"
  console.log(`Setting tokenURI: ${newTokenURI}`)
  const setBaseTokenUriResponse = await nerd.setBaseTokenUri(newTokenURI)
  setBaseTokenUriResponse.wait(1)

  console.log(`Minting 10 token for deployer`)
  const foundersMintResponse = await nerd.founderMint(10)
  foundersMintResponse.wait(1)
}

// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!")
    } else {
      console.log(e)
    }
  }
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
