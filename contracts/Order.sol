// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Order {
    struct OrderInfo {
        address orderAddress;
        address buyer;
        address seller;
        uint256 totalPrice;
        uint256 totalProduct;
        order_status state;
    }
    
    struct TransactionTransfer {
        address beneficiaryAccount;
        uint256 amount;
        uint256 timestamp;
    }

    enum order_status {
        PENDING,
        RETURN,
        SUCCESS,
        CANCEL
    }

    address payable owner;
    address payable seller;
    uint256 public totalPrice;
    uint256 public totalProduct;

    uint256 public paymentTime;
    uint256 public returnTime;
    uint256 public cancelTime;
    uint256 public dealine;

    TransactionTransfer[] public transactionTransfers;
    order_status public state;

    constructor(
        address _ownerAddress,
        address _seller,
        uint256 _totalPrice,
        uint256 _totalProduct
    ) {
        owner = payable(_ownerAddress);
        seller = payable(_seller);
        totalPrice = _totalPrice;
        totalProduct = _totalProduct;
        state = order_status.PENDING;
    }

    event confirmPurchaseEvent(
        address from,
        address to,
        uint256 value,
        order_status state
    );

    event confirmPaymentToSellerEvent(
        address from,
        address payable to,
        uint256 value,
        order_status state
    );

    event confirmReturnOrderEvent(
        order_status state
    );

    event confirmCancelOrderEvent(
        address from,
        address payable to,
        uint256 value,
        order_status state
    );

    function getAddress() public view returns (address) {
        return address(this);
    }

    function confirmPurchase() public payable {
        require(msg.sender == owner, "Not permission");
        require(
            state == order_status.PENDING,
            "Order status must be status PENDING"
        );
        require(
            msg.sender.balance > msg.value,
            "Balance of account is not enough"
        );
        TransactionTransfer memory transaction = TransactionTransfer(
            getAddress(),
            msg.value,
            block.timestamp
        );
        transactionTransfers.push(transaction);

        emit confirmPurchaseEvent(
            msg.sender,
            getAddress(),
            msg.value,
            order_status.PENDING
        );
    }
    
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function confirmPaymentToSeller() public payable {
        require(msg.sender == owner, "Not permission");
        require(
            address(this).balance > 0,
            "Balance of order is not enough"
        );
        seller.transfer(address(this).balance);
        state = order_status.SUCCESS;
        paymentTime = block.timestamp;

        TransactionTransfer memory transaction = TransactionTransfer(
            seller,
            address(this).balance,
            paymentTime
        );
        transactionTransfers.push(transaction);

        emit confirmPaymentToSellerEvent(
            address(this),
            seller,
            totalPrice,
            order_status.SUCCESS
        );
    }

    function confirmReturnOrder() public payable {
        require(msg.sender == owner, "Not permission");
        state = order_status.RETURN;
        returnTime = block.timestamp;

        TransactionTransfer memory transaction = TransactionTransfer(
            msg.sender,
            0,
            returnTime
        );
        transactionTransfers.push(transaction);

        emit confirmReturnOrderEvent(
            order_status.RETURN
        );
    }

    function confirmCancelOrder() public payable {
        require(msg.sender == seller, "Not permission");
        require(
            address(this).balance > 0,
            "Balance of order is not enough"
        );
        owner.transfer(address(this).balance);
        state = order_status.CANCEL;
        cancelTime = block.timestamp;

        TransactionTransfer memory transaction = TransactionTransfer(
            owner,
            address(this).balance,
            paymentTime
        );
        transactionTransfers.push(transaction);
        emit confirmCancelOrderEvent(     
            address(this),
            owner,
            totalPrice,
            order_status.CANCEL
        );
    }
    function getOrderInfo() public view returns (OrderInfo memory) {
        return
            OrderInfo(
                getAddress(),
                owner,
                seller,
                totalPrice,
                totalProduct,
                state
            );
    }
}