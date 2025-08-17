import useAuthStore from "@/src/zStore/AuthSore";
import useDbStore from "@/src/zStore/dbStore";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { TcardClubeDebitoProps } from "../../types/cardClubeDebitoProps";



type TclubeDebito = {
    clube: TcardClubeDebitoProps,
    press: Function,
}



export function CardClubeSeparar(props: TclubeDebito) {

    const { session } = useAuthStore()
    const { pubSelecionadoDB, separarClube } = useDbStore()


    //let clube = props.clube
    const [clube, set_props] = useState<TcardClubeDebitoProps>(props.clube)
    const [reload, setReload] = useState<number>()


    type TsepararClube = {
        role_user_pdv_id: string,
        meus_clubes_id: string,
        pubs_id: string

    }


    async function separar(clube: TcardClubeDebitoProps) {

        let t = clube

        if (session && clube.id && pubSelecionadoDB?.id) {
            const separarClube: TsepararClube = {
                role_user_pdv_id: session?.role_id,
                meus_clubes_id: clube.id,
                pubs_id: pubSelecionadoDB?.id
            };

            console.log('clube', clube);
            console.log('session', session);

            Alert.alert(
                `${clube.titulo}`,
                `Dejesa enviar este clube para a separação?`,
                [
                    {
                        text: 'Não',
                        style: 'cancel',
                    },
                    {
                        text: 'SIM',
                        onPress: () => handleSubmitSeperar(separarClube),
                    },
                ],

            );




        }

    }

    async function handleSubmitSeperar(separar: TsepararClube) {

        try {
            const s = await separarClube(separar)
            if (s) {
                Alert.alert(
                    'AVISO',
                    'Clube enviado pra separação',
                );
            }
            if (!s) {
                Alert.alert(
                    'ERRO',
                    'Separação não realizada!',
                    [
                        {
                            text: 'Entendi',
                            style: 'destructive',
                        },
                    ],

                );
            }
        } catch (error) {

        }

        // const optionsFetch = {
        //     method: 'POST',
        //     headers: new Headers({
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json'
        //     }),
        //     body: JSON.stringify({ role_user_pdv_id: separar.role_user_pdv_id, meus_clubes_id: separar.meus_clubes_id, pubs_id: separar.pubs_id })
        // };


        // try {
        //     const response = await fetch(`${API_URL}/meusclubes/separarClubPeloPdv`, optionsFetch)

        //     const data = await response.json()
        //     console.log('response rrrrrr', data);


        //     if (data.error) {

        //         if (data.cod == 1) {
        //             Alert.alert(
        //                 'Informação',
        //                 data.msg,
        //                 [
        //                     {
        //                         text: 'Ok',
        //                         style: 'default',
        //                     },
        //                 ],

        //             );
        //         }

        //     } else {
        //         if (data.cod == 0) {
        //             Alert.alert(
        //                 'AVISO',
        //                 'Clube enviado pra separação',
        //             );
        //         }
        //     }
        // } catch (error) {
        //     console.log(error)

        // }
    }

    function debita(clubeId: string) {
        let t = clube
        console.log(clube);
        if (t.doses_adebitar - 1 >= 0) {
            t.doses_adebitar -= 1

            console.log(t);
            set_props(t)
            setReload(Math.random())

            props.press(clube)
        }
    }



    return (
        <View className={`flex flex-row w-full h-[100px] items-center rounded-2xl border-2 border-black ${clube.doses_adebitar > 0 ? 'bg-orange-100' : 'bg-white'}`}>

            {/* <View className="w-[20%] h-full">
                <Image width={70} height={70} source={{ uri: clube.imagem }} resizeMode="cover" style={{ borderRadius: 100 }} />
            </View> */}
            <View className="flex flex-col justify-start w-[70%] h-[100px] ">
                <View className="w-full h-[36px] zborder-b zborder-slate-400 flex felx-col justify-around px-4">
                    <Text className="text-lg font-semibold">{clube.titulo} </Text>
                </View>

                <View className="w-full flex flex-row items-center py-1 h-[54px] px-2">
                    <View className="w-1/2 h-full flex flex-col items-center justify-center border-r border-slate-400">
                        <Text className="text-[12px]"> Doses</Text>
                    </View>
                    <View className="w-1/2 flex flex-col items-center justify-center">

                        <Text className="text-[30px] text-center leading-none color-lime-600">{(clube.doses - clube.doses_consumidas) ? (clube.doses - clube.doses_consumidas) : 0}</Text>
                        <Text className="text-[10px] leading-none"> Disponíveis</Text>
                    </View>


                </View>

            </View>
            <View className=" w-[30.55%] h-[100px] border-l border-slate-400 bg-slate-600 rounded-r-2xl">
                <TouchableOpacity
                    onPress={() => separar(clube)}
                    className="h-full  flex flex-row justify-center items-center"
                ><Text className="text-[16px] leading-none text-white">Separar</Text>
                    {/* <MaterialCommunityIcons name="plus" size={30} color="black" /> */}
                </TouchableOpacity>

            </View>
        </View>






    )
}