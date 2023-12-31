import Header from "../components/Header";
import styled from "styled-components";
import Center from "../components/Center";
import Button from "../components/Button";
import {useContext, useEffect, useRef, useState} from "react";
import {CartContext} from "../components/CartContext";
import axios from "axios";
import Table from "../components/Table";
import Input from "../components/Input";
import "select2/dist/css/select2.css"; // Import select2 styles
import "select2"; // Import the select2 library
import $ from "jquery"; // Import jQuery
import { DiscountByAmount } from "../models/DiscountByAmount";
import { v4 as uuidv4 } from 'uuid';

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr .8fr;
  }
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  width: 300px; 
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  width: 100px;
  height: 100px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display:flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img{
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img{
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 10px;
  }
`;

const CityHolder = styled.div`
  display:flex;
  gap: 5px;
`;

const ProductRow = styled.div`
  display: flex;
  align-items: center; /* Vertically center the content */
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 10px; /* Add some spacing between the image and the discount part */
`;

const DiscountBadge = styled.div`
  text-align: center;
  color: white;
  background-color: orange;
  padding: 5px;
  border-radius: 5px;
`;

export default function CartPage() {
  const {cartProducts,addProduct,removeProduct,clearCart} = useContext(CartContext);
  const townships = [
"Kyaek Se (Mandalay)",
"Myit Tha (Mandalay)",
"Singaing (Mandalay)",
"Tada U (Mandalay)",
"Amarapura (Mandalay)",
"Aung Myay Tha Zan (Mandalay)",
"Chan Aye Thar Zan (Mandalay)",
"Chan Mya Thar Zi(Mandalay)",
"Maha Aung Mye (Mandalay)",
"Pathein Gyi (Mandalay)",
"Pyi Gyi Dagon (Mandalay)",
"Mahlaing (Mandalay)",
"Meik Htila (Mandalay)",
"Tha Zi (Mandalay)",
"Wun Dwin (Mandalay)",
"Myin Gyan (Mandalay)",
"Nah To Gyi (Mandalay)",
"Taung Tha (Mandalay)",
"Kyauk Pa Daung (Mandalay)",
"Nyaung U (Mandalay)",
"Madaya (Mandalay)",
"Pyin Oo Lwin (Mandalay)",
"Bo Ta Taung (Yangon)",
"Kyi Myin Daing (Yangon)",
"Ta Mwe (Yangon)",
"East Dagon (Yangon)",
"North Dagon (Yangon)",
"South Dagon (Yangon)",
"North Okkalapa (Yangon)",
"South Okkalapa (Yangon)",
"Mingala Taungnyut (Yangon)",
"Yankin (Yangon)",
"Thin Gan Gyun (Yangon)",
"Daw Bon (Yangon)",
"Pa Zun Daung (Yangon)",
"Tha Ke Ta (Yangon)",
"Than Lyin (Yangon)",
"Dagon Seikkan (Yangon)",
"Kyauk Ta Da (Yangon)",
"Ka Ma Yut (Yangon)",
"Ahlone (Yangon)",
"Mingaladon (Yangon)",
"Seikkan (Yangon)",
"Lan Ma Daw (Yangon)",
"Mayan Gon (Yangon)",
"Insein (Yangon)",
"Hmaw Bi (Yangon)",
"Bahan (Yangon)",
"Hlaing (Yangon)",
"San Chaung (Yangon)",
"La Tha (Yangon)",
"Hle Gu (Yangon)",
"Shwe Pyi Tha (Yangon)",
"Hlaing Thaya (Yangon)",
"Pabedan (Yangon)",
]
  const [products,setProducts] = useState([]);
  const [clientID,setClientID] = useState('');
  const [clientEmail,setClientEmail] = useState('');


  const [phone,setPhone] = useState('09799136751');
  const [city,setCity] = useState('Mandalay');
  const [streetAddress,setStreetAddress] = useState('86');
  const [note,setNote] = useState('Book Order');
  const [isSuccess,setIsSuccess] = useState(false);

  const selectRef = useRef(null);
  const [myanmarStates, setMyanmarStates] = useState([]); // State to store the JSON data
  const [discountPercentage, setDiscountPercentage] = useState(null);
  const [discountStartDate, setDiscountStartDate] = useState(null);
  const [discountEndDate, setDiscountEndDate] = useState(null);
  const [amountToGetDiscount, setAmountToGetDiscount] = useState(null);
  const [discountDescription, setDiscountDescription] = useState(null);
  const [hasDiscountByAmountData, setHasDiscountByAmountData] = useState(null);

  const [discountByProducts, setDiscountByProducts] = useState([]);
  const [hasBeenChanged, setHasBeenChanged] = useState(false);

  // discount by amount of line item
  const [line_discountbyamount, setLineDiscountByAmount] = useState(0);

  useEffect(() => {
    if(hasBeenChanged === false){
      $('#mySelect').select2();
    }
    $(selectRef.current).on('change', (e) => {
      const selectedValue = e.target.value;
      // Update your React state here if needed
      setCity(selectedValue);
    });

    // Clean up Select2 instance when the component unmounts
    return () => {
      $(selectRef.current).select2('destroy');
    };
  })
  useEffect(() => {
    // Fetch data from the API endpoint
    fetch("/api/discountbyamount") // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setLineDiscountByAmount(
          data._id ? 
          {
            id: data._id,
            amount: data.amount,
            discount_percentage: data.discount_percentage,
            description: data.description,
            start_date: data.start_date,
            end_date: data.end_date
          }
          :"{}"
        )

        //console.log("Line Discount By Amount", line_discountbyamount);

        setDiscountPercentage(data?.discount_percentage);
        setDiscountStartDate(data?.start_date);
        setAmountToGetDiscount(data?.amount);
        setDiscountEndDate(data?.end_date);
        setDiscountDescription(data?.description);
        setHasDiscountByAmountData("has");
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // console.log(
  // "Discount By Amount data" + discountPercentage
  // +"Discount Start Date:"+discountStartDate
  // +"Discount End Date:"+ discountEndDate
  // +"Discount Description:"+discountDescription
  // +"Amount to Get Discount:"+ amountToGetDiscount
  // );

  useEffect(() => {
    // Fetch data from the API endpoint
    fetch("/api/discountbyproduct") // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setDiscountByProducts(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  //console.log(discountByProducts[0]);
  
  useEffect(() => {
    setClientID(localStorage.getItem('UserIDforTainHlwar'))
    setClientEmail(localStorage.getItem('UserEmail'));

    console.log("User ID"+clientID);
    if (cartProducts.length > 0) {
      axios.post('/api/cart', {ids:cartProducts})
        .then(response => {
          setProducts(response.data);
        })
    } else {
      setProducts([]);
    }
  }, [cartProducts]);
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window?.location.href.includes('success')) {
      setIsSuccess(true);
      clearCart();
    }
  }, []);
  function moreOfThisProduct(id) {
    setHasBeenChanged(true);
    addProduct(id);
  }
  function lessOfThisProduct(id) {
    setHasBeenChanged(true);
    removeProduct(id);
  }
  async function addOrder() {
    console.log("Line Discount By Amount");
    console.log(line_discountbyamount);
    const response = await axios.post('/api/checkouts', {
      clientID,clientEmail,phone,city,streetAddress,note,
      cartProducts,
      line_discountbyamount,
    });
    if (response.data.url) {
      window.location = response.data.url;
    }
  }

  let total = 0;
  for (const productId of cartProducts) {
    const price = products.find(p => p._id === productId)?.price || 0;
    //console.log("Product Id" +productId+calculateProductTotal(productId, cartProducts, products))
    
    const discount = discountByProducts.find(discount => discount.productId === productId);
    const discount_percentage = discount ? discount.discount_percentage : 0;
    const start_date = discount ? discount.start_date : "";
    const end_date = discount ? discount.end_date : "";
    const discount_by_prdouct_id = discount ? discount._id : "";
    //console.log("Discount Percentage"+(price - ((price* discount_percentage)/100)).toFixed(0))
    
    const discountedPrice = Math.round(price - (price * discount_percentage) / 100);
    total += (discountedPrice);    
  }

  function calculateProductTotal(productId, cartProducts, products) {
    const quantity = cartProducts.filter(id => id === productId).length;
    const product = products.find(p => p._id === productId);
    if (!product) return 0; // Handle the case where the product is not found
    return quantity * product.price;
  }

  function getDiscountPercentage(product, discountByProducts) {
    const discount = discountByProducts.find(discount => discount.productId === product._id);
  
    return discount ? discount.discount_percentage : 0; // Return 0 if there's no discount
  }
  
  function calculateDisplayValue(discountPercentage, productTotal) {
    if (discountPercentage !== 0) {
      return productTotal- (productTotal * discountPercentage) / 100;
    } else {
      return productTotal;
    }
  }

  const handleCityChange = (event) => {
    console.log("Hello Handle city changed");
    setCity(event.target.value);
    console.log("Selected city"+event.target.value);
    setHasBeenChanged(true);
  };

  if (isSuccess) {
    return (
      <>
        <Header />
        <Center>
          <ColumnsWrapper>
            <Box>
              <h3>Order တင်မှုအတွက် ကျေးဇူး အများကြီးတင်ပါတယ်။</h3>
              <p>လူကြီးမင်းကို ဖုန်းလေးနဲ့ တစ်ချက်ပြန်ဆက်သွယ်ပေးပါမယ်နော်</p>
              <p>မင်္ဂလာရှိသောနေ့လေးဖြစ်ပါစေရှင်...</p>
            </Box>
          </ColumnsWrapper>
        </Center>
      </>
    );
  }
  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <Box>
            <h2>Cart</h2>
            {!cartProducts?.length && (
              <div>စျေးဝယ်ခြင်းတောင်း ဗလာဖြစ်နေပါတယ်ရှင်။ စာအုပ်လေးတစ်အုပ်လောက်တော့ အားပေးသွားပါလား စာပေချစ်သူရေ...📙</div>
            )}
          
            {products?.length > 0 && (
              <Table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Cost</th>
                    <th>Net Cost</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                  <tr key={product._id}>
                    <ProductInfoCell>
                      <ProductImageBox>
                        <img src={product.images[0]} alt=""/>
                        
                      </ProductImageBox>
                      
                      {product.title}
                      <br/>
                      {getDiscountPercentage(product, discountByProducts) > 0 && (
                        <ProductRow>
                          <ProductImage src="../discountBadge.png" alt="Discount Badge" />
                          {discountByProducts.some(discount => discount.productId === product._id) && (
                            <DiscountBadge>
                              {getDiscountPercentage(product, discountByProducts)} % Discount
                            </DiscountBadge>
                          )}
                        </ProductRow>)
                      }
                      
                    </ProductInfoCell>
                    <td>
                      <Button
                        onClick={() => lessOfThisProduct(product._id)}>-</Button>
                      <QuantityLabel>
                        {cartProducts.filter(id => id === product._id).length}
                      </QuantityLabel>
                      <Button
                        onClick={() => moreOfThisProduct(product._id)}>+</Button>
                    </td>
                    <td>
                      {product.price}ကျပ်
                    </td>
                    <td>
                      {cartProducts.filter(id => id === product._id).length * product.price} ကျပ်
                    </td>
                    
                    <td>
                    {calculateDisplayValue(getDiscountPercentage(product, discountByProducts), calculateProductTotal(product._id, cartProducts, products)).toFixed(0)} ကျပ်
                    </td>
                  </tr>
                ))}

                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{total}ကျပ်</td>   
                  </tr>
                  
                </tbody>
                
              </Table>
            )}

            {cartProducts.length > 0 && (
              total >= amountToGetDiscount ? 
              (
                <div style={{ backgroundColor: 'palegreen', padding: '10px', borderRadius: '5px' }}>
                  You qualify for a discount of {discountPercentage}%!
                </div>
              ) : 
              (
                <div style={{ opacity: 0.5, pointerEvents: 'none' }}>
                  You need to reach {amountToGetDiscount} to qualify for a discount.
                </div>
              )
            )}  
          </Box>
          {!!cartProducts?.length && clientID !== null && (
            <Box>
              <h2>Order information</h2>
             
              <Input type="text"
                     placeholder="Phone"
                     value={phone}
                     name="phone"
                     onChange={ev => {setPhone(ev.target.value);setHasBeenChanged(true)}}
                     style={{ marginTop: "10px", fontSize: "14px" }}
                     />
              
              <select id="" style={{ width: "100%" }} onChange={handleCityChange} value={city}>
                <option value="">Select a township</option>
                {townships.map((township, index) => (
                  <option key={index} value={township}>
                    {township}
                  </option>
                ))}
              </select>

              <Input type="text"
                     placeholder="Street Address"
                     value={streetAddress}
                     name="streetAddress"
                     onChange={ev => { setStreetAddress(ev.target.value); setHasBeenChanged(true)}}
                     style={{ marginTop: "10px", fontSize: "14px" }}
                     />
                
              <textarea name="note" id="" cols="30" rows="10" style={{ width: '100%',marginTop: "10px", fontSize: "14px" }} placeholder="note"
              onChange={ev => {setNote(ev.target.value); setHasBeenChanged(true)}}
              ></textarea>

              <Button black block
                      onClick={addOrder}
                style={{padding: "7px"}}        
              >
                Add Order
              </Button>
            </Box>
          )}

          {clientID === null && (
            <Box style={{justifyContent:"center",alignItems: "center"}}>
              <p style={{textAlign:"Center"}}>ကျေးဇူးပြု၍ အကောင့် Logged in အရင် ဝင်ပေးပါရှင်...</p>
              <img src="https://i.pinimg.com/originals/20/5c/da/205cdaf7caf31069ca4fae4120702e27.gif" alt="" />
            </Box>
          )}
        </ColumnsWrapper>
      </Center>
    </>
  );
}