// Home.js
import React, { useEffect, useRef, useState } from "react";
import Checkbox from "expo-checkbox";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useSQLiteContext } from "expo-sqlite/next";
// import * as SQLite from 'expo-sqlite/next';

const HomeScreen = ({ screenHeight, basicInputStyle }) => {
  const [matchIsChecked, setMatchIsChecked] = useState(false);
  const [surah, setSurah] = useState(null);
  const [word, setWord] = useState(null);
  const [firstAyat, setFirstAyat] = useState(null);
  const [secondAyat, setSecondAyat] = useState(null);
  const [queryResult, setQueryResult] = useState([]);
  const listOfBg = ["#F99", "#9F9", "#3FF", "#FF9", "#F9F"];

  let testString = `<Text style={{color:"red"}}>AAAaaaaaa</Text>`;

  const surahInput  = useRef();
  const wordInput  = useRef();
  const matchCheckInput= useRef();
  const firstAyatInput  = useRef();
  const secondAyatInput  = useRef();



  const db = useSQLiteContext();

  // menambil data dari database
 function getData() {
    console.log("fungsi getData() start ++++++++++++++++++++")
    try {
      const surahFilter = surah ? `nosurah = ${surah}` : ``;
      var ayatFilter = ``;
      var wordFilter = ``;
      if (wordInput.current.value) {
        wordFilter = matchIsChecked
          ? ` isiayat like "%${wordInput.current.value}%"`
          : wordsSplitAndReshape(wordInput.current.value);
      } else if (firstAyat && secondAyat) {
        ayatFilter = `(noayat >= ${firstAyat} and noayat <= ${secondAyat})`;
      } else if (firstAyat) {
        ayatFilter = `noayat >= ${firstAyat}`;
      } else if (secondAyat) {
        ayatFilter = `noayat <= ${secondAyat}`;
      }

      const andFiller1 = surahFilter && wordFilter ? ` and ` : ``;
      const andFiller2 =
        (wordFilter && ayatFilter) || (surahFilter && ayatFilter)
          ? ` and `
          : ``;

      // console.log(
      //   "Query: ",
      //   `SELECT ayatID, nosurah, isiayat, noayat FROM data WHERE ${surahFilter}${andFiller1}${wordFilter}${andFiller2}${ayatFilter}`
      // );

      const result = db.getAllSync(
        `SELECT ayatID, nosurah, isiayat, noayat FROM data WHERE ${surahFilter}${andFiller1}${wordFilter}${andFiller2}${ayatFilter}`
      );
      // console.log("Result: ", result)
      console.log("fungsi getData() end ----------------")
      return result;
    } catch (error) {
      console.error("Error fetching data:", error);
    }

  }

  // menyisipkan wordInput pada query 
  wordsSplitAndReshape = (words) => {
    var splittedWords = words.split(" ");
    var splittedAndReshapedWords = ``;
    var i = 0;
    for (var word of splittedWords) {
      i += 1;
      if (i == splittedWords.length) {
        splittedAndReshapedWords += ` isiayat like "%${word}%"`;
      } else {
        splittedAndReshapedWords += ` isiayat like "%${word}%" and`;
      }
    }
    return splittedAndReshapedWords;
  };

var a = null;
// melakukan opersi boldening substring ayat
  const queryResultSplitter = (ayat) => {
    // console.log("ayat: ",ayat)
    var parsedAyat = ayat.isiayat.split(new RegExp(`(${wordInput.current.value})`, "gi"));
    // parsedAyat.forEach(function(subAyat, index){
    //   if (subAyat.toLowerCase() === word.toLowerCase()) {
    //     console.log("masuk if bold")
    //     this[index] = <Text style={{ fontWeight: "bold" }}>{subAyat}</Text>
    //   }
    //   // console.log("Setelah format style ayat diubah ---: ",parsedAyat)
    // },parsedAyat)
    const newParsedData = parsedAyat.map(subAyat => (subAyat.toLowerCase() === wordInput.current.value.toLowerCase() ? <Text style={{ fontWeight: "bold" }}>{subAyat}</Text> : subAyat));
    // console.log("parsedAyat: ",parsedAyat)
    // console.log(newParsedData)
    return newParsedData
  };


  const toggleCheckBox = () => {
    setMatchIsChecked(!matchIsChecked);
  };

  // const surahInputHandle = (surah) => {
  //   setSurah(surah);
  // };

  // const wordInputHandle = (word) => {
  //   setWord(word);
  // };

  // const firstAyatInputHandle = (firstAyat) => {
  //   setFirstAyat(firstAyat);
  //   setSecondAyat(firstAyat);
  // };

  // const secondAyatInputHandle = (secondAyat) => {
  //   setSecondAyat(secondAyat);
  // };
  // useEffect(() => {
    // wordInput.current.focus()
  // })

  // search button handle, memicu rerender.
  const searchButtonHandle = () => { 
    console.log("wordInput: ", wordInput.current.value)
    console.log("searchButtonHandle start +++++++++++")
    // setSurah(surah);
    // setWord(wordInput.current.value);
    // setFirstAyat(firstAyat);
    // setSecondAyat(firstAyat);
    // setSecondAyat(secondAyat);
    db.withTransactionSync(() => {
      result = getData(); // Tunggu hingga getData() selesai dieksekusi
      setQueryResult(result); // Set state dengan hasil query
    });
    // console.log("QueryResult: ",queryResult)
    console.log("searchButtonHandle end --------------")
  };

  const searchHeaderHeight = screenHeight * 0.15;

  
  


  const renderT = ({ item, index }) => {
    var parsedAyat = null;
    // if (word && matchCheckInput){
      if (wordInput.current.value){
      parsedAyat = queryResultSplitter(item);
    }
    else{
      parsedAyat = item.isiayat
    }
    // parsedAyat = item.isiayat
    console.log("renderT ends ----------------------")





    return (
      <View
        style={{
          alignItems: "center",
          backgroundColor: listOfBg[index % 5],
          padding: 10,
        }}
      >
        <Text style={{ fontSize: 18 }}>
          {item.nosurah}:{item.noayat}
        </Text>
        <Text style={{ textAlign: "center", fontSize: 18 }}>{parsedAyat}</Text>
        {/* <Text style={{backgroundColor:listOfBg[index%5]}}>{item}</Text> */}
      </View>
    );
  };
  const newText = "Hi my name is <Text style={{fontWeight: 'bold'}}>ASD</Text>. Good to see you!";
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      {/* <View style={{backgroundColor:"blue", height:"40%"}}></View> */}

      <ScrollView style={styles.scrollViewStyle}
        keyboardShouldPersistTaps='handled'
        >
        
        <View style={[{ height: searchHeaderHeight }, styles.searchHeader]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[basicInputStyle, { width: "95%", height: "28%" }]}
              placeholder="Quran Surah"
              placeholderTextColor="white"
              keyboardType="numeric"
              // onChangeText={surahInputHandle}
              onChangeText={textInput => setSurah(textInput)}
              value={surah}
              // value={username}
              // onChangeText={handleUsernameChange}
            />

            <View style={styles.wordWrapper}>
              <TextInput
                style={[
                  basicInputStyle,
                  styles.inputWeightHeightProfile1,
                  { flex: 1 },
                ]}
                placeholder="Word"
                placeholderTextColor="white"
                // onChangeText={wordInputHandle}
                // onChangeText={textInput => setWord(textInput)}
                // onChangeText={value => {
                //   // can be called anywhere to set value
                //   wordInput.current = value
                  
                // }}
                ref={wordInput}
                onChangeText={(e) => wordInput.current.value = e}
                // value={word}
              />
              <TouchableOpacity
                style={[
                  styles.checkBoxWrapperStyle,
                  basicInputStyle,
                  { width: "auto", height: "100%" },
                ]}
                onPress={toggleCheckBox}
              >
                <Checkbox
                  style={{
                    backgroundColor: "white",
                    borderWidth: 0,
                    height: 15,
                    width: 15,
                  }}
                  value={matchIsChecked}
                  // onValueChange={setChecked}
                  // checkedIcon='dot-circle-o'
                  // checkedColor='blue'
                  // uncheckedColor='white'
                />
                <Text style={{ color: "white" }}> Match</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.ayatWrapper}>
              <TextInput
                style={[basicInputStyle, { flex: 1 }]}
                placeholder="Ayat"
                placeholderTextColor="white"
                // onChangeText={firstAyatInputHandle}
                // onChangeText={textInput => setFirstAyat(textInput)}
                // value={firstAyat}
                ref={firstAyatInput}
                keyboardType="numeric"
              />
              {/* DASH */}
              <View
                style={{
                  marginHorizontal: 10,
                  flex: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{ width: 8, height: 2, backgroundColor: "#818181" }}
                ></View>
              </View>
              <TextInput
                style={[basicInputStyle, { flex: 1 }]}
                placeholder="Ayat"
                placeholderTextColor="white"
                // onChangeText={secondAyatInputHandle}
                // onChangeText={textInput => setSecondAyat(textInput)}
                // value={secondAyat}
                ref={secondAyatInput}

                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={styles.searchButtonWrapper}>
            <TouchableOpacity
              style={styles.searchButtonStyle}
              onPress={searchButtonHandle}
            >
              <Text style={styles.searchTextStyle}>Search</Text>
            </TouchableOpacity>
          </View>
          <View></View>
        </View>
        <Text style={{ backgroundColor: "white" }}>
          {queryResult.length}
        </Text>


        <FlatList
          // data={listOfBoldenedAyat} // Data yang akan ditampilkan dalam daftar
          data={queryResult} // Data yang akan ditampilkan dalam daftar
          renderItem={(item,index) => renderT(item, index)}
          // keyExtractor={(item, index) => index.toString()} // Fungsi untuk menentukan key untuk setiap item
          // keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
          // contentContainerStyle=
          disableVirtualization={true} 
          initialNumToRender={500}
          // initialScrollIndex={500}

        />
        <Text style={{color:"red"}}>{testString}</Text>

        <Text style={{ backgroundColor: "white" }}>Aaaaaaa</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  scrollViewStyle: {
    // flex:1,
    height: "100%",
    backgroundColor: "black",
  },
  searchHeader: {
    width: "100%",
    backgroundColor: "#F7F7F7",
    // backgroundColor: "red",
    flex: 0,
    flexDirection: "row",
  },
  inputWrapper: {
    flex: 1,
    justifyContent: "space-evenly",
    // justifyContent: 'cent÷er',
    alignItems: "center",
    width: "70%",
    // backgroundColor: "red",F7F7F7
  },
  searchButtonWrapper: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    // flex:1,
    width: "30%",
    // backgroundColor: "blue",
  },
  wordWrapper: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
    height: "28%",
  },
  ayatWrapper: {
    width: "95%",
    height: "28%",
    // flex: 1,
    flexDirection: "row",
  },
  inputWeightHeightProfile1: {
    width: "50%",
    height: "100%",
  },
  checkBoxWrapperStyle: {
    marginLeft: 5,
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  searchButtonStyle: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    // color:'white',
    backgroundColor: "#00A3FF",
    height: "95%",
    width: "95%",
    borderRadius: 4,
  },
  searchTextStyle: {
    flex: 0,
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
});

//   <View>
//   <Text>Welcome to Home Screen!</Text>
// </View>
