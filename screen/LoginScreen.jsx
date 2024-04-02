import React, { useState } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, Button, FormControl, Input, Center, Container, Stack, Text, Image } from 'native-base';
import { NativeBaseProvider } from 'native-base';

const LoginScreen = ({ navigation }) => { // ナビゲーションのプロップスを渡す
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api', // APIのベースURLを更新
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`,
    },
  });

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/sanctum/token', { 
        email: email,
        password: password,
        device_name: 'iphone'
      });
      const token = response.data; // レスポンスからトークンを取得
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await AsyncStorage.setItem('userToken', token); // トークンをローカルストレージに保存
      // Alert.alert("Login Successful", "You have been logged in successfully.");
      console.log("トークンが保存できました"); 
      console.log(token);

          const res = await apiClient.get('/user')
          console.log(res.data);
        
      // ログイン後の画面へのナビゲーションなどの処理をここに追加
      navigation.navigate('WebView',{email,password});
    } 
    catch (error) {
      console.error(error.response ? error.response.data : error);
      Alert.alert("ログインできませんでした", "ログインIDとパスワードを確認してください。");
    }
  };

  const handleLogin = () => {
    login(email, password);
  };

  return (
    <NativeBaseProvider>
      <Container bg="white" 
        // justifyContent="center"
        flex={1}
        p={20}
        mx="auto"
        alignItems="center"
        maxWidth="100%"
      >
        <Center>
        <Image marginTop={5}
               marginBottom={10}
          style={{width: 300, height: 60, 
                  resizeMode: 'contain'
                }}
          source={require('../assets/img/APPEL_FULL_Logo-h.png')}
          alt='logo'
        />
          <Box>
          <FormControl.Label>
              <Text fontSize={20}
                    color="gray.500"
              >
                ログインID</Text>
            </FormControl.Label>
            <Stack mx="4">
              <Input
                fontSize={15}
                bgColor={"gray.100"}
                type="email"
                width={250}
                height={10}
                value={email}
                onChangeText={setEmail}
                placeholder="ログインID"
              />
            </Stack>
          </Box>
          <Box>
            <FormControl.Label marginTop={5}>
              <Text fontSize={20}
                    color="gray.500"
              >
                パスワード</Text>
            </FormControl.Label>
            <Stack mx="4">
              <Input
                fontSize={15}
                type="password"
                bg={"gray.100"}
                width={250}
                height={10}
                value={password}
                onChangeText={setPassword}
                placeholder="パスワード"
                marginBottom={10}
              />
            </Stack>
          </Box>
          <Button
            // colorScheme="success"
            bg="green.500"
            borderColor="green.500"
            width={150}
            marginTop={15}
            onPress={handleLogin}
          >
            <Text bold
                  fontSize={20}
                  color="white">
            ログイン
            </Text>
          </Button>
        </Center>
      </Container>
    </NativeBaseProvider>
  );
}


export default LoginScreen;
