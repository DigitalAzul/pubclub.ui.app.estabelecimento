import { useGlobalSearchParams } from "expo-router";
import { useState } from "react";
import { CardClubeDebitoConfirmacao } from "../../src/components/cards/CardClubeDebitoConfirmacao";

import { StyleSheet, Text, TextInput, View } from 'react-native';

type Tclube = {
    id: string;
    titulo: string;
    doses: number;
    valor: GLfloat;
    doses_consumidas: number;
    doses_adebitar: number;
    validade: number;
    expira_em: Date;
    imagem: string;

}

export default function ClubesDC() {

    const params = useGlobalSearchParams<{ clubes: string, auth: string }>();
    const [clubesDebitar, setClubesDebitar] = useState<Tclube[]>([])


    let C: Tclube[] = []

    if (params?.clubes) {

        C = JSON.parse(params?.clubes)
    }


    return (
        <View style={styles.container}>


            {params.auth == 'QRCODE' &&
                <View>
                    <Text>qrcode</Text>
                </View>
            }
            {params.auth == 'CODIGO' &&
                <View>
                    <TextInput
                        placeholder="Seu código de segurança"
                        value=""
                    />
                </View>
            }

            {C.map((c: Tclube) => (
                <CardClubeDebitoConfirmacao
                    key={c.id}
                    clube={{
                        doses_consumidas: c.doses_consumidas,
                        doses_adebitar: c.doses_adebitar,
                        validade: c.validade,
                        expira_em: c.expira_em,
                        imagem: c.imagem,
                        id: c.id,
                        titulo: c.titulo,
                        doses: c.doses,
                        valor: c.valor,
                    }} />


            ))
            }

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
