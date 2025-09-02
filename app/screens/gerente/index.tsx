
//import * as SQLite from 'expo-sqlite';


import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import useAuthStore from '../../../src/zStore/AuthSore';




export default function Index() {

    const router = useRouter();


    const { login, resetPassGerente } = useAuthStore()


    const [email, setEmail] = useState("g@g.com"); // gerente@a.com
    const [password, setPassword] = useState('12345') // 12345
    const [trocarSenhaForm, setTrocarSenhaForm] = useState(false) // 12345

    const _login = async () => {

        const role = 'GERENTE'
        const result = await login!(email, password, role);
        if (result?.autenticado) {
            console.log(result);

            router.push('../../(admin)');
        } else {
            alert("Credenciais inválidas!")
        }
    }

    const _resetPassGerente = async () => {
        const res = await resetPassGerente(email)
        console.log('_resetPAssGerente', res);
    }

    return (


        <View style={{ flex: 1 }}
            className="bg-white"
        >



            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', height: '100%' }}>

                <View
                    className='flex flex-col justify-center items-center h-[200px]'
                >
                    <Text
                        style={styles.subTitulo}>Seja bem vindo ao</Text>
                    <Text style={styles.Titulo}>Pub Club</Text>
                    <Text className='font-bold text-2xl'>
                        LOGIN GERENTE
                    </Text>
                </View>


                {!trocarSenhaForm ?
                    <View style={{ width: '100%', flexDirection: 'column', alignItems: 'center', paddingTop: 50 }}>

                        <Text
                            className='text-xl text-center text-slate-600'>
                            Informe seu e-mail e senha cadastradas na plataforma!
                        </Text>

                        <View className='mx-6 p-6 py-10 bg-slate-200 rounded-3xl mt-6'>
                            <Text style={{ fontSize: 14, fontWeight: '300', paddingLeft: 16 }}>E-mail</Text>
                            <View
                                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: "#FFF", borderRadius: 25, height: 45, paddingHorizontal: 20, marginTop: 5 }}
                            >
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={(text: string) => setEmail(text)}
                                    placeholder="E-mail"
                                    placeholderTextColor={"#8C8C8C"}
                                    keyboardType="email-address"
                                    autoComplete="email"
                                    autoCapitalize="none"
                                />
                            </View>
                            <Text style={{ fontSize: 14, fontWeight: '300', marginTop: '1.5%', paddingLeft: 16 }}>Senha</Text>
                            <View
                                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: "#FFF", borderRadius: 25, height: 45, paddingHorizontal: 20, marginTop: 5 }}
                            >
                                <TextInput
                                    style={styles.input}
                                    value={password}
                                    onChangeText={(text: string) => setPassword(text)}
                                    placeholder="Senha"
                                    placeholderTextColor={"#8C8C8C"}
                                    secureTextEntry={true}
                                />
                            </View>
                        </View>


                        <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 25 }}>



                            <TouchableOpacity
                                className='flex flex-row justify-center items-center bg-slate-300 text-white w-[80%] h-[70px] rounded-full'
                                onPress={_login}
                            >
                                <Text>ENTRAR</Text>
                            </TouchableOpacity>




                        </View>
                    </View>

                    :

                    <View style={{ width: '100%', flexDirection: 'column', alignItems: 'center', paddingTop: 50 }}>

                        <Text
                            className='text-xl text-center text-slate-600'>
                            Informe seu e-mail cadastrado na plataforma!
                        </Text>

                        <View className='mx-6 p-6 py-10 bg-slate-200 rounded-3xl mt-6'>
                            <Text style={{ fontSize: 14, fontWeight: '300', paddingLeft: 16 }}>E-mail</Text>
                            <View
                                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: "#FFF", borderRadius: 25, height: 45, paddingHorizontal: 20, marginTop: 5 }}
                            >
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={(text: string) => setEmail(text)}
                                    placeholder="E-mail"
                                    placeholderTextColor={"#8C8C8C"}
                                    keyboardType="email-address"
                                    autoComplete="email"
                                    autoCapitalize="none"
                                />
                            </View>

                        </View>


                        <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 25 }}>



                            <TouchableOpacity
                                className='flex flex-row justify-center items-center bg-slate-300 text-white w-[80%] h-[70px] rounded-full'
                                onPress={_resetPassGerente}
                            >
                                <Text>TROCAR</Text>
                            </TouchableOpacity>




                        </View>
                    </View>
                }




                <Pressable
                    onPress={() => setTrocarSenhaForm(!trocarSenhaForm)}
                    style={{
                        padding: 5,
                        width: "50%",
                        borderRadius: 50,
                        alignItems: "center",
                        marginTop: 10,
                    }}

                >
                    {!trocarSenhaForm ?
                        <Text>Esqueci a senha</Text>
                        :
                        <Text>Cancelar</Text>
                    }

                </Pressable>

            </View>


        </View>





    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 0,
    },
    Textos: {
        paddingTop: "30%",
        justifyContent: "center",
        alignItems: "center",


    },


    subTitulo: {
        fontSize: 26,
        color: "black",
    },
    Titulo: {
        fontSize: 60,
        fontWeight: "800",
        textTransform: "uppercase",
        color: "black",
    },
    input: {
        width: '100%',
        color: "#000",

        letterSpacing: 0.5,
        fontSize: 16,

    },

});
