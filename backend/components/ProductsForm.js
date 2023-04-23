import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Spinner from "./spinner";
import { ReactSortable } from "react-sortablejs";

export const ProductsForm = ({
  title: exisstingTitle,
  description: exestingDescription,
  price: exestingPrice,
  EDITPRODUCTS,
  _id,
  images: exestingimages,
  category: assignedCategory,
  properties:assignedproperty
}) => {
  const [title, setTitle] = useState(exisstingTitle || "");
  const [price, setprice] = useState(exestingPrice || "");
  const [category, setcategory] = useState(assignedCategory || "");
  const [images, setimages] = useState(exestingimages || []);
  const [description, setdescription] = useState(exestingDescription || "");
  const [goToproduct, setgotoproduct] = useState(false);
  const [isuploading, setisuploading] = useState(false);
  const [categories, setcategories] = useState([]);
  const [productprop, setproductprop] = useState(assignedCategory || {});
  useEffect(() => {
    axios.get("/api/categories").then((res) => {
      setcategories(res.data);
    });
  }, []);

  const router = useRouter();
  async function saveProduct(ev) {
    const data = { title, description, price, images, category,properties:productprop };
    ev.preventDefault();
    if (_id) {
      await axios.put(`/api/products`, { ...data, _id });
    } else {
      await axios.post("/api/products", data);
    }
    setgotoproduct(true);
  }
  if (goToproduct) {
    router.push("/products");
  }
  async function uploadimage(e) {
    const files = e.target?.files;
    if (files?.length > 0) {
      setisuploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("files", file);
      }
      const res = await axios.post("/api/upload", data, {
        headers: { "Content-Type": `multipart/form-data` },
      });
      setimages((oldimg) => {
        return [...oldimg, ...res.data.links];
      });
      setisuploading(false);
    }
  }
  console.log(_id);
  const propertiesf = [];
  if (categories.length > 0 && category) {
    const selcat = categories.find(({ _id }) => _id === category);
    console.log(selcat);
    propertiesf.push(...selcat.properties);
    while (selcat?.parent?.id) {
      const parent = categories.find(({ _id }) => _id === selcat?.parent?._id);
      propertiesf.push(...parent.properties);
      selcat = parent;
    }
  }

  function updateorder(images) {
    setimages(images);
  }
function setproductprops(propName,value){
  setproductprop(prev =>{
    const newprop = {...prev};
    newprop[propName] = value;
    return newprop
  })
}

  return (
    <form onSubmit={saveProduct}>
      <h1 className="">{EDITPRODUCTS}</h1>
      <label>Product name</label>
      <input
        type="text"
        placeholder="search"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Category</label>
      <select onChange={(ev) => setcategory(ev.target.value)} value={category}>
        <option value="">No parent category</option>
        {categories.length > 0 &&
          categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
      </select>
      {propertiesf.length > 0 &&
        propertiesf.map((p) => (
          <div className="felx gap-1">
            {p.name}
            <select value={productprop[p.name]} onChange={ev=> setproductprops(p.name,ev.target.value)}>
              {p.values.map((v) => (
                <option value={v}>{v}</option>
              ))}
            </select>
          </div>
        ))}
      <label>Photos</label>
      <div className="mb-2 flex-wrap gap-2">
        <ReactSortable
          list={images}
          setList={updateorder}
          className="felx felx-wrap gap-1"
        >
          {!!images?.length &&
            images.map((link) => (
              <div key={link} className="inline-block h-24">
                <img src={link} className="h-24 rounded" alt=""></img>
              </div>
            ))}
        </ReactSortable>
        {isuploading && (
          <div className=" h-24 ">
            <Spinner />
          </div>
        )}

        <label className="w-24 h-24 border text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Upload</div>
          <input
            type="file"
            name="foo"
            className="hidden"
            onChange={uploadimage}
          />
        </label>
      </div>
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(ev) => setdescription(ev.target.value)}
      ></textarea>
      <label>price</label>
      <input
        type="text"
        placeholder="price"
        value={price}
        onChange={(ev) => setprice(ev.target.value)}
      />
      <button
        className="bg-blue-900 text-white px-4 py-1 rounded-sm shadow-sm"
        type="submit"
      >
        Save
      </button>
    </form>
  );
};
