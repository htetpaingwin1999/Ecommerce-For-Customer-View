import Header from "../../components/Header";
import Center from "../../components/Center";
import {mongooseConnect} from "../../lib/mongoose";
import { useRouter } from "next/router";
import ProductsGrid from "../../components/ProductsGrid";
import { Product } from "../../models/Product";

export default function ProductsPageByCategory({products}) {
    const router = useRouter(); // Use the useRouter hook to access the route parameters
    let { id } = router.query;
    console.log(products)
    return (
    <>
      <Header />
      <Center>
        {/* <Title></Title> */}
        <ProductsGrid products={products} />
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
    await mongooseConnect();
    const { id } = context.params; // Get the category ID from the page context
    // Retrieve the products based on the category ID
    const products = await Product.find({ category: id }, null, { sort: { '_id': -1 } });
  
    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
      }
    };
  }
  

