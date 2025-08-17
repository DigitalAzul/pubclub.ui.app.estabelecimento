import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { create } from "zustand";
import { API_URL } from "../constants/env";
import { TcardClubeDebitoProps } from "../types/cardClubeDebitoProps";
import { Tclubes } from "../types/clubes";
import { Tmesa } from "../types/mesas";
import { TmodoAuth, TroleUserApp } from "../types/modoAuth";
import { operadorMembros, Toperadores } from "../types/operadores";
import { Tpdv } from "../types/pdv";
import { Tdevice, TpubProfile } from "../types/pubProfile";

interface IdbStore {
  pubSelecionadoDB: TpubProfile | null;
  setPubSelecionadoDB: (pub: TpubProfile) => void;
  pdvs: Tpdv[] | null;
  getPdvsPorPubID: (pub_id: string, tokem: string) => void;
  clubes: Tclubes[] | null;
  getClubesPorPubID: (pub_id: string, tokem: string) => void;
  pdvProfile: Tpdv | null;
  ativarPdv: (pdvProfile: Tdevice) => Promise<boolean>;
  desativarPdv: (pdvProfile: Tdevice) => Promise<boolean>;
  getPdvProfile: () => void;
  mesas: Tmesa[] | null;
  getMesasPorPubID: (pub_id: string, tokem: string) => void;
  getMeusClubesPorCodigo: (
    ddd: string,
    telefone: string,
    codigo: string,
    pubs_id: string
  ) => Promise<boolean | undefined>;
  getMeusClubesPorQRcode: (
    qrcode: string,
    pubs_id: string
  ) => Promise<boolean | undefined>;
  userAppAtual: {
    clubes: TcardClubeDebitoProps[];
    clubesADebitar: TcardClubeDebitoProps[];
    roleUserApp: TroleUserApp;
    modoAuth: TmodoAuth;
  };
  getSituacaoPub: (pub_id: string) => Promise<string>;
  getSituacaoPdv: (pdv_id: string) => Promise<boolean>;
  getUsersRolePdv: (pub_id: string) => Promise<boolean>;
  createUsersRoleOP: (
    pub_id: string,
    nome: string,
    password: string,
    role: string,
    tokem: string
  ) => Promise<{ cod: number; error: boolean; msg: string }>;
  editaUsersRoleOP: (
    id: string,
    email: string,
    nome: string,
    password: string,
    tokem: string
  ) => Promise<{ cod: number; error: boolean; msg: string }>;
  usersRolePdv: Toperadores;
  desativaUsersRoleOP: (
    id: string,
    situacao: string,
    tokem: string
  ) => Promise<{ cod: number; error: boolean; msg: string }>;
  excluirUsersRoleOP: (
    id: string,
    situacao: string,
    tokem: string
  ) => Promise<{ cod: number; error: boolean; msg: string }>;
  reseteUserAppAtual: () => void;
  getPubDeviceAPI: (
    pubs_id: string,
    uuid: string
  ) => Promise<{ device: Tdevice } | null>;
  cadastrarPdv: (device: Tdevice, tokem: string) => Promise<boolean>;
  deviceLocalCorrente: Tdevice | null;
  setDeviceLocalCorrente: (device: Tdevice | null) => void;
}
const tokem = "";

const useDbStore = create<IdbStore>((set, get, state) => ({
  pubSelecionadoDB: null,
  async setPubSelecionadoDB(pub: TpubProfile) {
    set({ pubSelecionadoDB: pub });
  },
  pdvs: [],
  clubes: [],
  pdvProfile: null,
  mesas: [],
  usersRolePdv: { balcao: [], pdv: [] },
  userAppAtual: {
    clubes: [],
    clubesADebitar: [],
    roleUserApp: {
      ddd: "",
      id: "",
      telefone: "",
      user: {
        nome: "",
      },
      user_id: "",
    },
    modoAuth: {
      modo: null,
      codigo: {
        ddd: "",
        telefone: "",
        codigo: "",
      },
      qrcode: {
        qrcode: "",
      },
    },
  },
  async getMeusClubesPorCodigo(
    ddd: string,
    telefone: string,
    codigo: string,
    pubs_id: string
  ) {
    try {
      const response = await fetch(`${API_URL}/meusclubes/getPorCodigo`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
        }),
        body: JSON.stringify({
          ddd: ddd,
          telefone: telefone,
          codigo: codigo,
          pubs_id: pubs_id,
        }),
      });
      const data = await response.json();
      console.log("getMeusClubesPorCodigo", data);
      if (data.error) {
        Alert.alert("Cliente não encontrado", data.msg);
        return;
      }
      const { roleUserApp, meusClubes: _meusClubes } = data;
      if (_meusClubes.length) {
        _meusClubes.map((mc: TcardClubeDebitoProps) => {
          mc.doses_adebitar = 0;
        });
      }
      set({
        userAppAtual: {
          clubes: _meusClubes,
          clubesADebitar: [],
          roleUserApp: roleUserApp,
          modoAuth: {
            modo: "CODIGO",
            codigo: { ddd: ddd, telefone: telefone, codigo: codigo },
          },
        },
      });
    } catch (error) {
      console.log(error);
      return Promise.resolve(undefined);
    }
    return Promise.resolve(true);
  },
  async getMeusClubesPorQRcode(qrcode: string, pubs_id: string) {
    try {
      const response = await fetch(`${API_URL}/meusclubes/getPorQrcode`, {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${tokem}`,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ qrcode: qrcode, pubs_id: pubs_id }),
      });
      const data = await response.json();
      console.log("getMeusClubesPorQRcode", data);
      if (data.error) {
        Alert.alert("Cliente não encontrado", data.msg);
        return;
      }
      const { roleUserApp, meusClubes: _meusClubes } = data;
      if (_meusClubes.length) {
        _meusClubes.map((mc: TcardClubeDebitoProps) => {
          mc.doses_adebitar = 0;
        });
      }
      set({
        userAppAtual: {
          clubes: _meusClubes,
          clubesADebitar: [],
          roleUserApp: roleUserApp,
          modoAuth: {
            modo: "QRCODE",
          },
        },
      });
    } catch (error) {
      console.log(error);
      return Promise.resolve(undefined);
    }

    return Promise.resolve(true);
  },
  async getPdvsPorPubID(pub_id: string, tokem: string) {
    try {
      await fetch(`${API_URL}/pdvs/${pub_id}`, {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${tokem}`,
          "Content-Type": "application/json",
        }),
      })
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          set({ pdvs: data });
        });
    } catch (error) {
      // setError(error);
    } finally {
      //setLoading(false);
    }

    return Promise.resolve();
  },
  async getClubesPorPubID(pub_id: string, tokem: string) {
    try {
      await fetch(`${API_URL}/clubespub/pub_id/${pub_id}`, {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${tokem}`,
          "Content-Type": "application/json",
        }),
      })
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          console.log("clubes", data);
          set({ clubes: data });
        });
    } catch (error) {
      // setError(error);
    } finally {
      //setLoading(false);
    }

    return Promise.resolve();
  },
  async cadastrarPdv(pdv: Tdevice, tokem: string) {
    try {
      const optionsFetchProfile = {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${tokem}`,
        }),
        body: JSON.stringify(pdv),
      };
      await fetch(`${API_URL}/pdvs`, optionsFetchProfile).then((response) => {
        if (response.ok) {
          return true;
        } else {
          return false;
        }
      });

      return Promise.resolve(true);
    } catch (error) {
      await SecureStore.deleteItemAsync("DEVICE");
      set({ clubes: null });
      return Promise.resolve(false);
    }
  },
  async ativarPdv(pdv: Tdevice) {
    try {
      await fetch(`${API_URL}/pdvs/ativar/`, {
        method: "PATCH",
        headers: new Headers({
          Authorization: `Bearer ${tokem}`,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(pdv),
      });
      // .then((response) => {
      //   if (response.ok) return response.json();
      // });
      // .then(async (data) => {
      //   await SecureStore.setItemAsync("DEVICE", JSON.stringify(data));
      // });
      return Promise.resolve(true);
    } catch (error) {
      await SecureStore.deleteItemAsync("DEVICE");
      set({ clubes: null });
      return Promise.resolve(false);
    }
  },
  async desativarPdv(pdv: Tdevice) {
    //const _pdvProfile = get().pdvProfile;
    try {
      await SecureStore.deleteItemAsync("PDVPROFILE");
      // ativa pdv no DB
      await fetch(`${API_URL}/pdvs/desativar/`, {
        method: "PATCH",
        headers: new Headers({
          Authorization: `Bearer ${tokem}`,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(pdv),
      });
      // .then((response) => {
      //   if (response.ok) return response.json();
      // });
      // .then(async (data) => {
      //   console.log("destativa request", data);
      //   await SecureStore.setItemAsync("DEVICE", JSON.stringify(data));

      //   // RE VER ISSO
      //   // if (pdv.id === _pdvProfile?.id) {
      //   //   set({ pdvProfile: null });
      //   // }
      // });
      return Promise.resolve(true);
    } catch (error) {
      await SecureStore.deleteItemAsync("DEVICE");
      set({ clubes: null });
      return Promise.resolve(false);
    }
  },
  async getPdvProfile() {
    const _pdv = await SecureStore.getItemAsync("PDVPROFILE");
    console.debug(_pdv);
    if (_pdv) {
      const _pdvOBJ = JSON.parse(_pdv);

      set({ pdvProfile: _pdvOBJ });
    } else {
      set({ pdvProfile: null });
    }
    return Promise.resolve();
  },
  async getMesasPorPubID(pub_id: string, tokem: string) {
    try {
      await fetch(`${API_URL}/mesas/pub/${pub_id}`, {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${tokem}`,
          "Content-Type": "application/json",
        }),
      })
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          console.log("mesas", data);
          set({ mesas: data });
        });
    } catch (error) {
      // setError(error);
    } finally {
      //setLoading(false);
    }

    return Promise.resolve();
  },
  async getSituacaoPub(pub_id: string) {
    let S = "";
    try {
      await fetch(`${API_URL}/pubs/getSituacaoPub/${pub_id}`, {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${tokem}`,
          "Content-Type": "application/json",
        }),
      })
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          console.log(data.situacao);
          S = data.situacao;
        });
    } catch (error) {
      // setError(error);
    } finally {
      //setLoading(false);
    }
    return Promise.resolve(S);
  },
  async getSituacaoPdv(pdv_id: string) {
    let _ativo = false;
    // ANALISA SE P PDV ESTA ATIVO
    try {
      await fetch(`${API_URL}/pdvs/situacao/${pdv_id}`, {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${tokem}`,
          "Content-Type": "application/json",
        }),
      })
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          console.debug("PDV profile xxx", data);
          if (data.ativo == false) {
            _ativo = false;
            const inativaPDV = async () => {
              await SecureStore.deleteItemAsync("PDVPROFILE");
            };
            inativaPDV();
          } else {
            _ativo = true;
          }
        });
    } catch (error) {
      // setError(error);
    }
    // ANALISA SE P PDV ESTA ATIVO
    return Promise.resolve(_ativo);
  },
  async getUsersRolePdv(pub_id: string) {
    try {
      const response = await fetch(`${API_URL}/users/qryUOPE/${pub_id}`, {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${tokem}`,
          "Content-Type": "application/json",
        }),
      });
      const json = await response.json();

      const pdv: operadorMembros[] = [];
      const balcao: operadorMembros[] = [];
      // const caixa: operadorMembros[] = [];
      json.map((j: operadorMembros) => {
        if (j.role == "BALCAO") {
          balcao.push(j);
        }
        // if (j.role == "CAIXA") {
        //   caixa.push(j);
        // }
        if (j.role == "PDV") {
          pdv.push(j);
        }
      });
      set({ usersRolePdv: { balcao: balcao, pdv: pdv } });
    } catch (error) {
      console.log(error);
    }
    return Promise.resolve(true);
  },
  async createUsersRoleOP(
    pub_id: string,
    nome: string,
    password: string,
    role: string,
    tokem: string
  ) {
    try {
      let urlOP;
      if (role == "PDV") {
        urlOP = "rolePDV";
      }

      if (role == "BALCAO") {
        urlOP = "roleBALCAO";
      }

      // if (role == "CAIXA") {
      //   urlOP = "roleCAIXA";
      // }

      const response = await fetch(`${API_URL}/users/${urlOP}/${pub_id}`, {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${tokem}`,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ nome: nome, password: password, role: role }),
      });
      const json = await response.json();
      return Promise.resolve(json);
    } catch (error) {
      console.log(error);
    }
  },
  async editaUsersRoleOP(
    id: string,
    email: string,
    nome: string,
    password: string,
    tokem: string
  ) {
    try {
      const response = await fetch(`${API_URL}/users/rolePDVEST`, {
        method: "PATCH",
        headers: new Headers({
          Authorization: `Bearer ${tokem}`,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          id: id,
          email: email,
          nome: nome,
          password: password,
        }),
      });
      const json = await response.json();

      return Promise.resolve(json);
    } catch (error) {
      console.log(error);
    }
  },
  async excluirUsersRoleOP(id: string, situacao: string, tokem: string) {
    try {
      const response = await fetch(`${API_URL}/users/rolePDVESTAD`, {
        method: "PATCH",
        headers: new Headers({
          Authorization: `Bearer ${tokem}`,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          id: id,
          situacao: situacao,
        }),
      });
      const json = await response.json();

      return Promise.resolve(json);
    } catch (error) {
      console.log(error);
    }
  },
  async desativaUsersRoleOP(id: string, situacao: string, tokem: string) {
    try {
      const response = await fetch(`${API_URL}/users/rolePDVESTAD`, {
        method: "PATCH",
        headers: new Headers({
          Authorization: `Bearer ${tokem}`,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          id: id,
          situacao: situacao,
        }),
      });
      const json = await response.json();

      return Promise.resolve(json);
    } catch (error) {
      console.log(error);
    }
  },
  async reseteUserAppAtual() {
    set({
      userAppAtual: {
        clubes: [],
        clubesADebitar: [],
        roleUserApp: {
          ddd: "",
          id: "",
          telefone: "",
          user: {
            nome: "",
          },
          user_id: "",
        },
        modoAuth: {
          modo: null,
          codigo: {
            ddd: "",
            telefone: "",
            codigo: "",
          },
          qrcode: {
            qrcode: "",
          },
        },
      },
    });
  },
  async getPubDeviceAPI(pubs_id: string, uuid: string) {
    const optionsFetchProfile = {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
    };
    try {
      const _device = await fetch(
        `${API_URL}/pdvs/situacao/${pubs_id}/${uuid}`,
        optionsFetchProfile
      );
      const device_ = await _device.json();

      console.log("setDevice(device_)", device_);
      if (device_.error) {
        return Promise.resolve(null);
      }
      return Promise.resolve({ device: device_.data });
    } catch (error) {
      return Promise.resolve(null);
    }
  },
  deviceLocalCorrente: {
    id: "",
    pubs_id: "",
    titulo: "",
    uuid: "",
    brand: "",
    deviceName: "",
    deviceType: "",
    isDevice: "",
    modelName: "",
    ativo: false,
  },
  setDeviceLocalCorrente(device: Tdevice | null) {
    set({ deviceLocalCorrente: device });
  },
}));

export default useDbStore;
