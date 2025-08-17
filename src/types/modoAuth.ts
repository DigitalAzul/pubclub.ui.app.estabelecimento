export type TmodoAuth = {
  modo: "CODIGO" | "QRCODE" | null;
  codigo?: {
    ddd: string;
    telefone: string;
    codigo: string;
  };
  qrcode?: {
    qrcode: string;
  };
};

export type TroleUserApp = {
  ddd: string;
  id: string;
  telefone: string;
  user: { nome: string };
  user_id: string;
};
