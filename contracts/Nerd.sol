// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Nerd is ERC721, Pausable, Ownable, ERC721Enumerable {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;
  uint256 public constant MAX_SUPPLY = 1000;
  uint256 public constant PRICE_PER_TOKEN = 20000000000000000; // 0.02 ETH
  uint256 public constant MAX_PUBLIC_MINT = 10;
  string internal baseTokenUri;

  constructor() ERC721("Nerd Collection", "NRD") {}

  function setBaseTokenUri(string calldata _baseTokenUri) external onlyOwner {
    baseTokenUri = _baseTokenUri;
  }

  function tokenURI(uint256 _tokenId)
    public
    view
    override
    returns (string memory)
  {
    require(_exists(_tokenId), "Token does not exist");
    return string(abi.encodePacked(baseTokenUri, Strings.toString(_tokenId)));
  }

  function withdraw() public onlyOwner {
    uint256 balance = address(this).balance;
    payable(msg.sender).transfer(balance);
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function mint(uint256 numberOfTokens) public payable whenNotPaused {
    uint256 ts = totalSupply();
    require(
      ts + numberOfTokens <= MAX_SUPPLY,
      "Purchase would exceed max tokens"
    );
    require(numberOfTokens <= MAX_PUBLIC_MINT, "Exceeded max token purchase");
    require(
      PRICE_PER_TOKEN * numberOfTokens <= msg.value,
      "Ether value sent is not correct"
    );

    for (uint256 i = 0; i < numberOfTokens; i++) {
      _safeMint(msg.sender, _tokenIdCounter.current());
      _tokenIdCounter.increment();
    }
  }

  function founderMint(uint256 numberOfTokens)
    public
    payable
    whenNotPaused
    onlyOwner
  {
    uint256 ts = totalSupply();
    require(
      ts + numberOfTokens <= MAX_SUPPLY,
      "Purchase would exceed max tokens"
    );
    require(numberOfTokens <= MAX_PUBLIC_MINT, "Exceeded max token purchase");

    for (uint256 i = 0; i < numberOfTokens; i++) {
      _safeMint(msg.sender, _tokenIdCounter.current());
      _tokenIdCounter.increment();
    }
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  // The following functions are overrides required by Solidity.

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
