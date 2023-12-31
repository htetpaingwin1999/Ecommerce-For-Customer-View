import Header from "../../components/Header";
import styled from "styled-components";
import Center from "../../components/Center";
import {mongooseConnect} from "../../lib/mongoose";
import Title from "../../components/Title";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import $ from 'jquery'; // Import jQuery
import DataTable from 'react-data-table-component';
import OrderDatatableComponent from "../../components/OrderDatatableComponent";
import PaymentForm from "../../components/PaymentForm";
import { useRouter } from "next/router";

export default function OrderListPage({}) {
    const router = useRouter();
    const [orders,setOrders] = useState([]);
    
    useEffect(() => {
      
      axios.get('/api/orders').then(response => {
        setOrders(response.data);
      });
    }, []);

    let { id } = router.query;
    console.log(id);
     // Function to generate an abstract voucher number based on createdAt
    
  
    return (
    <>
        <Header />
        <Center>
            <PaymentForm orderId={id} />
        </Center>
    </>
    
    );
 
}

