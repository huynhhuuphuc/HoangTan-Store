import axios from "axios";
export function searchBikes({ commit }, keyword) {
  axios.get(`/api/v1/products?keyword=${keyword}`).then(({ data }) => {
    console.log("data ne: ", data.products);
    commit("setSearchBikes", data.products);
  });
}
