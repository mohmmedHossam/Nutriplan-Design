export class ProductCategoriesResponse {
  constructor({ message = "", pagination = {}, results = [] }) {
    this.message = message;
    this.pagination = new Pagination(pagination);
    this.results = results.map((item) => new ProductCategory(item));
  }

  static fromJson(json) {
    return new ProductCategoriesResponse(json);
  }
}

export class Pagination {
  constructor({ total = 0, totalPages = 0, currentPage = 1, limit = 0 }) {
    this.total = total;
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.limit = limit;
  }
}

export class ProductCategory {
  constructor({ id = "", name = "", products = 0, url = "" }) {
    this.id = id;
    this.name = name;
    this.products = products;
    this.url = url;
  }
}
