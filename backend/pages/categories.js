import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function categories() {
  const [name, setName] = useState("");
  const [editedcategory, seteditedcategory] = useState(null);
  const [parentcategory, setparentcategory] = useState("");
  const [categories, setcategories] = useState("");
  const [properties, setProperties] = useState([]);

  async function savecat(ev) {
    ev.preventDefault();
    const data = {
      name,
      parentcategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };
    if (editedcategory) {
      data._id = editedcategory._id;
      await axios.put("/api/categories", data);
      seteditedcategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setparentcategory("");
    setProperties([]);
    ch();
  }

  useEffect(() => {
    axios.get("/api/categories").then((res) => {
      setcategories(res.data);
      console.log(res.data);
    });
  }, []);
  function ch() {
    axios.get("/api/categories").then((res) => {
      setcategories(res.data);
      console.log(res.data);
    });
  }
  function editCategory(category) {
    seteditedcategory(category);
    setName(category.name);
    setparentcategory(category.parent?._id);
    setcategories(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
    ch();
  }
  async function deleteCategory(category) {
    if (confirm("Are you sure you want to delete this?")) {
      const { _id } = category;
      await axios.delete("/api/categories?_id=" + _id);
    }
    ch();
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }
  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }
  function handlePropertyNameChange(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }
  function handlePropertyValuesChange(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }
  return (
    <Layout>
      <h1>Category</h1>
      <label>
        {editedcategory
          ? `Edit category ${editedcategory.name}`
          : "create new  Category"}
      </label>
      <form onSubmit={savecat}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={"Category name"}
            onChange={(ev) => setName(ev.target.value)}
            value={name}
          />
          <select
            onChange={(ev) => setparentcategory(ev.target.value)}
            value={parentcategory}
          >
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm mb-2"
          >
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div key={property.name} className="flex gap-1 mb-2">
                <input
                  type="text"
                  value={property.name}
                  className="mb-0"
                  onChange={(ev) =>
                    handlePropertyNameChange(index, property, ev.target.value)
                  }
                  placeholder="property name (example: color)"
                />
                <input
                  type="text"
                  className="mb-0"
                  onChange={(ev) =>
                    handlePropertyValuesChange(index, property, ev.target.value)
                  }
                  value={property.values}
                  placeholder="values, comma separated"
                />
                <button
                  onClick={() => removeProperty(index)}
                  type="button"
                  className="btn-red"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          {editedcategory && (
            <button
              type="button"
              onClick={() => {
                seteditedcategory(null);
                setName("");
                setparentcategory("");
                setProperties([]);
              }}
              className="btn-default"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary bg-blue-900 btn-default py-1">
            Save
          </button>
        </div>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>categories name</td>
            <td>parent categories</td>
          </tr>
        </thead>

        <tbody>
          {categories.length > 0 &&
            categories.map((cat) => (
              <tr>
                <td>{cat.name}</td>
                <td>{cat?.parent?.name}</td>
                <td>
                  <button
                    onClick={() => editCategory(cat)}
                    className="bg-blue-900 btn-primary mr-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(cat)}
                    className="bg-blue-900 btn-primary"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
