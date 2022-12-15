// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Order {
    struct OrderInfo {
        address orderAddress;
        address buyer;
        address seller;
        uint256 totalPrice;
        uint256 shippingPrice;
        uint256 totalProduct;
        order_status state;
        uint256 purchaseTime;
        uint256 confirmedTime;
        uint256 cancelTime;
        uint256 paymentTime;
        uint256 returnTime;
        uint256 returnedTime;
        uint256 dealine;
        uint256 balance;
    }
    
    struct TransactionOrder {
        address beneficiaryAccount;
        uint256 amount;
        order_status state;
        uint256 timestamp;
    }

    enum order_status {
        PENDING,
        CONFIRMED,
        CANCEL,
        SUCCESS,
        RETURN,
        RETURNED
    }

    address payable owner;
    address payable seller;
    uint256 public totalPrice;
    uint256 public shippingPrice;
    uint256 public totalProduct;

    uint256 public purchaseTime;
    uint256 public confirmedTime;
    uint256 public cancelTime;
    uint256 public paymentTime;
    uint256 public returnTime;
    uint256 public returnedTime;

    uint256 public deadline;

    TransactionOrder[] public transactionOrders;
    order_status public state;

    constructor(
        address _ownerAddress,
        address _seller,
        uint256 _shippingPrice,
        uint256 _totalProduct,
        uint256 _deadline
    ) {
        owner = payable(_ownerAddress);
        seller = payable(_seller);
        shippingPrice = _shippingPrice;
        totalProduct = _totalProduct;
        deadline = _deadline;
    }

    event confirmPurchaseEvent(
        address from,
        address to,
        uint256 value,
        order_status state
    );

    event confirmOrderEvent(
        order_status state
    );

    event confirmCancelOrderEvent(
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

    event confirmReturnedOrderEvent(
        address from,
        address payable toBuyer,
        uint256 valueToBuyer,
        address payable toSeller,
        uint256 valueToSeller,
        order_status state
    );

    function getAddress() public view returns (address) {
        return address(this);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function confirmPurchase() public payable {
        require(msg.sender == owner, "Not permission");
        require(
            state == order_status.PENDING,
            "Order status must be status PENDING"
        );
        require(
            msg.value > 0,
            "Value must be greater 0"
        );
        require(
            msg.sender.balance > msg.value,
            "Balance of account is not enough"
        );
        totalPrice = msg.value;
        purchaseTime = block.timestamp;
        state = order_status.PENDING;
        TransactionOrder memory transaction = TransactionOrder(
            getAddress(),
            msg.value,
            state,
            purchaseTime
        );
        transactionOrders.push(transaction);

        emit confirmPurchaseEvent(
            msg.sender,
            getAddress(),
            msg.value,
            order_status.PENDING
        );
    }

    function confirmOrder(uint256 _newDeadline) public {
        require(msg.sender == seller, "Not permission");
        require(
            state == order_status.PENDING,
            "Order status must be status PENDING"
        );
        state = order_status.CONFIRMED;
        confirmedTime = block.timestamp;
        deadline = _newDeadline;
        TransactionOrder memory transaction = TransactionOrder(
            msg.sender,
            0,
            state,
            confirmedTime
        );
        transactionOrders.push(transaction);

        emit confirmOrderEvent(
            order_status.CONFIRMED
        );
    }

    function confirmCancelOrder() public {
        require(msg.sender == seller, "Not permission");
        require(
            state == order_status.PENDING,
            "Order status must be status PENDING"
        );
        owner.transfer(address(this).balance);
        state = order_status.CANCEL;
        cancelTime = block.timestamp;
        TransactionOrder memory transaction = TransactionOrder(
            owner,
            totalPrice,
            state,
            cancelTime
        );
        transactionOrders.push(transaction);

        emit confirmCancelOrderEvent(
            order_status.CANCEL
        );
    }

    function handleWithDrawForBuyerWhenSellerNotConfirm() public {
        require((block.timestamp)*1000 > deadline, "Present time must be greater deadline");
        require(msg.sender == owner, "Not permission");
        require(
            state == order_status.PENDING,
            "Order status must be status PENDING"
        );
        require(
            address(this).balance > 0,
            "Balance of order is not enough"
        );
        owner.transfer(address(this).balance);
        state = order_status.CANCEL;
        cancelTime = block.timestamp;
        TransactionOrder memory transaction = TransactionOrder(
            owner,
            totalPrice,
            state,
            cancelTime
        );
        transactionOrders.push(transaction);

        emit confirmCancelOrderEvent(
            order_status.CANCEL
        );
    }

    function handleWithDrawForSellerWhenDeliveryExpired() public {
        require((block.timestamp)*1000 > deadline, "Present time must be greater deadline");
        require(msg.sender == seller, "Not permission");
        require(
            state == order_status.CONFIRMED,
            "Order status must be status CONFIRMED"
        );
        require(
            address(this).balance > 0,
            "Balance of order is not enough"
        );
        seller.transfer(address(this).balance);
        state = order_status.SUCCESS;
        purchaseTime = block.timestamp;
        TransactionOrder memory transaction = TransactionOrder(
            seller,
            totalPrice,
            state,
            purchaseTime
        );
        transactionOrders.push(transaction);

        emit confirmPaymentToSellerEvent(
            address(this),
            seller,
            totalPrice,
            order_status.SUCCESS
        );
    }

    function confirmPaymentToSeller() public {
        require(msg.sender == owner, "Not permission");
        require(
            address(this).balance > 0,
            "Balance of order is not enough"
        );
        require(
            state == order_status.CONFIRMED,
            "Order status must be status CONFIRMED"
        );
        seller.transfer(address(this).balance);
        state = order_status.SUCCESS;
        paymentTime = block.timestamp;

        TransactionOrder memory transaction = TransactionOrder(
            seller,
            totalPrice,
            state,
            paymentTime
        );
        transactionOrders.push(transaction);

        emit confirmPaymentToSellerEvent(
            address(this),
            seller,
            totalPrice,
            order_status.SUCCESS
        );
    }

    function confirmReturnOrder(uint256 _newDeadline) public {
        require(msg.sender == owner, "Not permission");
        require(
            state == order_status.CONFIRMED,
            "Order status must be status CONFIRMED"
        );
        state = order_status.RETURN;
        returnTime = block.timestamp;
        deadline = _newDeadline;
        TransactionOrder memory transaction = TransactionOrder(
            msg.sender,
            0,
            state,
            returnTime
        );
        transactionOrders.push(transaction);

        emit confirmReturnOrderEvent(
            order_status.RETURN
        );
    }

    function confirmReturnedOrder() public {
        require(msg.sender == seller, "Not permission");
        require(
            address(this).balance > 0,
            "Balance of order is not enough"
        );
        require(
            state == order_status.RETURN,
            "Order status must be status RETURN"
        );

        state = order_status.RETURNED;
        returnedTime = block.timestamp;
        
        // return shipping price to seller
        seller.transfer(shippingPrice);
        TransactionOrder memory transactionReturnShippingPrice = TransactionOrder(
            seller,
            shippingPrice,
            state,
            returnedTime
        );
        transactionOrders.push(transactionReturnShippingPrice);

        // return total price to buyer
        owner.transfer(address(this).balance - shippingPrice);
        TransactionOrder memory transactionReturnTotalPrice = TransactionOrder(
            owner,
            totalPrice - shippingPrice,
            state,
            returnedTime
        );
        transactionOrders.push(transactionReturnTotalPrice);


        emit confirmReturnedOrderEvent(     
            address(this),
            owner,
            totalPrice - shippingPrice,
            seller,
            shippingPrice,
            order_status.RETURNED
        );
    }

    function handleWithDrawForBuyerWhenReturnExpired() public {
        require((block.timestamp)*1000 > deadline, "Present time must be greater deadline");
        require(msg.sender == owner, "Not permission");
        require(
            state == order_status.RETURN,
            "Order status must be status RETURN"
        );
        require(
            address(this).balance > 0,
            "Balance of order is not enough"
        );

        state = order_status.RETURNED;
        returnedTime = block.timestamp;
        // return shipping price to seller
        seller.transfer(shippingPrice);
        TransactionOrder memory transactionReturnShippingPrice = TransactionOrder(
            seller,
            shippingPrice,
            state,
            returnedTime
        );
        transactionOrders.push(transactionReturnShippingPrice);

        // return total price to buyer
        owner.transfer(address(this).balance - shippingPrice);
        TransactionOrder memory transactionReturnTotalPrice = TransactionOrder(
            owner,
            totalPrice - shippingPrice,
            state,
            returnedTime
        );
        transactionOrders.push(transactionReturnTotalPrice);

        emit confirmReturnedOrderEvent(     
            address(this),
            owner,
            totalPrice - shippingPrice,
            seller,
            shippingPrice,
            order_status.RETURNED
        );
    }

    function getOrderInfo() public view returns (OrderInfo memory) {
        return
            OrderInfo(
                getAddress(),
                owner,
                seller,
                totalPrice,
                shippingPrice,
                totalProduct,
                state,
                purchaseTime, 
                confirmedTime,
                cancelTime,
                paymentTime,
                returnTime,
                returnedTime,
                deadline,
                getBalance()
            );
    }

    function getAllTransactionOrder()
        public
        view
        returns (TransactionOrder[] memory)
    {
        TransactionOrder[] memory t = transactionOrders;
        return t;
    }
}