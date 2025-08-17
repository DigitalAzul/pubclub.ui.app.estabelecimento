export type TcardClubeDebitoProps = {
  id: string;
  titulo: string;
  doses: number;
  valor: GLfloat;
  doses_consumidas: number;
  doses_adebitar: number;
  validade: number;
  expira_em: Date | undefined;
  imagem: string;
};
