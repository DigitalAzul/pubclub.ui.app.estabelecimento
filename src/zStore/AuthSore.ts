import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { API_URL } from "../constants/env";
import { IprofileGerente, Tdevice, TpubProfile } from "../types/pubProfile";
import { TsessionProfile } from "../types/sessionProfile";

interface AuthState {
  autenticado: boolean;
  session: TsessionProfile | null;
  setSession: (session: TsessionProfile | null) => void;
  tokem: string | null;
  setTokem: (tokem: string) => void;
  pubProfile: TpubProfile | null;
  getPubProfile: () => Promise<{ pubProfile: TpubProfile } | null>;
  login: (
    email: string,
    password: string,
    role: string
  ) => Promise<{
    autenticado: boolean;
    session: TsessionProfile | null;
    tokem: string;
  } | null>;
  resetPass: (
    email: string,
    ddd: string,
    telefome: string
  ) => Promise<{ cod: number; error: boolean; msg: string } | null>;
  resetPassGerente: (
    email: string
  ) => Promise<{ cod: number; error: boolean; msg: string } | null>;
  resetPassPdv: (
    user_id: string,
    password: string
  ) => Promise<{ cod: number; error: boolean; msg: string } | null>;
  logout: () => Promise<void>;
  pubsDevice: Tpub[] | null;
  getPubsDevice: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  autenticado: false,
  session: null,
  tokem: null,
  pubProfile: null,
  pubsDevice: null,
  setTokem: (t: string) => set(() => ({ tokem: t })),
  getPubProfile: async () => {
    const _PF = await SecureStore.getItemAsync("PUBPROFILE");

    if (_PF) {
      const _PUB = await JSON.parse(_PF);
      set({ pubProfile: _PUB });
      return Promise.resolve({ pubProfile: _PUB });
    }
    return Promise.resolve(null);
  },
  setSession: (session) => set({ session }),
  login: async (email, password, role) => {
    // DEFINE A URL DE LOGIN
    console.log(email, password, role);
    let URL = "";
    if (role == "GERENTE") {
      URL = "/auth/2";
    }
    if (role == "BALCAO") {
      URL = "/auth/5";
    }
    if (role == "PDV") {
      URL = "/auth/3";
    }

    const optionsFetch = {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify({ username: email, password: password }),
    };

    const response = await fetch(`${API_URL}${URL}`, optionsFetch);

    if (!response.ok) {
      return Promise.resolve(null);
      // throw ('Credenciais Inválidas !');
    }
    const data = await response.json();

    // SE GERENTE
    if (role == "GERENTE") {
      // SET PROFILE
      const optionsFetchProfile = {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${data.access_token}`,
        }),
      };
      const PROFILE = await fetch(`${API_URL}/profile/2`, optionsFetchProfile);
      if (!PROFILE.ok) {
        throw "Credenciais Inválidas !";
      }

      const p: IprofileGerente = await PROFILE.json();

      const _rede = {
        id: p.rede.id,
        titulo: p.rede.titulo,
        situacao: p.rede.situacao,
      };
      const _pub = {
        id: p.rede.pubs[0].id,
        titulo: p.rede.pubs[0].titulo,
        razao_social: p.rede.pubs[0].razao_social,
        cnpj: p.rede.pubs[0].cnpj,
        dominio: p.rede.pubs[0].dominio,
        situacao: p.rede.pubs[0].situacao,
      };

      // GET REDE EM STORE
      const _pubs_devices = await SecureStore.getItemAsync("PUBS_DEVICES");

      if (_pubs_devices == null || _pubs_devices == "null") {
        const p: Tpub[] = [];
        p.push(_pub);
        await SecureStore.setItemAsync("PUBS_DEVICES", JSON.stringify(p));
      } else {
        try {
          if (_pubs_devices) {
            const pd: Tpub[] = JSON.parse(_pubs_devices);

            const pubIdx = pd.findIndex((R: Tpub) => R.id == _pub.id);

            // se tem rede verifica o pub
            if (pubIdx == -1) {
              pd.push(_pub);
            }

            await SecureStore.setItemAsync("PUBS_DEVICES", JSON.stringify(pd));
            set({ pubsDevice: pd });
          }
        } catch (error) {
          console.log(error);
        }
      }

      const t = await SecureStore.getItemAsync("PUBS_DEVICES");

      //*****
      // RETIRADO EM 25/05/2025
      // POIS SERÁ SETADO PELO GARÇOM AO ENTRAR
      //*****
      const pubProfile = {
        id: p.rede.pubs[0].id,
        cnpj: p.rede.pubs[0].cnpj,
        razao_social: p.rede.pubs[0].razao_social,
        dominio: p.rede.pubs[0].dominio,
        situacao: p.rede.pubs[0].situacao,
      };
      await SecureStore.setItemAsync("PUBPROFILE", JSON.stringify(pubProfile));

      let _device = "";
      switch (Device.deviceType) {
        case 0:
          _device = "UNKNOWN";
          break;
        case 1:
          _device = "PHONE";
          break;
        case 2:
          _device = "TABLET";
          break;
        case 3:
          _device = "DESKTOP";
          break;
        default:
          _device = "UNKNOWN";
          break;
      }
      const device: Tdevice = {
        pubs_id: p.rede.pubs[0].id,
        titulo: email,
        uuid: new Date().getTime().toString(),
        brand: Device.brand,
        deviceName: Device.deviceName,
        deviceType: _device,
        isDevice: Device.isDevice ? "SIM" : "NAO",
        modelName: Device.modelName,
        ativo: true,
      };

      const dev = await SecureStore.getItemAsync("DEVICE");

      if (!dev) {
        await SecureStore.setItemAsync("DEVICE", JSON.stringify(device));

        // ENVIA PRA API
        const optionsFetchProfile = {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${data.access_token}`,
          }),
          body: JSON.stringify(device),
        };
        await fetch(`${API_URL}/pdvs`, optionsFetchProfile);
      } else {
        // SE NÃO TIVER DEVICE BUSCA SE O PUB JA  O POSSUI
        // SE NÃO ENVIA PRA API DO PUB
        // **** FALTA FAZER
      }

      //
      // OBTEM OS PDVS ATUAIS DO PUB
      //

      // ENVIA PRA API
      const optionsFetchProfileGetPdv = {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${data.access_token}`,
        }),
      };
      const _pdvs = await fetch(
        `${API_URL}/pdvs/${p.rede.pubs[0].id}`,
        optionsFetchProfileGetPdv
      );
      const pdvs_ = await _pdvs.json();

      // gerente profile
      const gerenteProfile: TsessionProfile = {
        user_id: p.user.id,
        role_id: p.role_id,
        nome: p.user.nome,
        email: p.user.email,
        role: p.user.role,
        // user_id: p.role_user_gerente.user.id,
        // role_id: p.role_user_gerente.id,
        // nome: p.role_user_gerente.user.nome,
        // email: p.role_user_gerente.user.email,
        // role: p.role_user_gerente.user.role,
      };

      await SecureStore.setItemAsync(
        "GERENTEPROFILE",
        JSON.stringify(gerenteProfile)
      );

      await set({
        autenticado: true,
        session: {
          user_id: p.user.id,
          role_id: p.role_id,
          nome: p.user.nome,
          email: p.user.email,
          role: p.user.role,
        },
        tokem: data.access_token,
      });
    }

    if (role == "BALCAO") {
      const optionsFetchProfile = {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${data.access_token}`,
        }),
      };

      const PROFILE = await fetch(`${API_URL}/profile/5`, optionsFetchProfile);
      if (!PROFILE.ok) {
        throw "Credenciais Inválidas !";
      }
      const p = await PROFILE.json();
      console.log('PROFILE balcao login', p)
      const pdvUserProfile = {
        user_id: p.id,
        role_id: p.RoleUserBalcao.id,
        nome: p.nome,
        email: p.email,
        role: p.role,
      };
      await SecureStore.setItemAsync(
        "PDVUSERPROFILE",
        JSON.stringify(pdvUserProfile)
      );
      set({
        autenticado: true,
        session: pdvUserProfile,
        tokem: data.access_token,
      });
    }
    if (role == "PDV") {
      const optionsFetchProfile = {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${data.access_token}`,
        }),
      };

      const PROFILE = await fetch(`${API_URL}/profile/3`, optionsFetchProfile);
      if (!PROFILE.ok) {
        throw "Credenciais Inválidas !";
      }

      const p = await PROFILE.json();

      const pdvUserProfile = {
        user_id: p.id,
        role_id: p.role_user_pdv.id,
        nome: p.nome,
        email: p.email,
        role: p.role,
      };
      await SecureStore.setItemAsync(
        "PDVUSERPROFILE",
        JSON.stringify(pdvUserProfile)
      );
      set({
        autenticado: true,
        session: pdvUserProfile,
        tokem: data.access_token,
      });
    }

    return Promise.resolve({
      autenticado: true,
      session: get().session,
      tokem: data.access_token,
    });
  },

  resetPass: async (email: string, ddd: string, telefone: string) => {
    console.log("register novo auth", email, ddd, telefone);

    const optionsFetch = {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify({ email, ddd, telefone }),
    };
    try {
      const response = await fetch(
        `${API_URL}/users/rstPassRoleUserAppF1`,
        optionsFetch
      );

      console.log("response", response);
      if (!response.ok) {
        return { cod: 9, error: true, msg: "Erro no Registro" };
      }
      const data = await response.json();

      return Promise.resolve(data);
    } catch (error) {
      return { error: true, msg: error as any };
    }
  },
  resetPassGerente: async (email: string) => {
    console.log("register novo auth", email);

    const optionsFetch = {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify({ email }),
    };
    try {
      const response = await fetch(
        `${API_URL}/users/rstPassRoleUserGerenteF1`,
        optionsFetch
      );

      console.log("response", response);
      if (!response.ok) {
        return { cod: 9, error: true, msg: "Erro no Registro" };
      }
      const data = await response.json();

      return Promise.resolve(data);
    } catch (error) {
      return { error: true, msg: error as any };
    }
  },
  resetPassPdv: async (user_id: string, password: string) => {
    const optionsFetch = {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify({ user_id, password }),
    };
    try {
      const response = await fetch(
        `${API_URL}/users/rstPassRoleUserPdv`,
        optionsFetch
      );

      console.log("response", response);
      if (!response.ok) {
        return { cod: 9, error: true, msg: "Erro no Registro" };
      }
      const data = await response.json();

      return Promise.resolve(data);
    } catch (error) {
      return { error: true, msg: error as any };
    }
  },
  logout: async () => {
    set({ autenticado: false, session: null });
    return Promise.resolve();
  },
  getPubsDevice: async () => {
    const _PUBS_DEVICES = await SecureStore.getItemAsync("PUBS_DEVICES");

    if (_PUBS_DEVICES) {
      const p = JSON.parse(_PUBS_DEVICES);
      set({ pubsDevice: p });
    }
  },
}));

export default useAuthStore;
