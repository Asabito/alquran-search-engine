// Home.js
import React, { useState } from "react";
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
  const listOfBg = [
    "#F99",
    "#9F9",
    "#3FF",
    "#FF9",
    "#F9F"
  ]

  const db = useSQLiteContext();
  async function getData() {
    try {
      const surahFilter = surah ? `nosurah = ${surah}` : ``;
      var ayatFilter = ``;
      var wordFilter = ``;
      if (word) {
        wordFilter = matchIsChecked ? ` isiayat like "%${word}%"` : wordsSplitAndReshape(word);
      } else if (firstAyat && secondAyat) {
        ayatFilter = `(noayat >= ${firstAyat} and noayat <= ${secondAyat})`;
      } else if (firstAyat) {
        ayatFilter = `noayat >= ${firstAyat}`;
      } else if (secondAyat) {
        ayatFilter = `noayat <= ${secondAyat}`;
      }

      const andFiller1 = surahFilter && wordFilter? ` and `:``;
      const andFiller2 = (wordFilter && ayatFilter) || (surahFilter && ayatFilter) ? ` and `:``;

      console.log(
        "Query: ",
        `SELECT ayatID, nosurah, isiayat, noayat FROM data WHERE ${surahFilter}${andFiller1}${wordFilter}${andFiller2}${ayatFilter}`
      );

      const result = await db.getAllAsync(
        `SELECT ayatID, nosurah, isiayat, noayat FROM data WHERE ${surahFilter}${andFiller1}${wordFilter}${andFiller2}${ayatFilter}`
      );
      return result;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }


  const renderAyat = ({ item, index }) => {
    var moduloOfFive = index%5;
    var tempWord = "";
    if (matchIsChecked){
      // console.log(word)
      // tempWord = item.isiayat.replace(new RegExp(word,'gi'), `<Text>abc</Text>`);
      tempWord = item.isiayat.split(new RegExp(word, 'i'))
      // console.log(tempWord)
      // item.isiayat= tempWord
      // console.log(item.isiayat)
      listOfObject = []
      tempWord.forEach((items, index) => {
        listOfObject.push(<Text>{items}</Text>)
      });
    }
    // console.log("listOfObject[0]: ", listOfObject[0])

    const renderBoldAyat = ({ item, index }) => {
      connectorWord = index+1 < listOfObject.length? <Text style={{fontWeight:"bold"}}>{word}</Text>: null;
      return(
          // <Text>{item}{connectorWord}</Text>
          {item}
      )
    }
    
    
    // var a = <Text style={{backgroundColor:"white"}}>ABC</Text>
    // var b = <Text style={{backgroundColor:"white"}}>CDE</Text>
    // console.log("Type of: ((* ",typeof(a))
    return(
      <View style={{backgroundColor:'white'}}>
        <Text style={{padding:0, textAlign:"center", fontSize:18}}>{item.nosurah}:{item.noayat}</Text>
        <View style={{flexDirection:"row", flexWrap:'wrap'}}>
        <Text>
        <FlatList
        data={listOfObject}
        renderItem={renderBoldAyat}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
        horizontal
        contentContainerStyle={{flex:1,flexWrap:'wrap',marginRight: 10, marginLeft: 10}}
        />
        </Text>
        </View>
        {/* {listOfObject[0]} */}
        {/* <Text style={{fontWeight:"bold"}}>{word}</Text> */}
        {/* <Text style={{textAlign:"center", fontSize:18 }}>{word}</Text> */}
        {/* {listOfObject[1]} */}
      </View>
    //   <View style={{ padding: 20, justifyContent: 'center', alignItems: 'center', width:"100%", backgroundColor:listOfBg[moduloOfFive],}}>
    //   {/* <Text style={{textAlign:"center", fontSize:18 }}><BoldTextInSubstring originalText={item.isiayat} targetPhrase={word}/></Text>  */}
    //   <Text style={{textAlign:"center", fontSize:18 }}>{item.isiayat}</Text> 
    // </View>
  )};


  // function BoldeningString({ ayatSubString}) {
  //   formattedString = ayatSubString.replace(new RegExp(word,'gi'), `<Text style={{fontWeight:"bold"}}>${word}</Text>`);
  //   console.log("formattedString: ------------- ", formattedString)
  //   const abc = "<Text>formattedString</Text>"
  //   return(
  //     eval(abc)
  //   )
  // }


  // function BoldTextInSubstring({ originalText, targetPhrase }) {
  //   const formattedText = originalText.split(' ').map((phrase, index) => {
  //     const isBold = phrase.toLowerCase() === targetPhrase.toLowerCase();
  //     return (
  //       <Text key={index} style={{ fontWeight: isBold ? 'bold' : 'normal' }}>
  //         {phrase}{' '}
  //       </Text>
  //     );
  //   });
  //   console.log("Formatted Text: ",formattedText)
  //   return <Text>{formattedText}</Text>;
  // }





  const boldAyat = ({ayat}) => {
    return(
      eval(ayat)
    )
  }

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


  const toggleCheckBox = () => {
    setMatchIsChecked(!matchIsChecked);
  };

  const surahInputHandle = (surah) => {
    setSurah(surah);
  };

  const wordInputHandle = (word) => {
    setWord(word);
  };

  const firstAyatInputHandle = (firstAyat) => {
    setFirstAyat(firstAyat);
    setSecondAyat(firstAyat);
  };

  const secondAyatInputHandle = (secondAyat) => {
    setSecondAyat(secondAyat);
  };

  const searchButtonHandle = () => {

    db.withTransactionAsync(async () => {
      result = await getData(); // Tunggu hingga getData() selesai dieksekusi
      setQueryResult(result); // Set state dengan hasil query
    });
  };


  const searchHeaderHeight = screenHeight * 0.15;

  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      {/* <View style={{backgroundColor:"blue", height:"40%"}}></View> */}

      <ScrollView style={styles.scrollViewStyle}>
        <View style={[{ height: searchHeaderHeight }, styles.searchHeader]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[basicInputStyle, { width: "95%", height: "28%" }]}
              placeholder="Quran Surah"
              placeholderTextColor="white"
              keyboardType="numeric"
              onChangeText={surahInputHandle}
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
                onChangeText={wordInputHandle}
                value={word}
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
                onChangeText={firstAyatInputHandle}
                value={firstAyat}
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
                onChangeText={secondAyatInputHandle}
                value={secondAyat}
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
        <FlatList
          data={queryResult} // Data yang akan ditampilkan dalam daftar
          renderItem={renderAyat}
          // keyExtractor={(item, index) => index.toString()} // Fungsi untuk menentukan key untuk setiap item
          keyExtractor={(item, index) => index.toString()} 
          scrollEnabled={false}
        />

        {/* <View style={{height: 100, backgroundColor:"red"}}></View> */}



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
