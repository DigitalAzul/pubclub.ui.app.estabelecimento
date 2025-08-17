import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from 'expo-router';
import { operadorMembros } from "../../src/types/operadores";
import { Tdevice } from "../../src/types/pubProfile";
import useAuthStore from '../../src/zStore/AuthSore';
import useDbStore from '../../src/zStore/dbStore';

const PDVPROFILE = 'PDVPROFILE';




export default function Pdvs() {

    const scrollViewRef = useRef<ScrollView>(null);


    const [nome, setNome] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [id, setId] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [formAddOpen, setFormAddOpen] = useState(false)
    const [formAddEmdicao, setFormAddEmdicao] = useState(false)
    const [tab, setTab] = useState<'PDV' | 'CAIXA' | 'BALCAO'>('PDV')
    const [operadorSelecionado, setOperadorSelecionado] = useState<operadorMembros | null>()


    const isFocused = useIsFocused();

    const { getPubProfile, tokem, pubProfile } = useAuthStore()
    const { pdvs, ativarPdv, getPdvsPorPubID, desativarPdv, getUsersRolePdv, usersRolePdv, createUsersRoleOP, editaUsersRoleOP, desativaUsersRoleOP } = useDbStore()


    useEffect(() => {

        if (operadorSelecionado) {
            setNome(operadorSelecionado?.nome)
            setId(operadorSelecionado?.id)
            setEmail(operadorSelecionado?.email)

        }
    }, [operadorSelecionado])



    const i = async () => {
        const f = await getPubProfile()

        if (f?.pubProfile.id && tokem) {
            getPdvsPorPubID(f.pubProfile.id, tokem)
            await getUsersRolePdv(f.pubProfile.id)
        } else {
            alert("PDV não ativado")
        }
    }
    useEffect(() => {
        i();
    }, [isFocused])


    async function createUsersOP() {
        const f = await getPubProfile()
        let role = ''
        if (tab == 'PDV') {
            role = 'PDV'
        }

        if (tab == 'BALCAO') {
            role = 'BALCAO'
        }

        // if (tab == 'CAIXA') {
        //     role = 'CAIXA'
        // }

        if (f?.pubProfile.id && tokem && nome && password) {
            setOperadorSelecionado(null)
            const c = await createUsersRoleOP(f?.pubProfile.id, nome, password, role, tokem)

            if (!c.error) {
                Alert.alert('Operador criado')
                await getUsersRolePdv(f.pubProfile.id)
                setFormAddEmdicao(false)
                setFormAddOpen(false)
            } else {
                Alert.alert(c.msg)

            }
        }
    }
    async function editaUsersRoleOPFunc() {
        const f = await getPubProfile()
        // let role = ''
        // if (tab == 'PDV') {
        //     role = 'PDV'
        // }

        // if (tab == 'CAIXA') {
        //     role = 'CAIXA'
        // }


        const dominio = email.split('@')
        let _email = `${nome.trim()}@${dominio[1]}`



        if (f?.pubProfile.id && tokem) {
            setOperadorSelecionado(null)
            const c = await editaUsersRoleOP(id, _email, nome, password, tokem)

            if (!c.error) {
                Alert.alert('Operador Editado')
                await getUsersRolePdv(f.pubProfile.id)
                setFormAddEmdicao(false)
                setFormAddOpen(false)
            } else {
                Alert.alert(c.msg)

            }
        }
    }



    const promptAtivar = async () => {

        Alert.alert(
            'AVISO',
            ` Deseja ${operadorSelecionado?.situacao == 'ATIVO' ? 'DESATIVAR este Operador?' : 'ATIVA este operador'}`,
            [
                {
                    text: 'Não',
                    onPress: () => { return false },
                    style: 'cancel',
                },
                {
                    text: 'Sim',
                    onPress: () => ativarUsersRoleOPFunc(),
                    style: 'default',
                },
            ],

        );
    }
    async function ativarUsersRoleOPFunc() {

        const situacao = operadorSelecionado?.situacao == 'ATIVO' ? 'INATIVO' : 'ATIVO';

        const f = await getPubProfile()

        if (f?.pubProfile.id && tokem) {
            setOperadorSelecionado(null)
            const c = await desativaUsersRoleOP(id, situacao, tokem)

            if (!c.error) {
                Alert.alert('Operador Editado')
                await getUsersRolePdv(f.pubProfile.id)
                setFormAddEmdicao(false)
                setFormAddOpen(false)
            } else {
                Alert.alert(c.msg)

            }
        }

    }

    const promptExcluir = async () => {

        Alert.alert(
            'AVISO',
            ` Deseja EXCLUIR este operador'}`,
            [
                {
                    text: 'Não',
                    onPress: () => { return false },
                    style: 'cancel',
                },
                {
                    text: 'Sim',
                    onPress: () => excluirUsersRoleOPFunc(),
                    style: 'default',
                },
            ],

        );
    }
    async function excluirUsersRoleOPFunc() {

        const f = await getPubProfile()

        if (f?.pubProfile.id && tokem) {
            setOperadorSelecionado(null)
            const c = await desativaUsersRoleOP(id, 'EXCLUIDO', tokem)

            if (!c.error) {
                Alert.alert('Operador Editado')
                await getUsersRolePdv(f.pubProfile.id)
                setFormAddEmdicao(false)
                setFormAddOpen(false)
            } else {
                Alert.alert(c.msg)

            }
        }

    }

    function setTabFunction(tab: 'PDV' | 'CAIXA' | 'BALCAO') {
        setTab(tab);
        setNome("")
        setPassword("")
        setFormAddEmdicao(false)
    }

    const onScrollToTop = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current?.scrollTo({ y: 0, animated: true }); //animated: true for smooth scrolling
        }
    };

    function editForm() {
        setFormAddOpen(true)
        setFormAddEmdicao(true)
        onScrollToTop()

    }
    function cancelForm() {
        setNome("")
        setPassword("")
        setFormAddOpen(false)
        setFormAddEmdicao(false)
    }

    function setCrtlOperador(o: operadorMembros) {
        if (operadorSelecionado?.id == o.id) {
            setOperadorSelecionado(null)
        } else {
            setOperadorSelecionado(o)
        }
    }
    const FormOp = () => {
        return (
            <View>
                <Text style={{ fontSize: 26, fontWeight: '700', paddingLeft: 16 }}>{formAddEmdicao ? 'Editando' : 'Novo'} {tab == 'PDV' && 'Garçom'} {tab == 'CAIXA' && 'Caixa'} {tab == 'BALCAO' && 'Balcao'}</Text>
                <View className='mx-2 p-6 pb-10 bg-slate-200 rounded-3xl mt-6 flex gap-3'>
                    <Text style={{ fontSize: 14, fontWeight: '300', paddingLeft: 16 }}>Nome</Text>
                    <View
                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: "#FFF", borderRadius: 25, height: 45, paddingHorizontal: 20, marginTop: 5 }}
                    >
                        <TextInput
                            style={styles.input}
                            value={nome}
                            onChangeText={(text: string) => setNome(text)}
                            placeholder="Nome"
                            placeholderTextColor={"#8C8C8C"}
                            keyboardType="default"
                            autoCapitalize="none"
                        />
                    </View>


                    <Text style={{ fontSize: 14, fontWeight: '300', paddingLeft: 16 }}>Código</Text>
                    <View
                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: "#FFF", borderRadius: 25, height: 45, paddingHorizontal: 20, marginTop: 5 }}
                    >
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={(text: string) => setPassword(text)}
                            placeholder="Código"
                            placeholderTextColor={"#8C8C8C"}
                            keyboardType="default"
                            autoCapitalize="none"
                        />
                    </View>


                </View>
                <View
                >
                    <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginVertical: 25, gap: 18 }}>

                        {formAddEmdicao ?
                            <TouchableOpacity
                                className='flex flex-row justify-center items-center bg-slate-300 text-white w-[80%] h-[70px] rounded-full'
                                onPress={() => editaUsersRoleOPFunc()}
                            >
                                <Text>SALVAR EDIÇÃO</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                className='flex flex-row justify-center items-center bg-slate-300 text-white w-[80%] h-[70px] rounded-full'
                                onPress={() => createUsersOP()}
                            >
                                <Text>CRIAR</Text>
                            </TouchableOpacity>
                        }

                        <TouchableOpacity
                            className='flex flex-row justify-center items-center bg-slate-200 text-white w-[80%] h-[70px] rounded-full'
                            onPress={() => cancelForm()}
                        >
                            <Text>CANCELAR</Text>
                        </TouchableOpacity>




                    </View>
                </View>
            </View>
        )
    }


    const ativarPDV = (pdvProfile: Tdevice) =>
        Alert.alert(
            'ATIVAÇÃO DE PDV',
            'Deseja ativar este PDV ?',
            [
                {
                    text: 'Cancelar',
                    //onPress: () => Alert.alert('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Sim',
                    onPress: () => ativarPubPdv(pdvProfile),
                    style: 'default',
                },
            ],

        );


    async function ativarPubPdv(pubpdv: Tdevice) {

        const f = await getPubProfile()

        if (f?.pubProfile.id) {

            const x = await ativarPdv(pubpdv);
            if (x) {
                alert('PDV ativado')
                router.replace('/(admin)')
            } else {
                alert("Falha ao ativar PDV.")
            }
        } else {
            alert("Falha ao ativar PDV.")
        }

    }




    const _desativarPDV = (pdvProfile: Tdevice) =>
        Alert.alert(
            'DESATIVAR DE PDV',
            'Deseja desativar este PDV ?',
            [
                {
                    text: 'Cancelar',
                    //onPress: () => Alert.alert('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Sim',
                    onPress: () => desativarPubPdv(pdvProfile),
                    style: 'default',
                },
            ],

        );
    async function desativarPubPdv(pubpdv: Tdevice) {

        desativarPdv(pubpdv)
        // recarrega PDVs
        i();
        //await SecureStore.deleteItemAsync(PDVPROFILE)

    }






    return (

        <SafeAreaProvider style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>

                <ScrollView ref={scrollViewRef}
                >
                    <View
                        className='pt-10 px-4'
                    >
                        <View className='flex flex-row justify-between items-center'>
                            <View>
                                <Text className='text-2xl'>Lista de</Text>
                                <Text className='text-[50px] font-medium -translate-y-3'>OPERADORES</Text>
                            </View>


                        </View>

                        <View>

                            {formAddOpen &&
                                <View className="border border-slate-400 rounded-xl py-6 px-2 my-10 ">

                                    {FormOp()}

                                </View>
                            }


                            <View className=" mt-14">
                                <View className="flex flex-row items-center gap-4 px-3  mb-10">
                                    <TouchableOpacity
                                        onPress={() => setTabFunction('PDV')}
                                        className={`p-4 rounded-full  w-1/2 flex justify-center flex-row ${tab == 'PDV' ? 'bg-slate-400' : 'bg-slate-200'}`}>
                                        <Text className={`${tab == 'PDV' ? 'text-white' : 'text-black'}`}>GARÇONS</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setTabFunction('BALCAO')}
                                        className={`p-4 rounded-full  w-1/2 flex justify-center flex-row ${tab == 'BALCAO' ? 'bg-slate-400' : 'bg-slate-200'}`}>
                                        <Text className={`${tab == 'BALCAO' ? 'text-white' : 'text-black'}`}>BALCÃO</Text>
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity
                                        onPress={() => setTabFunction('CAIXA')}
                                        className={`p-4 rounded-full  w-1/2 flex justify-center flex-row ${tab == 'CAIXA' ? 'bg-slate-400' : 'bg-slate-200'}`}>
                                        <Text className={`${tab == 'CAIXA' ? 'text-white' : 'text-black'}`}>CAIXAS</Text>
                                    </TouchableOpacity> */}
                                </View>


                                {tab == 'PDV' &&
                                    <View className="flex flex-col gap-4">

                                        {usersRolePdv.pdv.map((g: operadorMembros) => (
                                            <View
                                                key={g.id}
                                                className={`p-4 rounded-xl ${g.situacao == 'ATIVO' ? 'bg-slate-300' : 'bg-red-300'}`}>
                                                <View className="flex flex-row justify-between items-center">
                                                    <View>
                                                        <Text className='text-sm'>
                                                            NOME/GARÇOM
                                                        </Text>
                                                        <Text className='font-bold text-2xl'>
                                                            {g.nome}
                                                        </Text>
                                                    </View>
                                                    <View>
                                                        <TouchableOpacity
                                                            onPress={() => setCrtlOperador(g)}
                                                            className='p-2 rounded-3xl bg-slate-200'>
                                                            <MaterialIcons name="more-vert" size={32} color="black" />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                {g.id == operadorSelecionado?.id &&

                                                    <View className="flex flex-row gap-3 justify-end mt-6 border-t border-white pt-4">
                                                        <TouchableOpacity
                                                            onPress={() => editForm()}
                                                            className='rounded-lg bg-white p-2 px-6'>

                                                            <Text className="">Editar</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => promptAtivar()}
                                                            className='rounded-lg bg-white p-2 px-6'>

                                                            <Text className="">{operadorSelecionado.situacao == 'ATIVO' ? 'Desativar' : 'Ativar'}</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => promptExcluir()}
                                                            className='rounded-lg bg-white p-2 px-6'>

                                                            <Text className="">Excluir</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                }

                                            </View>
                                        ))}

                                        <View className="mb-[70px]">
                                            <TouchableOpacity
                                                onPress={() => { setFormAddOpen(true), setNome(""), setPassword(""), setOperadorSelecionado(null) }}
                                                className='p-6 rounded-2xl bg-slate-500 flex flex-row items-center justify-center'>

                                                <Text className="text-xl text-white font-semibold">NOVO GARÇOM</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                }

                                {tab == 'BALCAO' &&
                                    <View className="flex flex-col gap-4">
                                        {usersRolePdv.balcao.map((g: operadorMembros) => (
                                            <View
                                                key={g.id}
                                                className={`p-4 rounded-xl ${g.situacao == 'ATIVO' ? 'bg-slate-300' : 'bg-red-300'}`}>
                                                <View className="flex flex-row justify-between items-center">
                                                    <View>
                                                        <Text className='text-sm'>
                                                            NOME/BALCÃO
                                                        </Text>
                                                        <Text className='font-bold text-2xl'>
                                                            {g.nome}
                                                        </Text>
                                                    </View>
                                                    <View>
                                                        <TouchableOpacity
                                                            onPress={() => setCrtlOperador(g)}
                                                            className='p-2 rounded-3xl bg-slate-200'>
                                                            <MaterialIcons name="more-vert" size={32} color="black" />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                {g.id == operadorSelecionado?.id &&

                                                    <View className="flex flex-row gap-3 justify-end mt-6 border-t border-white pt-4">
                                                        <TouchableOpacity
                                                            onPress={() => editForm()}
                                                            className='rounded-lg bg-white p-2 px-6'>

                                                            <Text className="">Editar</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => promptAtivar()}
                                                            className='rounded-lg bg-white p-2 px-6'>

                                                            <Text className="">{operadorSelecionado.situacao == 'ATIVO' ? 'Desativar' : 'Ativar'}</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => promptExcluir()}
                                                            className='rounded-lg bg-white p-2 px-6'>

                                                            <Text className="">Excluir</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                }

                                            </View>
                                        ))}

                                        <View>
                                            <TouchableOpacity
                                                onPress={() => { setFormAddOpen(true), setNome(""), setPassword(""), setOperadorSelecionado(null) }}
                                                className='p-6 rounded-2xl bg-slate-500 flex flex-row items-center justify-center'>

                                                <Text className="text-xl text-white font-semibold">NOVO BALCÃO</Text>
                                            </TouchableOpacity>
                                        </View>
                                        {/* <View>
                                            <TouchableOpacity
                                                onPress={() => { setFormAddOpen(true), setNome(""), setPassword(""), setOperadorSelecionado(null) }}
                                                className='p-6 rounded-2xl bg-slate-500 flex flex-row items-center justify-center'>

                                                <Text className="text-xl text-white font-semibold">NOVO CAIXA</Text>
                                            </TouchableOpacity>
                                        </View> */}
                                    </View>
                                }
                                {/* {tab == 'CAIXA' &&
                                    <View className="flex flex-col gap-4">
                                        {usersRolePdv.caixa.map((g: operadorMembros) => (
                                            <View
                                                key={g.id}
                                                className={`p-4 rounded-xl ${g.situacao == 'ATIVO' ? 'bg-slate-300' : 'bg-red-300'}`}>
                                                <View className="flex flex-row justify-between items-center">
                                                    <View>
                                                        <Text className='text-sm'>
                                                            NOME/CAIXA
                                                        </Text>
                                                        <Text className='font-bold text-2xl'>
                                                            {g.nome}
                                                        </Text>
                                                    </View>
                                                    <View>
                                                        <TouchableOpacity
                                                            onPress={() => setCrtlOperador(g)}
                                                            className='p-2 rounded-3xl bg-slate-200'>
                                                            <MaterialIcons name="more-vert" size={32} color="black" />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                {g.id == operadorSelecionado?.id &&

                                                    <View className="flex flex-row gap-3 justify-end mt-6 border-t border-white pt-4">
                                                        <TouchableOpacity
                                                            onPress={() => editForm()}
                                                            className='rounded-lg bg-white p-2 px-6'>

                                                            <Text className="">Editar</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => promptAtivar()}
                                                            className='rounded-lg bg-white p-2 px-6'>

                                                            <Text className="">{operadorSelecionado.situacao == 'ATIVO' ? 'Desativar' : 'Ativar'}</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => promptExcluir()}
                                                            className='rounded-lg bg-white p-2 px-6'>

                                                            <Text className="">Excluir</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                }

                                            </View>
                                            // <View
                                            //     key={g.id}
                                            //     className='p-4 bg-slate-300 py-10 rounded-xl'>
                                            //     <Text className='font-bold text-sm'>
                                            //         CAIXA
                                            //     </Text>
                                            //     <Text className='font-bold text-2xl'>
                                            //         {g.nome}
                                            //     </Text>

                                            // </View>
                                        ))}

                                        <View>
                                            <TouchableOpacity
                                                onPress={() => { setFormAddOpen(true), setNome(""), setPassword(""), setOperadorSelecionado(null) }}
                                                className='p-6 rounded-2xl bg-slate-500 flex flex-row items-center justify-center'>

                                                <Text className="text-xl text-white font-semibold">NOVO CAIXA</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                } */}

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
    input: {
        width: '100%',
        color: "#000",

        letterSpacing: 0.5,
        fontSize: 16,

    },


});


const styles2 = StyleSheet.create({
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