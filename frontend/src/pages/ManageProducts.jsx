import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import ConfirmationModal from "../components/ConfirmationModal";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
  });
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    CategoryId: "",
    imageUrl: "",
    stock: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      console.log("API Response:", response.data);
      const productsData = response.data.data || [];
      console.log("Processed Products:", productsData);
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error fetching products");
      setProducts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      console.log("Categories Response:", response.data);
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (product) => {
    console.log("Editing product:", product);
    setEditingProduct(product);

    // Find and set category
    const category = categories.find((cat) => cat.id === product.CategoryId);
    console.log("Found category:", category);
    setCurrentCategory(category);

    // Format the data for the form
    setProductData({
      name: product.name || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      CategoryId: product.CategoryId?.toString() || "",
      imageUrl: product.imageUrl || "",
      stock: product.stock?.toString() || "",
    });

    setShowAddForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Basic validation
      if (
        !productData.name ||
        !productData.description ||
        !productData.imageUrl
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Validate and parse numeric fields
      const price = parseFloat(productData.price);
      const stock = parseInt(productData.stock, 10);
      const categoryId = parseInt(productData.CategoryId, 10);

      if (isNaN(price) || price < 0) {
        toast.error("Please enter a valid price");
        return;
      }

      if (isNaN(stock) || stock < 0) {
        toast.error("Please enter a valid stock quantity");
        return;
      }

      if (isNaN(categoryId)) {
        toast.error("Please select a category");
        return;
      }

      const formData = {
        name: productData.name.trim(),
        description: productData.description.trim(),
        price: price,
        stock: stock,
        CategoryId: categoryId,
        imageUrl: productData.imageUrl.trim(),
      };

      let response;
      if (editingProduct) {
        response = await axios.put(
          `http://localhost:5000/api/products/${editingProduct.id}`,
          formData
        );
      } else {
        response = await axios.post(
          "http://localhost:5000/api/products",
          formData
        );
      }

      if (response.data.success) {
        toast.success(
          editingProduct
            ? "Product updated successfully!"
            : "Product created successfully!"
        );
        resetForm();
        fetchProducts();
      } else {
        throw new Error(
          response.data.message ||
            `Failed to ${editingProduct ? "update" : "create"} product`
        );
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(
        error.response?.data?.message || error.message || "Error saving product"
      );
    }
  };

  const resetForm = () => {
    setProductData({
      name: "",
      description: "",
      price: "",
      CategoryId: "",
      imageUrl: "",
      stock: "",
    });
    setEditingProduct(null);
    setCurrentCategory(null);
    setShowAddForm(false);
  };

  const handleDelete = async (productId) => {
    setDeleteModal({ isOpen: true, productId });
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/products/${deleteModal.productId}`
      );
      if (response.data.success) {
        toast.success("Product deleted successfully!");
        fetchProducts();
      } else {
        throw new Error(response.data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error deleting product"
      );
    } finally {
      setDeleteModal({ isOpen: false, productId: null });
    }
  };

  const CategorySelect = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleCategorySelect = (category) => {
      setProductData((prev) => ({
        ...prev,
        CategoryId: category.id.toString(),
      }));
      setCurrentCategory(category);
      setIsOpen(false);
    };

    return (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
          {editingProduct && currentCategory && (
            <span className="ml-2 text-gray-500">
              (Current: {currentCategory.name})
            </span>
          )}
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <span className="block truncate">
              {currentCategory ? currentCategory.name : "Select a category"}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>

          {isOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-100 ${
                    currentCategory?.id === category.id ? "bg-indigo-50" : ""
                  }`}
                  onClick={() => handleCategorySelect(category)}
                >
                  <span className="block truncate">{category.name}</span>
                  {currentCategory?.id === category.id && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <svg
                        className="h-5 w-5 text-indigo-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const ProductForm = () => {
    const [formData, setFormData] = useState({
      name: editingProduct?.name || "",
      description: editingProduct?.description || "",
      price: editingProduct?.price?.toString() || "",
      discountedPrice: editingProduct?.discountedPrice?.toString() || "",
      CategoryId: editingProduct?.CategoryId?.toString() || "",
      imageUrl: editingProduct?.imageUrl || "",
      stock: editingProduct?.stock?.toString() || "",
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleFormSubmit = async (e) => {
      e.preventDefault();

      try {
        // Basic validation
        if (!formData.name || !formData.description || !formData.imageUrl) {
          toast.error("Please fill in all required fields");
          return;
        }

        // Validate and parse numeric fields
        const price = parseFloat(formData.price);
        const discountedPrice = formData.discountedPrice
          ? parseFloat(formData.discountedPrice)
          : null;
        const stock = parseInt(formData.stock, 10);
        const categoryId = parseInt(formData.CategoryId, 10);

        if (isNaN(price) || price < 0) {
          toast.error("Please enter a valid price");
          return;
        }

        if (
          discountedPrice !== null &&
          (isNaN(discountedPrice) || discountedPrice < 0)
        ) {
          toast.error("Please enter a valid discounted price");
          return;
        }

        if (discountedPrice !== null && discountedPrice >= price) {
          toast.error("Discounted price must be less than regular price");
          return;
        }

        if (isNaN(stock) || stock < 0) {
          toast.error("Please enter a valid stock quantity");
          return;
        }

        if (isNaN(categoryId)) {
          toast.error("Please select a category");
          return;
        }

        const submitData = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: price,
          discountedPrice: discountedPrice,
          stock: stock,
          CategoryId: categoryId,
          imageUrl: formData.imageUrl.trim(),
        };

        let response;
        if (editingProduct) {
          response = await axios.put(
            `http://localhost:5000/api/products/${editingProduct.id}`,
            submitData
          );
        } else {
          response = await axios.post(
            "http://localhost:5000/api/products",
            submitData
          );
        }

        if (response.data.success) {
          toast.success(
            editingProduct
              ? "Product updated successfully!"
              : "Product created successfully!"
          );
          resetForm();
          fetchProducts();
        } else {
          throw new Error(
            response.data.message ||
              `Failed to ${editingProduct ? "update" : "create"} product`
          );
        }
      } catch (error) {
        console.error("Error saving product:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Error saving product"
        );
      }
    };

    const handleCategorySelect = (category) => {
      setFormData((prev) => ({
        ...prev,
        CategoryId: category.id.toString(),
      }));
      setCurrentCategory(category);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-500 transition-colors duration-150"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150"
                  required
                  placeholder="Enter product name"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Regular Price
                </label>
                <div className="relative mt-1 rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="block w-full rounded-lg border-gray-300 pl-7 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150"
                    required
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Discounted Price
                  <span className="text-sm text-gray-500 ml-1">(Optional)</span>
                </label>
                <div className="relative mt-1 rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="discountedPrice"
                    value={formData.discountedPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="block w-full rounded-lg border-gray-300 pl-7 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="CategoryId"
                  value={formData.CategoryId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  step="1"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150"
                  required
                  placeholder="Enter stock quantity"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150"
                  required
                  placeholder="Enter image URL"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150"
                  required
                  placeholder="Enter product description"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
              >
                {editingProduct ? "Update Product" : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-2">
        <div className="flex justify-between items-center mb-4 bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Product Management
          </h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            + Add New Product
          </button>
        </div>

        {showAddForm && <ProductForm />}

        {Array.isArray(products) && products.length > 0 ? (
          <div className="bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[80px]"
                    >
                      Image
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[45%]"
                    >
                      Product Details
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%]"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%]"
                    >
                      Stock
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%]"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="h-14 w-14 rounded overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {product.description}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          {categories.find(
                            (cat) => cat.id === product.CategoryId
                          )?.name || "N/A"}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900">
                          $
                          {(() => {
                            try {
                              const price =
                                typeof product.price === "number"
                                  ? product.price
                                  : parseFloat(product.price || 0);
                              return price.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              });
                            } catch (error) {
                              console.error("Error formatting price:", error);
                              return "0.00";
                            }
                          })()}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-center">
                        <span
                          className={`px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${
                            product.stock > 20
                              ? "bg-green-50 text-green-700 border border-green-100"
                              : product.stock > 5
                              ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
                              : "bg-red-50 text-red-700 border border-red-100"
                          }`}
                        >
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right">
                        <div className="flex justify-end items-center space-x-1">
                          <button
                            onClick={() => handleEdit(product)}
                            className="inline-flex items-center px-1.5 py-1 border border-indigo-200 rounded text-xs font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors duration-150"
                          >
                            <svg
                              className="h-3 w-3 mr-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="inline-flex items-center px-1.5 py-1 border border-red-200 rounded text-xs font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors duration-150"
                          >
                            <svg
                              className="h-3 w-3 mr-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center bg-white shadow-sm p-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="mt-4 text-xl font-medium text-gray-900">
              No products found
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Get started by adding your first product.
            </p>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, productId: null })}
        onConfirm={confirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
};

export default ManageProducts;
