import * as SecureStore from 'expo-secure-store'
import { createContext, useContext, useState } from 'react'
import { API_URL } from '../constants/env'
import { UseSessionProfileStore } from '../zStore/sesssionProfileStore'


type TgerenteProfile = {
    id: string,
    nome: string,
    email: string,
    estabelecimento: {
        cnpj: string,
        id: string,
        razao_social: string,
    }
}

type TuserFinal = {
    email: string,
    nome: string,
    password: string,
    telefone: string,
    ddd: string
}


interface AuthProps {
    authState?: { token?: string | null; authenticated: boolean | null };
    onRegister?: (userFinal: TuserFinal) => Promise<any>;
    onLogin?: (email: string, password: string, role: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}


const TOKEN_KEY = 'PDVJKEY';
const PUBPROFILE = 'PUBPROFILE';
const GERENTEPROFILE = 'GERENTEPROFILE';
const PDVPROFILE = 'PDVPROFILE';
const PDVUSERPROFILE = 'PDVUSERPROFILE';
//export const API_URL = 'http://192.168.0.17:3000';
//export const API_URL = 'http://10.81.1.224:3000';
//export const API_URL = 'http://10.81.1.63:3000';
const AuthContext = createContext<AuthProps>({})

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }: any) => {

    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
    }>({
        token: null,
        authenticated: null
    });


    const { setTokem, setUserCorrente } = UseSessionProfileStore()


    const register = async (userFinal: {}) => {
        console.log('Auth register', userFinal);
        const optionsFetch = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }),
            body: JSON.stringify({ ...userFinal })
        };
        try {
            const response = await fetch(`${API_URL}/users-final`, optionsFetch)

            console.log('response', response);
            if (!response.ok) {
                throw ('Credenciais Inválidas !');
            }
            const data = await response.json()
            //console.log(data)

            return data

        } catch (error) {
            return { error: true, msg: (error as any) }
        }
    }


    const login = async (email: string, password: string, role: string) => {

        // DEFINE A URL DE LOGIN
        let URL = ""
        if (role == 'GERENTE') {
            URL = '/auth/2'
        }
        if (role == 'PDV') {
            URL = '/auth/3'
        }

        const optionsFetch = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }),
            body: JSON.stringify({ username: email, password: password })
        };

        try {
            const response = await fetch(`${API_URL}${URL}`, optionsFetch)

            if (!response.ok) {
                throw ('Credenciais Inválidas !');
            }
            const data = await response.json()



            setAuthState({
                token: data.access_token,
                authenticated: true
            });
            await SecureStore.setItemAsync(TOKEN_KEY, data.access_token)

            // Zstore
            await setTokem(data.access_token);



            // ***** SET PROFILE

            // SE GERENTE
            if (role == 'GERENTE') {

                const optionsFetchProfile = {
                    method: 'POST',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        "Authorization": `Bearer ${data.access_token}`
                    }),

                };

                const PROFILE = await fetch(`${API_URL}/profile/2`, optionsFetchProfile)
                if (!PROFILE.ok) {
                    logout()
                    throw ('Credenciais Inválidas !');
                }

                const p = await PROFILE.json()

                // FALTA DEFINIR QU EO FETCH COLOQUE OS HEADERS DA AUTENTICAÇÃO COMO NO AXIOS
                // AXIOS:: axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;



                const pubProfile = {
                    id: p.role_user_gerente.pub.id,
                    cnpj: p.role_user_gerente.pub.cnpj,
                    razao_social: p.role_user_gerente.pub.razao_social,
                    dominio: p.role_user_gerente.pub.dominio,
                }
                await SecureStore.setItemAsync(PUBPROFILE, JSON.stringify(pubProfile))


                const gerenteProfile = {
                    id: p.id,
                    nome: p.nome,
                    email: p.email,
                }
                await SecureStore.setItemAsync(GERENTEPROFILE, JSON.stringify(gerenteProfile))


            }


            if (role == 'PDV') {

                const optionsFetchProfile = {
                    method: 'POST',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        "Authorization": `Bearer ${data.access_token}`
                    }),

                };


                const PROFILE = await fetch(`${API_URL}/profile/3`, optionsFetchProfile)
                if (!PROFILE.ok) {
                    logout()
                    throw ('Credenciais Inválidas !');
                }

                const p = await PROFILE.json()

                console.log('get o profile do user pdv', p)

                const pdvUserProfile = {
                    id: p.role_user_pdv.id,
                    nome: p.nome,
                    email: p.email,
                    role: p.role,
                }
                await SecureStore.setItemAsync(PDVUSERPROFILE, JSON.stringify(pdvUserProfile))
            }



            return data


        } catch (error) {
            console.log('onLogin AuthContext::', error);
            return { error: true, msg: (error as any) }
        }
    }
    const logout = async () => {

        await SecureStore.deleteItemAsync(TOKEN_KEY)

        setAuthState({
            token: null,
            authenticated: false
        });

        return null
    }


    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState
    }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}