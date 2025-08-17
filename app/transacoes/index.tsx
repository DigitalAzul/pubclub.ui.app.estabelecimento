

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { CardClube } from '../../src/components/cards/CardClubes';


import { Tclubes } from '../../src/types/clubes';
import useAuthStore from '../../src/zStore/AuthSore';
import useDbStore from '../../src/zStore/dbStore';

// type Tclube = {
//     id: string,
//     titulo: string,
//     doses: number,
//     valor: GLfloat,
//     dose_debito: number,
//     dose_saldo: number,
//     imagem: string,
// }


export default function Index() {

    const { getPubProfile, pubProfile, tokem } = useAuthStore()
    const { getClubesPorPubID, clubes, pdvProfile, getPdvProfile, getMesasPorPubID, pubSelecionadoDB } = useDbStore();

    const [emCapitura, setEmCapitura] = useState(false);
    const [onCodigo, setOnCodigo] = useState(false);
    const [emFetch, setEmFetch] = useState(false);

    useEffect(() => {
        const i = async () => {
            //const f = await getPubProfile()
            await getPubProfile()
            await getPdvProfile()


            if (pubSelecionadoDB?.id && tokem) {
                await getClubesPorPubID(pubSelecionadoDB.id, tokem)
                await getMesasPorPubID(pubSelecionadoDB.id, tokem)
            } else {
                // alert("PDV não habilitado, favor solicite ao seu Gerente.")
                Alert.alert(
                    'PDV NÃO HABILITADO',
                    'Solicite ao gerente que habilite este PDV ',
                    [
                        {
                            text: 'Cancelar',
                            style: 'cancel',
                        },
                        {
                            text: 'Sim',
                            onPress: () => router.replace('/screens/gerente'),
                            style: 'default',
                        },
                    ],

                );

            }
        }
        i()
    }, [])




    function iniciarAtendimento() {
        router.push({
            pathname: '/transacoes/identificacao_f1'
        })
    }
    function ajuda() {
        router.push({
            pathname: '/transacoes/ajuda'
        })
    }

    return (
        <SafeAreaProvider style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>

                <ScrollView style={{ flex: 1 }}>

                    <View
                        className='pt-10 px-4 flex flex-row justify-between'
                    >
                        <View className='pb-6'>
                            <Text className='text-2xl'>PUB CLUBE</Text>
                            <Text className='text-[50px] font-medium -translate-y-3'>{pubSelecionadoDB?.razao_social}</Text>
                        </View>
                        <View>
                            <TouchableOpacity
                                onPress={ajuda}
                            >
                                <MaterialCommunityIcons name="help-circle-outline" size={40} color={'#64748b'} />
                            </TouchableOpacity>

                        </View>
                    </View>

                    <View className={`mb-6 ${clubes?.length == 0 ? ' opacity-30' : 'opacity-100'}`}>


                        <View className='mt-4 flex flex-col justify-center gap-6 px-3'>


                            {/* <TouchableOpacity

                                className='w-full min-h-[80px] border-slate-400  shadow-2xl bg-white p-2 flex flex-col rounded-3xl'
                                >
                                    <View className='flex flex-row justify-start items-center gap-6 p-4'>
                                        <MaterialCommunityIcons name="qrcode-scan" size={50} color="black" />
                                    <Text className='text-2xl font-bold'>LISTAR CLUBES</Text>
                                </View>

                            </TouchableOpacity> */}

                            <TouchableOpacity

                                onPress={iniciarAtendimento}
                                className='w-full min-h-[60px] bg-lime-500 shadow-2xl px-4 py-2 flex flex-col items-center rounded-3xl'
                            >
                                <View className='flex flex-row justify-start items-center gap-6 p-4'>
                                    <MaterialCommunityIcons name="qrcode-scan" size={30} color="black" />
                                    <View className='flex flex-col break-words w-[250px]'>
                                        <Text className='text-xl font-bold'>INICIAR ATENDIMENTO</Text>
                                        <Text className='text-sm italic mb-3'>
                                            Para clientes que já possuam clubes
                                        </Text>
                                    </View>

                                </View>

                            </TouchableOpacity>


                            <View className='flex flex-col gap-3 bg-white p-4 rounded-3xl'>

                                <View className='flex flex-row items-center justify-between'>
                                    <Text
                                        className='text-4xl font-semibold  pt-5'>Clubes disponíveis
                                    </Text>
                                </View>
                                <Text
                                    style={{ lineHeight: .5 }}
                                    className='text-sm italic leading-none mb-3'>Para novas aquisições, Selecione os clubes para inseri-los no carrinho </Text>


                                {
                                    clubes?.map((n: Tclubes, i: number) => (

                                        <CardClube
                                            key={n.id}
                                            clube={n}
                                            press={(c: Tclubes) => console.log(c)}
                                        />


                                    ))
                                }

                            </View>

                        </View>
                    </View>




                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
