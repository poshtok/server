export default function ExpireTime(min:number){
    let date = new Date();
    var dateMin =  Number(date.getMinutes()) + min ;
    (date.setMinutes(dateMin) as any).toLocaleTimeString
    return date;
}
export  function isExpired(expireTime:Date){
    let nowDate = new Date().toISOString();
    let expiredateTime = new Date(expireTime).toISOString()

    return nowDate.valueOf() > expiredateTime.valueOf() ? true :false;
}
