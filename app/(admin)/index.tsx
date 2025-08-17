
import { useIsFocused } from "@react-navigation/native";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";


import React, { useEffect, useState } from "react";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Button } from '../../src/components/Button';
import { Tdevice } from "../../src/types/pubProfile";
import useAuthStore from '../../src/zStore/AuthSore';
import useDbStore from '../../src/zStore/dbStore';





// type TgerenteProfile = {
//     id: string,
//     nome: string,
//     email: string,
//     estabelecimento: {
//         cnpj: string,
//         id: string,
//         razao_social: string,
//         dominio: string
//     }
// }


type TpubPdvs = {
    id: string,
    titulo: string,
    emPosse: string,
    situacao: boolean,
}




export default function Admin() {


    const { getPubProfile, pubProfile, session, tokem, pubsDevice } = useAuthStore()
    const { getPdvProfile, pdvProfile, ativarPdv, desativarPdv, getPubDeviceAPI, cadastrarPdv } = useDbStore()

    const [deviceCorrente, setDeviceCorrente] = useState<Tdevice | null>(null)
    const [deviceLocal, setDeviceLocal] = useState<Tdevice | null>(null)
    const [_sync, set_sync] = useState(0)



    const isFocused = useIsFocused();

    useEffect(() => {

        const i = async () => {
            const prf = await getPubProfile();
            await getPdvProfile();


            const dev = await SecureStore.getItemAsync("DEVICE");
            console.log('dev,dev,dev,dev', dev);
            const _d: Tdevice = dev ? await JSON.parse(dev) : null
            if (dev && prf?.pubProfile?.id && _d.uuid) {

                // define o device em LOCAL
                setDeviceLocal(_d)

                const devAPI = await getPubDeviceAPI(prf?.pubProfile?.id, _d.uuid)
                if (devAPI) {
                    ;
                    setDeviceCorrente(devAPI.device)

                } else {

                    setDeviceCorrente(null)

                }

                // try {
                //     const _d: Tdevice = JSON.parse(dev)
                //     setDeviceCorrente(_d)
                //     // consulta a api por dados do device
                //     const optionsFetchProfileGetPdv = {
                //         method: "GET",
                //         headers: new Headers({
                //             "Content-Type": "application/json",
                //             Accept: "application/json",
                //             Authorization: `Bearer ${tokem}`,
                //         }),
                //     };
                //     const _pdvs = await fetch(
                //         `${API_URL}/pdvs/situacao/${prf?.pubProfile?.id}/${_d.uuid}`,
                //         optionsFetchProfileGetPdv
                //     );
                //     const pdvs_ = await _pdvs.json();
                //     if (pdvs_.error == false) {

                //         console.log('pdvs_,pdvs_pdvs_', pdvs_.error);
                //         setDeviceCorrente(pdvs_.data)
                //         await SecureStore.setItemAsync("DEVICE", JSON.stringify(pdvs_.data));
                //     }

                // } catch (error) {
                //     console.log('dev && pubProfile?.id', error);
                // }

            }

        }
        i()
    }, [_sync])



    async function desativarPubPdv() {


        if (deviceCorrente) {

            Alert.alert(
                'DESATIVAR PDV',
                'Deseja desativar este PDV ?',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Sim',
                        onPress: async () => {
                            await desativarPdv(deviceCorrente)
                            set_sync(new Date().getDate())
                        },
                        style: 'default',
                    },
                ],

            );
        }



    }
    async function ativarPubPdv() {


        if (deviceCorrente) {

            Alert.alert(
                'ATIVAR PDV',
                'Deseja ATIVAR este PDV ?',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Sim',
                        onPress: async () => {
                            const c = await ativarPdv(deviceCorrente)
                            console.log('await ativar', c);
                            set_sync(new Date().getDate() + 333)
                        },
                        style: 'default',
                    },
                ],

            );
        } else {
            if (deviceLocal && tokem && pubProfile && session) {

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
                    pubs_id: pubProfile.id,
                    titulo: session.email,
                    uuid: deviceLocal.uuid,
                    brand: deviceLocal.brand,
                    deviceName: deviceLocal.deviceName,
                    deviceType: _device,
                    isDevice: deviceLocal.isDevice ? "SIM" : "NAO",
                    modelName: deviceLocal.modelName,
                    ativo: true,
                };





                console.log('nao tem device pra esse cnpj');
                const c = await cadastrarPdv(device, tokem)
                console.log('return de cadastar devc', c);
                if (c) {
                    set_sync(new Date().getDate())
                }
            }
        }



    }



    return (

        <SafeAreaProvider style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>

                <ScrollView>
                    <View
                        className='pt-10 px-4'
                    >
                        <View className='pb-6'>
                            <Text className='text-2xl'>Portal do</Text>
                            <Text className='text-[50px] font-medium -translate-y-3'>Gerente</Text>
                        </View>

                        <View>
                            <View className='bg-black rounded-2xl p-4 mb-4'>
                                <View className='py-2 border-b border-slate-400'>
                                    <Text className='font-bold text-3xl text-white'>
                                        Estabeleciemento
                                    </Text>
                                    <View>
                                        <Text className='text-lg  text-white'>
                                            {pubProfile?.razao_social}
                                        </Text>
                                    </View>
                                </View>
                                <View className='py-2 flex flex-col gap-3'>

                                    <View>
                                        <Text className='text-sm  text-white'>
                                            CNPJ
                                        </Text>
                                        <Text className='text-lg  text-white'>
                                            {pubProfile?.cnpj}
                                        </Text>
                                    </View>
                                    <View className='flex flex-row gap-3 ' >

                                        <View>
                                            <Text className='text-sm  text-white'>
                                                Gerente
                                            </Text>
                                            <Text className='text-lg  text-white'>
                                                {session?.nome}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text className='text-sm  text-white'>
                                                Email
                                            </Text>
                                            <Text className='text-lg  text-white'>
                                                {session?.email}
                                            </Text>
                                        </View>
                                    </View>
                                    {/* <View>
                                        <Text className='text-sm  text-white'>
                                            Domínio do Estabelecimento
                                        </Text>
                                        <Text className='text-lg  text-white'>
                                            @{gerProfile?.estabelecimento.dominio}
                                        </Text>
                                    </View> */}
                                </View>
                            </View>



                            <View className='border  rounded-2xl'>
                                <View className='p-4 border-b border-black'>
                                    <Text className='font-bold text-2xl'>
                                        Este PDV
                                    </Text>
                                    {/* <Text className='text-lg'>
                                        {pdvProfile?.titulo}
                                    </Text> */}
                                </View>

                                {deviceCorrente ?
                                    <View>

                                        <View className='p-4 flex flex-row gap-4'>
                                            <View>
                                                <Text className='text-sm'>
                                                    Situação
                                                </Text>
                                                {deviceCorrente?.ativo ?
                                                    <Text className='text-lg'>
                                                        ATIVO
                                                    </Text>
                                                    :
                                                    <Text className='text-lg'>
                                                        DESATIVADO
                                                    </Text>
                                                }

                                            </View>
                                            <View>
                                                <Text className='text-sm'>
                                                    Habilitado por:
                                                </Text>
                                                <Text className='text-lg'>
                                                    {deviceCorrente?.titulo}
                                                </Text>
                                            </View>
                                        </View>

                                        <View className='w-full flex flex-row justify-between items-center'>

                                            {deviceCorrente?.ativo == true ?
                                                < Button label="DESATIVAR"
                                                    onPress={() => desativarPubPdv()}
                                                    labelClasses="font-semibold text-lg text-white"
                                                    className="w-full h-16 rounded-b-2xl bg-pink-600"
                                                />

                                                :
                                                <Button label="ATIVAR"
                                                    onPress={() => ativarPubPdv()}
                                                    labelClasses="font-semibold text-lg text-white"
                                                    className="w-full h-16 rounded-b-2xl bg-sky-600"
                                                />
                                            }

                                        </View>
                                    </View>
                                    :


                                    <View className='p-4'>
                                        <Button label="CADASTRAR"
                                            onPress={() => ativarPubPdv()}
                                            labelClasses="font-semibold text-lg text-white"
                                            className="w-full h-20 bg-black"
                                        />
                                    </View>

                                }




                            </View>





                        </View>


                    </View>
                </ScrollView>
            </SafeAreaView>
            <StatusBar style="auto" />
        </SafeAreaProvider>

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


});
