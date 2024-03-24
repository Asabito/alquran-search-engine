import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import React, { Suspense, useEffect, useState } from "react";
import HomeScreen from "./Screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { SQLiteProvider } from "expo-sqlite/next";

const Stack = createNativeStackNavigator();
const { height: screenHeight } = Dimensions.get("window");

const basicInputStyle = {
  backgroundColor: "#818181",
  // height: '20%',
  // width: '50%',
  borderRadius: 8,
  paddingLeft: 10,
  paddingRight: 10,
  color: "white",
  // marginLeft: 50,
  // marginRight: 50,
  // marginRight:20,
  // marginTop: 5,
  // marginBottom: 5,
};


// const testDatabaseConnection = async () => {
//   const dbName = "alquran-SE-db.db";
//   const db = SQLite.openDatabase(dbName);
//   // Lakukan query sederhana untuk membaca data dari tabel
//   db.transaction((tx) => {
//     tx.executeSql(
//       'SELECT * FROM surah',
//       [],
//       (_, { rows }) => {
//         // Output hasil query ke konsol
//         console.log('Data dari database:', rows._array);
//       },
//       error => {
//         console.log('Gagal melakukan query:', error);
//       }
//     );
//   });
// };




const loadDatabase = async () => {
  const dbName = "alquran-SE-db.db";
  const dbAsset = require("./assets/data/alquran-SE-db.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  console.log("File info: ", fileInfo)
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      { intermediates: true }
    );
  }
  await FileSystem.downloadAsync(dbUri, dbFilePath);
};


export default function App() {
  const [dbLoaded, setDbLoaded] = useState(false);

  useEffect(() => {
    // Read data from the database
    console.log("Masuk useeffect");

    loadDatabase()
      .then(() => 
      setDbLoaded(true))
      .catch((e) => console.error(e));

    console.log("done useeffect");
  }, []);

  if (!dbLoaded) return <Text>Loading...</Text>;
  console.log("dbloaded: ", dbLoaded)


  return (

    <NavigationContainer>
        <SQLiteProvider databaseName="alquran-SE-db.db">
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={() => (
                <HomeScreen
                  screenHeight={screenHeight}
                  basicInputStyle={basicInputStyle}
                />
              )}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </SQLiteProvider>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  // header: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   padding: 16,
  //   // paddingTop: Platform.OS === "ios" ? StatusBar.currentHeight + 24 : 16,
  // },

  // search
});
