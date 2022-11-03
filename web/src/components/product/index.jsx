import axios from "axios";
import { useEffect, useState } from "react";
// import "./index.css";

function Product() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [code, setCode] = useState("");
  const [products, setProducts] = useState([]);
  const [toggleRefresh, setToggleRefresh] = useState(true);

  //////////////======editproduct=========
  let [editProduct, setEditProduct] = useState(null);////
  let [loading, setLoading] = useState(false);
  
//////////////======editproduct=========

  // useEffect(() => {
  //   let getAllProducts = async () => {
  //     let response =await axios.get ("http://localhost:5000/products")
  //     // let response = await axios.get("https://crud--crud-app.herokuapp.com/products");
  //     setProducts(response.data.data.reverse());
  //   };
  //   getAllProducts();
  // }, [toggleRefresh]);

  const doSignup = async (e) => {
    e.preventDefault();

    var profilePictureInput = document.getElementById("profilePictureInput");
    console.log("fileInput: ", profilePictureInput.files); // local url

    let formData = new FormData();
    // https://developer.mozilla.org/en-US/docs/Web/API/FormData/append#syntax

    formData.append("name", name); // this is how you add some text data along with file
    formData.append("description", description); // this is how you add some text data along with file
    formData.append("price", price); // this is how you add some text data along with file
    formData.append("code", code);
    // formData.append("profilePicture", profilePictureInput.files[0]);

    // file input is for browser only, use fs to read file in nodejs client

    axios({
      method: "post",
      url: "http://localhost:5000/product",
      //  url: "https://crud--crud-app.herokuapp.com/product",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
      // withCredentials: true
    })
      .then((res) => {
        console.log(`upload Success` + res.data);
        document.querySelector("#message").innerHTML = res.data.message;
        setToggleRefresh(!toggleRefresh);
      })
      .catch((err) => {
        console.log(err);
        document.querySelector("#message").innerHTML = err.res.data.message;
      });
  };

  ///////////////////==============================


    
  /////editproduct//////////////
  let updateHandler = async (e) => {
    e.preventDefault();


    try {
        let updated = await
            axios.put(`http://localhost:5000/product/${editProduct?._id}`,
                {
                    name: editProduct.name,
                    price: editProduct.price,
                    description: editProduct.description,
                    code: editProduct.code,
                },
                {
                    // withCredentials: true
                })
        console.log("updated: ", updated.data);

        setToggleRefresh(!toggleRefresh);
        setEditProduct(null);


    } catch (e) {
        console.log("Error in api call: ", e);
        setLoading(false)
    }


}////
  return (
    <>
      <div className="flex1">
        <div className="main">
          <div className="start">
            <h1>Product Form</h1>
          </div>

          <form onSubmit={doSignup}>
          
            <div className="in1">
              Name:
              <input
                name="name"
                type="text"
                placeholder="Name"
                id="name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <br />
            Description:
            <input
              name="description"
              type="text"
              placeholder="Description"
              id="description"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <br />
            Price:
            <input
              className="in1"
              name="price"
              type="number"
              placeholder="Price"
              id="price"
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />
            <br />
            Code:
            <input
              className="in1"
              name="code"
              type="number"
              placeholder="Code"
              id="code"
              onChange={(e) => {
                setCode(e.target.value);
              }}
            />
            <br />
            Profile Picture:
            <input
              className="profile"
              type="file"
              id="profilePictureInput"
              accept="image/*"
              onChange={() => {
                ////// to display imager instantly on screen
                var profilePictureInput = document.getElementById(
                  "profilePictureInput"
                );
                var url = URL.createObjectURL(profilePictureInput.files[0]);
                console.log("url: ", url);
                document.getElementById(
                  "img"
                ).innerHTML = `<img width="200px" src="${url}" alt="" id="img"> `;
              }}
            />
            <div className="sign">
              <div id="img"></div>

              <div className="msg">
                <button className="but" type="submit">
                  Submit
                </button>
                <p className="message" id="message"></p>
              </div>
            </div>
            <div>
    {products?.map(eachProduct => (
        <div key={eachProduct?._id}>
<div className="img1">
                {" "}
                <img width='200px' className="pic" src={eachProduct.profilePicture} alt="" />
              </div>
            <h3>{eachProduct?.name}</h3>
           
            <div>{eachProduct?.description}</div>
            <div>{eachProduct?.price}</div>
            <div>{eachProduct?.code}</div>

            <button onClick={async () => {
                try {

                    setLoading(true)

                    let deleted = await
                        axios.delete(`http://localhost:5000/product/${eachProduct?._id}`,
                            {
                                // withCredentials: true
                            })
                    console.log("deleted: ", deleted.data);
                    setLoading(false)

                    setToggleRefresh (!toggleRefresh);

                } catch (e) {
                    console.log("Error in api call: ", e);
                    setLoading(false)
                }

            }}>Delete</button>

            <button onClick={() => {
                setEditProduct({
                    _id: eachProduct._id,
                    name: eachProduct?.name,
                  
                    description: eachProduct?.description,
                    price: eachProduct?.price,
                    code: eachProduct?.code
                })
            }}>Edit</button>

        </div>
    ))}
</div>
          </form>
          {(editProduct !== null) ? (< div >

<h1>
    update form
</h1>
<form onSubmit={updateHandler} >
    Name: <input type="text" onChange={(e) => { setEditProduct({ ...editProduct, name: e.target.value }) }} value={editProduct.name} /> <br />
    Price: <input type="text" onChange={(e) => { setEditProduct({ ...editProduct, price: e.target.value }) }} value={editProduct.price} /> <br />
    Description: <input type="text" onChange={(e) => { setEditProduct({ ...editProduct, description: e.target.value }) }} value={editProduct.description} /> <br />
    Code: <input type="text" onChange={(e) => { setEditProduct({ ...editProduct, code: e.target.value }) }} value={editProduct.code} /> <br />

    <button type="submit"> Proceed Update </button>
</form>
</div>) : null}
          <p id="message"></p>
        </div>
      </div>
      <hr />

  

      {/* <div className="result">
        <div className="map1">
          {products.map((eachProduct) => (
            <div className="key1" key={eachProduct._id}>
              <div className="img1">
                {" "}
                <img className="pic" src={eachProduct.profilePicture} alt="" />
              </div>
              <div className="detail">
                <p className="name1">{eachProduct.name}</p>
                <br />
                <div>{eachProduct.description}</div>
                <br />
              </div>
                <br />
                <div className="price">{eachProduct.Price}</div>
                <br />
                <div>{eachProduct.code}</div>
            </div>
          ))}
        </div>
      </div> */}
      {/* //////////////////edit product//// */}
   





    </>
  );
}

export default Product;
