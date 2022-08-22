// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Authorizable is Ownable {
    mapping(address => bool) private _authorizedMinters;

    modifier onlyAuthorized() {
        require(_authorizedMinters[msg.sender],"VNNN: Caller not authorized to mint tokens");
        _;
    }

    event authorized(address indexed minter);
    event revoked(address indexed minter);

    function addAuthorized(address toAdd) onlyOwner public {
        require(toAdd != address(0));
        _authorizedMinters[toAdd] = true;
        emit authorized(toAdd);
    }

    function revokeAuthorized(address toRemove) onlyOwner public {
        require(toRemove != address(0));
        _authorizedMinters[toRemove] = false;
        emit revoked(toRemove);
    }

    function isAuthorized(address minter) public view returns (bool) {
        require(minter != address(0));
        return _authorizedMinters[minter];
    }
}