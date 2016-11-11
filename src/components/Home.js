import React, { Component } from 'react';
import {
  StyleSheet,
} from 'react-native';
import { Container, Content, Text, InputGroup, Input, Button, Icon, View } from 'native-base';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default class Home extends Component {
  render() {
    return (
      <Container>
        <Content>
          <Text style={styles.welcome}>
            mixslice-react-native boilerplate
          </Text>
          <View style={styles.container}>
            <Text style={styles.instructions}>
            测试－首页
            </Text>
            <Button>下一页</Button>
          </View>
        </Content>
      </Container>
    );
  }
}
