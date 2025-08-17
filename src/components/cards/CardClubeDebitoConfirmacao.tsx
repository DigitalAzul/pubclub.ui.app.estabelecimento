import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { TcardClubeDebitoProps } from "../../types/cardClubeDebitoProps";



type TclubeDebito = {
    clube: TcardClubeDebitoProps
}



export function CardClubeDebitoConfirmacao(props: TclubeDebito) {


    //let clube = props.clube
    const [clube, set_props] = useState(props.clube)
    const [reload, setReload] = useState<number>()




    useEffect(() => {
        console.log('props confirm', props);
    }, [clube])


    return (
        <View className="flex flex-row w-full h-[130px] items-center rounded-2xl border-2 border-black">

            <View className="flex flex-col justify-start w-full h-full ">
                <View className="w-full h-[50px] border-b border-slate-400 flex felx-col justify-around px-4">
                    <Text className="text-lg font-semibold">{props.clube.titulo} </Text>
                </View>

                <View className="w-full flex flex-row items-center py-1 h-[80px]">
                    <View className="w-[25%] h-full flex flex-col items-center justify-center border-r border-slate-400">
                        <Text className="text-[12px]"> Doses</Text>
                    </View>
                    <View className="w-[30%] flex flex-col items-center justify-center">
                        <Text className="text-[30px] text-center leading-none color-pink-800">{props.clube.doses_adebitar}</Text>
                        <Text className="text-[11px] leading-none"> Consumidas</Text>
                    </View>
                    <View className="w-[30%] flex flex-col items-center justify-center">
                        <Text className="text-[30px] text-center leading-none color-slate-600">{(clube.doses - clube.doses_consumidas) - clube.doses_adebitar}</Text>
                        <Text className="text-[11px] leading-none"> Saldo</Text>
                    </View>
                    {/* <View className="w-[25%] flex flex-col items-center justify-center">
                        <Text className="text-[35px] text-center leading-none color-lime-600">{props.clube.doses}</Text>
                        <Text className="text-[12px] leading-none"> Disponíveis</Text>
                    </View> */}
                </View>

            </View>

        </View>






    )
}