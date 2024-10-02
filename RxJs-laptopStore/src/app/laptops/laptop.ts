export interface Laptop {
    id: number;
    brand: string;
    model: string;
    price: number;
    batteryLife: string;
    connectivity: string;
    customDescription: string;
    displaySize: string;
    graphicsCard: string;
    operatingSystem: string;
    processor: string;
    ramSizeGB: number;
    resolution: string;
    storageSizeGB: number;

    compatiblePripheralDevice: PeripheralDevice[]
}

export interface PeripheralDevice {
    id: number;
    brand: string;
    model: string;
    type: string;
    price: number;
}

