const mobileDetection = (userAgent:string)=>{
    return String(userAgent).toLowerCase().indexOf('android') != -1 || String(userAgent).toLowerCase().indexOf('iphone') != -1
}
export default mobileDetection