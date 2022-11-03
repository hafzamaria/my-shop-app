import axios from "axios";
import { useEffect, useState } from "react";
import './index.css'
import { Link } from "react-router-dom";


function Shop() {
  const [products, setProducts] = useState([]);
  const [toggleRefresh, setToggleRefresh] = useState(true);
  const [cart , setCart]= useState(null);


  useEffect(() => {
    let getAllProducts = async () => {
      let response =await axios.get ("http://localhost:5000/products")
      // let response = await axios.get("https://crud--crud-app.herokuapp.com/products");
      setProducts(response.data.data.reverse());
    };
    getAllProducts();
  }, [toggleRefresh]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    console.log({
        id: data.get('id'),
        name: data.get('name'),
    });

    let baseUrl = "http://localhost:5000";
    try {
        let response = await axios.post(`${baseUrl}/cart`,
            {
                id: data.get('id'),
                name: data.get('name'),
            },
            {
                withCredentials: true//////jwt work
            })
        console.log("response: ", response.data);

    

    } catch (e) {
        console.log("Error in api call: ", e);
    }
};

  /////////==============
  // const ProductPage=async () =>{
    
  //   axios.get('http://localhost:5000/products')
 
  
  //   .then(function (response) {
  //     console.log(response.data);
  //     console.log('')
      
     
  //   })
   
  
  
  // ProductPage();
  ////////////============
//   let cartHandler = async (e) => {
//     e.preventDefault();


//     try {
//         let response = await
//             axios.post("http://localhost:5000/cart",
//                 {
//                     name: cart.name,
//                    price: cart.price,
//                     description: cart.description,
//                     code: cart.code,
//                 },
//                 {
//                     withCredentials: true
//                 })
//         console.log("cart: ", response.data);

//         setToggleRefresh(!toggleRefresh);
//         setCart(null);


//     } catch (e) {
//         console.log("Error in api call: ", e);

//     }


// }




  return (
    <>
    
 


  

       <div className="result">
        <div className="map1">
          {products.map((eachProduct) => (
            <div className="key1" key={eachProduct._id}>
              {/* <div className="img1">
                <img className="pic" width='200px' src={eachProduct.profilePicture} alt="" />
              </div> */}
              <div className="detail">
                <p className="name1">{eachProduct.name}</p>
                <br />
                <div>{eachProduct.description}</div>
                <br />
             
                <br />
                <div className="price">{eachProduct.price}</div>
                <br />
                <div>{eachProduct.code}</div>
               

         <div className="product">
             <button onClick={handleSubmit} >Add to Cart</button>
             </div>
             {/* <Link to="/Page">ProductPage</Link> */}
             
             </div>
            </div>
          ))}
           
        </div>
      </div> 

   

    



    </>
  );
}

export default Shop;