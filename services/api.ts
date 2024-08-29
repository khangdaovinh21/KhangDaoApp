
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const getOffers = () => axios.get(`${API_BASE_URL}/offers`);
export const createOffer = (offerData: any) => axios.post(`${API_BASE_URL}/offers`, offerData);
export const updateOffer = (offerId: string, offerData: any) => axios.put(`${API_BASE_URL}/offers/${offerId}`, offerData);
export const deleteOffer = (offerId: string) => axios.delete(`${API_BASE_URL}/offers/${offerId}`);
