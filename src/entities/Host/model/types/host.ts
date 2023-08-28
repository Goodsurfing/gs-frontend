export interface Host {
    id: string;
    name: string;
    address: string;
    type: string;
    website: string;
    description: string;
    vk: string;
    facebook: string;
    instagram: string;
    telegram: string;
}

export interface HostSchema {
    data?: Host;
}
