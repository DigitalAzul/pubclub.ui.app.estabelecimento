

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAudioPlayer } from 'expo-audio';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import useAuthStore from '../../src/zStore/AuthSore';
import useDbStore from '../../src/zStore/dbStore';
const audio_1 = require('@/assets/sino_1.mp3');

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

    const player = useAudioPlayer(audio_1);

    // setInterval(() => {
    //     const t = player.currentStatus
    //     console.log(t.currentTime)
    //     if (t.currentTime > 0) {
    //         player.seekTo(0);

    //     }
    //     player.play();
    // }, 10000)

    // const conectWebSocket = () => {
    //     let headers: any = [];
    //     headers["Connection"] = "Upgrade";
    //     headers["Upgrade"] = "websocket";
    //     headers["Sec-WebSocket-Key"] = "x3JJHMbDL1EzLkh9GBhXDw==";
    //     headers["Sec-WebSocket-Version"] = "13";

    //     const ws = new WebSocket("ws://192.168.0.18:8000/bolinha", { ...headers });


    //     console.log("WebSocket connection opened", ws);
    //     ws.onopen = () => {
    //         console.log("WebSocket connection opened");
    //         ws.send('Origem do cliente')
    //     };

    //     ws.onmessage = (e) => {
    //         console.log("Message from server:", e);

    //     };

    //     ws.onerror = (e) => {
    //         console.log("WebSocket error:", e);
    //     };
    // }
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
                            <Button
                                title="Replay Sound"
                                onPress={() => {
                                    player.seekTo(0);
                                    player.play();
                                }}
                            />
                        </View>
                    </View>

                    <View className='p-4'>
                        <View className='flex flex-row justify-around items-center rounded-xl border border-slate-300 py-4'>

                            <Text className='text-xl font-bold'>AGARDANDO CLUBE</Text>

                        </View>

                        <View>
                            <View
                                className='border border-slate-400 p-4 rounded-2xl'>

                                <View className='flex flex-row justify-between'>
                                    <View>
                                        <Text className='text-sm font-bold'>CLUBE</Text>
                                        <Text className='text-xl font-bold'>Jonh Walker</Text>
                                    </View>
                                    <View>
                                        <Text className='text-3xl font-bold'>10</Text>
                                        <Text className='text-sm font-bold'>DOSES</Text>
                                    </View>

                                </View>
                                <View>
                                    <Text className='text-sm font-bold'>CLIENTE</Text>
                                    <Text className='text-xl font-bold'>Luiz B.</Text>
                                </View>
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
