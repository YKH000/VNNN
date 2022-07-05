pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Authorizable.sol";

contract VNNN is ERC20, Authorizable {

    mapping(address => bool) private _vnnnContracts;
    mapping(address => mapping(address => bool)) private _vnnnPermitted;

    constructor() ERC20("VNNN", "VNNN") {
        _mint(msg.sender, 10000000 * 10 ** decimals());
    }

    modifier onlyVNNN() {
        require(_vnnnContracts[msg.sender],"VNNN: Caller is not a VNNN Contract and cannot use this function");
        _;
    }

    function mint(address to, uint256 amount) public onlyAuthorized {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 3;
    }

    function intAmount(uint256 input) public pure returns (uint256){
        return input * 10 ** decimals();
    }

    function isVNNNPermitted(address user, address vnnnContract) public view returns(bool){
        return _vnnnPermitted[user][vnnnContract];
    }

    function vnnnPermit(address vnnnContract) public {
        _vnnnPermitted[msg.sender][vnnnContract] = true;
    }

    function vnnnPermitRevoke(address vnnnContract) public {
        _vnnnPermitted[msg.sender][vnnnContract] = false;
    }

    function addVNNNContract(address vnnnContract) public onlyOwner {
        _vnnnContracts[vnnnContract] = true;
    }

    function revokeVNNNContract(address vnnnContract) public onlyOwner {
        _vnnnContracts[vnnnContract] = false;
    }  

    function vnnnBurnFrom (address from, uint256 amount) public onlyVNNN {
        require(_vnnnPermitted[from][msg.sender],"VNNN: User has not allowed VNNN Contract to call this function");
        _burn(from,amount);
    } 

}