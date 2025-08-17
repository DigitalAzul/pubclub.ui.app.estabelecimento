export type operadorMembros = {
  criado_em: string;
  email: string;
  id: string;
  nome: string;
  role: string;
  situacao: string;
};
export type Toperadores = {
  caixa?: operadorMembros[];
  pdv: operadorMembros[];
  balcao: operadorMembros[];
};
