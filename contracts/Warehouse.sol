// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "./Order.sol";

contract Warehouse {
    address[] public listOrder;
    address public owner;

    constructor() payable {
        owner = msg.sender;
    }

    event createOrder(
        address orderAddress, 
        address owner,
        address seller
    );

    function getOwner() public view returns (address) {
        return owner;
    }

    function addOrder(address seller, uint256 totalProduct, uint256 shippingPrice, uint256 deadline) 
        public 
        returns 
        (bool) 
    {
        require(totalProduct > 0, "totalProduct must be greater than zero");
        require(shippingPrice > 0, "shippingPrice must be greater than zero");
        require(deadline > 0, "deadline must be greater than zero");
        Order order = new Order(msg.sender, seller, shippingPrice, totalProduct, deadline);
        listOrder.push(address(order));
        emit createOrder(
            order.getAddress(),
            msg.sender,
            seller
        );
        return true;
    }

    function getAllOrder() public view returns (address[] memory) {
        return listOrder;
    }

    function getOrderInfo(address _address)
        private
        view
        returns (Order.OrderInfo memory)
    {
        Order order = Order(_address);
        return order.getOrderInfo();
    }

    function getOrderPerCompany(address _addressCompany) public view returns (Order.OrderInfo[] memory) {
        uint256 totalResult;
        uint256 totalOrder = listOrder.length;

        for (uint256 i = 0; i < totalOrder; i++) {
            Order.OrderInfo memory orderDetail;
            orderDetail = getOrderInfo(listOrder[i]);
            if(orderDetail.seller == _addressCompany || orderDetail.buyer == _addressCompany) {
                totalResult++; 
            }
        }
        Order.OrderInfo[] memory orderPerCompany = new Order.OrderInfo[](totalResult);
        uint256 j;
        for (uint256 i = 0; i < totalOrder; i++) {
            Order.OrderInfo memory orderDetail;
            orderDetail = getOrderInfo(listOrder[i]);
            if(orderDetail.seller == _addressCompany || orderDetail.buyer == _addressCompany) {
                orderPerCompany[j] = orderDetail;
                j++;
            }
        }

        return orderPerCompany;
    }
}