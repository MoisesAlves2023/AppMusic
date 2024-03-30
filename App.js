import React from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Routes from "./src/Routes/routes";

export default function App() {
    return (
        <NavigationContainer>
            <Routes />
        </NavigationContainer>
    )

}
