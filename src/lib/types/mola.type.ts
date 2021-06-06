export interface MolaDotJson {
  projectName: string;
  domain: string;
  name: string;
  description: string;
  locales: string[];
  skins: string[];
  soul: string;
  backend?: BackendPoperties;
}

export interface BackendPoperties {
  database: true;
}
