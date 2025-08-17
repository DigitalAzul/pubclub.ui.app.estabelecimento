import { router } from 'expo-router';

import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';



import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import useAuthStore from '../../src/zStore/AuthSore';
import useDbStore from '../../src/zStore/dbStore';



export default function IdentificacaoF1() {
    const [ddd, setDDD] = useState("")
    const [telefone, setTelefone] = useState("")
    const [codigo, setCodigo] = useState("")
    const [emCapitura, setEmCapitura] = useState(false);
    const [onCodigo, setOnCodigo] = useState(false);
    const [modoAuth, setModoAuth] = useState("");
    const [emFetch, setEmFetch] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();

    const { pubProfile } = useAuthStore()
    const { getMeusClubesPorCodigo, getMeusClubesPorQRcode, userAppAtual } = useDbStore()
    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View className='p-6 flex-1 justify-center items-center w-full'>
                <View className='p-6 bg-slate-300 rounded-3xl w-full'>
                    <Text >Permita a aceso a camera do aparelho para poder ler o QRCODE. </Text>
                    <Button
                        className='w-full h-14 bg-slate-400 mt-10 rounded-2xl'
                        onPress={requestPermission} label='Permirtir' />
                </View>
            </View>
        );
    }


    function setAuthMode(modo: string) {
        if (modo == "CODIGO") {
            setModoAuth("CODIGO")
            setOnCodigo(!onCodigo)
        }
        if (modo == "QRCODE") {
            setModoAuth("QRCODE")
            setEmCapitura(!emCapitura)
        }
    }

    const scanerQrcode = async (qrcode: any) => {
        console.log(qrcode.data);
        setEmCapitura(false)
        if (qrcode.data && pubProfile) {
            const _meusClubes = await getMeusClubesPorQRcode(qrcode.data, pubProfile?.id)
            if (_meusClubes) {
                setDDD("");
                setTelefone("");
                setCodigo("");
                router.push({
                    pathname: '/transacoes/clubeList_f2',

                })
            }


        }

    }


    async function intentificaPorCodigo() {

        if (pubProfile) {
            const _meusClubes = await getMeusClubesPorCodigo(ddd, telefone, codigo, pubProfile?.id)
            if (_meusClubes) {
                setDDD("");
                setTelefone("");
                setCodigo("");
                router.push({
                    pathname: '/transacoes/clubeList_f2',
                })
            }
        }

    }

    return (
        <View style={{ flex: 1 }}>

            <View
                className='pt-10 px-4'
            >
                <View className='pb-6'>
                    <Text className='text-2xl'>Iniciar</Text>
                    <Text className='text-[50px] font-medium -translate-y-3'>Identificação</Text>
                </View>
            </View>

            <View className={`my-6 px-4 ${emFetch ? 'opacity-30 animate-pulse' : 'opacity-100'}`}>
                <Text className='text-xl'>Opções de identificação: </Text>

                <View className='mt-6 flex flex-col justify-center gap-6'>

                    {!onCodigo &&
                        <View

                            className={`w-full min-h-[80px] border-slate-400  shadow-2xl bg-white p-2 px-6 flex flex-col ${emCapitura ? 'rounded-3xl' : 'rounded-full'}`}
                        >
                            <View className='flex flex-row justify-between items-center p-4'>
                                <View className='flex flex-row justify-start items-center gap-6'>
                                    <MaterialCommunityIcons name="qrcode-scan" size={30} color="black" />
                                    <Text className='text-xl font-bold'>QRCODE</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setAuthMode("QRCODE")}
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
                                            onBarcodeScanned={scanerQrcode}

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
                    {!emCapitura &&

                        <View
                            className={`w-full min-h-[80px] border-slate-400  shadow-2xl bg-white p-2 px-6 flex flex-col ${onCodigo ? 'rounded-3xl pb-6' : 'rounded-full'}`}>

                            <View className='flex flex-row justify-between items-center p-4'>
                                <View className='flex flex-row justify-start items-center gap-6'>

                                    <MaterialIcons name="password" size={30} color="black" />
                                    <Text className='text-xl font-bold'>CÓDIGO</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setAuthMode("CODIGO")}
                                    className='p-2 rounded-3xl bg-slate-50'>
                                    {onCodigo ?
                                        <MaterialIcons name="keyboard-arrow-up" size={26} color="black" />
                                        :
                                        <MaterialIcons name="keyboard-arrow-down" size={26} color="black" />
                                    }
                                </TouchableOpacity>
                            </View>
                            {onCodigo &&
                                <View className='flex flex-col justify-between p-4'>

                                    <View className='flex flex-row gap-3'>
                                        <Input
                                            value={ddd}
                                            onChangeText={(text: string) => setDDD(text)}
                                            className='w-[25%]'
                                            keyboardType="number-pad"
                                            label="DDD" placeholder="DDD"
                                            labelClasses=" font-semibold"
                                            inputClasses='text-2xl text-center'
                                            maxLength={2}
                                        />
                                        <Input
                                            value={telefone}
                                            onChangeText={(text: string) => setTelefone(text)}
                                            className='w-[71%]'
                                            keyboardType="number-pad"
                                            label="TELEFONE" placeholder="Apenas números"
                                            labelClasses=" font-semibold"
                                            inputClasses='text-xl'
                                        />
                                    </View>
                                    <View className='pt-3'>
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
                                            onPress={intentificaPorCodigo}
                                            className='h-14 w-[250px]  bg-slate-300 rounded-2xl m-3'
                                            label='Confirmar' />
                                    </View>
                                </View>
                            }


                        </View>
                    }

                </View>
            </View>




        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
