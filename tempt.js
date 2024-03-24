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