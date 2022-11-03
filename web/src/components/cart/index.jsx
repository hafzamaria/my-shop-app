// import axios from "axios";
// import { useEffect, useState } from "react";
// // import "./index.css";

// function Cart() {
//   const [Name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [code, setCode] = useState("");
//   const [carts, setCarts] = useState([]);
//   const [toggleRefresh, setToggleRefresh] = useState(true);

//   //////////////======editproduct=========
//   let [editProduct, setEditProduct] = useState(null);////
//   let [loading, setLoading] = useState(false);
  
// //////////////======editproduct=========

//   useEffect(() => {
//     let getAllCarts = async () => {
//       let response =await axios.get ("http://localhost:5000/carts")
//       // let response = await axios.get("https://crud--crud-app.herokuapp.com/products");
//       setCarts(response.data.data.reverse());
//     };
//     getAllCarts();
//   }, [toggleRefresh]);

// //   const doSignup = async (e) => {
// //     e.preventDefault();

// //     var profilePictureInput = document.getElementById("profilePictureInput");
// //     console.log("fileInput: ", profilePictureInput.files); // local url

// //     let formData = new FormData();
// //     // https://developer.mozilla.org/en-US/docs/Web/API/FormData/append#syntax

// //     formData.append("name", Name); // this is how you add some text data along with file
// //     formData.append("description", description); // this is how you add some text data along with file
// //     formData.append("price", price); // this is how you add some text data along with file
// //     formData.append("code", code);
// //     formData.append("profilePicture", profilePictureInput.files[0]);

// //     // file input is for browser only, use fs to read file in nodejs client

// //     axios({
// //       method: "post",
// //       url: "http://localhost:5000/product",
// //       //  url: "https://crud--crud-app.herokuapp.com/product",
// //       data: formData,
// //       headers: { "Content-Type": "multipart/form-data" },
// //       // withCredentials: true
// //     })
// //       .then((res) => {
// //         console.log(`upload Success` + res.data);
// //         document.querySelector("#message").innerHTML = res.data.message;
// //         setToggleRefresh(!toggleRefresh);
// //       })
// //       .catch((err) => {
// //         console.log(err);
// //         document.querySelector("#message").innerHTML = err.res.data.message;
// //       });
// //   };
//   /////editproduct//////////////

//   return (
//     <>
      
 

  

//      <div className="result">
//         <div className="map1">
//           {carts.map((eachCart) => (
//             <div className="key1" key={eachCart._id}>
//               <div className="img1">
           
//                 <img className="pic" src={eachCart.profilePicture} alt="" />
//               </div>
//               <div className="detail">
//                 <p className="name1">{eachCart.name}</p>
//                 <br />
//                 <div>{eachCart.description}</div>
//                 <br />
//               </div>
//                 <br />
//                 <div className="price">{eachCart.Price}</div>
//                 <br />
//                 <div>{eachCart.code}</div>
//             </div>
//           ))}
//         </div>
//       </div> 

   





//     </>
//   );
// }

// export default Cart;
import axios from "axios";
import { useEffect, useState } from "react";
// import "./index.css";

function Cart() {
  const [Name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [code, setCode] = useState("");
  const [carts, setCarts] = useState([]);
  const [toggleRefresh, setToggleRefresh] = useState(true);

  //////////////======editproduct=========
  let [editProduct, setEditProduct] = useState(null);////
  let [loading, setLoading] = useState(false);
  
//////////////======editproduct=========

  useEffect(() => {
    let getAllCarts = async () => {
      let response =await axios.get ("http://localhost:5000/carts")
      // let response = await axios.get("https://crud--crud-app.herokuapp.com/products");
      setCarts(response.data.data.reverse());
    };
    getAllCarts();
  }, [toggleRefresh]);

//   const doSignup = async (e) => {
//     e.preventDefault();

//     var profilePictureInput = document.getElementById("profilePictureInput");
//     console.log("fileInput: ", profilePictureInput.files); // local url

//     let formData = new FormData();
//     // https://developer.mozilla.org/en-US/docs/Web/API/FormData/append#syntax

//     formData.append("name", Name); // this is how you add some text data along with file
//     formData.append("description", description); // this is how you add some text data along with file
//     formData.append("price", price); // this is how you add some text data along with file
//     formData.append("code", code);
//     formData.append("profilePicture", profilePictureInput.files[0]);

//     // file input is for browser only, use fs to read file in nodejs client

//     axios({
//       method: "post",
//       url: "http://localhost:5000/product",
//       //  url: "https://crud--crud-app.herokuapp.com/product",
//       data: formData,
//       headers: { "Content-Type": "multipart/form-data" },
//       // withCredentials: true
//     })
//       .then((res) => {
//         console.log(`upload Success` + res.data);
//         document.querySelector("#message").innerHTML = res.data.message;
//         setToggleRefresh(!toggleRefresh);
//       })
//       .catch((err) => {
//         console.log(err);
//         document.querySelector("#message").innerHTML = err.res.data.message;
//       });
//   };
  /////editproduct//////////////
  
  
  return (
    <>
      
 

  

     <div className="result">
        <div className="map1">
          {carts.map((eachCart) => (
            <div className="key1" key={eachCart._id}>
              <div className="img1">
                {" "}
                <img className="pic" src={eachCart.profilePicture} alt="" />
              </div>
              <div className="detail">
                <p className="name1">{eachCart.name}</p>
                <br />
                <div>{eachCart.description}</div>
                <br />
              </div>
                <br />
                <div className="price">{eachCart.Price}</div>
                <br />
                <div>{eachCart.code}</div>
                <button onClick={async () => {
                try {

                    setLoading(true)

                    let deleted = await
                        axios.delete(`http://localhost:5000/cart/${eachCart?._id}`,
                            {
                                // withCredentials: true
                            })
                    console.log("deleted: ", deleted.data);
                    setLoading(false)

                    setToggleRefresh (!toggleRefresh);

                } catch (e) {
                  console.log(e)
                    console.log("Error in api call: ", e);
                    setLoading(false)
                }

            }}>Delete</button>
             
            </div>
          ))}
        </div>
      </div> 

   





    </>
  );
}

export default Cart;