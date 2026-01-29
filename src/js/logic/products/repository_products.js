import { BaseApiService } from "/src/js/apis/baseApiServices.js";
import { routes } from "/src/js/apis/apiRoutes.js";
import { BarcodeResponse } from "./Models/products_barcode_response.js";
import { ProductsSearchResponse } from "./Models/products_search_response.model.js";
import { ProductCategoriesResponse } from "./Models/product_categories_response.js";

export class ProductsRepository extends BaseApiService {
  static async getProductsBarcode(code) {
    var productFilter = await super.get(`${routes.productsBarcode}${code}`);
    if (productFilter != null) {
      var barcodeResponse = BarcodeResponse.fromJson(productFilter).result;
      return barcodeResponse;
    }
  }

  static async getProductsBySearch(query) {
    var productFilter = await super.get(routes.productsSearch, { q: query });
    if (productFilter != null) {
      var productsSearchResponse =
        ProductsSearchResponse.fromJson(productFilter).results;
      return productsSearchResponse;
    }
  }

  static async getProductCategories() {
    var categoriesResponse = await super.get(routes.productsCategories);
    if (categoriesResponse != null) {
      const categories =
        ProductCategoriesResponse.fromJson(categoriesResponse).results;
      return categories;
    }
  }

  static async filterProductByCategory(category) {
    var categoriesResponse = await super.get(
      `${routes.productsCategory}${category}`
    );
    if (categoriesResponse != null) {
      const categories =
        ProductsSearchResponse.fromJson(categoriesResponse).results;
      return categories;
    }
  }
}
