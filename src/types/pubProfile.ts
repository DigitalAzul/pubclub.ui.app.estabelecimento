export type SituacaoPub = "ATIVO" | "INATIVO" | "SUSPENSO" | "EXCLUIDO";

export type TpubProfile = {
  id: string;
  cnpj: string;
  razao_social: string;
  dominio: string;
  situacao?: SituacaoPub;
};

export enum ENDeviceType {
  UNKNOWN,
  PHONE,
  TABLET,
  DESKTOP,
}

export type Tdevice = {
  id?: string;
  pubs_id: string;
  titulo: string;
  uuid: string | null;
  brand: string | null;
  deviceName: string | null;
  deviceType: ENDeviceType | any;
  isDevice: string;
  modelName: string | null;
  ativo: boolean;
};

export type Tpub = {
  id: string;
  titulo: string;
  razao_social: string;
  cnpj: string;
  dominio: string;
  situacao: string;
};
export type Trede = {
  id: string;
  titulo: string;
  situacao: string;
  pubs: Tpub[];
};
export interface Irede {
  rede: Trede;
}
export interface IredeStore {
  redes: Trede[];
}
export interface IpubsDevice {
  pubs: Tpub[];
}
export interface IprofileGerente {
  user: {
    id: string;
    nome: string;
    email: string;
    role: string;
  };
  role_id: string;
  rede: Trede;
}
