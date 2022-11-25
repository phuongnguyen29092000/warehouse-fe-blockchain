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
        SUCCESS,
        ABORT
    }

    address payable owner;
    address payable seller;
    uint256 public totalPrice;
    uint256 public totalProduct;
    uint256 public paymentTime;
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

    event confirmPurchase(
        address from,
        address to,
        uint256 value,
        order_status state
    );

    event confirmPaymentToSeller(
        address from,
        address payable to,
        uint256 value,
        order_status state
    );

    event cancelOrder(
        address from,
        address payable to,
        uint256 value,
        order_status state
    );

    function getAddress() public view returns (address) {
        return address(this);
    }

    function tranferTotalPriceToOrder() public payable {
        // require(msg.value == totalPrice, "value must equal totalPrice");
        TransactionTransfer memory transaction = TransactionTransfer(
            getAddress(),
            msg.value,
            block.timestamp
        );
        transactionTransfers.push(transaction);

        emit confirmPurchase(
            msg.sender,
            getAddress(),
            msg.value,
            order_status.PENDING
        );
    }
    
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function handleConfirmPayment() public payable {
        require(msg.sender == owner, "Not permission");
        // require(
        //     address(this).balance == totalPrice,
        //     "Balance not equal totalPrice"
        // );
        seller.transfer(address(this).balance);
        state = order_status.SUCCESS;
        paymentTime = block.timestamp;

        TransactionTransfer memory transaction = TransactionTransfer(
            seller,
            address(this).balance,
            paymentTime
        );
        transactionTransfers.push(transaction);

        emit confirmPaymentToSeller(
            address(this),
            seller,
            totalPrice,
            order_status.SUCCESS
        );
    }

    function handleCancelOrder() public payable {
        require(msg.sender == owner, "Not permission");
        // require(
        //     address(this).balance == totalPrice,
        //     "Balance not equal totalPrice"
        // );
        owner.transfer(address(this).balance);
        state = order_status.ABORT;
        cancelTime = block.timestamp;

        TransactionTransfer memory transaction = TransactionTransfer(
            owner,
            address(this).balance,
            paymentTime
        );
        transactionTransfers.push(transaction);
        emit confirmPaymentToSeller(
            address(this),
            owner,
            totalPrice,
            order_status.ABORT
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