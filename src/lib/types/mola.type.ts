export interface MolaDotJson {
  projectName: string;
  domain: string;
  name: string;
  description: string;
  themes: string[];
  locales: string[];
  backend: MolaBackend;
}

export interface MolaBackend {
  provider: 'none' | 'firebase';
}
