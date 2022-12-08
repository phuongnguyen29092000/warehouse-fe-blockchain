export const ConvertVNDToETH = (price) => {
    return (price/30000000).toFixed(4)
}

export const getOrderStatus= (value) => {
    const STATUS = [
        'PENDING',      //0
        'CONFIRMED',    //1
        'CANCEL',       //2
        'SUCCESS',      //3
        'RETURN',       //4
        'RETURNED'      //5
    ]
    return STATUS?.[value]
}