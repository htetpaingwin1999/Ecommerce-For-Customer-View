import Header from "../components/Header";
import Featured from "../components/Featured";
import {Product} from "../models/Product";
import {Author} from "../models/Author";
import {Category} from "../models/Category";

import {mongooseConnect} from "../lib/mongoose";
import NewProducts from "../components/NewProducts";
import { AuthProvider, useAuth } from '../components/Form/AuthContext';
import { useContext, useEffect } from "react";
import BestSeller from "../components/BestSeller";
import { getTop10BestSellers } from "./bestSellersModule";
import { SearchContext, SearchContextProvider } from "../components/SearchContext";
import { useRouter } from 'next/router';

export default function HomePage({
  featuredProduct,
  newProducts, 
  bestSellersWeekProducts,
  productsInChildLiteratureCategory,
  productsInWorldPoliticsCategory,
  productsInFictionCategory,
  productsProducedInSakeKuuChooPublishedBook,
  productsMatchingSearch,
  isSearch,
}) {
  const { jwtToken } = useAuth();
  const { searchData } = useContext(SearchContext);
  const router = useRouter();
  useEffect(() => {
    console.log("All Products");
  }, [jwtToken]);  

  useEffect(() => {
    console.log("Search value "+searchData);
    console.log("Product Matching");
    console.log(productsMatchingSearch);
    if (productsMatchingSearch.length > 0) {
      router.push(`/product/${productsMatchingSearch[0]._id}`);
    }
  },[])
  return (
    <div>
      <Header />
      {isSearch ?  
        <>
          {productsMatchingSearch.length>0 ? 
            <> 
            </>
            :
            <>
             <p
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '200px', // Optional: Set a fixed height to center vertically within the viewport
                }}
              >
             အားနာပါတယ်၊ သင်ရှာဖွေလိုသော စာအုပ်မရှိပါ။ 
             </p>
            </>
          }         
        </>
          :
        <>
          <Featured product={featuredProduct} />
          {bestSellersWeekProducts.length >0 && (
            <BestSeller products={bestSellersWeekProducts} />
          )}
          <NewProducts products={newProducts} text="အသစ်ထွက်ရှိသောစာအုပ်များ"/>
          <NewProducts products={productsInChildLiteratureCategory} text= "ကလေးစာအုပ်များ"/>
          <NewProducts products={productsInWorldPoliticsCategory} text= "ကမ္ဘာ့နိုင်ငံရေးစာအုပ်များ"/>
          <NewProducts products={productsInFictionCategory} text= "ရသစာပေများ"/>
          <NewProducts products={productsProducedInSakeKuuChooPublishedBook} text= "စိတ်ကူးချိုချိုစာအုပ်တိုက်မှ စာအုပ်များ"/>
        </> 
      }
      
      
    </div>
  );
}


export async function getServerSideProps(context) {
  const featuredProductId = '640de2b12aa291ebdf213d48';
  await mongooseConnect();
  const featuredProduct = await Product.findById(featuredProductId);
  const newProducts = await Product.find({}, null, {sort: {'_id':-1}, limit:20});
  // const allProducts = await Product.find({})
  // .sort({ _id: -1 })
  // .populate('category', 'name') // Populate the 'category' field and select only the 'name' field
  // .populate('author', 'name'); // Populate the 'category' field and select only the 'name' field


  const { bestSellersWeek } = await getTop10BestSellers();
  const bestSellersWeekProducts = await Promise.all(
    bestSellersWeek.map(async (product) => {
      const productData = await Product.findById(product._id);
      return JSON.parse(JSON.stringify(productData));
    })
  );

  // const newProducts = await Product.find({}, null, {sort: {'_id':-1}});
  
  // const currentDate = new Date();
  // currentDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00:000

  // const newProducts = await Product.find(
  //   { createdAt: { $gte: currentDate } },
  //   null,
  //   { sort: { _id: -1 } }
  // );

  const childLiteratureBookByCategory = '649846d8ff8b88bab79214c0'; // Replace with your actual category ID
  const productsInChildLiteratureCategory = await Product.find({ category: childLiteratureBookByCategory })
  .sort({ _id: -1 }) // Sort the products by ID in descending order
  .limit(4); // Limit the results to 20 products (you can adjust this limit)

  const bigorayBookByCategory = '64a296a17e2b797ccdb02d67';
  const productsInBiographyLiteratureCategory = await Product.find({ category: bigorayBookByCategory })
  .sort({ _id: -1 }) // Sort the products by ID in descending order
  .limit(4); // Limit the results to 20 products (you can adjust this limit)

  const worldPoliciticBookByCategory = '64a2976e7e2b797ccdb02d6f';
  const productsInWorldPoliticsCategory = await Product.find({ category: worldPoliciticBookByCategory })
  .sort({ _id: -1 }) // Sort the products by ID in descending order
  .limit(4); // Limit the results to 20 products (you can adjust this limit)

  const fitctionBookByCategory = '64a44d580bd2959f546d7f41';
  const productsInFictionCategory = await Product.find({ category: fitctionBookByCategory })
  .sort({ _id: -1 }) // Sort the products by ID in descending order
  .limit(4); 

  const SakeKuuChoChoPublishedBook = 'စိတ်ကူးချိုချိုစာပေ';
  const productsProducedInSakeKuuChooPublishedBook = await Product.find({ published_place: SakeKuuChoChoPublishedBook })
  .sort({ _id: -1 }) // Sort the products by ID in descending order
  .limit(4); 

  const searchData = context.query.searchData;

  const isSearch = searchData? true: false;
  // Create a regular expression to perform a "like" search
  const searchRegex = new RegExp(searchData, 'i'); // 'i' for case-insensitive search

  // Find products that match the search query using the regular expression
  let productsMatchingSearch = [];
  if (searchData) { // Check if searchData is not empty
    productsMatchingSearch = await Product.find({
      title: searchData,
    }).sort({ _id: -1 }) // Sort the products by ID in descending order
    .limit(4); 
  }


  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      productsInChildLiteratureCategory: JSON.parse(JSON.stringify(productsInChildLiteratureCategory)),
      productsInBiographyLiteratureCategory: JSON.parse(JSON.stringify(productsInBiographyLiteratureCategory)),
      productsInWorldPoliticsCategory: JSON.parse(JSON.stringify(productsInWorldPoliticsCategory)),
      productsInFictionCategory: JSON.parse(JSON.stringify(productsInFictionCategory)),
      productsProducedInSakeKuuChooPublishedBook: JSON.parse(JSON.stringify(productsProducedInSakeKuuChooPublishedBook)), 
      // allProducts: JSON.parse(JSON.stringify(allProducts)),
      bestSellersWeek: JSON.parse(JSON.stringify(bestSellersWeek)),
      bestSellersWeekProducts: bestSellersWeekProducts,
      productsMatchingSearch: JSON.parse(JSON.stringify(productsMatchingSearch)),
      isSearch
    },
  };
}