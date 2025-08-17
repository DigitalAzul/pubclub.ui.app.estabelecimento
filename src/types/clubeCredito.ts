export type TclubeCredito = {
  id: string;
  expira_em: Date | null;
  validade: number;
  criado_em: Date;
  ativo: boolean;
  titulo: string;
  doses: number;
  imagem: string;
  valor: GLfloat;
  pubs_id: string;
  quantidade: number;
};
