import Header from "../components/Header";
import Featured from "../../Featured";
import {Product} from "../../models/Product";
import {mongooseConnect} from "../../lib/mongoose";
import NewProducts from "../../NewProducts";

export default function HomePage({featuredProduct,newProducts}) {
  return (
    <div>
      <Header />
      <Featured product={featuredProduct} />
      <NewProducts products={newProducts} />
    </div>
  );
}

export async function getServerSideProps() {
  const featuredProductId = '640de2b12aa291ebdf213d48';
  await mongooseConnect();
  const featuredProduct = await Product.findById(featuredProductId);
  // const newProducts = await Product.find({}, null, {sort: {'_id':-1}, limit:10});
  // const newProducts = await Product.find({}, null, {sort: {'_id':-1}});
  
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00:000

  const newProducts = await Product.find(
    { createdAt: { $gte: currentDate } },
    null,
    { sort: { _id: -1 } }
  );

  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
    },
  };
}