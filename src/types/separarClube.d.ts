export type TsepararClube = {
  role_user_pdv_id: string,
  meus_clubes_id: string,
  pubs_id: string

}


export type TsepararClubeResponse = {
  id: string,
  meus_clubes_id: string,
  role_user_pdv_id: string,
  criado_em: string,
  situacao: string,
  pubs_id: string,
  meusClubes: {
    doses: number,
    doses_consumidas: number,
    titulo: string,
    roleUserApp: {
      user: {
        nome: string
      }
    }
  },
  roleUserPdv: {
    user: {
      nome: string
    }
  }
}