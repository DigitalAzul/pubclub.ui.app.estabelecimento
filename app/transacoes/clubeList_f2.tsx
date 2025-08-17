import { router, useGlobalSearchParams } from 'expo-router';

import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { CardClubeCredito } from '../../src/components/cards/CardClubeCredito';
import { CardClubeDebito } from '../../src/components/cards/CardClubeDebito';



import { TcardClubeDebitoProps } from '../../src/types/cardClubeDebitoProps';
import { Tcliente } from '../../src/types/cliente';
import { TclubeCredito } from '../../src/types/clubeCredito';
import { Tpdv } from '../../src/types/pdv';


//import { Select } from '@/components/Select';
import { Tclubes } from '../../src/types/clubes';
import { Tmesa } from '../../src/types/mesas';
import useAuthStore from '../../src/zStore/AuthSore';
import useDbStore from '../../src/zStore/dbStore';

// type Tclube = {
//     id: string,
//     titulo: string,
//     doses: number,
//     valor: GLfloat,
//     doses_consumidas: number,
//     doses_restantes: number,
//     validade: number,
//     expira_em: Date,
//     imagem: string,
// }
// type TclubeCredito = {
//     id: string,
//     titulo: string,
//     doses: number,
//     quantidade: number,
//     valor: GLfloat,
//     imagem: string,

// }

let clubesCredito: TclubeCredito[] = [
    // {
    //     id: 'AAA',
    //     titulo: 'Red Label 1',
    //     doses: 20,
    //     valor: 123.33,
    //     quantidade: 0,

    //     imagem: 'string',

    // },
    // {
    //     id: 'BBB',
    //     titulo: 'Red Label 2',
    //     doses: 20,
    //     valor: 13.50,
    //     quantidade: 0,

    //     imagem: 'string',

    // },
    // {
    //     id: 'CCC',
    //     titulo: 'Red Label 3',
    //     doses: 20,
    //     valor: 90.00,
    //     quantidade: 0,

    //     imagem: 'string',

    // },

]
let clubesDebito: TcardClubeDebitoProps[] = [
    // {
    //     id: 'AAA',
    //     titulo: 'Red Label',
    //     doses: 20,
    //     valor: 123,
    //     dose_debito: 20,
    //     dose_saldo: 0,
    //     imagem: 'string'
    // },
    // {
    //     id: 'CCC',
    //     titulo: 'Red Label',
    //     doses: 20,
    //     valor: 123,
    //     dose_debito: 20,
    //     dose_saldo: 0,
    //     imagem: 'string'
    // },
    // {
    //     id: 'BBB',
    //     titulo: 'Red Label',
    //     doses: 20,
    //     valor: 123,
    //     dose_debito: 20,
    //     dose_saldo: 0,
    //     imagem: 'string'
    // },
]

let _aDebitar: TcardClubeDebitoProps[] = []
let _aCreditar: TclubeCredito[] = []
let _cliente: Tcliente
let _modoAuth: string




let _meusClubes: TcardClubeDebitoProps[] = []

export default function ClubeListF2() {

    const { clubes, pdvProfile, mesas, getMeusClubesPorCodigo, userAppAtual, getSituacaoPub } = useDbStore();
    const { pubProfile, getPubProfile } = useAuthStore();


    const [selectedCaixa, setSelectedCaixa] = useState("");
    const [mesasOPT, setMesasOPT] = useState<Tmesa[]>([]);



    //const { pubProfile } = useGetStore()


    const params = useGlobalSearchParams<{ cliente: string, meusClubes: string, modoAuth: string }>();



    const [_pdvProfile, setPdvProfile] = useState<Tpdv>()
    const [adebitar, setAdebitar] = useState<TcardClubeDebitoProps[]>([])
    const [clubesOPT, setClubesOPT] = useState<TclubeCredito[]>([])
    const [acreditar, setAcreditar] = useState<TclubeCredito[]>([])
    const [mesa, setMesa] = useState<string | number>()

    const [lengthClubes, setLengthClubes] = useState(0)

    const [tab, setTab] = useState("debitar") // debitar | creditar
    const [situacaoPub, setSituacaoPub] = useState("")


    type TmeusClupes = {
        "id": string,
        "titulo": string,
        "doses": number,
        "valor": number,
        "doses_consumidas": number,
        "validade": number,
        "expira_em": string,
        "imagem": string
    }

    // CONVERTE MEUS CLUBES DE DEBITO
    useEffect(() => {
        const _MC: TcardClubeDebitoProps[] = []
        let _mc: TcardClubeDebitoProps = {
            id: '',
            titulo: '',
            doses: 0,
            valor: 0,
            doses_consumidas: 0,
            doses_adebitar: 0,
            validade: 0,
            expira_em: undefined,
            imagem: ''
        }
        userAppAtual.clubes.map((c: TcardClubeDebitoProps) => {
            _mc = {
                id: c.id,
                titulo: c.titulo,
                doses: c.doses - c.doses_consumidas,
                valor: c.valor,
                doses_consumidas: 0,
                doses_adebitar: 0,
                validade: c.validade,
                expira_em: undefined,
                imagem: c.imagem
            }
            _MC.push(_mc)
        })
        _meusClubes = _MC
    }, [userAppAtual])


    useEffect(() => {
        const i = async () => {
            // set clubes
            if (clubes) {
                console.log('set clubes', clubes);
                let tmpClubes: TclubeCredito[] = []
                clubes.map((i: Tclubes) => {
                    const c = {
                        id: i.id,
                        expira_em: null,
                        validade: i.validade,
                        criado_em: i.criado_em,
                        ativo: i.ativo,
                        titulo: i.titulo,
                        doses: i.doses,
                        imagem: i.imagem,
                        valor: i.valor,
                        pubs_id: i.pubs_id,
                        quantidade: 0,
                    }
                    tmpClubes.push(c)
                })
                setClubesOPT(tmpClubes)
            }

        }

        i()
    }, [])

    useEffect(() => {
        const i = async () => {
            // OBTEM A SITUACAO DO PUB
            if (pubProfile?.id) {
                const x = await getSituacaoPub(pubProfile?.id);
                setSituacaoPub(x)
                console.log(clubesOPT);
            }
        }
        i();
    }, [tab])









    // FUNCOES DE DEBITAR CLIENTE
    async function addDebito(clube: TcardClubeDebitoProps) {

        _aDebitar = adebitar
        const IDX = _aDebitar.findIndex((c: TcardClubeDebitoProps) => c.id == clube.id)

        if (IDX == -1) {
            _aDebitar.push(clube)
        } else {
            await _aDebitar.splice(IDX, 1)
            _aDebitar.push(clube)
        }


        let c: TcardClubeDebitoProps[] = []
        adebitar.map((ad: TcardClubeDebitoProps) => {
            if (ad.doses_adebitar > 0)
                c.push(ad)
        })
        setAdebitar([...c])



    }

    async function finalizarDebito() {

        if (adebitar.length == 0) {
            Alert.alert('Creditar Clube', 'Não há clube selecionado, insira a quantidade em algum clube pra continuar!')

            return
        }


        router.push({
            pathname: './debitarClubes',
            params: {
                clubes: JSON.stringify(adebitar),
                // cliente: JSON.stringify(userAppAtual.roleUserApp),
                // modoAuth: JSON.stringify(userAppAtual.modoAuth)
            },
        })
    }


    // FUNCOES DE CREDITAR CLEINTE
    function lengthClubesSelecionados() {
        let c = 0
        clubesOPT.map((l: TclubeCredito) => {
            if (l.quantidade > 0) {
                c += 1
            }
        })
        setLengthClubes(c)
    }

    function inc(id: string) {

        let t: TclubeCredito[] = []

        clubesOPT.map((i: TclubeCredito) => {
            let Y = i
            if (Y.id == id) {
                Y.quantidade += 1
            }
            t.push(Y)
        })

        setClubesOPT(t)
        lengthClubesSelecionados()

    }
    function dec(id: string) {



        let t: TclubeCredito[] = []

        clubesOPT.map((i: TclubeCredito) => {
            let Y = i
            if (Y.id == id) {
                if (Y.quantidade > 0) {
                    Y.quantidade -= 1
                }
            }
            t.push(Y)
        })

        setClubesOPT(t)
        lengthClubesSelecionados()

    }



    function finalizarCredito(auth: string) {
        console.log('clubesOPT', clubesOPT);
        let c: TclubeCredito[] = []
        clubesOPT.map((i: TclubeCredito) => {
            if (i.quantidade > 0) {
                c.push(i)
            }
        })


        if (c.length == 0) {
            Alert.alert('Creditar Clube', 'Não há clube selecionado, insira a quantidade em algum clube pra continuar!')
            return
        }
        if (!mesa) {
            Alert.alert('Creditar Clube', 'Selecione uma mesa!')
            return
        }

        router.push({
            pathname: './creditarClubes',
            params: {
                clubes: JSON.stringify(c),
                cliente: JSON.stringify(userAppAtual.roleUserApp),
                mesa: mesa
            },
        })
    }






    return (
        <SafeAreaProvider style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>

                <ScrollView>
                    <View>
                        <View className='flex flex-row justify-between items-center '>
                            <TouchableOpacity
                                onPress={() => setTab("debitar")}
                                className={`w-1/2 h-[60px] flex flex-row justify-center items-center ${tab == 'debitar' ? 'bg-white border-b-4' : 'bg-inherit opacity-60'}`}>
                                <Text className='text-2xl'>Debitar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setTab("creditar")}
                                className={`w-1/2 h-[60px] flex flex-row justify-center items-center ${tab == 'creditar' ? 'bg-white border-b-4' : 'bg-inherit opacity-60'}`}>
                                <Text className='text-2xl'>Creditar</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <View className='pb-6'>
                            <Text className='text-2xl'>Lista de</Text>
                            <Text className='text-[50px] font-medium -translate-y-3'>Clubes</Text>
                        </View> */}
                    </View>

                    {tab == "debitar" &&

                        <View className='bg-white mb-10'>
                            <View className='w-full bg-white pt-6 pb-4'>
                                <View className='px-6 pb-6 w-full flex flex-row justify-between items-center'>
                                    <View className='mb-4'>
                                        <Text className='text-lg'>Cliente</Text>
                                        <Text className='text-3xl'>{userAppAtual.roleUserApp.user.nome}</Text>
                                    </View>
                                </View>
                                <View className='flex flex-row items-center mx-6 rounded-2xl border-2 bg-black h-[100px] mb-10'>
                                    <View className='w-[40%] h-full flex flex-col items-center'>
                                        <Text className='text-[40px] text-white'>{adebitar.length}</Text>
                                        <Text className='text-sm text-white leading-3 p-[2px]'>Cubes</Text>
                                        <Text className='text-sm text-white leading-3 p-[2px]'>Selecionados</Text>

                                    </View>


                                    <View

                                        className='w-[60%] h-full flex flex-col justify-center items-center rounded-r-[12px] border-l border-white'>

                                        <TouchableOpacity className='w-full h-[70px] flex flex-row justify-center items-center '
                                            onPress={() => (finalizarDebito())}
                                        >

                                            <Text className='text-sm font-medium text-white'>CONCLUIR DEBITAÇÃO</Text>
                                        </TouchableOpacity>

                                        {/* <View className='w-full h-[90px] flex flex-row justify-center'>
                                    <TouchableOpacity
                                        onPress={() => (finalizarDebito('CODIGO'))}
                                        className='w-1/2 flex flex-row justify-center items-center bg-slate-400'>
                                        <Text className='text-sm text-white'>Código</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => (finalizarDebito("QRCODE"))}
                                        className='w-1/2 flex flex-row justify-center items-center bg-slate-800 rounded-br-2xl'>
                                        <Text className='text-sm text-white'>QRCode</Text>
                                    </TouchableOpacity>
                                </View> */}




                                    </View>
                                </View>

                            </View>
                            <View className='flex flex-col gap-6 px-3 py-10 bg-slate-100 rounded-3xl'>


                                {
                                    _meusClubes.map((n: TcardClubeDebitoProps, i: number) => (

                                        <CardClubeDebito
                                            key={n.id}
                                            clube={n}
                                            press={(c: TcardClubeDebitoProps) => addDebito(c)}
                                        />


                                    ))
                                }

                            </View>
                        </View>
                    }

                    {tab == "creditar" &&

                        <View className='w-full bg-white pt-6 pb-4'>
                            {situacaoPub !== 'ATIVO' &&
                                <View className='p-4'>
                                    <View className='bg-red-500 w-full h-32 rounded-2xl p-4'>
                                        <Text className='text-lg text-white'>ATENÇÂO</Text>
                                        <Text className='text-sm text-white'>Este Estabelecimento esta impossibilitado de vender novos clubes. Favor procurar a gerência!</Text>


                                    </View>
                                </View>
                            }
                            {/* IDENTIFICACAO CLIENTE */}
                            {situacaoPub === 'ATIVO' &&
                                <View>
                                    <View className='px-6 w-full flex flex-row justify-between items-center pb-6 border-b border-slate-200 mb-0'>
                                        <View className='mb-4'>
                                            <Text className='text-lg'>Cliente</Text>
                                            <Text className='text-3xl'>{userAppAtual.roleUserApp.user.nome}</Text>
                                        </View>

                                        <View className='z-50'>

                                            {/* <Select
                                                label="Mesa"
                                                placeholder="Escolha"
                                                options={mesas ? mesas : []}
                                                selectClasses='w-[130px]'
                                                labelKey="titulo"
                                                valueKey="id"
                                                selectedValue={mesa}
                                                onSelect={value => setMesa(value)}
                                            /> */}



                                            {/* <SelectList
                                        setSelected={(val: string) => setSelectedCaixa(val)}
                                        data={caixasOPT}
                                        save="value"
                                    /> */}
                                            {/* <TextInput
                                        value={mesa}
                                        onChangeText={(text: string) => setMesa(text)}
                                        maxLength={2}
                                        keyboardType='number-pad'
                                        className='border-2 border-black w-[60px] h-[40px] text-black text-xl text-center rounded-xl'
                                    ></TextInput> */}

                                        </View>
                                    </View>

                                    <View className='flex flex-row items-center mx-6 rounded-2xl border-2 bg-black h-[100px] mb-10'>
                                        <View className='w-[40%] h-full flex flex-col items-center'>
                                            <Text className='text-[45px] text-white'>{lengthClubes}</Text>
                                            <Text className='text-sm text-white leading-3'>Cubes</Text>
                                            <Text className='text-sm text-white leading-3'>Selecionados</Text>

                                        </View>


                                        <View

                                            className='w-[60%] h-full flex flex-col justify-center items-center rounded-r-[12px] border-l border-white'>
                                            <TouchableOpacity
                                                onPress={() => (finalizarCredito('CODIGO'))}
                                                className='w-full h-[70px] flex flex-row justify-center items-center '>
                                                <Text className='text-sm font-medium text-white'>CONCLUIR VENDA</Text>
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                </View>
                            }

                            {/* // CLUBES DISPONIVEIS */}

                            <View className='flex flex-col p-6 '>
                                <Text
                                    className='text-4xl font-semibold  '>Clubes disponíveis
                                </Text>
                                <Text

                                    className='text-sm italic mb-3'>Para novas aquisições, Selecione os clubes para inseri-los no carrinho
                                </Text>
                            </View>

                            <View className='flex flex-col gap-4 px-4'>

                                {

                                    clubesOPT.map((n: TclubeCredito, i: number) => (

                                        <CardClubeCredito
                                            key={n.id}
                                            clube={n}
                                            increment={(d: string) => inc(d)}
                                            decrement={(d: string) => dec(d)}
                                        />


                                    ))
                                }
                            </View>
                        </View>
                    }
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
