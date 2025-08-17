import { useEffect, useState } from "react";
import { Text, View, Image, TextInput, TouchableOpacity } from "react-native";



type TclubeCredito = {
    clube: {
        id: string,
        titulo: string,
        doses: number,
        quantidade: number,
        valor: GLfloat,
        imagem: string,
    },
}



export function CardClubeCreditoConfirmacao(props: TclubeCredito) {


    //let clube = props.clube
    const [clube, set_props] = useState(props.clube)
    const [reload, setReload] = useState<number>()




    useEffect(() => {
        console.log('props confirm', props);
    }, [clube])


    return (
        <View className="flex flex-row w-full h-[130px] items-center rounded-2xl border-2 border-black">

            {/* <View className="w-[20%] h-full">
                <Image width={70} height={70} source={{ uri: clube.imagem }} resizeMode="cover" style={{ borderRadius: 100 }} />
            </View> */}
            <View className="flex flex-col justify-start w-full">
                <View className="w-full h-[50px] border-b border-slate-400 flex felx-col justify-around px-4">
                    <Text className="text-lg font-semibold">{props.clube.titulo} </Text>
                </View>

                <View className="w-full flex flex-row items-center h-[80px]">

                    <View className="w-full flex flex-row items-center">

                        <View className="w-[50%] flex flex-col items-center justify-center border-r border-slate-400 ">
                            <Text className="text-[30px] text-center leading-none color-lime-600">{clube.valor}</Text>
                            <Text className="text-[11px] leading-none">R$ Preço</Text>
                        </View>

                        <View className="w-[20%] flex flex-col items-center justify-center">
                            <Text className="text-[30px] text-center leading-none color-slate-600">{clube.doses}</Text>
                            <Text className="text-[11px] leading-none pt-1"> Doses</Text>
                        </View>

                        <View className="w-[25%] flex flex-col items-center justify-center">
                            <Text className="text-[30px] text-center leading-none color-lime-600 font-bold">{clube.quantidade}</Text>
                            <Text className="text-[11px] leading-none"> Qauntidade</Text>
                        </View>
                    </View>

                </View>

            </View>

        </View>






    )
}