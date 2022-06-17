pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Authorizable.sol";

contract VNNN is ERC20, Authorizable {

    constructor() ERC20("VNNN", "VNNN") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyAuthorized {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public {
        _burn(from, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 4;
    }

    function intAmount(uint256 input) public view returns (uint256){
        return input * 10 ** decimals();
    }

}