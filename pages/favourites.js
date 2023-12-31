import Header from "../components/Header";
import styled from "styled-components";
import Center from "../components/Center";
import { mongooseConnect } from "../lib/mongoose";
import { Product } from "../models/Product";
import ProductsGrid from "../components/ProductsGrid";
import Title from "../components/Title";
import { useContext, useEffect, useState } from "react";
import { SearchContext } from "../components/SearchContext";

export default function ProductsPage({ products }) {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const {searchData, setSearchData} = useContext(SearchContext);
  useEffect(() => {
    // Retrieve favorite products from localStorage
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const favoriteProducts = products.filter((product) =>
      favorites.includes(product._id)
    );
    setFavoriteProducts(favoriteProducts);
  }, [products]);

  return (
    <>
      <Header />
      <Center>
        <Title>Favorite Products</Title>
        {favoriteProducts.length > 0 ? (
          <ProductsGrid products={favoriteProducts} />
        ) : (
          <p>No favorite products found.</p>
        )}
      </Center>
    </>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  const products = await Product.find({}, null, { sort: { '_id': -1 } });
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
