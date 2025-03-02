import * as React from 'react';
import {  View, ScrollView, StyleSheet, Text, FlatList, TextInput } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { connect } from 'react-redux'
import { white,  black, lightGray, darkBlue } from '../utils/colors.js'
import { MaterialIcons } from '@expo/vector-icons'
import { fetchJobs } from '../utils/api'
import { TouchableOpacity } from 'react-native-gesture-handler';


class Jobs extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Find Jobs'
    }
  }

  state = {
    jobs: []
  }
  
  async componentDidMount() {
    const jobs =  await fetchJobs();
    this.setState({jobs: jobs.data});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topView}>
          <TextInput
            value={text}
            style={{ height: 50, flex: 6, borderColor: lightGray, borderWidth: 1, fontSize: 18 }}
            placeholder="Search"
            onChangeText={this.handleChange}
          />
          <MaterialIcons
            name="settings"
            color="black"
            size={35}
            style={{flex: 1, alignSelf: 'center'}}
            onPress={() => this.props.navigation.navigate('Settings', { })}
          />
        </View>

        <View style={styles.middleView}>
        <FlatList
          data={this.state.jobs}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) =>
            <View style={styles.flatview}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('JobDetails', {jobDetails: item})}>
                <Text style={styles.title}
                  >{item.jobtitle}
                </Text>
                <Text style={styles.company}>
                  {item.company}
                </Text>
                <Text style={styles.description}>
                {item.description}
              </Text>
            </TouchableOpacity>
            </View>
          }
          keyExtractor={item => item.id}
        />
        </View>
        
        <View  style={styles.bottomView}>
        <MapView
        style={{ alignSelf: 'stretch', height: 300 }}
        initialRegion={{
          latitude: this.props.location.coords.latitude,
          longitude: this.props.location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        >
          <Marker
            coordinate={this.props.location.coords}
            title="My Location"
            description="This is where I am."
          />
        </MapView>
        </View>

      </View>
        
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
  bottomView: {
    flex: 3,
    borderBottomColor: 'gray',
    borderBottomWidth: 1
  },
  middleView: {
    flex: 6,
    borderTopColor: 'gray',
    borderBottomColor: 'gray',
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  topView: {
    flex: 1,
    display: 'flex',
    alignContent: 'stretch',
    flexDirection: 'row'
  },
  addCard: {
    padding: 5,
    margin: 5,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
  description: {
    color: black,
    textAlign: 'center',
    fontSize: 12
  },
    company: {
    color: black,
    textAlign: 'center',
    fontSize: 18
  },
  title: {
    textAlign: 'center',
    backgroundColor: white,
    color: darkBlue,
    fontSize: 28
  },
  header: {
    fontSize: 30
  }, 
  flatview: {
    backgroundColor: black,
    borderTopColor: lightGray,
    borderTopWidth: 1
  }
});

function mapStateToProps({},{ navigation }) {
  const location = navigation.getParam('location')
  return { 
    location,
    hasLocationPermissions: true,
    mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }
   }
}

export default connect(mapStateToProps)(Jobs)