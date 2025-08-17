import { Stack } from 'expo-router';
import useDbStore from '../../src/zStore/dbStore';

export default function Layout() {
    const { pubSelecionadoDB } = useDbStore();

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="clubeList_f2"
                options={{
                    headerShown: true,
                    title: pubSelecionadoDB?.razao_social,
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="clubesDC"
                options={{
                    title: 'Clubes em transação',
                    headerShown: true,
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="modal"
                options={{
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="identificacao_f1"
                options={{
                    title: pubSelecionadoDB?.razao_social,
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="debitarClubes"
                options={{
                    title: pubSelecionadoDB?.razao_social,
                    headerShown: true,
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="creditarClubes"
                options={{
                    title: pubSelecionadoDB?.razao_social,
                    headerShown: true,
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="ajuda"
                options={{
                    title: 'Ajuda',
                    headerShown: true,
                    presentation: 'modal',
                }}
            />
        </Stack>
    );
}
