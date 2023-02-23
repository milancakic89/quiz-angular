export interface Device{
    width: number;
    height: number;
    deviceFounded: boolean;
}

export const getConfiguration = (): Device =>{
    const device: Device = {
        width: 0,
        height: 0,
        deviceFounded: false
    }
    const width = document.body.clientWidth
    const height = document.body.getBoundingClientRect().height;
    //width
    if (width >= 200){
        device.width = 320;
    }
    if (width >= 360) {
        device.width = 360;
    }
    if (width >= 375) {
        device.width = 375;
    }
    if (width >= 384) {
        device.width = 384;
    }
    if (width >= 390) {
        device.width = 390;
    }
    if (width >= 400) {
        device.width = 400;
    }
    if (width >= 411) {
        device.width = 411;
    }
    if (width >= 428) {
        device.width = 411;
    }
    if (width >= 480) {
        device.width = 480;
    }

    //height
    if (height >= 480) {
        device.height = 480;
    }
    if (height >= 533) {
        device.height = 533;
    }
    if (height >= 568) {
        device.height = 568;
    }

    if (height >= 598) {
        device.height = 598;
    }

    if (height >= 640) {
        device.height = 640;
    }

    if (height >= 667) {
        device.height = 667;
    }

    if (height >= 695) {
        device.height = 695;
    }

    if (height >= 718) {
        device.height = 718;
    }
    if (height >= 740) {
        device.height = 740;
    }
    if(device.width > 0 && device.height > 0){
        device.deviceFounded = true;
    }

    return device;

}