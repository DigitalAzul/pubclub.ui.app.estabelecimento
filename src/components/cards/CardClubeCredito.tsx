import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";



type TclubeCredito = {
    clube: {
        id: string,
        titulo: string,
        doses: number,
        quantidade: number,
        valor: GLfloat,
        imagem: string,
        validade: number
    },
    decrement: Function,
    increment: Function,
}



export function CardClubeCredito(props: TclubeCredito) {

    //let clube = props.clube
    const [clube, set_props] = useState(props.clube)
    const [reload, setReload] = useState<number>()



    function credita(clubeId: any) {

        props.increment(clubeId)

        // _clube.quantidade += 1
        // set_props(_clube)
        // setReload(Math.random())

        // props.press(_clube)
        // let t = clube
        // t.quantidade += 1
        // set_props(t)
        // setReload(Math.random())

        // props.press(t)
    }

    function debita(clubeId: string) {

        props.decrement(clubeId)
        // let t = clube

        // if (t.quantidade - 1 >= 0) {
        //     t.quantidade -= 1

        //     set_props(t)
        //     setReload(Math.random())

        //     props.press(clube)
        // }
    }

    useEffect(() => {
    }, [reload])


    return (
        <View className={`flex flex-row w-full h-[115px] items-center rounded-2xl border-2 border-black ${clube.quantidade > 0 ? 'bg-orange-100' : 'bg-white'}`}>


            <View className="flex flex-col justify-start w-[80%] h-full">
                <View className="w-full h-[40px] zborder-b zborder-slate-400 flex felx-col px-4">
                    <Text className="text-lg font-semibold">{clube.titulo} </Text>
                    <Text className="text-sm text-slate-500 pb-4">Validade de {clube.validade} dias</Text>
                </View>

                <View className="w-full flex flex-row items-center">

                    <View className="w-[50%] h-[80%] flex flex-col items-center justify-center border-r border-slate-400 ">
                        <Text className="text-[35px] text-center leading-none color-lime-600">{clube.valor}</Text>
                        <Text className="text-[12px] leading-none">R$ Preço</Text>
                    </View>

                    <View className="w-[20%] flex flex-col items-center justify-center">
                        <Text className="text-[30px] text-center leading-none color-slate-600">{clube.doses}</Text>
                        <Text className="text-[11px] leading-none"> Doses</Text>
                    </View>

                    <View className="w-[25%] flex flex-col items-center justify-center">
                        <Text className="text-[30px] text-center leading-none color-lime-600 font-bold">{clube.quantidade}</Text>
                        <Text className="text-[11px] leading-none"> Qauntidade</Text>
                    </View>
                </View>

            </View>
            <View className="w-[20%] h-[108px]"
                style={{ borderLeftColor: "#94a3b8", borderLeftWidth: 1 }}
            >
                <TouchableOpacity
                    onPress={() => credita(clube.id)}
                    className="h-[54px] w-full flex flex-row justify-center items-center border-b border-b-[#94a3b8]"
                >
                    <MaterialCommunityIcons name="plus" size={30} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => debita(clube.id)}
                    className="h-[54px] w-full flex flex-row justify-center items-center"
                >
                    <MaterialCommunityIcons name="minus" size={30} color="black" />
                </TouchableOpacity>
            </View>
        </View>






    )
}