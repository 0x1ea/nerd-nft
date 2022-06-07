const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

describe("Nerd", () => {
  let nerdFactory
  let nerd

  beforeEach(async function () {
    nerdFactory = await ethers.getContractFactory("Nerd")
    nerd = await nerdFactory.deploy()
  })

  it("Users should mint a new NFT", async function () {
    await nerd.safeMint(1, {
      value: "200000000000000000",
    })
    const expectedValue = "1"
    const currentValue = await nerd.totalSupply()
    assert.equal(currentValue.toString(), expectedValue)
  })

  it("Founders should mint a new NFT", async function () {
    await nerd.founderMint(1)
    const expectedValue = "1"
    const currentValue = await nerd.totalSupply()
    assert.equal(currentValue.toString(), expectedValue)
  })

  it("Shouldn't have a tokenUri", async function () {
    await nerd.safeMint(1, {
      value: "200000000000000000",
    })
    const expectedValue = "0"
    const currentValue = await nerd.tokenURI(0)
    assert.equal(currentValue.toString(), expectedValue)
  })

  it("Should set the tokenURI", async function () {
    await nerd.safeMint(1, {
      value: "200000000000000000",
    })
    await nerd.setBaseTokenUri(
      "ipfs://QmcybGtWyA87KTq8iUDkwLVT6q9m1zz7WeAMNJM6QmeXTd/"
    )
    const expectedValue =
      "ipfs://QmcybGtWyA87KTq8iUDkwLVT6q9m1zz7WeAMNJM6QmeXTd/0"
    const currentValue = await nerd.tokenURI(0)
    assert.equal(currentValue.toString(), expectedValue)
  })
})
