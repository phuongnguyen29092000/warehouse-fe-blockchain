// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract PurchaseAgreement {
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    address public owner;
    Counters.Counter private index;

    struct OrderDetails {
        string _id;
    }

    struct OrderInfo {
        address exportUser;
        address importUser;
        uint256 totalPrice;
        uint256 timestamp;
        uint256 totalProduct;
        string orderStatus;
        string _id;
        string orderInfomation;
        uint256 index;
    }
    
    enum ORDER_STATUS {
        PENDING, SUCCESS, ABORT
    }

    constructor () payable{
        owner = msg.sender;
    }

    mapping (uint256 => OrderInfo) myOrders;
    OrderInfo[] public orderInfomations;

    event confirmPurchaseEvent(
        address from,
        address exportUser,
        uint256 value
    );

    event confirmPayment(
        address from,
        address payable to,
        uint256 totalPrice
    );

    function confirmPurchase(address payable exportUser, address payable importUser, uint256 totalProduct, string memory orderStatus, string memory _id, string memory orderInfomation) public payable {
        require(msg.value > 0, "Price must be greater 0");
        require(msg.sender.balance > msg.value,"Balance of account is not enough");
        index.increment();
        uint256 _index = index.current();
        OrderInfo memory order = OrderInfo({
            exportUser: exportUser,
            importUser: importUser,
            totalPrice: msg.value,
            timestamp: block.timestamp,
            totalProduct: totalProduct,
            orderStatus: orderStatus,
            _id: _id,
            orderInfomation: orderInfomation,
            index: _index
        });
        myOrders[_index] = order;
        orderInfomations.push(order);
        emit confirmPurchaseEvent(importUser, exportUser, msg.value);

        importUser.transfer(msg.value);
    }

    function findIndexOrder(uint256 _index) public view returns (uint256) {
        uint256 i = 0;
        while (myOrders[i].index != _index) {
            i++;
        }
        return i;
    }

    function confirmPaymentToSeller(uint256 index) public {
        uint256 indexOrder = findIndexOrder(index);
        OrderInfo memory order = myOrders[indexOrder];

    }

    // function updateStatusOrderInfo(OrderInfo order) public {

    // }
    
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getAddress() public view returns (address) {
        return address(this);
    }

    function getAllOrderInfo()
        public
        view
        returns (OrderInfo[] memory)
    {
        OrderInfo[] memory orders = orderInfomations;
        return orders;
    }

    function getOrderInfo() public view returns (OrderInfo memory) {
        // return OrderInfo(
        //     getAddress(),

        // )
    }

}