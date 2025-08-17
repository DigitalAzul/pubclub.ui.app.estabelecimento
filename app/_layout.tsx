import { AuthProvider } from "@/src/context/AuthContext";
import { Slot } from "expo-router";


import '@/assets/global.css';

//export default Slot



export default function App() {

  return (

    <AuthProvider>
      <Slot />

    </AuthProvider>
  );
}
