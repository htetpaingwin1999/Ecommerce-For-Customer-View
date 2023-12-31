import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useContext } from "react";
import { CartContext } from "./CartContext";

const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
`;

const AdvertisementWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  margin: 0 auto; /* Center the container */
`;

const AdvertisementImages = styled.div`
  display: flex;
`;

const AdvertisementImage = styled.img`
  max-width: 100%;
  height: 400px;
  margin-right: 20px;
  object-fit: contain;
  transition: transform 0.5s ease-in-out;
`;

export default function Featured() {
  const { addProduct } = useContext(CartContext);

  const [advertisementImages, setAdvertisementImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchAdvertisementImages() {
      try {
        const response = await axios.get("/api/advertisements");
        const advertisements = response.data;

        const images = [];
        for (const advertisement of advertisements) {
          for (const imagePath of advertisement.image_paths) {
            images.push(imagePath);
          }
        }

        setAdvertisementImages(images);
      } catch (error) {
        console.error(error);
      }
    }

    fetchAdvertisementImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        (prevIndex + 1) % advertisementImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [advertisementImages.length]);

  return (
    advertisementImages.length > 0 && (
      <Bg>
        <AdvertisementWrapper>
          <AdvertisementImages>
            {advertisementImages.map((imagePath, index) => (
              <AdvertisementImage
                key={index}
                src={imagePath}
                alt={`Advertisement ${index}`}
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              />
            ))}
          </AdvertisementImages>
        </AdvertisementWrapper>
      </Bg>
    )
  );
}
