import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, TextInput } from 'react-native';
import axios from 'axios';
import { Offer } from '../types';
import { PlusIcon, HamburgerIcon, SettingsIcon } from '../assets/icons'; 

const OfferList: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newOffer, setNewOffer] = useState<Partial<Offer>>({});
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:3000/api/offers');
      setOffers(response.data.reverse());  
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const handleCreateOffer = async () => {
    try {
      await axios.post('http://10.0.2.2:3000/api/offers', newOffer, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setNewOffer({});
      setModalVisible(false);
      fetchOffers();
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const handleUpdateOffer = async () => {
    if (selectedOffer?._id) {
      try {
        await axios.put(`http://10.0.2.2:3000/api/offers/${selectedOffer._id}`, newOffer, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setNewOffer({});
        setSelectedOffer(null);
        fetchOffers();
        setModalVisible(false);
      } catch (error) {
        console.error('Error updating offer:', error);
      }
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    try {
      await axios.delete(`http://10.0.2.2:3000/api/offers/${offerId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      fetchOffers();
    } catch (error: any) {
      console.error('Error deleting offer:', error.message || error);
    }
  };

  const handleBuyNow = (offerId: string) => {
    console.log(`Buy Now clicked for offer ID: ${offerId}`);
  };

  const renderOffer = ({ item }: { item: Offer }) => (
  <View style={styles.offerCard}>
    <View style={styles.grouptitle} >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.discountGroup}>
        <Text style={styles.discountLabel}>Discount: </Text>
        <Text style={styles.discountValue}>{item.discountPercentage}%</Text>
      </View>

      <View style={styles.originalPriceGroup}>
        <Text style={styles.originalPriceLabel}>Original Price: </Text>
        <Text style={styles.originalPriceValue}>${item.originalPrice}</Text>
      </View>

      <View style={styles.discountedPriceGroup}>
        <Text style={styles.discountedPriceLabel}>Discounted Price: </Text>
        <Text style={styles.discountedPriceValue}>${item.discountedPrice}</Text>
      </View>
      </View>
      <TouchableOpacity
        style={styles.buyNowButton}
        onPress={() => handleBuyNow(item._id)}
      >
        <Text style={styles.buttonText1}>Buy Now</Text>
      </TouchableOpacity>
      <View style={styles.groupButton}>
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => {
            setSelectedOffer(item);
            setNewOffer({
              title: item.title,
              description: item.description,
              discountPercentage: item.discountPercentage,
              originalPrice: item.originalPrice,
              discountedPrice: item.discountedPrice
            });
            setModalVisible(true);
          }}
        >
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteOffer(item._id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.groupcontainer} >
      <HamburgerIcon />
      <SettingsIcon />
      </View>
      <FlatList
        data={offers}
        renderItem={renderOffer}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        style={styles.addOfferButton}
        onPress={() => {
          setSelectedOffer(null);
          setNewOffer({});
          setModalVisible(true);
        }}
      >
          <PlusIcon />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalView}>
          <TextInput
            placeholder="Title"
            value={newOffer.title || ''}
            onChangeText={(text) => setNewOffer({ ...newOffer, title: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            value={newOffer.description || ''}
            onChangeText={(text) => setNewOffer({ ...newOffer, description: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Discount Percentage"
            value={newOffer.discountPercentage ? newOffer.discountPercentage.toString() : ''}
            keyboardType="numeric"
            onChangeText={(text) => {
              const sanitizedText = text.replace(/[^0-9.]/g, '');
              setNewOffer({ ...newOffer, discountPercentage: parseFloat(sanitizedText) || 0 });
            }}
  style={styles.input}
/>
          <TextInput
            placeholder="Original Price"
            value={newOffer.originalPrice ? newOffer.originalPrice.toString() : ''}
            keyboardType="numeric"
            onChangeText={(text) => setNewOffer({ ...newOffer, originalPrice: parseFloat(text) })}
            style={styles.input}
          />
          <TextInput
            placeholder="Discounted Price"
            value={newOffer.discountedPrice ? newOffer.discountedPrice.toString() : ''}
            keyboardType="numeric"
            onChangeText={(text) => setNewOffer({ ...newOffer, discountedPrice: parseFloat(text) })}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={selectedOffer ? handleUpdateOffer : handleCreateOffer}
          >
            <Text style={styles.buttonText}>{selectedOffer ? 'Update Offer' : 'Create Offer'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton2}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#5F9EA0', 

  },
  groupcontainer:{
    height:70,
    backgroundColor:"#5F9EA0",
    flexDirection:"row",
    justifyContent:"space-between",
    marginHorizontal:15,
    alignItems:"flex-end",
    marginBottom:15,
  },
  containertext:{
    fontSize:20,
    fontWeight:"bold",
    color:"black",
  },
  offerCard: { 
    marginBottom: 16, 
    padding: 16, 
    marginHorizontal:10,
    backgroundColor: '#fff', 
    borderRadius: 8, 
  },
  title: { 
    fontSize: 25, 
    fontWeight: 'bold', 
    color:"#FF9900"
  },
  description: { 
    marginVertical: 10,
    color:"#0000BB",
    fontSize:15,
    fontWeight:"bold",
   },
  grouptitle:{
    alignItems:"center",
  },
  modalView: { 
    flex: 1, 
    justifyContent: "flex-end", 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)', 
  },
  input: { 
    height: 50, 
    borderColor: 'gray', 
    borderWidth: 1, 
    width: '95%', 
    paddingHorizontal: 10, 
    backgroundColor: '#fff', 
    borderRadius:10,
  },
  
  buttonText: { 
    color: 'black', 
    fontSize: 13, 
    fontWeight:"bold"
  },
  buttonText1: { 
    color: 'white', 
    fontSize: 16 
  },
  groupButton:{
    flexDirection:"row",
    justifyContent:"space-between",
  },
  flatListContent: { 
  
  }, 
  buyNowButton: { 
    backgroundColor: '#FF0000', 
    padding: 7, 
    borderRadius: 10, 
    width: '100%', 
    alignItems: 'center', 
    marginVertical: 5 
  },
  updateButton: { 
    backgroundColor:'transparent', 
    padding: 5, 
    borderRadius: 10, 
    width: '48%', 
    alignItems: 'center', 
    marginVertical: 5,
    borderWidth:0.5
  },
  deleteButton: { 
    backgroundColor:'transparent', 
    padding: 5, 
    borderRadius: 10, 
    width: '48%', 
    alignItems: 'center', 
    marginVertical: 5 ,
    borderWidth:0.5
  },
  modalButton: { 
    backgroundColor: '#FF6600', 
    padding: 15, 
    borderRadius: 10, 
    width: '80%', 
    alignItems: 'center', 
    marginBottom:5,
    marginTop:5,
  },
  modalButton2: { 
    backgroundColor: '#999999', 
    padding: 10, 
    borderRadius: 10, 
    width: '50%', 
    alignItems: 'center', 
    marginBottom:20,
  },
  addOfferButton: { 
    position: 'absolute', 
    bottom: 40, 
    right: 20, 
  },
  discountGroup: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems:"center"

  },
  originalPriceGroup: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  discountedPriceGroup: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems:"center"
  },

  discountLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  originalPriceLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  discountedPriceLabel: {
    fontWeight: 'bold',
    color: '#333',
  },

  discountValue: {
    fontWeight: 'bold',
    fontSize:20,
    color: '#FF0000',
  },
  originalPriceValue: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  discountedPriceValue: {
    fontWeight: 'bold',
    fontSize:20,
    color: '#28a745',
  },
});


export default OfferList;
