import Header from "../../components/Header";
import styled from "styled-components";
import Center from "../../components/Center";
import { mongooseConnect } from "../../lib/mongoose";
import Title from "../../components/Title";
import { useRouter } from "next/router";
import ProductsGrid from "../../components/ProductsGrid";
import { Product } from "../../models/Product";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductsPageByAuthor({ products }) {
  const router = useRouter();
  let { id } = router.query;
    console.log(products)
  const [author, setAuthors] = useState();

  return (
    <>
      <Header />
      <Center>
        <Title></Title>
        {products.length > 0 ? (
          <ProductsGrid products={products} />
        ) : (
          <ProductsGrid>No Data</ProductsGrid>
        )}
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { id } = context.params;
  const products = await Product.find({ author: id }, null, { sort: { '_id': -1 } });

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
