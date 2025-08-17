
import { useState } from "react";
import { Image, Text, View } from "react-native";
import { API_URL } from "../../constants/env";



type Tclube = {
    clube: {
        id: string,
        titulo: string,
        doses: number,
        valor: GLfloat,
        imagem: string,
        selecionado?: boolean
    },
    press: Function
}


export function CardClube(props: Tclube) {



    const [selecionado, setSelecionado] = useState(false)

    console.log('props.clube.imagem', props.clube.imagem);

    return (
        <View
            className="bg-slate-300"
            style={{ flexDirection: "row", alignItems: 'center', width: "100%", height: 90, padding: 6, borderRadius: 15 }}
        >

            <View style={{ flexDirection: "row", alignItems: 'center', borderRadius: 15, padding: 0, columnGap: 12, width: '100%' }}>
                <View style={{ width: '20%' }}>
                    <Image width={70} height={70} source={{ uri: `${API_URL}/arquivador/${props.clube.imagem}` }} resizeMode="cover" style={{ borderRadius: 100 }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '70%' }}>
                    <View>
                        <Text style={{ fontWeight: "400", paddingBottom: 5, fontStyle: "italic" }}>{props.clube.titulo}</Text>

                        <Text style={{ fontStyle: "italic", fontSize: 11, fontWeight: "700" }}>{props.clube.doses} Doses </Text>
                    </View>

                    <View>
                        <Text style={{ fontWeight: '700', fontSize: 18 }}>R$ {props.clube.valor}</Text>
                    </View>
                </View>

            </View>




            {/* <Card.Actions>

                <Link href={{
                    pathname: '../screens/clube/detalhes',
                    params: {
                        id: props.pub.id,
                        nome: props.pub.nome,
                        descricao: props.pub.descricao,
                        imagem: props.pub.imagem,
                        qtd_clubes: props.pub.qtd_clubes,
                        endereco: props.pub.endereco
                    }
                }}>Entrar no Pub</Link>

            </Card.Actions> */}

        </View>
    )
}