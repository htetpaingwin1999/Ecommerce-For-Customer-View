import Link from "next/link";
import Center from "../components/Center";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../components/CartContext";
import BarsIcon from "../components/icons/Bars";
import axios from "axios";
import { BsCart4 } from 'react-icons/bs';
import { AuthProvider, useAuth } from './../components/Form/AuthContext';
import styled, { keyframes } from "styled-components";
import Marquee from "./Marquee";
import { SearchContext, SearchContextProvider } from "./SearchContext";

const StyledHeader = styled.header`
  background-color: #119afa;
  padding: 5px;
`;
const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
  position: relative;
  display: flex;
  justify-content: center;
  z-index: 3;
  margin-right: 10px;

  @media screen and (max-width: 768px) {
    font-size: 150px;
  }

  @media screen and (max-width: 480px) {
    font-size: 100px;
  }
`;
const LogoImage = styled.img`
  max-width: 200px;
  max-height: 200px;
  margin-right: 10px;
  display: ${props => props.hideWhenEmpty && props.src ? "block" : "none"};

  @media screen and (max-width: 768px) {
    max-width: 180px;
    max-height: 180px;
  }

  @media screen and (max-width: 480px) {
    max-width: 100px;
    max-height: 100px;
  }
`;
const Wrapper = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: center;
  padding: 20px 0 0 0;
  z-index: 999;
`;
const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  display: none;
  padding: 0px 0px 20px 0px;
  width: 200px;
  height: 300px;
  overflow-y: auto;
  z-index: 3;

  &.account {
    height: 80px;
  }

  /* Custom scroll styling */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #119afa;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #0a80d6;
  }
`;
const StyledNav = styled.nav`
  ${props =>
    props.mobileNavActive
      ? `
    display: block;
  `
      : `
    display: none;
  `}
  gap: 15px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 70px 20px 20px;
  background-color: #119afa;
  @media screen and (min-width: 768px) {
    display: flex;
    position: static;
    padding: 0;
  }
`;
const NavLink = styled.a`
  display: block;
  color: #fff;
  text-decoration: none;
  padding: 10px 0;
  position: relative;
  @media screen and (min-width: 768px) {
    padding: 0 0 10px 0;
  }

  &:hover + ${DropdownMenu} {
    display: block;
  }
`;
const DropdownLink = styled(Link)`
  display: block;
  color: #000;
  background: #fff;
  text-decoration: none;
  padding: 5px;
  &:hover {
    background-color: #f2f2f2;
  }
  &.parent {
    color: #fff;
    background: #63d0f7;
    border-bottom: 1px solid black;
    font-size: 18px;
  }
  &.child {
    background: #fff;
    border-bottom: 1px solid black;
    font-size: 16px;
  }
`;
const DropdownWrapper = styled.div`
  position: relative;
  &:hover ${DropdownMenu} {
    display: block;
  }
`;
const NavButton = styled.button`
  background-color: transparent;
  width: 30px;
  height: 30px;
  border: 0;
  color: white;
  cursor: pointer;
  position: relative;
  z-index: 3;
  @media screen and (min-width: 768px) {
    display: none;
  }
`;

// decoration part
const BannerConainer = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: row;
  margin-top: -10px;
  overflow: hidden;
  margin-bottom: 10px;
`
const NoofItems = styled.span`
  min-width: 30px;
  top: -20px;
  padding: 3px;
  height: auto;
  background: #b3c215;
  color: #fff;
  border-radius: 100%;

  position: relative;
  left: 50%;
  z-index: 0;
`

const MainImage1 = styled.img`
  position: absolute;
  width: 200px;
  height: 200px;
  top: 0;
  left: 0;
  z-index: -1;

  @media screen and (max-width: 600px) {
    width: 120px;
    height: 100%;
  }
`;

const MainImage2 = styled.img`
  position: absolute;
  width: 200px;
  height: 200px;
  top: 0;
  right: 0;
  z-index: -1;

  @media screen and (max-width: 600px) {
    width: 120px;
    height: 100%;
  }
`;

const backgroundAnimation = keyframes`
  from {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateY(0%) scale(1);
    opacity: 1;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  margin-top: 15px;
  align-items: center;
  justify-content: center;
  max-width: 70%; /* Adjust the maximum width as needed */
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-left: 15%;
  z-index:997;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  padding: 8px;
  font-size: 16px;
  z-index: 998;
`;

const SearchButton = styled.button`
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 20px;
  z-index:999;
`;

const SearchIcon = styled.i`
  color: #888;
`;

const SearchImage = styled.img`
  width: 16px; /* Adjust the image width as needed */
  height: 16px; /* Adjust the image height as needed */
  margin-right: 4px; /* Add some spacing between the image and input */
`;


// Create a styled component for the animated background
const AnimatedBackground = styled.div`
  position: absolute;
  top: -100px;
  left: 0;
  width: 100%;
  height: 180%;
  background-image: url(${props => props.backgroundImage});
  background-size: 100px;
  animation: ${backgroundAnimation} 10s linear infinite;
  z-index: -1;
`;

export default function Header() {
  const { cartProducts } = useContext(CartContext);
  const { searchData, setSearchData } = useContext(SearchContext);

  const handleSearchChange = (e) => {
    setSearchData(e.target.value);
    // console.log("Search data in header.js"+searchData);
  };
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [backgroundImageUrl, setBackgroundUrl] = useState('');
  const [day, setDay] = useState('');

  const [mainImage1, setMainImage1] = useState("");
  const [mainImage2, setMainImage2] = useState("");
  const mainImage0s = [];
  const [mainImage0, setMainImage0] = useState('');

  const [jwtToken, setJwtToken] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Use jwtToken here
    setJwtToken(localStorage.getItem('jwtToken'));
    setUserName(localStorage.getItem('UsernameForTainHlwar'));
  }, [jwtToken]);

  const handleLogout = () => {
    // Clear the items in localStorage
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('UsernameForTainHlwar');
    localStorage.removeItem('UserIDforTainHlwar')

    // Redirect to the logout or login page
    window.location.href = '/'; // Replace with the URL you want to redirect to
  };

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
    axios.get("/api/authors").then((result) => {
      setAuthors(result.data);
    });
  }, []);

  
  useEffect(() => {
    async function fetchLogoImage() {
      try {
        const response = await axios.get('/api/events');
        const activeEvent = response.data;
        setBackgroundUrl(activeEvent.background_image_path);
        setDay(activeEvent.name);

        if (activeEvent.image_path && activeEvent.besideOrUp == 1){
          for (let i = 0; i < mainImage0Count; i++) {
            setMainImage0(activeEvent.image_path)
            mainImage0s.push(
              <Logo key={i} href={"/"}>
                <LogoImage src={activeEvent.image_path} />
              </Logo>
            );
          }
        }
        if(activeEvent.image_path && activeEvent.besideOrUp == 0){
          setMainImage1(activeEvent.image_path);
          setMainImage2(activeEvent.image_path);
        }
      } catch (error) {
        console.error('Error fetching mainImage0 image:', error);
      }
    }

    fetchLogoImage();
  }, []); 

  const mainImage0Count = 28;
  const mainImage0sArray = Array.from({ length: mainImage0Count });

  return (
      <StyledHeader>
        <Center>
          <BannerConainer>
            {mainImage0sArray.map((_, index) => (
              <img
                key={index}
                src={mainImage0}
                alt=""
              />
            ))}
          </BannerConainer>
          
          <Logo href={"/"}>
          <AnimatedBackground backgroundImage={backgroundImageUrl} />
          
          {mainImage1 && (
            <>
              <MainImage1
                src={mainImage1}
                alt="Background"
              />
                
            </>
          )}
            
            <LogoImage src="https://drive.google.com/uc?export=view&id=1Yvgx39h6AUpcpfl1abUlwSEFo82eQm7O" hideWhenEmpty={true} />
            {mainImage2 && (
            <MainImage2
              src={mainImage1}
              alt="Background"
            />
          )}
          </Logo>

          <SearchContainer>
            <SearchInput type="text" placeholder="Search for books" 
              value={searchData}
              onChange={handleSearchChange}
            />
          <Link href={`/?searchData=${searchData}`}
          style={{zIndex:"999", padding:"5px"}}>
            <SearchButton>
              <SearchImage src="https://w7.pngwing.com/pngs/57/6/png-transparent-computer-icons-magnifying-glass-magnifier-magnifying-glass-text-interface-magnifier.png" alt="Search" />
            </SearchButton>
          </Link>
          </SearchContainer>

          <Wrapper>
            {/* <Logo href={"/"}>Paradise</Logo> */}
            <StyledNav mobileNavActive={mobileNavActive}>
              <NavLink href={"/"}>ပင်မ စာမျက်နှာ</NavLink>
              {/* <NavLink href={"/newarrivals"}>အသစ်ထွက်ရှိသောစာအုပ်များ</NavLink> */}
              <DropdownWrapper>
                <NavLink href={"/products"}>စာရေးဆရာများ</NavLink>
                <DropdownMenu>
                  {authors.map((author) => (
                    <DropdownLink
                      href={`/authors/${author._id}`}
                      key={author._id}
                      className="child"
                    >
                      {author.name}
                    </DropdownLink>
                  ))}
                </DropdownMenu>
              </DropdownWrapper>
              <DropdownWrapper>
                <NavLink href={"/categories"}>စာအုပ်အမျိုးအစားများ</NavLink>
                <DropdownMenu>
                  {categories.map((category) => (
                    <DropdownLink href={`/categories/${category._id}`} key={category._id}
                      className={category.parent ? 'child' : 'parent'}
                    >
                      {category.name}
                    </DropdownLink>
                  ))}
                </DropdownMenu>
              </DropdownWrapper>
              {/* <DropdownWrapper>
                <NavLink href={"/categories"}>စာအုပ်အညွှန်းများ</NavLink>
                <DropdownMenu>
                  {categories.map((category) => {
                    if (category.parent) { }
                    else {
                      return (
                        <DropdownLink
                          href={`/categories/${category._id}`}
                          key={category._id}
                          {...category}
                          className="child"
                        >
                          {category.name}
                        </DropdownLink>
                      );
                    }
                  })}
                </DropdownMenu>
              </DropdownWrapper> */}
              <DropdownWrapper>
                <NavLink href={"/services"}>ဝန်ဆောင်မှုများ</NavLink>
              </DropdownWrapper>
            
              
              <NavLink href={"/favourites"}>နှစ်သက်မှု💕</NavLink>
              <DropdownWrapper>
                {jwtToken ?(
                <>
                    <NavLink href={"/"} style={{ marginTop: "3px" }}>{userName}</NavLink>
                    <DropdownMenu className="account">
                    <DropdownLink href="#" onClick={handleLogout}>
                      Logout
                    </DropdownLink>
                  </DropdownMenu>
                </>
                ) 
                :
                (
                  <>
                    <NavLink href={"/"}>မိမိအကောင့်</NavLink>
                    <DropdownMenu className="account">
                      <DropdownLink href={"/signup"}>
                        အကောင့်အသစ်ဖွင့်ရန်
                      </DropdownLink>
                      <DropdownLink href={"/login"}>
                        အကောင့်ထဲသို့ဝင်ရန်
                      </DropdownLink>
                    </DropdownMenu>
                  </>
                ) 
              }
                
              </DropdownWrapper>
            {jwtToken? <>
              <NavLink href={"/orderlist"}>
                Your Order Lists
              </NavLink>
            </>:<></>}
              <NavLink href={"/cart"}>
                <NoofItems>{cartProducts.length}</NoofItems>
                <BsCart4 size="25" color="#004380" style={{ top: -10 }} />
              </NavLink>
            
            </StyledNav>
            <NavButton onClick={() => setMobileNavActive(prev => !prev)}>
              <BarsIcon />
            </NavButton>
          </Wrapper>
        </Center>
        {/* <Marquee text="hello"/> */}
      </StyledHeader>
  );
  
}