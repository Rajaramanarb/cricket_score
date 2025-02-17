const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  PRODUCT_TYPE: "/category",
  ADD_PRODUCT: "/products/add-product",
  ADD_PRODUCT_TYPE: "/category/add-category",
  PROFILE: "/profile",
  PRODUCT: (id: String) => `/product/${id}`,
  PRODUCT_TYPE_ID: (id: String) => `/productType/${id}`,
  ADMIN_SIGN_IN_WITH_OAUTH: "admin-signin-with-oauth",
};

export default ROUTES;
