/**
 * DATA LAYER — Realistic Real-Estate Listings Dataset
 * Indian Metropolitan Enclaves (Delhi NCR, Mumbai, Bengaluru, Pune, Hyderabad, Chandigarh)
 */

const INITIAL_PROPERTIES = [
  {
    id: "prop-101",
    title: "The Camellias Ultra-Luxury Penthouse",
    listingType: "Sale",
    propertyType: "Penthouse",
    price: 385000000, // ₹38.5 Cr
    formattedPrice: "₹38.50 Cr",
    pricePerSqFt: "₹45,294 / sq.ft",
    city: "Gurugram",
    locality: "DLF Phase 5, Golf Course Road",
    address: "Tower 2B, DLF The Camellias, Golf Course Road",
    pincode: "122002",
    bedrooms: 5,
    bathrooms: 6,
    balconies: 4,
    floorNo: 28,
    totalFloors: 32,
    carpetArea: 8500,
    superBuiltUpArea: 10200,
    furnishing: "Fully Furnished",
    propertyAge: "2 years",
    facing: "North-East",
    isVerified: true,
    isFeatured: true,
    maintenance: "₹75,000 / month",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "An architectural tour de force occupying an entire private wing at DLF The Camellias. Boasts 14-foot floor-to-ceiling double-glazed thermal windows offering 360-degree panoramic vistas over the Arnold Palmer Golf Course and Aravalli hills. Master suite incorporates his-and-hers custom Italian walk-in dressing rooms, private sauna, temperature-regulated private plunge pool, and dedicated butler quarters.",
    amenities: ["Lift", "Parking", "Security", "Power backup", "Gym", "Swimming pool", "Clubhouse", "CCTV", "Air conditioning", "Piped Gas"],
    owner: {
      name: "Vikramaditya Singhania",
      role: "Exclusive Broker Associate",
      rera: "HRERA-PKL-GGM-2021-419",
      phone: "+91 98110 44219",
      email: "singhania.advisory@habitex.in",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    }
  },
  {
    id: "prop-102",
    title: "Sea-Facing Heritage Haven at Bandra West",
    listingType: "Sale",
    propertyType: "Apartment",
    price: 145000000, // ₹14.5 Cr
    formattedPrice: "₹14.50 Cr",
    pricePerSqFt: "₹58,000 / sq.ft",
    city: "Mumbai",
    locality: "Carter Road, Bandra West",
    address: "Sea Mist Heights, Off Carter Road Promenade",
    pincode: "400050",
    bedrooms: 3,
    bathrooms: 4,
    balconies: 2,
    floorNo: 11,
    totalFloors: 14,
    carpetArea: 2500,
    superBuiltUpArea: 3100,
    furnishing: "Semi-Furnished",
    propertyAge: "5 years",
    facing: "West",
    isVerified: true,
    isFeatured: true,
    maintenance: "₹32,000 / month",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Perched along the coveted coastline of Bandra West, this expansive 3 BHK residence combines timeless mid-century aesthetic with contemporary sea-view terraces. Features Burma teak herringbone timber flooring, open-plan Poggenpohl modular chef kitchen, and private elevator vestibule.",
    amenities: ["Lift", "Parking", "Security", "Power backup", "CCTV", "Air conditioning", "Modular kitchen"],
    owner: {
      name: "Rohini Merchant",
      role: "Senior Partner — Prime West",
      rera: "MAHARERA-A51900018742",
      phone: "+91 98201 55901",
      email: "merchant.estates@habitex.in",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
    }
  },
  {
    id: "prop-103",
    title: "Indiranagar Courtyard Garden Villa",
    listingType: "Sale",
    propertyType: "Villa",
    price: 92000000, // ₹9.2 Cr
    formattedPrice: "₹9.20 Cr",
    pricePerSqFt: "₹21,904 / sq.ft",
    city: "Bengaluru",
    locality: "Defence Colony, Indiranagar",
    address: "Plot 42, 6th Main, Defence Colony",
    pincode: "560038",
    bedrooms: 4,
    bathrooms: 5,
    balconies: 3,
    floorNo: 1,
    totalFloors: 3,
    carpetArea: 4200,
    superBuiltUpArea: 4850,
    furnishing: "Fully Furnished",
    propertyAge: "1 year",
    facing: "East",
    isVerified: true,
    isFeatured: true,
    maintenance: "₹18,000 / month",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "An inspired tropical modern sanctuary designed around a central open-sky rain garden. Features bespoke granite masonry, solar geothermal water recycling, double-height living room with skylights, private home theater, and an organic rooftop terrace with drip irrigation.",
    amenities: ["Parking", "Security", "Power backup", "Garden", "CCTV", "Air conditioning", "Solar Power"],
    owner: {
      name: "Karthik Balasubramanian",
      role: "Principal Asset Manager",
      rera: "PRM/KA/RERA/1251/310/AG/180211",
      phone: "+91 99450 78201",
      email: "karthik.b@habitex.in",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    }
  },
  {
    id: "prop-104",
    title: "Executive Skyline Suite at Indiranagar",
    listingType: "Rent",
    propertyType: "Apartment",
    price: 135000, // ₹1.35 Lakh / mo
    formattedPrice: "₹1.35 Lakh / mo",
    pricePerSqFt: "₹75 / sq.ft",
    city: "Bengaluru",
    locality: "100 Feet Road, Indiranagar",
    address: "The Bel Air, 100 Feet Road",
    pincode: "560038",
    bedrooms: 2,
    bathrooms: 2,
    balconies: 1,
    floorNo: 7,
    totalFloors: 10,
    carpetArea: 1800,
    superBuiltUpArea: 2100,
    furnishing: "Fully Furnished",
    propertyAge: "3 years",
    facing: "North",
    isVerified: true,
    isFeatured: false,
    maintenance: "₹8,500 / month",
    securityDeposit: "₹4,00,000",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Refined 2 BHK corporate residence ideal for tech executives and diplomats. Custom Scandinavian minimal cabinetry, Miele kitchen appliances, high-speed fiber-ready infrastructure, dedicated work-from-home library, and quiet sound-insulated glass doors.",
    amenities: ["Lift", "Parking", "Security", "Power backup", "Gym", "Clubhouse", "CCTV", "Air conditioning", "Internet"],
    owner: {
      name: "Pooja Hegde",
      role: "Leasing Consultant",
      rera: "PRM/KA/RERA/1251/310/AG/200412",
      phone: "+91 97412 88402",
      email: "pooja.leasing@habitex.in",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    }
  },
  {
    id: "prop-105",
    title: "Prime Commercial Floor at Cyber City",
    listingType: "Rent",
    propertyType: "Commercial",
    price: 480000, // ₹4.8 Lakh / mo
    formattedPrice: "₹4.80 Lakh / mo",
    pricePerSqFt: "₹120 / sq.ft",
    city: "Gurugram",
    locality: "DLF Cyber City, Phase 2",
    address: "Building 10C, 5th Floor, Cyber City",
    pincode: "122002",
    bedrooms: 0,
    bathrooms: 4,
    balconies: 0,
    floorNo: 5,
    totalFloors: 16,
    carpetArea: 4000,
    superBuiltUpArea: 5200,
    furnishing: "Fully Furnished",
    propertyAge: "4 years",
    facing: "North-East",
    isVerified: true,
    isFeatured: false,
    maintenance: "₹45,000 / month",
    securityDeposit: "₹14,40,000",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Grade-A LEED Platinum certified commercial office plate. 60 plug-and-play workstations, 3 executive cabins, 14-seater boardroom with video conferencing, cafeteria, biometric security access, and 100% DG dual-source power redundancy.",
    amenities: ["Lift", "Parking", "Security", "Power backup", "CCTV", "Internet", "Air conditioning"],
    owner: {
      name: "Aman Chopra",
      role: "Commercial Director",
      rera: "HRERA-GGM-2019-112",
      phone: "+91 99100 23412",
      email: "aman.c@habitex.in",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
    }
  },
  {
    id: "prop-106",
    title: "Sector 35 Freehold Villa with Lawn",
    listingType: "Sale",
    propertyType: "House",
    price: 78000000, // ₹7.8 Cr
    formattedPrice: "₹7.80 Cr",
    pricePerSqFt: "₹19,500 / sq.ft",
    city: "Chandigarh",
    locality: "Sector 35-B",
    address: "Kothi No. 412, Sector 35-B",
    pincode: "160035",
    bedrooms: 4,
    bathrooms: 4,
    balconies: 2,
    floorNo: 1,
    totalFloors: 2,
    carpetArea: 4000,
    superBuiltUpArea: 4500,
    furnishing: "Semi-Furnished",
    propertyAge: "6 years",
    facing: "North-West",
    isVerified: true,
    isFeatured: false,
    maintenance: "₹5,000 / month",
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Classic Corbusian Chandigarh kothi situated on a quiet tree-shaded cul-de-sac. Features expansive front manicured lawn, separate servant quarters, drive-in covered porch for 3 vehicles, solid sheesham wood carpentry, and verified freehold clear title documentation.",
    amenities: ["Parking", "Security", "Power backup", "Garden", "CCTV"],
    owner: {
      name: "Gurpreet Singh Dhillon",
      role: "Resident Advisor — Tri-City",
      rera: "RERA-CHD-AG-041",
      phone: "+91 98722 90123",
      email: "dhillon.chandigarh@habitex.in",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
    }
  },
  {
    id: "prop-107",
    title: "Koregaon Park Verdant Residential Plot",
    listingType: "Sale",
    propertyType: "Plot",
    price: 65000000, // ₹6.5 Cr
    formattedPrice: "₹6.50 Cr",
    pricePerSqFt: "₹13,000 / sq.ft",
    city: "Pune",
    locality: "Lane 5, Koregaon Park",
    address: "Plot 18A, South Main Road, Lane 5",
    pincode: "411001",
    bedrooms: 0,
    bathrooms: 0,
    balconies: 0,
    floorNo: 0,
    totalFloors: 0,
    carpetArea: 5000,
    superBuiltUpArea: 5000,
    plotArea: 5000,
    plotDimensions: "50 ft x 100 ft",
    roadWidth: "40 ft wide asphalt road",
    landType: "NA Residential / Freehold",
    furnishing: "Unfurnished",
    propertyAge: "New",
    facing: "East",
    isVerified: true,
    isFeatured: false,
    maintenance: "Nil",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Rare clear-title corner residential plot located in the ultra-posh Lane 5 of Koregaon Park. Permissible FSI allows for a bespoke 4-level independent villa with private swimming pool and basement parking. Surrounded by mature gulmohar trees and diplomatic residences.",
    amenities: ["Security", "CCTV", "Piped Gas"],
    owner: {
      name: "Tanuja Kirloskar",
      role: "Senior Real Estate Counsel",
      rera: "MAHARERA-A52100029801",
      phone: "+91 98900 11982",
      email: "tanuja.k@habitex.in",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80"
    }
  },
  {
    id: "prop-108",
    title: "Golf Course Road 3 BHK Panoramic Apartment",
    listingType: "Rent",
    propertyType: "Apartment",
    price: 85000, // ₹85,000 / mo
    formattedPrice: "₹85,000 / mo",
    pricePerSqFt: "₹42 / sq.ft",
    city: "Gurugram",
    locality: "Sector 54, Golf Course Road",
    address: "Tower C, The Crest, Sector 54",
    pincode: "122011",
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    floorNo: 18,
    totalFloors: 30,
    carpetArea: 2050,
    superBuiltUpArea: 2600,
    furnishing: "Semi-Furnished",
    propertyAge: "2 years",
    facing: "North-East",
    isVerified: true,
    isFeatured: false,
    maintenance: "₹12,000 / month",
    securityDeposit: "₹1,70,000",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A sun-drenched 3-bedroom residence in The Crest, DLF Phase 5. Features Italian marble living area, state-of-the-art VRV air-conditioning, attached staff room with washroom, and direct rapid-metro walkway access.",
    amenities: ["Lift", "Parking", "Security", "Power backup", "Gym", "Swimming pool", "Clubhouse", "CCTV", "Piped Gas"],
    owner: {
      name: "Vikramaditya Singhania",
      role: "Exclusive Broker Associate",
      rera: "HRERA-PKL-GGM-2021-419",
      phone: "+91 98110 44219",
      email: "singhania.advisory@habitex.in",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    }
  },
  {
    id: "prop-109",
    title: "Jubilee Hills Private Hilltop Estate",
    listingType: "Sale",
    propertyType: "Villa",
    price: 220000000, // ₹22 Cr
    formattedPrice: "₹22.00 Cr",
    pricePerSqFt: "₹31,428 / sq.ft",
    city: "Hyderabad",
    locality: "Road No. 36, Jubilee Hills",
    address: "Villa 14, Hill Ridge Enclave, Road 36",
    pincode: "500033",
    bedrooms: 5,
    bathrooms: 6,
    balconies: 3,
    floorNo: 1,
    totalFloors: 3,
    carpetArea: 7000,
    superBuiltUpArea: 8400,
    furnishing: "Fully Furnished",
    propertyAge: "1 year",
    facing: "East",
    isVerified: true,
    isFeatured: true,
    maintenance: "₹25,000 / month",
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Architect-curated cantilevered contemporary estate overlooking Durgam Cheruvu lake. Infinity pool on the private tier, home automated Lutron illumination systems, 8-seater private preview screening theater, and basement garage accommodating 6 luxury vehicles.",
    amenities: ["Parking", "Security", "Power backup", "Gym", "Swimming pool", "Clubhouse", "CCTV", "Air conditioning"],
    owner: {
      name: "Siddharth Rao",
      role: "Managing Director — South Prime",
      rera: "TS-RERA-AG-2018-0912",
      phone: "+91 94401 22910",
      email: "siddharth.rao@habitex.in",
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"
    }
  }
];

// Initialize and manage properties in localStorage
const PropertyStorage = {
  STORAGE_KEY: "estatecraft_properties",

  getAll() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) {
      this.saveAll(INITIAL_PROPERTIES);
      return INITIAL_PROPERTIES;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to parse stored properties, reverting to initial", e);
      return INITIAL_PROPERTIES;
    }
  },

  getById(id) {
    const list = this.getAll();
    return list.find(item => item.id === id) || null;
  },

  saveAll(properties) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(properties));
  },

  add(property) {
    const list = this.getAll();
    list.unshift(property);
    this.saveAll(list);
    return property;
  },

  remove(id) {
    let list = this.getAll();
    list = list.filter(item => item.id !== id);
    this.saveAll(list);
    return list;
  },

  update(id, updatedFields) {
    const list = this.getAll();
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields };
      this.saveAll(list);
      return list[index];
    }
    return null;
  },

  reset() {
    this.saveAll(INITIAL_PROPERTIES);
    return INITIAL_PROPERTIES;
  }
};

// Initial bootstrap check
if (!localStorage.getItem(PropertyStorage.STORAGE_KEY)) {
  PropertyStorage.saveAll(INITIAL_PROPERTIES);
}

window.PropertyStorage = PropertyStorage;
