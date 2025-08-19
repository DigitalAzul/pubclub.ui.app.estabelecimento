

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAudioPlayer } from 'expo-audio';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';


import { TsepararClubeResponse } from '@/src/types/separarClube';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

type TClubesAseparar = {
    id: string;
    titulo: string;
}
export default function Index() {



    const { getPubProfile, pubProfile, tokem } = useAuthStore()
    const { getClubesPorPubID, clubes, pdvProfile, getPdvProfile, getMesasPorPubID, pubSelecionadoDB, getClubesAseparar, definirSeparado } = useDbStore();

    const [clubesAseparar, setClubesAseparar] = useState<TsepararClubeResponse[]>([])

    const player = useAudioPlayer(audio_1);


    // PUSH NOTIFICATION
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
        undefined
    );


    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });

    function handleRegistrationError(errorMessage: string) {
        alert(errorMessage);
        throw new Error(errorMessage);
    }

    async function registerForPushNotificationsAsync() {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                handleRegistrationError('Permission not granted to get push token for push notification!');
                return;
            }
            const projectId =
                Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
            if (!projectId) {
                handleRegistrationError('Project Requerido!');
            }
            try {
                const pushTokenString = (
                    await Notifications.getExpoPushTokenAsync({
                        projectId,
                    })
                ).data;
                console.log('pushTokenString', pushTokenString);
                return pushTokenString;
            } catch (e: unknown) {
                handleRegistrationError(`${e}`);
            }
        } else {
            handleRegistrationError('Must use physical device for push notifications');
        }
    }

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(token => setExpoPushToken(token ?? ''))
            .catch((error: any) => setExpoPushToken(`${error}`));

        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
            player.play();
            console.log('setNotification', notification.request.content.data)
            _getClubesAseparar()
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });


        console.log('expoPushToken', expoPushToken)
        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, []);
    // PUSH NOTIFICATION


    useEffect(() => {



        const i = async () => {
            //const f = await getPubProfile()
            await getPubProfile()
            await getPdvProfile()
            await _getClubesAseparar()


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

    async function _getClubesAseparar() {

        if (pubProfile?.id) {

            const c = await getClubesAseparar(pubProfile?.id)

            if (c.length > 0) player.play();
            setClubesAseparar(c)
        }
    }

    function _definirSeparado(tituloClube: string, id: string) {

        Alert.alert(
            `${tituloClube.toUpperCase()}`,
            'Definir como entregue ao garçom',
            [
                {
                    text: 'Não',
                    onPress: () => console.log(),
                    style: 'default',
                },
                {
                    text: 'Sim',
                    onPress: () => t(),
                    style: 'default',
                },
            ],

        );

        const t = async () => {
            const c = await definirSeparado(id)
            console.log('_getClubesAseparar', c)
            if (c) {
                _getClubesAseparar()
            }
        }

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
                            {/* <Button
                                title="Replay Sound"
                                onPress={() => {
                                    player.seekTo(0);
                                    player.play();
                                    _getClubesAseparar();
                                }}
                            /> */}
                        </View>
                    </View>

                    <View className='p-4 rounded-2xl bg-slate-300 mx-3'>
                        <View className='flex flex-row justify-around items-center   pt-4 pb-10'>

                            <Text className='text-3xl font-bold'>CLUBES A SEPARAR</Text>

                        </View>

                        <View className='flex flex-col gap-4'>
                            {clubesAseparar.map((c: TsepararClubeResponse) => (
                                <View
                                    key={c.id}
                                    className='bg-white border border-slate-200 p-4 rounded-2xl'>

                                    <View className='flex flex-row justify-between'>
                                        <View>
                                            <Text className='text-sm font-bold'>CLUBE</Text>
                                            <Text className='text-xl font-bold'>{c.meusClubes.titulo}</Text>
                                        </View>
                                        <View>
                                            <Text className='text-3xl font-bold'>{c.meusClubes.doses_consumidas > 0 ? (c.meusClubes.doses - c.meusClubes.doses_consumidas) : 0}</Text>
                                            <Text className='text-sm font-bold'>Doses</Text>
                                        </View>

                                    </View>
                                    <View className='flex flex-row justify-between border-b border-slate-500 pb-5'>

                                        <View>
                                            <Text className='text-sm font-bold'>CLIENTE</Text>
                                            <Text className='text-xl font-bold'>{c.meusClubes.roleUserApp.user.nome}</Text>
                                        </View>
                                        <View>
                                            <Text className='text-sm font-bold'>GARÇON</Text>
                                            <Text className='text-xl font-bold'>{c.roleUserPdv.user.nome}</Text>
                                        </View>
                                    </View>
                                    <View className='mt-4'>
                                        <TouchableOpacity
                                            className='flex flex-row justify-center p-2 px-4 w-full bg-slate-400 rounded-2xl'
                                            onPress={() => {
                                                _definirSeparado(c.meusClubes.titulo, c.id)
                                            }}
                                        >
                                            <Text className='text-lg font-bold text-white'>Já separei</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            )
                            )}

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
