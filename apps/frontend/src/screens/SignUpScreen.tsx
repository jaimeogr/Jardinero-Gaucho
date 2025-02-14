import React, { useState } from 'react';
import { Button, View, Text, TextInput } from 'react-native';

const SignUpScreen = ({ navigation }) => {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    console.error('sign up button pressed');
  };

  if (pendingVerification) {
    return (
      <>
        <Text>Verify your email</Text>
        <TextInput value={code} placeholder="Enter your verification code" onChangeText={(code) => setCode(code)} />
        <Button title="Verify" onPress={onSignUpPress} />
      </>
    );
  }

  return (
    <View>
      <>
        <Text>Sign up</Text>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(email) => setEmailAddress(email)}
        />
        <TextInput
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <Button title="Continue" onPress={onSignUpPress} />
      </>
    </View>
  );
};

export default SignUpScreen;
