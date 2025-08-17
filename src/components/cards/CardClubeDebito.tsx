import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TcardClubeDebitoProps } from "../../types/cardClubeDebitoProps";



type TclubeDebito = {
    clube: TcardClubeDebitoProps,
    press: Function,
}



export function CardClubeDebito(props: TclubeDebito) {


    //let clube = props.clube
    const [clube, set_props] = useState<TcardClubeDebitoProps>(props.clube)
    const [reload, setReload] = useState<number>()




    function credita(clubeId: string) {

        let t = clube

        console.log(clube);
        if (t?.doses_adebitar + 1 <= (t?.doses - t?.doses_consumidas)) {
            t.doses_adebitar += 1


            set_props(t)
            setReload(Math.random())

            props.press(clube)
        }
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
            <View className="flex flex-col justify-start w-[80%] h-[100px] ">
                <View className="w-full h-[36px] zborder-b zborder-slate-400 flex felx-col justify-around px-4">
                    <Text className="text-lg font-semibold">{clube.titulo} </Text>
                </View>

                <View className="w-full flex flex-row items-center py-1 h-[54px] px-2">
                    <View className="w-[25%] h-full flex flex-col items-center justify-center border-r border-slate-400">
                        <Text className="text-[12px]"> Doses</Text>
                    </View>
                    <View className="w-[25%] flex flex-col items-center justify-center">

                        <Text className="text-[30px] text-center leading-none color-lime-600">{(clube.doses - clube.doses_consumidas) ? (clube.doses - clube.doses_consumidas) : 0}</Text>
                        <Text className="text-[10px] leading-none"> Disponíveis</Text>
                    </View>
                    <View className="w-[25%] flex flex-col items-center justify-center">
                        <Text className="text-[30px] text-center leading-none color-slate-600">{(clube.doses - clube.doses_consumidas) - clube.doses_adebitar}</Text>
                        <Text className="text-[10px] leading-none"> Saldo</Text>
                    </View>
                    <View className="w-[25%] flex flex-col items-center justify-center">
                        <Text className="text-[30px] text-center leading-none color-pink-800">{clube.doses_adebitar}</Text>
                        <Text className="text-[10px] leading-none"> Consumidas</Text>
                    </View>
                </View>

            </View>
            <View className="w-[20%] h-[100%] border-l border-slate-400">
                <TouchableOpacity
                    onPress={() => credita(clube.id)}
                    className="h-[54px] w-[96%] flex flex-row justify-center items-center border-b border-b-[#94a3b8]"
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