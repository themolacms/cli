export interface MolaDotJson extends GeneralProperties {
  vendor: VendorProperties;
  additionalThemes?: string[];
  additionalLocales?: string[];
}

export interface GeneralProperties {
  projectName: string;
  domain: string;
  name: string;
  description: string;
}

export interface VendorProperties extends GeneralProperties {
  themes: string[];
  locales: string[];
}
