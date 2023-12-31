import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'select2/dist/css/select2.min.css';
import 'select2';
import jQuery from 'jquery';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { useRouter } from "next/router";

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false
});
export default function PaymentForm() {
  const router = useRouter();
  const [transactionID, setTransactionID] = useState('');
  const [note, setNote] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState(null); // Use null for a single file
  let { id } = router.query;
  console.log("Query ID");
  console.log(id);

  const [clientID,setClientID] = useState('');
  useEffect(() => {
    setClientID(localStorage.getItem('UserIDforTainHlwar'))
    console.log("User ID"+clientID);
    
  }, [clientID]);

  
  const paymentMethods = [
    { value: 2, label: 'K Pay' },
    { value: 3, label: 'AYA Pay' },
    { value: 4, label: 'Wave Money' },
    { value: 5, label: 'CB Pay' },
    { value: 6, label: 'Others' },
  ];

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const handlePaymentMethodSelect = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handleTransactionChange = (event) => {
    setTransactionID(event.target.value);
  };

  const handleNoteChange = (contentState) => {
    setNote(contentState);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData();

    if (image) {
      data.append("file", image);
    }

    try {
      setIsUploading(true);
      const response = await axios.post("/api/screenshot-upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedImagePath = response.data.links[0].link;
     
      const formData = {
        clientID: clientID,
        paymentDate: new Date().toISOString(),
        transactionID: transactionID,
        orderID: id,
        paymentMethod: selectedPaymentMethod,
        status: 0,
        screenshot:uploadedImagePath,
        note: note,
      };
      await axios.post("/api/payments", formData);
      //Error တက်ရင် ဒီကုဒ်ပြန်သုံး
      // const updateData = {
      //    _id: "6506565b766b1c0088d99681",
      //    status: 1, //ငွေလွှဲပြီးလို့ order တင်လိုက်တာပါ။
      // };

      const updateData = {
        _id,
        status: 2, //ငွေလွှဲပြီးလို့ order တင်လိုက်တာပါ။
     };
      
      await axios.put(`/api/orders`, updateData);

      const router = useRouter();
      router.push('/');      
    } catch (error) {
      console.error(error);
      setIsUploading(false);
    }
  }

  return (
    <div style={{ background: '#fff', padding: '30px' }}>
      <h2>Payment Form</h2>
      <div>
        <form onSubmit={handleSubmit} className="text-gray" encType="">
          <label htmlFor="paymentMethod">Select Payment Method:</label><br />
          <select
            id="paymentMethod"
            value={selectedPaymentMethod}
            onChange={handlePaymentMethodSelect}
            style={{ width: '80%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '40px' }}
          >
            <option value="">Select a payment method</option>
            {paymentMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
          <br /><br />

          <label htmlFor="transactionID">Transaction ID:</label><br />
          <input
            type="text"
            id="transaction_id"
            value={transactionID}
            onChange={handleTransactionChange}
            style={{ width: '80%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '10px' }}
          />
          <br />

          <label htmlFor="image">Screenshot</label>
          <br />

          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt={`Uploaded Screenshot`}
              style={{ width: "200px", height: "200px" }}
            />
          )}

          <input
            type="file"
            onChange={(ev) => setImage(ev.target.files[0])}
            style={{ width: '80%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '30px' }}
          />
          <br />

          <label htmlFor="note">Note</label>
          <div>
            {/* Render ReactQuill only on the client-side */}
            {typeof window !== 'undefined' && (
              <ReactQuill
                value={note}
                onChange={value => setNote(value)}
                placeholder="Note"
                style={{ width: '80%', minHeight: '150px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '30px' }}
              />
            )}
          </div>
          <br />

          <button type="submit" className='btn-primary mt-3' style={{ padding: '10px', borderRadius: '4px', background: '#007bff', color: '#fff', border: 'none', marginBottom: '30px' }}>
            {isUploading ? "Loading" : "Submit Payment"}
          </button>
        </form>
      </div>
    </div>
  );
}
