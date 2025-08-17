
//import * as SQLite from 'expo-sqlite';
import * as SecureStore from "expo-secure-store";

import { useIsFocused } from '@react-navigation/native';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { TgerenteProfile } from '../../../src/types/gerenteProfile';
import { Tdevice, TpubProfile } from "../../../src/types/pubProfile";
import useAuthStore from '../../../src/zStore/AuthSore';
import useDbStore from '../../../src/zStore/dbStore';




type TpubPdvs = {
    id: string,
    titulo: string,
    emPosse: string,
    situacao: boolean,
}
type TpdvProfile = {
    estabeleciemnto: TgerenteProfile[],
    pdvs: TpubPdvs[]
}

export default function Index() {

    const { tokem, login, pubProfile, getPubProfile, pubsDevice, getPubsDevice } = useAuthStore()
    const { pdvProfile, getPdvProfile, getSituacaoPdv, setPubSelecionadoDB, getPubDeviceAPI, setDeviceLocalCorrente, deviceLocalCorrente } = useDbStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('')
    const [pubSelecionado, setPubSelecionado] = useState<TpubProfile>()
    const [device, setDevice] = useState<Tdevice | null>(null)
    const [deviceLocal, setDeviceLocal] = useState<Tdevice | null>(null)


    const [dominio, setDominio] = useState("")



    const isFocused = useIsFocused();
    const router = useRouter();


    useEffect(() => {


        const i = async () => {
            await getPubProfile()
            await getPdvProfile()
            await getPubsDevice()


            let _dev: Tdevice
            const dev = await SecureStore.getItemAsync("DEVICE");

            if (dev) {
                _dev = await JSON.parse(dev)
                setDeviceLocal(_dev)

                // console.log('_dev.uuid , pubProfile , tokem >> ', _dev.uuid,);
                // console.log('_dev.uuid , pubProfile , tokem >> ', pubProfile);
                // if (_dev.uuid && pubProfile) {
                //     const device_ = await getPubDeviceAPI(pubSelecionado.id, _dev.uuid)
                //     if (device_) {
                //         setDevice(device_?.device)
                //     } else {
                //         setDevice(null)
                //     }
                // }






            } else {
                console.log('NAO TEM SecureStore.getItemAsync("DEVICE")', dev);

            }




        }
        i()
    }, [isFocused])




    const _login = async () => {

        if (!pubSelecionado?.dominio) {
            Alert.alert(
                'PDV NÃO HABILITADO',
                'Solicite ao gerente que habilite este PDV ',
                [
                    {
                        text: 'Sim',
                        onPress: () => router.replace('/screens/gerente'),
                        style: 'default',
                    },
                ],

            );
            return;
        }


        const role = 'PDV'
        const emailComDominio = email + '@' + pubSelecionado?.dominio;
        try {
            const result = await login!(emailComDominio, password, role);
            if (result?.autenticado) {

                await SecureStore.deleteItemAsync("PUBPROFILE");
                await SecureStore.setItemAsync("PUBPROFILE", JSON.stringify(pubSelecionado));
                await setPubSelecionadoDB(pubSelecionado)


                router.replace('../../transacoes');
            } else {
                alert("Credenciais inválidas!")
            }




        } catch (error) {
            console.log(error);

        }


    }

    const _reseteForm = () => {
        setPubSelecionado(undefined)
        setEmail("")
        setPassword("")
    }


    const _setPubSelecionado = async (pub: TpubProfile) => {
        if (deviceLocal) {
            if (deviceLocal.uuid && pubProfile) {
                console.log('deviceLocal 3 >>', deviceLocal);
                const device_ = await getPubDeviceAPI(pub.id, deviceLocal.uuid)
                if (device_) {

                    // set db store
                    setDeviceLocalCorrente(device_.device)

                    if (device_?.device.ativo === true) {
                        setDevice(device_?.device)
                        setPubSelecionado(pub)
                    } else {
                        setDevice(null)
                        setPubSelecionado(undefined)
                        Alert.alert(
                            'PDV NÃO HABILITADO .',
                            'Solicite ao gerente que habilite este PDV ',
                            [
                                {
                                    text: 'Sim',
                                    onPress: () => router.replace('/screens/gerente'),
                                    style: 'default',
                                },
                            ],

                        );

                    }
                } else {
                    setDevice(null)
                    setDeviceLocalCorrente(null)
                    Alert.alert(
                        'PDV NÃO HABILITADO x',
                        'Solicite ao gerente que habilite este PDV ',
                        [
                            {
                                text: 'Sim',
                                onPress: () => router.replace('/screens/gerente'),
                                style: 'default',
                            },
                        ],

                    );
                }
            }

            // if (device.ativo == true) {
            //     setPubSelecionado(pub)
            // } else {
            //     Alert.alert(
            //         'PDV NÃO HABILITADO x',
            //         'Solicite ao gerente que habilite este PDV ',
            //         [
            //             {
            //                 text: 'Sim',
            //                 onPress: () => router.replace('/screens/gerente'),
            //                 style: 'default',
            //             },
            //         ],

            //     );
            // }
        } else {
            Alert.alert(
                'PDV NÃO HABILITADO y',
                'Solicite ao gerente que habilite este PDV ',
                [
                    {
                        text: 'Sim',
                        onPress: () => router.replace('/screens/gerente'),
                        style: 'default',
                    },
                ],

            );
        }
    }


    return (


        <View style={{ flex: 1 }}>



            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', height: '100%', paddingBottom: 60 }}>

                <View
                    className='flex flex-col justify-center items-center h-[200px] mt-[70px]'
                >
                    <Text
                        style={styles.subTitulo}>Seja bem vindo ao</Text>
                    <Text style={styles.Titulo}>Pub Club</Text>
                    <Text className='font-bold text-2xl'>
                        LOGIN COMO PDV
                    </Text>
                </View>

                {!pubSelecionado?.id ?

                    <View className='w-[90%] mt-10 flex flex-col gap-4'>
                        <Text className='text-2xl text-center pb-4'>SELECIONE O ESTABELECIMENTO</Text>
                        {pubsDevice &&

                            pubsDevice?.map((p: TpubProfile) => (
                                <TouchableOpacity
                                    key={p.id}
                                    onPress={() => _setPubSelecionado(p)}
                                    className="w-full min-h-[80px] border-4 border-slate-300  shadow-2xl bg-white p-2 px-6 flex flex-col rounded-2xl"
                                >
                                    <Text className='text-lg'>{p.razao_social}</Text>
                                    <Text className='text-lg'>CNPJ: {p.cnpj}</Text>
                                </TouchableOpacity>
                            ))

                        }
                    </View>
                    :

                    <View className='mt-16 px-6 w-full'>
                        <View
                            className="w-full min-h-[80px] shadow-2xl bg-yellow-500 p-2 px-6 pb-4 flex flex-col rounded-2xl"
                        >
                            <Text
                                className='text-xl text-center text-white p-2 mb-4 border-b border-white'>
                                Informe seu nome de login e senha para este estabelecimento.
                            </Text>
                            <Text className='text-xl'>{pubSelecionado?.razao_social}</Text>
                            <Text className='text-lg'>CNPJ: {pubSelecionado?.cnpj}</Text>
                        </View>

                        <View className='p-6 py-10 bg-slate-200 rounded-3xl mt-6'>
                            <Text style={{ fontSize: 14, fontWeight: '300' }}>Nome</Text>
                            <View
                                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: "#FFF", borderRadius: 25, height: 45, paddingHorizontal: 20, marginTop: 5 }}
                            >
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={(text: string) => setEmail(text)}
                                    placeholder="Nome"
                                    placeholderTextColor={"#8C8C8C"}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                />
                            </View>
                            <Text style={{ fontSize: 14, fontWeight: '300', marginTop: '1.5%' }}>Senha</Text>
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


                        <View className='flex flex-col items-center gap-4 mt-10'>

                            <TouchableOpacity
                                className='flex flex-row justify-center items-center bg-slate-300 text-white w-[80%] h-[70px] rounded-full'
                                onPress={_login}
                            >
                                <Text>ENTRAR</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className='flex flex-row justify-center items-center bg-slate-100 text-white w-[80%] h-[70px] rounded-full'
                                onPress={_reseteForm}
                            >
                                <Text>CANCELAR</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                }




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
        width: '90%',

        color: "#000",

        letterSpacing: 0.5,
        fontSize: 16,

    },

});
