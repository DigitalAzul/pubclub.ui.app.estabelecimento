import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import useAuthStore from '../../src/zStore/AuthSore';


export default function Ajuda() {

    const { resetPassPdv, session } = useAuthStore()
    const [password, setPassword] = useState('') // 12345
    const [trocaSenhaForm, setTrocaSenhaForm] = useState(false) // 

    const _resetPassPdv = async () => {
        console.log('session', session);

        if (password.length < 3) {
            Alert.alert(
                'VALIDAÇÃO',
                'A senha deve possuir mais de 3 caracteres!',
            );
        }
        if (session?.role == 'PDV') {
            console.log(session.user_id);
            console.log(password);
            const res = await resetPassPdv(session.user_id, password)
            if (res?.error) {

            } else {
                Alert.alert(
                    'INFORMAÇÃO',
                    'Senha alterada com sucesso!',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                router.replace({
                                    pathname: '../screens/pdv',

                                })
                            },
                            style: 'default',
                        },
                    ],

                );
            }

        }
    }


    return (
        <SafeAreaProvider style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>

                <ScrollView className='px-4'>
                    <View className='px-3 py-6'>
                        <Text className='text-2xl font-semibold'>PDV</Text>
                        <Text className='text-lg'>Usuário: {session?.nome}</Text>
                    </View>
                    <View
                        className={`w-full min-h-[80px] border-slate-400  shadow-2xl bg-white p-2 px-6 my-5 flex flex-col ${trocaSenhaForm ? 'rounded-3xl' : 'rounded-full'}`}
                    >
                        <View className='flex flex-row justify-between items-center p-4'>
                            <View className='flex flex-row justify-start items-center gap-6'>
                                <Text className='text-xl font-bold'>Trocar Senha</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setTrocaSenhaForm(!trocaSenhaForm)}
                                className='p-2 rounded-3xl bg-slate-50'>
                                {trocaSenhaForm ?
                                    <MaterialIcons name="keyboard-arrow-up" size={26} color="black" />
                                    :
                                    <MaterialIcons name="keyboard-arrow-down" size={26} color="black" />
                                }
                            </TouchableOpacity>

                        </View>
                        <View>
                            {trocaSenhaForm &&
                                <View className=' flex flex-row justify-center items-center'>
                                    <View style={{ width: '100%', flexDirection: 'column', alignItems: 'center', paddingTop: 10 }}>

                                        <View className='mx-6 p-6 bg-slate-200 rounded-3xl mt-6'>
                                            <Text style={{ fontSize: 14, fontWeight: '300', paddingLeft: 16 }}>Nova senha</Text>
                                            <View
                                                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: "#FFF", borderRadius: 25, height: 45, paddingHorizontal: 20, marginTop: 5 }}
                                            >
                                                <TextInput
                                                    style={styles.input}
                                                    value={password}
                                                    onChangeText={(text: string) => setPassword(text)}
                                                    placeholder="Senha"
                                                    placeholderTextColor={"#8C8C8C"}
                                                    keyboardType="default"
                                                    autoCapitalize="none"
                                                />
                                            </View>

                                        </View>


                                        <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginVertical: 25 }}>



                                            <TouchableOpacity
                                                className='flex flex-row justify-center items-center bg-slate-300 text-white w-[80%] h-[70px] rounded-full'
                                                onPress={() => _resetPassPdv()}
                                            >
                                                <Text>TROCAR</Text>
                                            </TouchableOpacity>




                                        </View>
                                    </View>

                                </View>
                            }
                        </View>




                    </View>



                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
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