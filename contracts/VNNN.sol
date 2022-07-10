pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "./Authorizable.sol";

contract VNNN is ERC20Permit, Authorizable {

    mapping(address => bool) private _vnnnContracts;
    mapping(address => mapping(address => bool)) private _vnnnPermitted;

    constructor() ERC20("VNNN", "VNNN") ERC20Permit("VNNN") {
        _mint(msg.sender, 10000000 * 10 ** decimals());
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

    // Functions for owner to add/remove VNNN Contracts
    function addVNNNContract(address vnnnContract) public onlyOwner {
        _vnnnContracts[vnnnContract] = true;
    }

    function revokeVNNNContract(address vnnnContract) public onlyOwner {
        _vnnnContracts[vnnnContract] = false;
    } 
    
    // Functions for users to check, permit or revoke VNNN contracts' ability to transfer or burn from their account 
    function isVNNNPermitted(address user, address vnnnContract) public view returns(bool){
        return _vnnnPermitted[user][vnnnContract];
    }

    function vnnnPermit(address vnnnContract) public {
        _vnnnPermitted[msg.sender][vnnnContract] = true;
    }

    function vnnnPermitRevoke(address vnnnContract) public {
        _vnnnPermitted[msg.sender][vnnnContract] = false;
    }

 
    // onlyVNNN modifier ensures only VNNN Contracts (permitted by users) can burn or transfer from user accounts without allowance
    modifier onlyVNNN(address requestor) {
        require(_vnnnContracts[msg.sender],"VNNN: Caller is not a VNNN Contract and cannot use this function");
        require(_vnnnPermitted[requestor][msg.sender],"VNNN: User has not allowed VNNN Contract to call this function");
        require(msg.sender != tx.origin,"VNNN: Caller must be a contract");
        _;
    }

    // Functions to allow permitted VNNN Contracts to burn or withdraw VNNN from user accounts ignoring allowance
    function vnnnBurnFrom (address from, uint256 amount) public onlyVNNN(from) {
        _burn(from,amount);
    } 

    function vnnnTransferFrom (address from, address to, uint256 amount) public onlyVNNN(from) {
        _transfer(from, to, amount);
    }

}