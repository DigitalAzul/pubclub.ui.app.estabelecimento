
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


import { CameraView } from 'expo-camera';

import { useState } from "react";

import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StackActions } from "@react-navigation/native";
import { useGlobalSearchParams, useNavigationContainerRef, useRouter } from "expo-router";
import { Button } from '../../src/components/Button';
import { CardClubeDebitoConfirmacao } from '../../src/components/cards/CardClubeDebitoConfirmacao';
import { Input } from "../../src/components/Input";
import { API_URL } from "../../src/constants/env";
import { TcardClubeDebitoProps } from '../../src/types/cardClubeDebitoProps';
import { Tcliente } from '../../src/types/cliente';
import useAuthStore from '../../src/zStore/AuthSore';
import useDbStore from '../../src/zStore/dbStore';





let _cliente: Tcliente;
let _clubes: TcardClubeDebitoProps[] = [];




export default function DebitarClubes() {

    const router = useRouter();

    const { session } = useAuthStore()
    const { userAppAtual, reseteUserAppAtual, deviceLocalCorrente } = useDbStore()

    const [codigo, setCodigo] = useState("")
    const [emCapitura, setEmCapitura] = useState(true);

    //const params = useGlobalSearchParams<{ clubes: string, cliente: string, modoAuth: string }>();
    const params = useGlobalSearchParams<{ clubes: string }>();

    // if (params?.clubes, params?.cliente, params?.modoAuth) {
    //     _clubes = JSON.parse(params?.clubes)
    //     _cliente = JSON.parse(params?.cliente)

    //     console.log('_cliente', params?.modoAuth);
    // }

    if (params?.clubes) {
        _clubes = JSON.parse(params?.clubes)
    }







    async function handleSubmitPorQrcode(qrcode: any) {

        setEmCapitura(false)

        const optionsFetch = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }),
            body: JSON.stringify({ clubes: _clubes, userProfileApp: userAppAtual.roleUserApp, pdvProfile: deviceLocalCorrente, pdvUserProfile_id: session?.role_id, modoAuth: { modo: 'QRCODE', valor: qrcode.data } })
        };

        try {
            const response = await fetch(`${API_URL}/meusclubes/debitarClubesPeloPdv`, optionsFetch)

            const data = await response.json()
            console.log('response rrrrrr', data);


            if (data.error) {

                if (data.cod == 9) {
                    Alert.alert(
                        'Informação',
                        data.msg,
                        [
                            {
                                text: 'Ok',
                                onPress: async () => {
                                    await reseteUserAppAtual()
                                    //rootNavigation.dispatch(StackActions.popToTop());
                                    router.replace('../screens/gerente')
                                },
                                style: 'default',
                            },
                        ],

                    );
                }
                if (data.cod == 1) {
                    Alert.alert(
                        'AVISO',
                        'Qrcode inválido deseja refazer a leitura, ou não encontrado',
                        [
                            {
                                text: 'Não',
                                onPress: () => setEmCapitura(false),
                                style: 'cancel',
                            },
                            {
                                text: 'Sim',
                                onPress: () => setEmCapitura(true),
                                style: 'default',
                            },
                        ],

                    );
                }
            } else {
                Alert.alert(
                    'Informação',
                    data.msg,
                    [
                        {
                            text: 'Ok',
                            onPress: async () => {
                                await reseteUserAppAtual()
                                rootNavigation.dispatch(StackActions.popToTop());
                                router.replace('/transacoes')
                            },
                            style: 'default',
                        },
                    ],

                );
            }
        } catch (error) {
            console.log(error)

        }

    }

    const rootNavigation = useNavigationContainerRef();


    async function handleSubmitPorCodigo() {
        const optionsFetch = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }),
            body: JSON.stringify({ clubes: _clubes, userProfileApp: userAppAtual.roleUserApp, pdvProfile: deviceLocalCorrente, pdvUserProfile_id: session?.role_id, modoAuth: { modo: 'CODIGO', valor: codigo } })
        };

        try {
            const response = await fetch(`${API_URL}/meusclubes/debitarClubesPeloPdv`, optionsFetch)

            console.log('response rrrrrr', response);
            if (!response.ok) {
                throw ('Credenciais Inválidas !');
            }
            const data = await response.json()
            if (data.cod == 9) {
                Alert.alert(
                    'Informação',
                    data.msg,
                    [
                        {
                            text: 'Ok',
                            onPress: async () => {
                                await reseteUserAppAtual()
                                //rootNavigation.dispatch(StackActions.popToTop());
                                router.replace('../screens/gerente')
                            },
                            style: 'default',
                        },
                    ],

                );
            }
            Alert.alert(
                'Informação',
                data.msg,
                [
                    {
                        text: 'Ok',
                        onPress: async () => {
                            await reseteUserAppAtual()
                            rootNavigation.dispatch(StackActions.popToTop());
                            router.replace('/transacoes')
                        },
                        style: 'default',
                    },
                ],

            );
            console.log(data)
        } catch (error) {
            console.log(error)

        }


    }







    return (
        <SafeAreaProvider style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>

                <ScrollView>
                    <View className="flex pb-6">


                        <View className='p-4 mt-4 mb-8'>

                            <Text className='text-2xl'>Prezado {userAppAtual.roleUserApp.user.nome}</Text>
                            <Text className='text-base py-2'>Favor confira os clubes respectivas quantidades e confirme sua aquisição !</Text>
                        </View>

                        <View className='px-7 flex flex-col gap-6'>

                            {_clubes.map((c: TcardClubeDebitoProps) => (
                                <CardClubeDebitoConfirmacao
                                    key={c.id}
                                    clube={{
                                        id: c.id,
                                        titulo: c.titulo,
                                        doses: c.doses,
                                        valor: c.valor,
                                        doses_adebitar: c.doses_adebitar,
                                        doses_consumidas: c.doses_consumidas,
                                        expira_em: c.expira_em,
                                        validade: c.validade,
                                        imagem: ""
                                    }} />


                            ))
                            }


                        </View>

                        {userAppAtual.modoAuth.modo == 'CODIGO' &&
                            <View>
                                <View className='p-10'>
                                    <Input
                                        value={codigo}
                                        onChangeText={(text: string) => setCodigo(text)}
                                        secureTextEntry={true}
                                        textContentType='password'
                                        keyboardType="default"
                                        label="CÓDIGO DE SEGURANÇA" placeholder="Digite seu código de segurança"
                                        labelClasses=" font-semibold"
                                    />
                                </View>


                                <View className='w-full flex-row justify-center mt-6'>
                                    <Button
                                        onPress={() => {
                                            handleSubmitPorCodigo()

                                        }
                                        }
                                        className='h-14 w-[250px]  bg-slate-300 rounded-2xl m-3'
                                        label='Confirmar' />
                                </View>


                                {/* <View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            handleSubmitPorCodigo()
                                            console.log(params?.clubes)
                                        }
                                        }
                                    >
                                        <Text>confirmar</Text>
                                    </TouchableOpacity>
                                </View> */}
                            </View>
                        }

                        {userAppAtual.modoAuth.modo == 'QRCODE' &&
                            <View

                                className={`w-full min-h-[80px] border-slate-400  shadow-2xl bg-white p-2 flex flex-col ${emCapitura ? 'rounded-3xl' : 'rounded-full'}`}
                            >
                                <View className='flex flex-row justify-between items-center p-4'>
                                    <View className='flex flex-row justify-start items-center gap-6'>
                                        <MaterialCommunityIcons name="qrcode-scan" size={50} color="black" />
                                        <Text className='text-2xl font-bold'>QRCODE</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => setEmCapitura(!emCapitura)}
                                        className='p-2 rounded-3xl bg-slate-50'>
                                        {emCapitura ?
                                            <MaterialIcons name="keyboard-arrow-up" size={26} color="black" />
                                            :
                                            <MaterialIcons name="keyboard-arrow-down" size={26} color="black" />
                                        }
                                    </TouchableOpacity>

                                </View>
                                <View>
                                    {emCapitura &&
                                        <View className='h-[380px] flex flex-row justify-center items-center'>
                                            <CameraView
                                                active={false}
                                                barcodeScannerSettings={{
                                                    barcodeTypes: ["qr"],
                                                }}
                                                onBarcodeScanned={handleSubmitPorQrcode}

                                                facing={'back'}
                                            >
                                                <View className='w-[300px] h-[300px] rounded-3xl'>

                                                </View>
                                            </CameraView>

                                        </View>
                                    }
                                </View>




                            </View>
                        }
                        {/* {userAppAtual.modoAuth.modo == 'QRCODE' && emCapitura &&
                            <View>
                                <View className='h-[380px] flex flex-row justify-center items-center'>
                                    <CameraView
                                        active={false}
                                        barcodeScannerSettings={{
                                            barcodeTypes: ["qr"],
                                        }}
                                        onBarcodeScanned={handleSubmitPorQrcode}

                                        facing={'back'}
                                    >
                                        <View className='w-[300px] h-[300px] rounded-3xl'>

                                        </View>
                                    </CameraView>

                                </View>



                            </View>
                        } */}

                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
});
