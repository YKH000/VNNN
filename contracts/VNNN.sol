pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Authorizable.sol";

contract VNNN20 is ERC20, ERC20Permit, Authorizable {
    
    constructor() ERC20("VNNN ERC20", "VNNN20") ERC20Permit("VNNN20") {
        _mint(msg.sender, 100000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyAuthorized {
        _mint(to, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 4;
    }

    function intAmount(uint input) public view returns (uint){
        return input * 10 ** decimals();
    }

}