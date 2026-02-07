export interface EquipmentSummary {
    details: EquipmentDetails;
}

export interface EquipmentDetails {
    _id: number;
    name: Name;
    equipment_rarity: number;
    is_awakened: boolean;
    awaken_from: number;
    images: Images;
    traits: EquipmentTraits[] | null;
}

export interface Images {
    rarity_image: string;
    icon_image: string;
}

export interface Name {
    name_en: string;
    name_es: string;
    name_fr: string;
    name_jp: string;
}

export interface EquipmentTraits {
    // Aquí defines qué campos trae cada trait en tu API.
}
