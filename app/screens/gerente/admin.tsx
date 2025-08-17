import { useAuth } from '../../../src/context/AuthContext';

import * as SecureStore from 'expo-secure-store';


import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Button } from '../../../src/components/Button';


const PDVPROFILE = 'PDVPROFILE';



type TpubPdvs = {
    id: string,
    titulo: string,
    emPosse: string,
    situacao: boolean,
}




export default function Admin() {
    const [estePdv, setEstePdv] = useState<TpubPdvs>()

    const { onLogin, onRegister, authState, onLogout } = useAuth()

    useEffect(() => {

        const getStorePdvProfile = async () => {
            const PROF = await SecureStore.getItemAsync(PDVPROFILE);
            const _PDVPROFILE = JSON.parse(PROF ?? "")
            setEstePdv(_PDVPROFILE)
            console.log("_PDVPROFILE Store", _PDVPROFILE);
        }

        getStorePdvProfile()
    }, [])



    const PDVs: TpubPdvs[] = [
        {
            id: "oreiut",
            titulo: "PUDPDV-1",
            emPosse: "Gomes Alberto",
            situacao: false,
        },
        {
            id: "ç~klytpoit",
            titulo: "PUDPDV-2",
            emPosse: "Maria Estrela",
            situacao: false,
        },
        {
            id: "ç~priet",
            titulo: "PUDPDV-3",
            emPosse: "Pablo Vitor",
            situacao: false,
        },
    ]





    async function ativarPubPdv(pubpdv: TpubPdvs) {

        console.log(pubpdv);
        await SecureStore.setItemAsync(PDVPROFILE, JSON.stringify({ ...pubpdv }))



    }
    async function desativarPubPdv(pubpdv: TpubPdvs) {

        console.log(pubpdv);
        await SecureStore.deleteItemAsync(PDVPROFILE)

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
                                            Pub do Luiz B.
                                        </Text>
                                    </View>
                                </View>
                                <View className='py-2'>

                                    <View>
                                        <Text className='text-sm  text-white'>
                                            CNPJ
                                        </Text>
                                        <Text className='text-lg  text-white'>
                                            12.456.456./001-23.
                                        </Text>
                                    </View>
                                    <View>
                                        <Text className='text-sm  text-white'>
                                            Gerente
                                        </Text>
                                        <Text className='text-lg  text-white'>
                                            Luiz da Silvaxx
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View className='border border-lime-500 bg-lime-100 rounded-2xl'>
                                <View className='p-4 border-b border-lime-500'>
                                    <Text className='font-bold text-2xl'>
                                        Este PDV
                                    </Text>
                                    <Text className='text-lg'>
                                        {estePdv?.titulo}
                                    </Text>
                                </View>

                                <View className='p-4'>
                                    <View>
                                        <Text className='text-sm'>
                                            Em pose de:
                                        </Text>
                                        <Text className='text-lg'>
                                            {estePdv?.emPosse}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text className='text-sm'>
                                            Situação
                                        </Text>
                                        <Text className='text-lg'>
                                            {estePdv?.situacao}
                                        </Text>
                                    </View>
                                </View>

                                <View className='w-full flex flex-row justify-between items-center'>
                                    <Button label="DESATIVAR"
                                        labelClasses="font-semibold text-lg text-white"
                                        className="w-full rounded-b-2xl bg-pink-600"
                                    />
                                </View>
                            </View>



                            <View>
                                {
                                    PDVs.map((p: TpubPdvs, i: number) => (

                                        <View
                                            key={p.id}
                                            className='my-4 flex flex-col items-center gap-4'>
                                            <View className='border border-slate-500 rounded-2xl w-full'>
                                                <View className='p-4 border-b border-slate-500'>
                                                    <Text className='font-bold text-2xl'>
                                                        PDV
                                                    </Text>
                                                    <Text className='text-lg'>
                                                        {p.titulo}
                                                    </Text>
                                                </View>

                                                <View className='p-4'>
                                                    <View>
                                                        <Text className='text-sm'>
                                                            Em pose de:
                                                        </Text>
                                                        <Text className='text-lg'>
                                                            {p.emPosse}
                                                        </Text>
                                                    </View>
                                                    <View>
                                                        <Text className='text-sm'>
                                                            Situação
                                                        </Text>
                                                        <Text className='text-lg'>
                                                            {p.situacao}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View className='w-full flex flex-row justify-between items-center'>
                                                    {p.situacao ?

                                                        <Button label="DESATIVAR"
                                                            onPress={() => ativarPubPdv(p)}
                                                            labelClasses="font-semibold text-lg"
                                                            className="w-full rounded-b-2xl bg-red-500"
                                                        />
                                                        :

                                                        <Button label="ATIVAR"
                                                            onPress={() => ativarPubPdv(p)}
                                                            labelClasses="font-semibold text-lg"
                                                            className="w-full rounded-b-2xl bg-lime-500"
                                                        />
                                                    }


                                                </View>
                                            </View>

                                        </View>

                                    ))
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
