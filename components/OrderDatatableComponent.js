import React, { useEffect, useRef } from 'react';
import DataTable from 'react-data-table-component';
import { useState } from 'react';
import Link from "next/link";

const OrderDatatableComponent = ({ orders }) => {
    const [searchText, setSearchText] = useState('');

const columns = [
        {
          name: 'Date',
          selector: 'createdAt',
          sortable: true,
          format: (row) => new Date(row.createdAt).toLocaleString(),
        },
        {
          name: 'Paid',
          selector: 'paid',
          sortable: true,
          format: (row) => (row.paid ? 'YES' : 'NO'),
          cell: (row) => (
            <span className={row.paid ? 'text-green-600' : 'text-red-600'}>
              {row.paid ? 'YES' : 'NO'}
            </span>
          ),
        },
        {
          name: 'Address',
          selector: 'address',
          sortable: false,
          cell: (row) => (
            <div>
              {row.name} {row.email}
              <br />
              {row.city} {row.postalCode} {row.country}
              <br />
              {row.streetAddress}
            </div>
          ),
        },
        {
          name: 'Products Name',
          selector: 'productName',
          sortable: false,
          cell: (row) => (
            <div>
              {row.line_items.map((item) => (
                <div key={item._id}>{item.price_data.product_data.productTitle}</div>
              ))}
            </div>
          ),
        },
        {
          name: 'Product Quantity',
          selector: 'productQuantity',
          sortable: false,
          cell: (row) => (
            <div>
              {row.line_items.map((item) => (
                <div
                  key={item._id}
                  className={
                    row.status === 1
                      ? 'border-green-500 border'
                      : row.status === 0
                      ? 'border-blue-500 border'
                      : 'border-red-500 border'
                  }
                >
                  {item.quantity}အုပ်
                </div>
              ))}
            </div>
          ),
        },
        {
            name: 'Actions',
            cell: (row) => {
              if(row.status === 0){
                return (
                  <button className="btn-pay" style={{ backgroundColor: '#f0f0f0', color: '#999', cursor: 'not-allowed', pointerEvents: 'none', border: '1px solid #ccc' }}>
                  <img
                    src="https://cdn3.iconfinder.com/data/icons/digital-marketing-4-11/65/169-512.png"
                    alt="Pay"
                    className="pay-icon"
                    style={{ width: '16px', height: '16px' }}
                  />
                  Waiting List
                </button>  
                );
              }
              else if(row.status === 1){
                return (
                <a href={`/pay/${row._id}`}>
                    <button className="btn-pay">                    
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4614/4614115.png"
                            alt="Pay"
                            className="pay-icon"
                            style={{ width: '16px', height: '16px' }} // Adjust the image size        
                        />
                        Pay
                    </button>
              </a>)
              }
              else if(row.status === 2){
                return(
                <button className="btn-pay">                    
                    <img
                        src="https://image.similarpng.com/very-thumbnail/2021/08/Green-check-mark-icon.png"
                        alt="Done"
                        className="pay-icon"
                        style={{ width: '16px', height: '16px' }} // Adjust the image size        
                    />
                    Paid Pending
                </button>
                )
              }
              else if(row.status === 3){
              return(
                <button className="btn-pay">                    
                    <img
                        src="https://image.similarpng.com/very-thumbnail/2021/08/Green-check-mark-icon.png"
                        alt="Done"
                        className="pay-icon"
                        style={{ width: '16px', height: '16px' }} // Adjust the image size        
                    />
                    Paid Confirmed
                </button>)
              }
              return null;
            },
        },
        {
          name: 'Remark',
          cell: (row) => {
            if(row.status === 0){
              return (
                      <p>Order Confirmဖို့ စောင့်ဆိုင်းပေးပါရှင်။</p>
              );
            }
            if(row.status === -1){
              return (
                      <p>Cancel ထားသော Order ပါ။</p>
              );
            }
            if(row.status === 1){
              return (
                      <p>Order Confirm ပါတယ်ရှင်။ Payment Process လေးလုပ်ပေးပါနော်</p>
              );
            }
            if(row.status === 2){
              return (
                <>
                    <p>Payment တင်သွင်းမှုလုပ်ဆောင်ထားတဲ့အတွက် ကျေးဇူးတင်ပါတယ်။ </p>
                    <p>Payment လေး confirm ဖို့စောင့်ပေးပါနော်</p>
                </>  
              );
            }
            if(row.status === 2){
              return (
                <>
                    <p>ဝယ်ယူအားပေးမှုအတွက် ကျေးဇူးတင်ပါတယ်။</p>
                </>  
              );
            }
            return null;
          },
      },
      ];
      const conditionalRowStyles = [
        {
          when: (row) => row.status === 0, //pending ဖြစ်နေတာ။
          style: {
            background: '#EBECF0',
            color: '#000',
          },
        },
        {
          when: (row) => row.status === 1, //order confirmed ပြီးပြီ၊ ပိုက်ဆံမချေရသေးဘူး။
          style: {
            background: 'orange',
            color: '#fff',
          },
        },
        {
          when: (row) => row.status === 2, //payment တော့တင်ပြီးပြီ၊ payment confirm ကျန်။
          style: {
            background: '#119afa',
            color: '#fff',
          },
        },
        {
          when: (row) => row.status === 3, //payment confirmed ပြီးကြောင်း။
          style: {
            background: 'green',
            color: '#fff',
          },
        },
        {
          when: (row) => row.status === -1, //cancel ဖြစ်တာ။
          style: {
            background: 'red',
            color: '#fff',
          },
        },
      ];
      const filteredOrders = orders.filter((order) => {
        const name = order.name ? order.name.toLowerCase() : '';
        return name.includes(searchText.toLowerCase());
      });
    
    return (
        <div>
          <input
            type="text"
            placeholder="Search by Name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
                width: '50%',
                padding: '12px',
                border: '2px solid #ccc',
                borderRadius: '5px',
                fontSize: '16px',
                backgroundColor: '#f8f8f8',
                outline: 'none',
                transition: 'border-color 0.3s',
                margin: '10px'
              }}
          />
          <DataTable
            columns={columns}
            data={filteredOrders}
            conditionalRowStyles={conditionalRowStyles}
            pagination
            paginationPerPage={10}
          />
        </div>
      );
    };
    
export default OrderDatatableComponent;
