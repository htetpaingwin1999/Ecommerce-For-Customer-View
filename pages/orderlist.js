import Header from "../components/Header";
import styled from "styled-components";
import Center from "../components/Center";
import {mongooseConnect} from "../lib/mongoose";
import Title from "../components/Title";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import $ from 'jquery'; // Import jQuery
import DataTable from 'react-data-table-component';
import OrderDatatableComponent from "../components/OrderDatatableComponent";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Ensure it's imported


export default function OrderListPage({}) {
    const [orders,setOrders] = useState([]);
   const [clientID, setClientID] = useState('');

    useEffect(() => {
    },[]);
      console.log("User ID"+clientID);
    
    useEffect(() => {
      setClientID(localStorage.getItem('UserIDforTainHlwar'))

      // Make the API request with the clientID as a query parameter
      axios.get(`/api/ordersbycustomers?clientID=${clientID}`)
        .then(response => {
          setOrders(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }, [clientID]);
     // Function to generate an abstract voucher number based on createdAt
    
  
    return (
    <>
        <Header />
        <Center>
            <Title>Your Order Lists</Title>
            <h1>Orders</h1>
        <OrderDatatableComponent orders={orders}/>
        </Center>
    </>
    
    );
 
}

