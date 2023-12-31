import Center from "../../components/Center";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { mongooseConnect } from "../../lib/mongoose";
import { Product } from "../../models/Product";
import styled from "styled-components";
import WhiteBox from "../../components/WhiteBox";
import ProductImages from "../../components/ProductImages";
import Button from "../../components/Button";
import CartIcon from "../../components/icons/CartIcon";
import { FaStar } from 'react-icons/fa';
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../components/CartContext";
import { formatDistanceToNow } from 'date-fns';
import axios from "axios";
import{ AiTwotoneHeart } from 'react-icons/Ai';
import { BsFacebook } from "react-icons/bs";
import SwipeProductsGrid from "../../components/SwipeProductsGrid";
import NewProducts from "../../components/NewProducts";

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 0.8fr 1.2fr;
  }
  gap: 40px;
  padding: 0 30px;
  margin: 40px 0;
  overflow: hidden;
`;

const PriceRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const Price = styled.span`
  font-size: 1.4rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
`;

const TableRow = styled.tr`
  background-color: ${(props) => (props.isOdd ? "#ffffff" : "#f9f9f9")};
`;

const TableHeader = styled.th`
  padding: 8px;
  font-weight: bold;
  text-align: left;
  border-bottom: 1px solid #ccc;
`;

const TableCell = styled.td`
  padding: 8px;
  border-bottom: 1px solid #ccc;
`;

const InfoParentContainer = styled.div`
  background: #fff;
`

const InfoContainer = styled.div`
padding: 0 20px`;


const RibbonDecoration = styled.div`
  --f: 10px;
  --r: 15px;
  --t: 10px;
  position: relative;
  inset: var(--t) calc(-1 * var(--f)) auto auto;
  padding: 5px 10px var(--f) calc(10px + var(--r));
  clip-path: polygon(
    0 0,
    100% 0,
    100% calc(100% - var(--f)),
    calc(100% - var(--f)) 100%,
    calc(100% - var(--f)) calc(100% - var(--f)),
    0 calc(100% - var(--f)),
    var(--r) calc(50% - var(--f) / 2)
  );
  background: #119afa;
  color: #fff;
  box-shadow: 0 calc(-1 * var(--f)) 0 inset #0005;
`;

const ReviewHeader = styled.h4`
    width: 95%;
    margin: 0% 2.5%;
    border-bottom: 1px solid gray;
`;

const ReviewTitle = styled.p`
    margin: 0% 2.5%;
    margin-top: 20px;
    color: blue;
`

const ReviewAds = styled.p`
    margin: 0% 2.5%;
    margin-top: 20px;
    color: #000;
`

const FormContainer = styled.form`
  background: #fff;
  margin: 40px;
  padding: 30px 30px;
  border-radius: 30px;
  max-width: 100%;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 30px;
`;

const Input = styled.input`
  background: transparent;
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: none;
  border-bottom: 1px solid #ccc;
  transition: border-bottom-color 0.3s;

  &:focus {
    outline: none;
    border-bottom-color: #007bff;
  }
`;

const TextArea = styled.textarea`
  background: transparent;
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: none;
  border-bottom: 1px solid #ccc;
  transition: border-bottom-color 0.3s;

  &:focus {
    outline: none;
    border-bottom-color: #007bff;
  }
`;

const StarRating = styled.div`
  display: flex;
  align-items: center;
`;

const StarIcon = styled(FaStar)`
  color: #b6b6b6;
  cursor: pointer;
  transition: color 0.25s;
  margin: 0 2px;

  &:hover {
    color: #ffc107;
  }

  ${(props) =>
    props.filled &&
    `
    color: #ffc107;
  `}
`;

const StaredIcon = styled(FaStar)`
  color: #ffc107;
  cursor: pointer;
  transition: color 0.25s;
  margin: 0 2px;

`;

const ReviewContainer = styled.div`
  background: #fff;
  margin: 40px;
  padding: 30px 30px;
  border-radius: 30px;
  max-width: 100%;
  display: flex;  
`;

const UserLogo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const RatingInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

const RatingPoint = styled.span`
  margin-right: 5px;
  font-weight: bold;
`;

const RatingComment = styled.p`
  margin: 0;
`;

const TimeAgo = styled.span`
  font-size: 12px;
  color: #888;
`;

const ShowMoreButton = styled.button`
  background: none;
  border: none;
  color: blue;
  cursor: pointer;
`;

const AuthorNameHeader = styled.h3`
    font-size: 20px;
    color: navy;
    display: flex;
    justify-content: center;
`

export default function ProductPage({ product, authorBooks,recommendedProducts }) {
  const { addProduct } = useContext(CartContext);
  const [authorName, setAuthorName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [reviews, setReviews] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState([]);
  const MAX_CHARACTERS = 300; // Maximum number of characters to display in "Show Less" state
  const [showFullDescription, setShowFullDescription] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const [noofStock ,setNoofStock] = useState(0);
  const [noofSuccessfulOrderBooks ,setNoofSuccessfulOrderBooks] = useState(0);
  console.log("Recommended Book Start")
  console.log(recommendedProducts)
  console.log("Recommended Book End")

  const handleToggleFavorite = () => {
    if (isFavorite) {
      // Remove product_id from favorites list in localStorage
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const updatedFavorites = favorites.filter((id) => id !== product._id);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } else {
      // Add product_id to favorites list in localStorage
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const updatedFavorites = [...favorites, product._id];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
    // Toggle the favorite state
    setIsFavorite(!isFavorite);
  };

  useEffect(() => {
    // Check if product_id exists in favorites list in localStorage
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(favorites.includes(product._id));
  }, []);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleShow = (index) => {
    setShowFullDescription((prevShowFullDescription) => {
      if (prevShowFullDescription === 0) {
        setExpandedReviews((prevExpandedReviews) => [...prevExpandedReviews, index]);
        return 1; // show more
      } else {
        setExpandedReviews((prevExpandedReviews) =>
          prevExpandedReviews.filter((expandedIndex) => expandedIndex !== index)
        );
        return 0; // show less
      }
    });
  };
  

  const renderDescription = (review, index) => {
    const isExpanded = expandedReviews.includes(index);
  
    if (isExpanded || review.description.length <= MAX_CHARACTERS) {
      return review.description;
    }
    return `${review.description.slice(0, MAX_CHARACTERS)}...`;
  };

  async function submitReview(event){
    event.preventDefault();
    const product_id = product._id;
    const client = localStorage.getItem('UserIDforTainHlwar');
    console.log('Review submitted:', { rating, description });
    const data = { client, rating, description, product: product_id }; // Use "product_id" instead of "product_id"
    await axios.post('/api/reviews', data);
    setRating(0);
    setDescription('');
    axios
      .get(`/api/reviews?productId=${product._id}`)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

  };

  const getTimeAgo = (createdAt) => {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  };

  useEffect(() => {
    axios
      .get(`/api/authors?id=${product.author}`)
      .then((response) => {
        const author = response.data;
        const authorName = author ? author.name : "";
        setAuthorName(authorName);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(`/api/categories?id=${product.category}`)
      .then((response) => {
        const category = response.data;
        const categoryName = category ? category.name : "";
        setCategoryName(categoryName);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(`/api/reviews?productId=${product._id}`)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

      axios
      .get(`/api/productstockquantites?productID=${product._id}`)
      .then((response) => {
        setNoofStock(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

      axios
      .get(`/api/productorderquantites?productID=${product._id}`)
      .then((response) => {
        setNoofSuccessfulOrderBooks(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

      setNoofStock(noofStock-noofSuccessfulOrderBooks);
  }, []);

  return (
    <>
      <Header />
      <Center>
        <ColWrapper>
          <WhiteBox>
            <ProductImages images={product.images} />
          </WhiteBox>
          <InfoParentContainer>
            <RibbonDecoration className="ribbon-2">{authorName} </RibbonDecoration>
            <InfoContainer>
              <Title>{product.title}</Title>
              <br />
              <p>{categoryName}</p>
              <Table>
                <tbody>
                  <TableRow isOdd>
                    <TableHeader>Pages</TableHeader>
                    <TableCell>{product.pages} pages</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeader>Size</TableHeader>
                    <TableCell>
                      {product.width} x {product.height} x {product.thickness} {product.unit}
                    </TableCell>
                  </TableRow>
                  <TableRow isOdd>
                    <TableHeader>Published Place</TableHeader>
                    <TableCell>{product.published_place}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeader>Edition</TableHeader>
                    <TableCell>{product.edition}</TableCell>
                  </TableRow>
                </tbody>
              </Table>
              <PriceRow>
                <div>
                  <Price>{product.price}ကျပ်</Price>
                </div>
                <div>
                  {noofStock > 0 && (
                    <Button  onClick={() => addProduct(product._id)}>
                    <CartIcon />Add to cart
                  </Button>
                  )}
                  
                </div>
              </PriceRow>
              {noofStock > 0 ? (
                  <p>{noofStock} အုပ် stock ရှိပါတယ်။</p>
                ) : (
                  <p>stock မရှိသေးပါ။</p>
                )
              }
              <AiTwotoneHeart
                style={{ color: isFavorite ? "red" : "gray", fontSize: "30px" }}
                onClick={handleToggleFavorite}
              />
              <BsFacebook
                style={{ fontSize: "28px", marginLeft: "10px", cursor: "pointer", color: "blue" }}
              />


            </InfoContainer>
          </InfoParentContainer>
        </ColWrapper>
      </Center>

      <ReviewHeader>
        ဝေဖန်သုံးသပ်ချက်များ ({reviews.length})
      </ReviewHeader>

      <ReviewTitle>
        ဝေဖန်သုံးသပ်မှုများ
      </ReviewTitle>
      <ReviewAds>
        ဝေဖန်သုံးသပ်မှုများ
        ဒီစာအုပ်မှာ ဝေဖန်အကြံပြုချက်များ မရှိသေးပါ
        “{product.title}” စာအုပ်အပေါ် လူကြီးမင်း၏ အမြင်ကို ဝေဖန်သုံးသပ်နိုင်ပါသည်...
      </ReviewAds>

      <FormContainer onSubmit={submitReview}>
        <FormGroup>
          <Label>Rating</Label>
          <StarRating>
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                filled={star <= rating}
                onClick={() => handleRatingChange(star)}
              />
            ))}
          </StarRating>
        </FormGroup>

        <FormGroup>
          <Label>Description</Label>
          <TextArea
            rows="5"
            placeholder="Write your review"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </FormGroup>
        <Button type="submit">Submit Review</Button>
      </FormContainer>

    {reviews.map((review, index) => (
       <ReviewContainer key={index}>
         <UserLogo src="./../../user.png" alt="User Logo" />
         <UserInfo>
           <UserName>{review.name}</UserName>
           <TimeAgo>{getTimeAgo(review.createdAt)}</TimeAgo>
           <RatingInfo>
             <RatingPoint>{review.rating}</RatingPoint>
             <StaredIcon></StaredIcon>
           </RatingInfo>
           <RatingComment>{renderDescription(review, index)}</RatingComment>
           {review.description.length > MAX_CHARACTERS && (
             <>
              <ShowMoreButton onClick={() => handleShow(index)}>
                {showFullDescription === 0 ? "Show more" : "Show less"}
              </ShowMoreButton>             
             </>
           )}
         </UserInfo>
       </ReviewContainer>
      ))}

    <AuthorNameHeader className="mx-100">{authorName}ရဲ့ စာအုပ်များ</AuthorNameHeader>
    <SwipeProductsGrid products={authorBooks} />
    <Title> Recommended Books</Title>
    <NewProducts products={recommendedProducts} />

    </>
  );

}



export async function getServerSideProps(context) {
  await mongooseConnect();
const { id, author_id, category_id } = context.query;

const userOrdering = {
  '64fc94efc94723594cffa886':{'64aa41c4100ed539d115442e':7,'64aa3ee4e491cd1d61322bc5':10,'64aa73fce491cd1d61322cb7':2,'649daf3e6b636ec9053174f1':2,'64a8526e16e083eeadd99b82':2,'64aa3d26e491cd1d61322bbb':3,'64a6897cfcebbecadd8e443e':4,'64aaf148e491cd1d61322d6e':1,'64ae2703be3a91ce22b1c243':1,'64aa3bbc100ed539d11543d8':10,},'64fc9543c94723594cffa88b':{'64aad485456746cdf896d2a5':8,'64a69d9291ef02ab9753878c':10,'64aaf59be491cd1d61322da0':10,'64a68815fcebbecadd8e4426':10,'64a8489716e083eeadd99b1b':2,'64ae2894be3a91ce22b1c26d':1,'64a85ba8e46495fed584c2cd':10,'64a8f3b93587bef9db328d0f':7,'64aae127456746cdf896d334':2,'64a858a016e083eeadd99be6':7,},'64fc9572c94723594cffa890':{'64a98e2fc188927a83249250':3,'64a85fe0e46495fed584c30d':4,'64a8572f16e083eeadd99bca':8,'64a8469ce46495fed584c1eb':3,'64a8531516e083eeadd99b8c':2,'64a8ec583587bef9db328c95':1,'64aacc62e491cd1d61322d23':6,'64a8469ce46495fed584c1eb':7,'64a69d9291ef02ab9753878c':8,'64aaf4ace491cd1d61322d96':1,},'64fc9659c94723594cffa897':{'64a650b2fcebbecadd8e4350':2,'64987d3b91ce10c73a384493':4,'64ae291bbe3a91ce22b1c28d':9,'64a9b100c188927a8324928c':9,'64aa3e57100ed539d1154406':3,'64aa679be491cd1d61322c12':9,'64987b4191ce10c73a38447d':1,'64a68c5421b7d880ade5aeb6':4,'64aa3fda100ed539d115441a':9,'64a28db17e2b797ccdb02d16':9,},'6505da3ada1cdf1de082dd23':{'64aa46754b72ca1d819c6cea':8,'64aa6858e491cd1d61322c1c':6,'64aa71e8e491cd1d61322ca3':8,'64a85a97e46495fed584c2c1':4,'64a92562304b5d133c6c958a':4,'64a9b539c188927a832492c8':4,'64aa6f0de491cd1d61322c8c':10,'64aa3781100ed539d11543a6':8,'64a4eb6573ca803634d9d2d6':5,'64aa36f3100ed539d115439c':8,},'6505da3ada1cdf1de082dd24':{'64a6897cfcebbecadd8e443e':8,'64a6820dfcebbecadd8e43d8':4,'64aac3b0e491cd1d61322d04':8,'64aa3ad5100ed539d11543ce':8,'64a852a2e46495fed584c256':10,'649db0c96b636ec905317507':1,'64a6900e21b7d880ade5aee9':4,'64a8f6943587bef9db328d23':3,'64a290887e2b797ccdb02d35':4,'64a68572fcebbecadd8e43ec':8,},'6505da3ada1cdf1de082dd25':{'64aacc62e491cd1d61322d23':3,'64a85192e46495fed584c242':6,'64a6903ffcebbecadd8e44a2':10,'64a6a25991ef02ab975387be':3,'64a85202e46495fed584c24c':9,'64aacd93e491cd1d61322d31':10,'64a84825e46495fed584c21a':4,'64a861e9e46495fed584c321':3,'64a85fe0e46495fed584c30d':3,'64aa3892100ed539d11543ba':1,},'6505da3ada1cdf1de082dd26':{'64a98e81c188927a8324925a':9,'64a45f0a0bd2959f546d8080':10,'64a84825e46495fed584c21a':5,'64a98f51c188927a8324926e':8,'64aa3892100ed539d11543ba':6,'64a8568216e083eeadd99bc0':5,'64a460e90bd2959f546d8094':10,'64a8548ce46495fed584c280':1,'64a4620d0bd2959f546d80a8':7,'64aade7d456746cdf896d2f8':1,},'6505da3ada1cdf1de082dd27':{'64a28db17e2b797ccdb02d16':6,'64a4620d0bd2959f546d80a8':6,'64a96d38c188927a832491c0':1,'64a85307e46495fed584c260':10,'64a4f1a3002b73a7f9eef918':4,'649daf3e6b636ec9053174f1':7,'64aa7663e491cd1d61322ce4':4,'64aacc62e491cd1d61322d23':6,'64a8558516e083eeadd99bb6':4,'64aaf3cfe491cd1d61322d8c':1,},'6505da3ada1cdf1de082dd28':{'64a69cf091ef02ab97538782':5,'64a923b2304b5d133c6c954a':8,'64aa649be491cd1d61322bf6':6,'64aa5ca2100ed539d11544eb':6,'64aa3781100ed539d11543a6':8,'64aa5fcf100ed539d1154528':4,'64aa56ce100ed539d11544af':2,'64a9225b304b5d133c6c952c':4,'64aa5e12100ed539d1154506':7,'64987de891ce10c73a3844a3':3,},'6505da3ada1cdf1de082dd29':{'64ae2703be3a91ce22b1c243':4,'64a98ecbc188927a83249264':3,'64aacad8e491cd1d61322d0f':10,'64a8572f16e083eeadd99bca':4,'64a85307e46495fed584c260':9,'64a6820dfcebbecadd8e43d8':8,'64a8f2673587bef9db328cf1':9,'64a68ce321b7d880ade5aec0':5,'64aa46754b72ca1d819c6cea':6,'64a96d38c188927a832491c0':5,},'6505da3ada1cdf1de082dd2a':{'64a96dc1c188927a832491ca':8,'64a85124e46495fed584c238':3,'64aa47264b72ca1d819c6cf4':10,'649db1d36b636ec905317521':2,'64aa679be491cd1d61322c12':6,'64a6900e21b7d880ade5aee9':5,'64aa7093e491cd1d61322c96':8,'64a6974c91ef02ab9753873d':4,'64a970c3c188927a8324921a':4,'64a85d88e46495fed584c2e1':9,},'6505da3ada1cdf1de082dd2b':{'64aa72dee491cd1d61322cad':4,'64a9b539c188927a832492c8':4,'64a68815fcebbecadd8e4426':10,'64a84825e46495fed584c21a':5,'64a45c990bd2959f546d8057':6,'64a8f3b93587bef9db328d0f':5,'64aa71e8e491cd1d61322ca3':8,'64aaf99ae491cd1d61322ddf':10,'64a9b361c188927a83249296':4,'64a9b3e2c188927a832492aa':6,},'6505da3ada1cdf1de082dd2c':{'64aa3958100ed539d11543c4':6,'64a68d41fcebbecadd8e4470':7,'64a68b1b21b7d880ade5aeac':8,'64a85528e46495fed584c28c':10,'64ae2c82be3a91ce22b1c2a5':5,'64a8607816e083eeadd99c48':9,'64a6897cfcebbecadd8e443e':2,'64aa464a100ed539d1154479':9,'64aadcf8456746cdf896d2d9':10,'64aa7551e491cd1d61322cda':9,
  },'6505da3ada1cdf1de082dd2d':{'64a85391e46495fed584c26a':6,'64a69ead91ef02ab97538796':4,'64aa3cf0100ed539d11543ec':2,'64a8506416e083eeadd99b78':1,'64a97037c188927a83249210':2,'64a98dd9c188927a83249246':2,'64a68fc2fcebbecadd8e4498':1,'64aa6a92e491cd1d61322c47':6,'64aa5f02100ed539d1154510':8,'64a92562304b5d133c6c958a':4,},'6505da3ada1cdf1de082dd2e':{'64aa464a100ed539d1154479':5,'64aa5b37100ed539d11544d7':7,'64a45f0a0bd2959f546d8080':8,'64a68c5421b7d880ade5aeb6':8,'64ae291bbe3a91ce22b1c28d':9,'649db0406b636ec9053174fd':1,'64aa5b37100ed539d11544d7':10,'64aaf4ace491cd1d61322d96':7,'64aa42b1100ed539d1154439':7,'64a970c3c188927a8324921a':6,},'6505da3ada1cdf1de082dd2f':{'64a85cd916e083eeadd99c17':10,'64a68572fcebbecadd8e43ec':5,'64a8f3b93587bef9db328d0f':8,'64aa6a92e491cd1d61322c47':1,'64a85307e46495fed584c260':5,'64a859fae46495fed584c2b7':10,'64a45c990bd2959f546d8057':6,'64a8630ae46495fed584c32b':1,'64aae016456746cdf896d322':1,'64ae291bbe3a91ce22b1c28d':6,},'6505da3ada1cdf1de082dd30':{'64a8568216e083eeadd99bc0':4,'64a85e4a16e083eeadd99c30':4,'64a8ee563587bef9db328c9f':4,'64a460e90bd2959f546d8094':3,'64a45c990bd2959f546d8057':2,'64a8f7373587bef9db328d35':4,'64aaf3cfe491cd1d61322d8c':10,'64a4eb6573ca803634d9d2d6':6,'64a69ead91ef02ab97538796':9,'64a85ba8e46495fed584c2cd':3,},'6505da3ada1cdf1de082dd31':{'64a65370fcebbecadd8e4374':9,'64ae2703be3a91ce22b1c243':8,'64aa3ad5100ed539d11543ce':8,'64aad612456746cdf896d2bb':6,'64aaf6a5e491cd1d61322daa':10,'64a96e18c188927a832491d4':9,'64ae2d63be3a91ce22b1c2af':1,'64aa3d74100ed539d11543f6':1,'64a45f0a0bd2959f546d8080':4,'64a68c40fcebbecadd8e445c':8,},'6505da3ada1cdf1de082dd32':{'64aad612456746cdf896d2bb':3,'64aad485456746cdf896d2a5':7,'64a68fc2fcebbecadd8e4498':9,'64a8f7373587bef9db328d35':1,'64a4ee9e002b73a7f9eef8f7':8,'64aade12456746cdf896d2ee':6,'64a98f88c188927a83249278':4,'64a8489716e083eeadd99b1b':3,'64a85d88e46495fed584c2e1':2,'64a68815fcebbecadd8e4426':7,},'6505da3ada1cdf1de082dd33':{'64aa7093e491cd1d61322c96':2,'64a861d816e083eeadd99c68':3,'64a98dd9c188927a83249246':1,'64aadc21456746cdf896d2cf':1,'64aaf3cfe491cd1d61322d8c':1,'64aa56ce100ed539d11544af':6,'64a68484fcebbecadd8e43e2':7,'64aade7d456746cdf896d2f8':4,'64ae2703be3a91ce22b1c243':8,'64a68a8c21b7d880ade5aea2':2,},'6505da3ada1cdf1de082dd34':{'64a861d816e083eeadd99c68':1,'64a85307e46495fed584c260':9,'64aa5fcf100ed539d1154528':7,'64a9b595c188927a832492d3':7,'64aaef09e491cd1d61322d47':2,'64aaf99ae491cd1d61322ddf':3,'64a68cc1fcebbecadd8e4466':4,'64a970c3c188927a8324921a':4,'64a863c8e46495fed584c335':2,'64a8f2673587bef9db328cf1':10,},'6505da3ada1cdf1de082dd35':{'64a290887e2b797ccdb02d35':6,'64aa42b1100ed539d1154439':3,'64a460e90bd2959f546d8094':9,'64a98e2fc188927a83249250':8,'64a6824fe8def734203120b6':9,'64a67c1efcebbecadd8e43ba':2,'64aaf99ae491cd1d61322ddf':6,'64a8630ae46495fed584c32b':5,'64a68a8c21b7d880ade5aea2':4,'64aaf7ece491cd1d61322db5':6,},'6505da3ada1cdf1de082dd36':{'64a6965591ef02ab97538733':9,'64aa3e55100ed539d1154404':9,'64aa3d26e491cd1d61322bbb':10,'64aa3e57100ed539d1154406':9,'64a461730bd2959f546d809e':9,'64aaf7ece491cd1d61322db5':2,'64aa3781100ed539d11543a6':7,'64aade7d456746cdf896d2f8':3,'64a8540b16e083eeadd99ba0':4,'64a45b490bd2959f546d8043':4,},'6505da3ada1cdf1de082dd37':{'64aac3b0e491cd1d61322d04':2,'64aadf9e456746cdf896d318':2,'64aa72dee491cd1d61322cad':2,'64a68d41fcebbecadd8e4470':10,'649db0406b636ec9053174fd':8,'64a68c5421b7d880ade5aeb6':5,'64a8539116e083eeadd99b96':4,'64a45e550bd2959f546d806b':8,'64a4ee9e002b73a7f9eef8f7':8,'64aa3e55100ed539d1154404':5,},'6505da3ada1cdf1de082dd38':{'64aa5be7100ed539d11544e1':9,'64a84fcb16e083eeadd99b6e':9,'64a8e9b93587bef9db328c6d':1,'64a68c40fcebbecadd8e445c':6,'64987d3b91ce10c73a384493':5,'64a8f0653587bef9db328cd2':2,'64a68f0efcebbecadd8e448e':8,'64a85391e46495fed584c26a':1,'64aa5f02100ed539d1154510':8,'64a68f0efcebbecadd8e448e':5,},'6505da3ada1cdf1de082dd39':{'64a8ec583587bef9db328c95':2,'64aa405ee491cd1d61322bcf':2,'64a858a016e083eeadd99be6':5,'64aa42b1100ed539d1154439':10,'64aa73fce491cd1d61322cb7':10,'64a68b1b21b7d880ade5aeac':8,'64aa5531100ed539d115449b':2,'64a84825e46495fed584c21a':1,'64a96f75c188927a832491f2':4,'64aa36f3100ed539d115439c':10,},'6505da3ada1cdf1de082dd3a':{'64aa74abe491cd1d61322ccf':10,'64a98ecbc188927a83249264':2,'64aadf9e456746cdf896d318':2,'64a8f6943587bef9db328d23':5,'64a85528e46495fed584c28c':9,'64aa6858e491cd1d61322c1c':5,'64aa6a92e491cd1d61322c47':1,'64a85cd5e46495fed584c2d7':1,'64a852a2e46495fed584c256':1,'64a8651ae46495fed584c349':4,}
  ,'6505da3ada1cdf1de082dd3b':{'64a6550bfcebbecadd8e4388':7,'64aaf148e491cd1d61322d6e':1,'64aade7d456746cdf896d2f8':7,'64a85b3316e083eeadd99bff':6,'64a85192e46495fed584c242':5,'64a97037c188927a83249210':2,'64a67f4afcebbecadd8e43c4':9,'64a6900e21b7d880ade5aee9':4,'64a8efd73587bef9db328cc8':10,'64a8e9b93587bef9db328c6d':9,},'6505da3ada1cdf1de082dd3c':{'64a68c5421b7d880ade5aeb6':7,'64a8568216e083eeadd99bc0':9,'64a85307e46495fed584c260':5,'64a4ef5a002b73a7f9eef903':2,'64a8568216e083eeadd99bc0':5,'64a849f716e083eeadd99b2c':1,'64a4ee9e002b73a7f9eef8f7':3,'64a460e90bd2959f546d8094':7,'64a92444304b5d133c6c955e':9,'64a6226759bdb224b852f1c8':10,},'6505da3ada1cdf1de082dd3d':{'64a85307e46495fed584c260':5,'64aaf99ae491cd1d61322ddf':5,'64a923b2304b5d133c6c954a':6,'64a855aee46495fed584c296':4,'64a9b45bc188927a832492b4':6,'64a69d9291ef02ab9753878c':7,'64ae2703be3a91ce22b1c243':8,'64ae2c82be3a91ce22b1c2a5':10,'64a8f2f63587bef9db328cfb':4,'64a9b45bc188927a832492b4':6,},'6505da3ada1cdf1de082dd3e':{'64aaf6a5e491cd1d61322daa':7,'64a98f88c188927a83249278':10,'64a84be916e083eeadd99b4e':3,'64a923ff304b5d133c6c9554':10,'64a923b2304b5d133c6c954a':2,'64a98f88c188927a83249278':1,'64a45f0a0bd2959f546d8080':7,'64a8526e16e083eeadd99b82':5,'64a8ea583587bef9db328c77':8,'64a8f7373587bef9db328d35':7,},'6505da3ada1cdf1de082dd3f':{'64a680c6e8def734203120ac':8,'64a68e53fcebbecadd8e4484':2,'64aaf7ece491cd1d61322db5':1,'64a96eb6c188927a832491e8':9,'64a69ead91ef02ab97538796':3,'64aaf99ae491cd1d61322ddf':1,'64a854b016e083eeadd99baa':8,'64aa3fda100ed539d115441a':8,'64a45c160bd2959f546d804d':3,'64a290887e2b797ccdb02d35':7,},'6505da3ada1cdf1de082dd40':{'64aa6d50e491cd1d61322c67':9,'64986aef91ce10c73a384445':4,'64a69ad591ef02ab97538769':2,'64aa65e9e491cd1d61322c00':1,'64aa6c06e491cd1d61322c51':9,'64a96dc1c188927a832491ca':1,'64a4e78373ca803634d9d2c4':6,'64a9b3e2c188927a832492aa':1,'64a6820dfcebbecadd8e43d8':6,'64aa3d74100ed539d11543f6':1,},'6505da3ada1cdf1de082dd41':{'64a85391e46495fed584c26a':6,'64a85202e46495fed584c24c':5,'64aadcf8456746cdf896d2d9':9,'64a45dac0bd2959f546d8061':3,'64aac1e4e491cd1d61322cfa':5,'64a45c990bd2959f546d8057':9,'64a8f11f3587bef9db328ce7':1,'64a68ec121b7d880ade5aedb':6,'64a85f5be46495fed584c303':10,'64aa72dee491cd1d61322cad':6,},'6505da3ada1cdf1de082dd42':{'64a68484fcebbecadd8e43e2':9,'64a85192e46495fed584c242':9,'64a28f5f7e2b797ccdb02d2b':7,'64a8531516e083eeadd99b8c':5,'64a861d816e083eeadd99c68':2,'64a98f88c188927a83249278':6,'64aa5be7100ed539d11544e1':6,'64a28db17e2b797ccdb02d16':7,'64a680aefcebbecadd8e43ce':10,'6499beadb43dc8c8d3b71187':5,},'6505da3ada1cdf1de082dd43':{'64a85ba8e46495fed584c2cd':1,'64a8f3b93587bef9db328d0f':8,'64aa3d74100ed539d11543f6':6,'64a848cfe46495fed584c224':9,'64a6a25991ef02ab975387be':9,'64aadd7a456746cdf896d2e3':7,'64a844e8e46495fed584c1e1':10,'64a848cfe46495fed584c224':1,'64aa47264b72ca1d819c6cf4':9,'64aac1e4e491cd1d61322cfa':3,},'6505da3ada1cdf1de082dd44':{'64a923b2304b5d133c6c954a':2,'64a85a97e46495fed584c2c1':2,'64a8539116e083eeadd99b96':4,'64aa5e12100ed539d1154506':7,'64aa5f02100ed539d1154510':5,'64a68e53fcebbecadd8e4484':7,'64aae127456746cdf896d334':1,'64a84825e46495fed584c21a':6,'64a972e9c188927a83249226':10,'64a85ba8e46495fed584c2cd':10,},'6505da3ada1cdf1de082dd45':{'64987d3b91ce10c73a384493':4,'64a4620d0bd2959f546d80a8':7,'64aaef09e491cd1d61322d47':4,'64a6965591ef02ab97538733':9,'64ae279bbe3a91ce22b1c24d':5,'64aae127456746cdf896d334':4,'64a6965591ef02ab97538733':4,'64aa3d26e491cd1d61322bbb':7,'64aa679be491cd1d61322c12':1,'64aa74abe491cd1d61322ccf':2,},'6505da3ada1cdf1de082dd46':{'64a7da5cf8b8181a82b5cce1':10,'64a863c8e46495fed584c335':9,'649db0c96b636ec905317507':8,'64a96e66c188927a832491de':3,'64aa3d26e491cd1d61322bbb':1,'64a6900e21b7d880ade5aee9':8,'64aa3e57100ed539d1154406':4,'64ae2d63be3a91ce22b1c2af':7,'64a7da5cf8b8181a82b5cce1':3,'64a863c8e46495fed584c335':4,},'6505da3ada1cdf1de082dd47':{'64aa3781100ed539d11543a6':7,'64a8526e16e083eeadd99b82':2,'64aadc21456746cdf896d2cf':4,'64a9b45bc188927a832492b4':6,'64a84983e46495fed584c22e':1,'64aa71e8e491cd1d61322ca3':10,'64aa36f3100ed539d115439c':8,'64aa3cf0100ed539d11543ec':10,'64a4ef5a002b73a7f9eef903':5,'64aa72dee491cd1d61322cad':10,},'6505da3ada1cdf1de082dd48':{'64aa3d26e491cd1d61322bbb':1,'64a9b539c188927a832492c8':8,'64a96e18c188927a832491d4':5,'64a85cd5e46495fed584c2d7':5,'64a8630ae46495fed584c32b':8,'64a67a20fcebbecadd8e4392':3,'64aaef09e491cd1d61322d47':6,'64a8469ce46495fed584c1eb':2,'64aaf233e491cd1d61322d78':10,'64a8f6433587bef9db328d19':9,}
  ,'6505da3ada1cdf1de082dd49':{'64aa65e9e491cd1d61322c00':10,'64a69d9291ef02ab9753878c':9,'64a68c40fcebbecadd8e445c':4,'64a68ec121b7d880ade5aedb':7,'64a8f2673587bef9db328cf1':6,'64a85cd916e083eeadd99c17':2,'64a9b4dac188927a832492be':2,'64a68c40fcebbecadd8e445c':8,'64aacad8e491cd1d61322d0f':5,'64a96eb6c188927a832491e8':8,},'6505da3ada1cdf1de082dd4a':{'64aadcf8456746cdf896d2d9':8,'64a8f34b3587bef9db328d05':8,'64a4eb6573ca803634d9d2d6':4,'64aa74abe491cd1d61322ccf':2,'64aa3ad5100ed539d11543ce':2,'64aae016456746cdf896d322':6,'64a68ec121b7d880ade5aedb':6,'64a859fae46495fed584c2b7':8,'64aadf9e456746cdf896d318':4,'64aa47264b72ca1d819c6cf4':8,},'6505da3ada1cdf1de082dd4b':{'64aa41c4100ed539d115442e':10,'64a8f6943587bef9db328d23':3,'64a98ecbc188927a83249264':4,'64aaf148e491cd1d61322d6e':10,'64a6974c91ef02ab9753873d':2,'64a8630ae46495fed584c32b':2,'64aa37e0100ed539d11543b0':2,'64aa3c68100ed539d11543e2':8,'64a6a25991ef02ab975387be':8,'64a865c1e46495fed584c353':3,},'6505da3ada1cdf1de082dd4c':{'64a8f11f3587bef9db328ce7':4,'64aa649be491cd1d61322bf6':10,'64a85fe0e46495fed584c30d':2,'64a8efd73587bef9db328cc8':10,'64a9b3e2c188927a832492aa':1,'64aa73fce491cd1d61322cb7':8,'64a9b5ebc188927a832492e5':3,'64a9b361c188927a83249296':4,'64a68a5afcebbecadd8e4448':9,'64aacd93e491cd1d61322d31':5,},'6505da3ada1cdf1de082dd4d':{'64a68572fcebbecadd8e43ec':4,'64a4e78373ca803634d9d2c4':6,'64ae2703be3a91ce22b1c243':10,'64a8ec583587bef9db328c95':4,'64aa3d26e491cd1d61322bbb':7,'64a849f716e083eeadd99b2c':5,'64aa3958100ed539d11543c4':8,'64a861e9e46495fed584c321':5,'64aa6f0de491cd1d61322c8c':9,'64a85cd916e083eeadd99c17':9,},'6505da3ada1cdf1de082dd4e':{'64a923ff304b5d133c6c9554':7,'64a68a5afcebbecadd8e4448':4,'64a680aefcebbecadd8e43ce':8,'64a844e8e46495fed584c1e1':3,'64a45c160bd2959f546d804d':6,'64a68b70fcebbecadd8e4452':3,'64987de891ce10c73a3844a3':4,'64a9b100c188927a8324928c':5,'64aa620a100ed539d115455e':7,'64aae127456746cdf896d334':7,},'6505da3ada1cdf1de082dd4f':{'64aa457f100ed539d115445f':8,'64a69a3991ef02ab9753875f':6,'64a98e81c188927a8324925a':2,'64ae2703be3a91ce22b1c243':5,'64a68b1b21b7d880ade5aeac':9,'64aadf9e456746cdf896d318':5,'64a8489716e083eeadd99b1b':2,'64aade12456746cdf896d2ee':1,'64a84825e46495fed584c21a':5,'64aa6f0de491cd1d61322c8c':1,},'6505da3ada1cdf1de082dd50':{'64a85391e46495fed584c26a':6,'64a680aefcebbecadd8e43ce':8,'64a9b595c188927a832492d3':7,'64aadc21456746cdf896d2cf':2,'64a45dac0bd2959f546d8061':8,'64a923ff304b5d133c6c9554':4,'64a6903ffcebbecadd8e44a2':10,'64a85cd916e083eeadd99c17':1,'64a85f5be46495fed584c303':8,'64a85f5be46495fed584c303':5,},'6505da3ada1cdf1de082dd51':{'64a4ef5a002b73a7f9eef903':8,'64a680c6e8def734203120ac':10,'64aadf9e456746cdf896d318':7,'64aa464a100ed539d1154479':5,'64a8630ae46495fed584c32b':4,'64aa3e55100ed539d1154404':1,'64aa6a92e491cd1d61322c47':7,'64a69a3991ef02ab9753875f':8,'64a4620d0bd2959f546d80a8':1,'64a28f5f7e2b797ccdb02d2b':8,},'6505da3ada1cdf1de082dd52':{'64a8568216e083eeadd99bc0':2,'6499beadb43dc8c8d3b71187':1,'649db17a6b636ec905317517':2,'64aadd7a456746cdf896d2e3':1,'64a9b595c188927a832492d3':9,'64aa71e8e491cd1d61322ca3':3,'64a8548ce46495fed584c280':4,'64a68c40fcebbecadd8e445c':7,'64a69a3991ef02ab9753875f':8,'64a98be9c188927a8324923c':1,},'6505da3ada1cdf1de082dd53':{'64a84983e46495fed584c22e':8,'64a69ad591ef02ab97538769':10,'64a8eecb3587bef9db328ca9':7,'64a9b3a8c188927a832492a0':2,'64a6a13891ef02ab975387b4':7,'64a84be916e083eeadd99b4e':9,'64a8489716e083eeadd99b1b':1,'64a92528304b5d133c6c9580':4,'64aa73fce491cd1d61322cb7':10,'64aa464a100ed539d1154479':10,},'6505da3ada1cdf1de082dd54':{'64aa6f0de491cd1d61322c8c':2,'64a6897cfcebbecadd8e443e':9,'64aaf148e491cd1d61322d6e':1,'64a96eb6c188927a832491e8':5,'64a98e81c188927a8324925a':5,'64aac3b0e491cd1d61322d04':5,'64aa3d74100ed539d11543f6':6,'64aadf9e456746cdf896d318':5,'64a4f1a3002b73a7f9eef918':5,'64aa3f02100ed539d1154410':7,},'6505da3ada1cdf1de082dd55':{'64987f2a91ce10c73a3844d3':3,'64a85ba8e46495fed584c2cd':10,'64a68a5afcebbecadd8e4448':6,'64aadf9e456746cdf896d318':6,'64a922fc304b5d133c6c9536':10,'64a922fc304b5d133c6c9536':3,'64a6255e59bdb224b852f1d2':3,'64a69ead91ef02ab97538796':3,'64aa42b1100ed539d1154439':1,'64a96f75c188927a832491f2':3,},'6505da3ada1cdf1de082dd56':{'64a8ea583587bef9db328c77':8,'64a4ee9e002b73a7f9eef8f7':4,'64a9b4dac188927a832492be':4,'64aaf59be491cd1d61322da0':1,'64a69cf091ef02ab97538782':3,'64aa6c06e491cd1d61322c51':1,'64a98b96c188927a83249232':4,'64a863c8e46495fed584c335':5,'64a84825e46495fed584c21a':6,'64a68a8c21b7d880ade5aea2':3,},'6505da3ada1cdf1de082dd57':{'64aa3958100ed539d11543c4':5,'64a45b490bd2959f546d8043':7,'64a68484fcebbecadd8e43e2':10,'64a852a2e46495fed584c256':9,'64a8e9b93587bef9db328c6d':9,'64a849f716e083eeadd99b2c':1,'64a8489716e083eeadd99b1b':9,'64a69a3991ef02ab9753875f':4,'64aa41c4100ed539d115442e':10,'64a680aefcebbecadd8e43ce':5,},'6505da3ada1cdf1de082dd58':{'64aa3cf0100ed539d11543ec':1,'64a6861dfcebbecadd8e4404':8,'64a85192e46495fed584c242':4,'64a6524dfcebbecadd8e436a':5,'64a8f2f63587bef9db328cfb':10,'64aa74abe491cd1d61322ccf':10,'64a8531516e083eeadd99b8c':3,'64a8526e16e083eeadd99b82':3,'64987f2a91ce10c73a3844d3':2,'64a4620d0bd2959f546d80a8':1,},'6505da3ada1cdf1de082dd59':{'64aa3c33e491cd1d61322bb1':10,'64a680aefcebbecadd8e43ce':5,'64aa3ee4e491cd1d61322bc5':10,'64a9b100c188927a8324928c':10,'64aacc62e491cd1d61322d23':10,'64aa73fce491cd1d61322cb7':10,'64aa37e0100ed539d11543b0':2,'64a86138e46495fed584c317':7,'64aad612456746cdf896d2bb':6,'64a8ee563587bef9db328c9f':5,},'6505da3ada1cdf1de082dd5a':{'64a8e9b93587bef9db328c6d':6,'64aa7093e491cd1d61322c96':1,'64ae279bbe3a91ce22b1c24d':5,'64a4e78373ca803634d9d2c4':9,'64a6255e59bdb224b852f1d2':8,'64a8ea583587bef9db328c77':6,'64a68484fcebbecadd8e43e2':9,'64a8f11f3587bef9db328ce7':8,'64aa6a92e491cd1d61322c47':9,'64aa6d50e491cd1d61322c67':8,},'6505da3ada1cdf1de082dd5b':{'64aadcf8456746cdf896d2d9':4,'64a9b361c188927a83249296':10,'64a8ef823587bef9db328cbe':7,'64ae2894be3a91ce22b1c26d':8,'64aa679be491cd1d61322c12':2,'64a854b016e083eeadd99baa':8,'64a8ee563587bef9db328c9f':7,'64a8f6943587bef9db328d23':7,'64a68dcafcebbecadd8e447a':2,'64a8eac43587bef9db328c81':7,},'6505da3ada1cdf1de082dd5c':{'64a9b361c188927a83249296':10,'64a45c990bd2959f546d8057':1,'64a9237a304b5d133c6c9540':4,'64a85124e46495fed584c238':4,'64a67c1efcebbecadd8e43ba':4,'64a68e53fcebbecadd8e4484':7,'64a84d1016e083eeadd99b5a':3,'64aa7663e491cd1d61322ce4':1,'64a6550bfcebbecadd8e4388':7,'64aa6a92e491cd1d61322c47':5,},'6505da3ada1cdf1de082dd5d':{'64aa59f1100ed539d11544c3':7,'64a854b016e083eeadd99baa':5,'64a96e18c188927a832491d4':10,'64a68d41fcebbecadd8e4470':5,'64a69a3991ef02ab9753875f':7,'64a6897cfcebbecadd8e443e':5,'64aae127456746cdf896d334':4,'64a461730bd2959f546d809e':3,'64a8469ce46495fed584c1eb':8,'64a9b4dac188927a832492be':6,},'6505da3ada1cdf1de082dd5e':{'64a861d816e083eeadd99c68':2,'64aa697fe491cd1d61322c34':2,'64a85124e46495fed584c238':10,'64aa3d74100ed539d11543f6':2,'64a69a3991ef02ab9753875f':5,'64a84fcb16e083eeadd99b6e':10,'64a68572fcebbecadd8e43ec':9,'64a86459e46495fed584c33f':2,'64a69d9291ef02ab9753878c':7,'64a6994691ef02ab97538755':7,},'6505da3ada1cdf1de082dd5f':{'64a8548ce46495fed584c280':4,'64a865c1e46495fed584c353':7,'64a6524dfcebbecadd8e436a':1,'64a9b595c188927a832492d3':6,'64a6a25991ef02ab975387be':1,'6499beadb43dc8c8d3b71187':6,'64a9b539c188927a832492c8':4,'64aa6858e491cd1d61322c1c':8,'64aa563f100ed539d11544a5':2,'64aa7663e491cd1d61322ce4':1,},'6505da3ada1cdf1de082dd60':{'64aa3c68100ed539d11543e2':2,'64a9b595c188927a832492d3':9,'64a8f3b93587bef9db328d0f':5,'64a97037c188927a83249210':10,'64aa3e57100ed539d1154406':5,'64a45c160bd2959f546d804d':5,'64a8572f16e083eeadd99bca':4,'64a7da5cf8b8181a82b5cce1':3,'64a85cd916e083eeadd99c17':8,'649daf3e6b636ec9053174f1':7,},'6505da3ada1cdf1de082dd61':{'64aaf6a5e491cd1d61322daa':10,'64a6226759bdb224b852f1c8':1,'64a861d816e083eeadd99c68':8,'64a4eb6573ca803634d9d2d6':1,'64aa7551e491cd1d61322cda':10,'64a4e78373ca803634d9d2c4':8,'64a972e9c188927a83249226':4,'64a6965591ef02ab97538733':6,'64a844e8e46495fed584c1e1':9,'64a8f7373587bef9db328d35':10,},'6505da3ada1cdf1de082dd62':{'64a8f6943587bef9db328d23':3,'64a9b5ebc188927a832492e5':3,'64a8eecb3587bef9db328ca9':5,'64a680c6e8def734203120ac':6,'64a8539116e083eeadd99b96':6,'64aa36f3100ed539d115439c':9,'64aa5ca2100ed539d11544eb':5,'64a68815fcebbecadd8e4426':5,'64a6974c91ef02ab9753873d':7,'64aad485456746cdf896d2a5':6,},'6505da3ada1cdf1de082dd63':{'64aafa7ae491cd1d61322dea':5,'64aac3b0e491cd1d61322d04':7,'64a96f75c188927a832491f2':10,'64987a7591ce10c73a38444f':7,'64ae2894be3a91ce22b1c26d':7,'64a68484fcebbecadd8e43e2':7,'64a68d41fcebbecadd8e4470':5,'64a85124e46495fed584c238':6,'64aa65e9e491cd1d61322c00':3,'64aa3d74100ed539d11543f6':5,},'6505da3ada1cdf1de082dd64':{'64a8f6943587bef9db328d23':8,'64aad612456746cdf896d2bb':9,'64a69a3991ef02ab9753875f':2,'64a9b3e2c188927a832492aa':2,'64a4ef5a002b73a7f9eef903':2,'64aa3e57100ed539d1154406':5,'64a8f6943587bef9db328d23':9,'64a68cc1fcebbecadd8e4466':9,'64a68d9f21b7d880ade5aed0':8,'64a8526e16e083eeadd99b82':7,},'6505da3ada1cdf1de082dd65':{'64aa464a100ed539d1154479':5,'64a68ec121b7d880ade5aedb':10,'64a6965591ef02ab97538733':2,'64aa5a95100ed539d11544cd':4,'64aa697fe491cd1d61322c34':7,'64a460e90bd2959f546d8094':3,'64a86459e46495fed584c33f':9,'64a8e9b93587bef9db328c6d':3,'64a68484fcebbecadd8e43e2':5,'64a85ba8e46495fed584c2cd':9,},'6505da3ada1cdf1de082dd66':{'64aa3ee4e491cd1d61322bc5':7,'64a8607816e083eeadd99c48':1,'64aa7663e491cd1d61322ce4':2,'649db1d36b636ec905317521':4,'649daf3e6b636ec9053174f1':5,'64aaf8ace491cd1d61322dc9':1,'64a98e2fc188927a83249250':9,'64a68572fcebbecadd8e43ec':4,'64aa679be491cd1d61322c12':9,'64a68c40fcebbecadd8e445c':8,},'6505da3ada1cdf1de082dd67':{'64a9b100c188927a8324928c':7,'64a9225b304b5d133c6c952c':1,'64ae2894be3a91ce22b1c26d':8,'64a6861dfcebbecadd8e4404':3,'64a9b4dac188927a832492be':8,'64aa74abe491cd1d61322ccf':9,'64a8539116e083eeadd99b96':6,'64a9b361c188927a83249296':4,'64a290887e2b797ccdb02d35':5,'64a7da5cf8b8181a82b5cce1':8,},'6505da3ada1cdf1de082dd68':{'64a98fc0c188927a83249282':8,'649db0c96b636ec905317507':9,'64a98dd9c188927a83249246':10,'64aa3d74100ed539d11543f6':2,'64aadd7a456746cdf896d2e3':8,'64a85f5be46495fed584c303':3,'64aa7663e491cd1d61322ce4':6,'64aaf7ece491cd1d61322db5':3,'64a9b595c188927a832492d3':1,'64aa6067100ed539d1154532':10,},'6505da3ada1cdf1de082dd69':{'64a6550bfcebbecadd8e4388':2,'64a98e81c188927a8324925a':4,'64a98f51c188927a8324926e':4,'64a85e8ee46495fed584c2eb':9,'64a8540b16e083eeadd99ba0':7,'649db0c96b636ec905317507':4,'64aad584456746cdf896d2b1':2,'64a8e9b93587bef9db328c6d':7,'64a8568216e083eeadd99bc0':10,'64a650b2fcebbecadd8e4350':10,},'6505da3ada1cdf1de082dd6a':{'64aa598b100ed539d11544b9':10,'64a8eecb3587bef9db328ca9':3,'64a4ee9e002b73a7f9eef8f7':3,'64aaf8ace491cd1d61322dc9':3,'64a6974c91ef02ab9753873d':1,'64aafa7ae491cd1d61322dea':10,'64a8540b16e083eeadd99ba0':3,'64aa697fe491cd1d61322c34':6,'64aadd7a456746cdf896d2e3':7,'64a68cc1fcebbecadd8e4466':9,},'6505da3ada1cdf1de082dd6b':{'64a4620d0bd2959f546d80a8':3,'64aaf6a5e491cd1d61322daa':10,'64a85f5be46495fed584c303':3,'64a9b595c188927a832492d3':9,'64a4620d0bd2959f546d80a8':2,'64a98ecbc188927a83249264':9,'64987b4191ce10c73a38447d':9,'64a8469ce46495fed584c1eb':6,'64a460e90bd2959f546d8094':1,'64a8f34b3587bef9db328d05':10,},'6505da3ada1cdf1de082dd6c':{'64a96eb6c188927a832491e8':7,'64a84d1016e083eeadd99b5a':9,'64aaf3cfe491cd1d61322d8c':4,'64a854b016e083eeadd99baa':8,'64a86138e46495fed584c317':3,'64a4f1a3002b73a7f9eef918':5,'64aaf233e491cd1d61322d78':3,'64aa6f0de491cd1d61322c8c':3,'64a6cce491ef02ab975387d8':7,'64aa47264b72ca1d819c6cf4':6,},'6505da3ada1cdf1de082dd6d':{'64a97037c188927a83249210':5,'64a85b3316e083eeadd99bff':6,'64aa649be491cd1d61322bf6':10,'64a98dd9c188927a83249246':6,'649db1d36b636ec905317521':3,'64a6820dfcebbecadd8e43d8':8,'64a7da5cf8b8181a82b5cce1':7,'64a8558516e083eeadd99bb6':2,'64a865c1e46495fed584c353':5,'64aa457f100ed539d115445f':1,},'6505da3ada1cdf1de082dd6e':{'64a68815fcebbecadd8e4426':3,'64aa3fda100ed539d115441a':7,'64a9237a304b5d133c6c9540':4,'64a68f0efcebbecadd8e448e':9,'64a858a016e083eeadd99be6':8,'64a96f75c188927a832491f2':7,'64aaf99ae491cd1d61322ddf':7,'64a85202e46495fed584c24c':7,'64a68cc1fcebbecadd8e4466':3,'64aade12456746cdf896d2ee':7,},'6505da3ada1cdf1de082dd6f':{'64a9237a304b5d133c6c9540':6,'64a69cf091ef02ab97538782':7,'64a972e9c188927a83249226':9,'64a68b1b21b7d880ade5aeac':3,'64aaf99ae491cd1d61322ddf':10,'64a9b595c188927a832492d3':9,'64a8526e16e083eeadd99b82':1,'64aa42b1100ed539d1154439':5,'64ae2894be3a91ce22b1c26d':9,'64a4ee9e002b73a7f9eef8f7':8,},'6505da3ada1cdf1de082dd70':{'64a98be9c188927a8324923c':7,'64a28f5f7e2b797ccdb02d2b':7,'64ae2703be3a91ce22b1c243':5,'64aa6a92e491cd1d61322c47':6,'64a68d41fcebbecadd8e4470':9,'64ae2703be3a91ce22b1c243':4,'64a84dbb16e083eeadd99b64':3,'64a85124e46495fed584c238':8,'64a92562304b5d133c6c958a':3,'64987de891ce10c73a3844a3':4,},'6505da3ada1cdf1de082dd71':{'64a8540b16e083eeadd99ba0':9,'64aad485456746cdf896d2a5':10,'64a68484fcebbecadd8e43e2':1,'64aa47264b72ca1d819c6cf4':10,'64aa5be7100ed539d11544e1':4,'64a6965591ef02ab97538733':1,'64aa7551e491cd1d61322cda':10,'64a28db17e2b797ccdb02d16':7,'64987d3b91ce10c73a384493':8,'64a861d816e083eeadd99c68':10,},'6505da3ada1cdf1de082dd72':{'64a68c5421b7d880ade5aeb6':5,'64a28db17e2b797ccdb02d16':8,'64a923ff304b5d133c6c9554':9,'64a6820dfcebbecadd8e43d8':4,'64aa3892100ed539d11543ba':5,'64aa3f02100ed539d1154410':3,'64aaef09e491cd1d61322d47':4,'64a68c40fcebbecadd8e445c':1,'64a68cc1fcebbecadd8e4466':9,'64a8f11f3587bef9db328ce7':10,},'6505da3ada1cdf1de082dd73':{'64a8f3b93587bef9db328d0f':1,'64aa73fce491cd1d61322cb7':9,'64a68572fcebbecadd8e43ec':3,'64ae2703be3a91ce22b1c243':4,'64a8f6943587bef9db328d23':7,'64aacc62e491cd1d61322d23':2,'64aa464a100ed539d1154479':8,'64a68dcafcebbecadd8e447a':8,'64a680aefcebbecadd8e43ce':3,'64a85ba8e46495fed584c2cd':8,},'6505da3ada1cdf1de082dd74':{'64a68f0efcebbecadd8e448e':10,'64a85124e46495fed584c238':4,'64a8572f16e083eeadd99bca':9,'64a9b595c188927a832492d3':3,'64a45c990bd2959f546d8057':7,'64a84dbb16e083eeadd99b64':9,'64aacc62e491cd1d61322d23':5,'64aaf3cfe491cd1d61322d8c':2,'64a69d9291ef02ab9753878c':7,'64aa5e12100ed539d1154506':4,},'6505da3ada1cdf1de082dd75':{'64aa4712100ed539d1154483':2,'64a4e78373ca803634d9d2c4':6,'64aa3fda100ed539d115441a':9,'64a9237a304b5d133c6c9540':10,'64a45f0a0bd2959f546d8080':1,'64a844e8e46495fed584c1e1':7,'64a96d38c188927a832491c0':8,'64a863c8e46495fed584c335':2,'64a85202e46495fed584c24c':10,'64aadf3b456746cdf896d30e':10,},'6505da3ada1cdf1de082dd76':{'64a6550bfcebbecadd8e4388':6,'64a8ee563587bef9db328c9f':8,'64aaf320e491cd1d61322d82':4,'64a92562304b5d133c6c958a':8,'64a6903ffcebbecadd8e44a2':6,'64aa74abe491cd1d61322ccf':2,'64a9b539c188927a832492c8':8,'64aa6a92e491cd1d61322c47':8,'64a68ec121b7d880ade5aedb':4,'64a461730bd2959f546d809e':1,},'6505da3ada1cdf1de082dd77':{'64a6903ffcebbecadd8e44a2':2,'64a86459e46495fed584c33f':3,'64aa6d50e491cd1d61322c67':6,'64a45f0a0bd2959f546d8080':5,'64987de891ce10c73a3844a3':8,'64a4620d0bd2959f546d80a8':10,'64a4e3c473ca803634d9d2a3':2,'64a6524dfcebbecadd8e436a':3,'64a8ec583587bef9db328c95':2,'64a68dcafcebbecadd8e447a':1,},'6505da3ada1cdf1de082dd78':{'64a8489716e083eeadd99b1b':7,'64a9237a304b5d133c6c9540':10,'64a65370fcebbecadd8e4374':10,'64aacbe5e491cd1d61322d19':7,'64a4e78373ca803634d9d2c4':6,'64a8526e16e083eeadd99b82':9,'64a6524dfcebbecadd8e436a':1,'64a844e8e46495fed584c1e1':4,'64a68cc1fcebbecadd8e4466':3,'64aaf6a5e491cd1d61322daa':3,},'6505da3ada1cdf1de082dd79':{'64a9225b304b5d133c6c952c':5,'64aa620a100ed539d115455e':8,'64a98f88c188927a83249278':3,'64a8f34b3587bef9db328d05':8,'64aa46754b72ca1d819c6cea':5,'64a8f34b3587bef9db328d05':2,'64aadd7a456746cdf896d2e3':1,'64a65421fcebbecadd8e437e':5,'64a8540b16e083eeadd99ba0':5,'64a858fae46495fed584c2a4':4,},'6505da3ada1cdf1de082dd7a':{'64a85192e46495fed584c242':4,'64a97037c188927a83249210':10,'64aa3d74100ed539d11543f6':7,'64a8469ce46495fed584c1eb':1,'64a68a5afcebbecadd8e4448':10,'64aa73fce491cd1d61322cb7':1,'64a45e550bd2959f546d806b':3,'64a923ff304b5d133c6c9554':7,'64a9b45bc188927a832492b4':9,'64a849f716e083eeadd99b2c':4,},'6505da3ada1cdf1de082dd7b':{'64a45b490bd2959f546d8043':2,'64a8f6433587bef9db328d19':8,'64a861d816e083eeadd99c68':2,'64a68ce321b7d880ade5aec0':1,'64a68fc2fcebbecadd8e4498':3,'64a98e2fc188927a83249250':9,'649db17a6b636ec905317517':4,'64a85fe0e46495fed584c30d':3,'64aa3cf0100ed539d11543ec':8,'64a96e18c188927a832491d4':4,},'6505da3ada1cdf1de082dd7c':{'64a8ec583587bef9db328c95':3,'64aa598b100ed539d11544b9':9,'64aa6101100ed539d115454a':5,'64a45b490bd2959f546d8043':6,'64a67a20fcebbecadd8e4392':3,'64aa6c06e491cd1d61322c51':3,'64a28db17e2b797ccdb02d16':5,'649db17a6b636ec905317517':9,'64a844e8e46495fed584c1e1':6,'64a972e9c188927a83249226':2,},'6505da3ada1cdf1de082dd7d':{'64aaf59be491cd1d61322da0':1,'64ae291bbe3a91ce22b1c28d':7,'64a4eb6573ca803634d9d2d6':6,'64a97037c188927a83249210':5,'64aaf99ae491cd1d61322ddf':4,'64a972e9c188927a83249226':9,'64a45f0a0bd2959f546d8080':4,'649db1d36b636ec905317521':10,'64a68d41fcebbecadd8e4470':9,'64aa3781100ed539d11543a6':10,},'6505da3ada1cdf1de082dd7e':{'64aa6101100ed539d115454a':2,'64a6965591ef02ab97538733':1,'64a85124e46495fed584c238':4,'64a67c1efcebbecadd8e43ba':8,'64a844e8e46495fed584c1e1':6,'64aa6a92e491cd1d61322c47':8,'64a8ea583587bef9db328c77':8,'64aac1e4e491cd1d61322cfa':7,'64a67f4afcebbecadd8e43c4':2,'64aadc21456746cdf896d2cf':10,},'6505da3ada1cdf1de082dd7f':{'64a98ecbc188927a83249264':4,'64a68fc2fcebbecadd8e4498':8,'64a84fcb16e083eeadd99b6e':2,'64ae291bbe3a91ce22b1c28d':1,'64a8f0653587bef9db328cd2':6,'64aa3e55100ed539d1154404':1,'64a98be9c188927a8324923c':10,'64aadcf8456746cdf896d2d9':5,'64aa457f100ed539d115445f':5,'64a85d88e46495fed584c2e1':9,},'6505da3ada1cdf1de082dd80':{'64aa3958100ed539d11543c4':6,'64a8489716e083eeadd99b1b':1,'64aaf8ace491cd1d61322dc9':10,'64aa65e9e491cd1d61322c00':8,'64aa406c100ed539d1154424':7,'64986aef91ce10c73a384445':1,'64a85202e46495fed584c24c':9,'64a863c8e46495fed584c335':4,'64a85f5be46495fed584c303':10,'64a855aee46495fed584c296':8,},'6505da3ada1cdf1de082dd81':{'64a6994691ef02ab97538755':9,'64a69d9291ef02ab9753878c':7,'64a9b361c188927a83249296':7,'64a68d9f21b7d880ade5aed0':8,'64a8558516e083eeadd99bb6':4,'64aa3e55100ed539d1154404':3,'64a8568216e083eeadd99bc0':8,'64aa3bbc100ed539d11543d8':4,'64a68815fcebbecadd8e4426':8,'64aadf9e456746cdf896d318':3,},'6505da3ada1cdf1de082dd82':{'64a922fc304b5d133c6c9536':9,'64a8e9b93587bef9db328c6d':7,'64a923b2304b5d133c6c954a':9,'64aa5e12100ed539d1154506':3,'64a98e81c188927a8324925a':3,'64a970c3c188927a8324921a':3,'64aaf4ace491cd1d61322d96':1,'64aa7551e491cd1d61322cda':3,'64aa41c4100ed539d115442e':8,'64a8f0653587bef9db328cd2':1,},'6505da3ada1cdf1de082dd83':{'64a8eecb3587bef9db328ca9':1,'64aa41c0e491cd1d61322bda':4,'64a68484fcebbecadd8e43e2':7,'64a96d38c188927a832491c0':1,'64a9b361c188927a83249296':2,'64a6974c91ef02ab9753873d':4,'64aa3c33e491cd1d61322bb1':6,'64aa7663e491cd1d61322ce4':3,'64aa6f0de491cd1d61322c8c':10,'64a84fcb16e083eeadd99b6e':8,},'6505da3ada1cdf1de082dd84':{'64aa464a100ed539d1154479':9,'64aa7093e491cd1d61322c96':1,'64a97037c188927a83249210':7,'64987a7591ce10c73a38444f':5,'64a9b100c188927a8324928c':3,'64a96d38c188927a832491c0':1,'64aa3ee4e491cd1d61322bc5':2,'64aa5ca2100ed539d11544eb':8,'64aa41c0e491cd1d61322bda':3,'64a859fae46495fed584c2b7':4,},'6505da3ada1cdf1de082dd85':{'64a85f5be46495fed584c303':8,'64aa37e0100ed539d11543b0':2,'64a67c1efcebbecadd8e43ba':1,'64a84d1016e083eeadd99b5a':1,'64aaef09e491cd1d61322d47':7,'64aa5be7100ed539d11544e1':6,'64aa6101100ed539d115454a':9,'64a9b3e2c188927a832492aa':6,'64aa6f0de491cd1d61322c8c':2,'64a9b595c188927a832492d3':9,},'6505da3ada1cdf1de082dd86':{'64aa3892100ed539d11543ba':10,'64a8f6943587bef9db328d23':5,'64aa7663e491cd1d61322ce4':3,'64a4f1a3002b73a7f9eef918':3,'64a8f0653587bef9db328cd2':5,'64a68c40fcebbecadd8e445c':6,'64987d3b91ce10c73a384493':9,'64987b4191ce10c73a38447d':6,'64ae279bbe3a91ce22b1c24d':10,'64a85192e46495fed584c242':7,},
  };
  
  // Function to calculate cosine similarity between two products
  function calculateCosineSimilarity(product1, product2, userOrdering) {
    const users1 = [];
    const users2 = [];
  
    for (const user in userOrdering) {
      if (userOrdering[user].hasOwnProperty(product1) && userOrdering[user].hasOwnProperty(product2)) {
        users1.push(userOrdering[user][product1]);
        users2.push(userOrdering[user][product2]);
      }
    }
  
    if (users1.length === 0 || users2.length === 0) {
      return 0; // No common users, no similarity.
    }
  
    const dotProduct = users1.reduce((acc, val, index) => acc + val * users2[index], 0);
    const magnitude1 = Math.sqrt(users1.reduce((acc, val) => acc + val ** 2, 0));
    const magnitude2 = Math.sqrt(users2.reduce((acc, val) => acc + val ** 2, 0));
  
    return dotProduct / (magnitude1 * magnitude2);
  }
  
  // Function to calculate product similarities for a target product
  function calculateProductSimilarities(targetProduct, userOrdering) {
    const similarities = {};
  
    // Collect all products ordered by users
    const allProducts = new Set();
    for (const user in userOrdering) {
      for (const product in userOrdering[user]) {
        allProducts.add(product);
      }
    }
  
    // Calculate similarities for the target product
    for (const product of allProducts) {
      if (product !== targetProduct) {
        similarities[product] = calculateCosineSimilarity(targetProduct, product, userOrdering);
      }
    }
  
    return similarities;
  }
  
  // Example: Calculate similarities between a specific product and all other products
  const targetProduct = id; // Change this to your target product ID
  const productSimilarities = calculateProductSimilarities(targetProduct, userOrdering);
  
  // Sort product similarities in descending order
  const sortedProductSimilarities = Object.keys(productSimilarities).sort((a, b) => productSimilarities[b] - productSimilarities[a]);
  
  // Recommend the top 10 products
  const topRecommendedProducts = sortedProductSimilarities.slice(0, 10);
  console.log('Top recommended products for the target product:');
  topRecommendedProducts.forEach(product => {
    console.log(product);
  });
  const recommendedProducts = await Product.find({ _id: { $in: topRecommendedProducts } }).exec();

const productQuery = {
  _id: id,
};

if (author_id) {
  productQuery.author = author_id;
}

if (category_id) {
  productQuery.category = category_id;
}

const product = await Product.findOne(productQuery);

const authorBooksQuery = {
  author: product.author,
  _id: { $ne: product._id }, // Exclude the current product from the result
};

const authorBooks = await Product.find(authorBooksQuery);

return {
  props: {
    product: JSON.parse(JSON.stringify(product)),
    authorBooks: JSON.parse(JSON.stringify(authorBooks)),
    recommendedProducts: JSON.parse(JSON.stringify(recommendedProducts)),
  },
  };
}

// Sample user-book ratings data

  
  // Function to calculate cosine similarity between two items
