
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CameraView } from 'expo-camera';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { StackActions } from "@react-navigation/native";
import { router, useGlobalSearchParams, useNavigationContainerRef } from "expo-router";

import { useState } from "react";
import { CardClubeCreditoConfirmacao } from "../../src/components/cards/CardClubeCreditoConfirmação";

import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Input } from "../../src/components/Input";
import { API_URL } from '../../src/constants/env';
import { Tcliente } from '../../src/types/cliente';
import { TclubeCredito } from "../../src/types/clubeCredito";
import useAuthStore from '../../src/zStore/AuthSore';
import useDbStore from '../../src/zStore/dbStore';





let _cliente: Tcliente
let _clubes: TclubeCredito[] = []
let PDVUSERPROFILE: string | null


export default function CreditarClubes() {

    const { session, pubProfile } = useAuthStore()
    const { userAppAtual, reseteUserAppAtual, pdvProfile, getMeusClubesPorCodigo, pubSelecionadoDB } = useDbStore()


    const [codigo, setCodigo] = useState("")
    const [emCapitura, setEmCapitura] = useState(true);

    const params = useGlobalSearchParams<{ clubes: string, cliente: string, mesa: string }>();
    const [modoAuth, setModoAuth] = useState<{ modo: string, valor: string }>({ modo: '', valor: '' })


    const rootNavigation = useNavigationContainerRef();


    //const [clubesDebitar, setClubesDebitar] = useState<TclubeCredito[]>([])


    // useEffect(() => {
    //     const ini = async () => {
    //         PDVUSERPROFILE = await SecureStore.getItemAsync('PDVUSERPROFILE');

    //     }
    //     ini()
    // }, [])


    if (params?.clubes) {

        _clubes = JSON.parse(params?.clubes)
        // _cliente = JSON.parse(params?.cliente)
    }



    // async function handleSubmit() {

    //     // const ddd = userAppAtual.roleUserApp.ddd;
    //     // const telefone = userAppAtual.roleUserApp.telefone;

    //     // _cliente.codigo = codigo;
    //     //setModoAuth({ modo: 'CODIGO', valor: codigo })
    //     const optionsFetch = {
    //         method: 'POST',
    //         headers: new Headers({
    //             'Content-Type': 'application/json',
    //             'Accept': 'application/json'
    //         }),
    //         body: JSON.stringify({ clubes: _clubes, userProfileApp: userAppAtual.roleUserApp, pubProfile: pubProfile, pdvUserProfile_id: session?.role_id, mesa: params?.mesa, modoAuth: modoAuth })
    //     };
    //     try {
    //         const response = await fetch(`${API_URL}/meusclubes/creditaClubesPeloPdv`, optionsFetch)
    //         console.log(response);
    //         if (!response.ok) {
    //             Alert.alert('Mensagem', 'Credenciais Inválidas !')
    //             //throw ('Credenciais Inválidas !');
    //         }
    //         const data = await response.json()

    //         if (data.error) {
    //             Alert.alert('Mensagem', data.msg)
    //             return
    //         } else {
    //             await getMeusClubesPorCodigo(ddd, telefone, codigo)
    //             Alert.alert('Mensagem', data.msg)
    //             console.log(data)
    //             router.push({
    //                 pathname: '/transacoes/clubeList_f2',
    //                 // params: {
    //                 //     cliente: JSON.stringify(userAppAtual.roleUserApp),
    //                 //     meusClubes: JSON.stringify(userAppAtual.clubes),
    //                 //     modoAuth: JSON.stringify(userAppAtual.modoAuth)
    //                 // },
    //             })
    //         }

    //     } catch (error) {
    //         console.log(error)

    //     }


    // }



    /// POR QRCODE



    async function handleSubmitPorQrcode(qrcode: any) {

        setEmCapitura(false)

        const optionsFetch = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }),
            body: JSON.stringify({ clubes: _clubes, userProfileApp: userAppAtual.roleUserApp, pubProfile: pubSelecionadoDB, pdvUserProfile_id: session?.role_id, modoAuth: { modo: 'QRCODE', valor: qrcode.data } })
        };

        try {
            const response = await fetch(`${API_URL}/meusclubes/creditaClubesPeloPdv`, optionsFetch)

            const data = await response.json()
            console.log('response rrrrrr', data);
            if (data.error) {
                Alert.alert(
                    'AVISO',
                    `${data.msg}`,
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
    // / POR QRCODE


    // POR CODIGO
    async function handleSubmitPorCodigo() {
        const optionsFetch = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }),
            body: JSON.stringify({ clubes: _clubes, userProfileApp: userAppAtual.roleUserApp, pubProfile: pubSelecionadoDB, pdvUserProfile_id: session?.role_id, modoAuth: { modo: 'CODIGO', valor: codigo } })
        };

        try {
            const response = await fetch(`${API_URL}/meusclubes/creditaClubesPeloPdv`, optionsFetch)

            console.log('response rrrrrr', response);
            if (!response.ok) {
                throw ('Credenciais Inválidas !');
            }
            const data = await response.json()
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
    // POR CODIGO


    return (
        <SafeAreaProvider style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>

                <ScrollView>
                    <View className="flex">


                        <View className='p-4 mt-4 mb-8'>

                            <Text className='text-2xl'>Prezado(a), {userAppAtual.roleUserApp.user.nome}</Text>
                            <Text className='text-base py-2'>Favor confira os clubes respectivas quantidades e confirme sua aquisição !</Text>
                        </View>


                        <View className='flex flex-col gap-4 px-[10px]'>
                            {_clubes.map((c: TclubeCredito) => (
                                <CardClubeCreditoConfirmacao
                                    key={c.id}
                                    clube={{
                                        id: c.id,
                                        titulo: c.titulo,
                                        doses: c.doses,
                                        valor: c.valor,
                                        quantidade: c.quantidade,
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



                        {/* <View>
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
                                        handleSubmit()
                                        console.log(params?.clubes)
                                    }
                                    }
                                    className='h-14 w-[250px]  bg-slate-300 rounded-2xl m-3'
                                    label='Confirmar' />
                            </View>
                            
                        </View> */}

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
