export const ConvertETHToVND = (price) => {
    return price*30000000
}

export const getOrderStatus= (value) => {
    const STATUS = [
        'PENDING',
        'CONFIRMED',
        'CANCEL',
        'SUCCESS',
        'RETURN',
        'RETURNED'
    ]
    return STATUS?.[value]
}