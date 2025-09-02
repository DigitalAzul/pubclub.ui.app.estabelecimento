
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


import { useIsFocused } from '@react-navigation/native';
import useDbStore from '../src/zStore/dbStore';

export default function Index() {

  const isFocused = useIsFocused();
  const router = useRouter();
  const { getPdvProfile } = useDbStore();

  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("a@a.com");
  const [senha, setSenha] = useState("");

  const [criarConta, setCriarConta] = useState(false)

  const [password, setPassword] = useState('1234')




  useEffect(() => {
    const i = async () => {
      await getPdvProfile();
    }
    i();
  }, [isFocused])



  const login = async (rota: string) => {

    if (rota == "admin") {
      // router.push('./(admin)');
      router.push('/screens/gerente');
    }

    if (rota == "pdv") {
      //router.push('./(pdv)');
      router.push('/screens/pdv');

    }
    if (rota == "balcao") {
      //router.push('./(pdv)');
      router.push('/screens/balcao');

    }
    //router.push('/screens/gerente');

  }




  return (

    <SafeAreaProvider style={{ flex: 1 }}

    >
      <SafeAreaView style={{ flex: 1 }}

      >


        <View
          className="bg-white"
          style={{ flex: 1, flexDirection: 'column', alignItems: 'center', height: '100%' }}>

          <View style={styles.Textos}>
            <Text style={styles.subTitulo}>Seja bem vindo ao</Text>
            <Text style={styles.Titulo}>Pub Club</Text>
            <Text className='font-bold text-2xl'>
              MÓDULO ESTABELECIMENTO
            </Text>
          </View>

          <View className='w-full flex flex-col items-center gap-6 mt-[30%] zh-[250px]'>
            <Text className='text-lg pt-4'>Acesse como:</Text>
            <TouchableOpacity
              onPress={() => login('admin')}
              className='flex flex-row justify-center items-center bg-slate-600 text-white w-[80%] h-[70px] rounded-full'
            >

              <Text className='text-2xl text-white'>GERÊNCIA</Text>


            </TouchableOpacity>


            <TouchableOpacity
              onPress={() => login("pdv")}
              className='flex flex-row justify-center items-center bg-slate-600 text-white w-[80%] h-[70px] rounded-full'
            >

              <Text className='text-2xl text-white'>PDV</Text>


            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => login("balcao")}
              className='flex flex-row justify-center items-center bg-slate-600 text-white w-[80%] h-[70px] rounded-full'
            >

              <Text className='text-2xl text-white'>BALCÃO</Text>


            </TouchableOpacity>
          </View>




        </View>
      </SafeAreaView>
      <StatusBar style="light" />
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


});

