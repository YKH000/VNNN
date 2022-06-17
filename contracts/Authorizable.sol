pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Authorizable is Ownable {
    mapping(address => bool) public _authorizedMinters;

    modifier onlyAuthorized() {
        require(_authorizedMinters[msg.sender]."VNNN: Caller not authorized to mint tokens");
        _;
    }

    function addAuthorized(address _toAdd) onlyOwner public {
        require(_toAdd != address(0));
        _authorizedMinters[_toAdd] = true;
    }

    function revokeAuthorized(address _toRemove) onlyOwner public {
        require(_toRemove != address(0));
        require(_toRemove != msg.sender);
        _authorizedMinters[_toRemove] = false;
    }

    function isAuthorized(address _minter) public view returns (bool) {
        require(_minter != address(0));
        return _authorizedMinters[_minter];
    }
}