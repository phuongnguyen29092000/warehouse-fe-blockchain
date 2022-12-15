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

export const handleGroupByUser = (data) => {
    const rs = data.reduce((group, item)=> {
        if(!group[item.userInfo._id]) group[item.userInfo._id] = []
        group[item.userInfo._id].push(item)
        return group
    }, {})
    return Object.values(rs)
}