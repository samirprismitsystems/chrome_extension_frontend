export interface ISingleProduct {
  discount: string;
  first_level_category_id: number;
  first_level_category_name: string;
  lastest_volume: number;
  original_price: string;
  original_price_currency: string;
  product_detail_url: string;
  product_id: number;
  product_main_image_url: string;
  product_small_image_urls: {
    productSmallImageUrl: string[];
  };
  product_title: string;
  product_video_url: string;
  sale_price: string;
  sale_price_currency: string;
  second_level_category_id: number;
  second_level_category_name: string;
  seller_id: number;
  shop_id: number;
  shop_url: string;
  target_original_price: string;
  target_original_price_currency: string;
  target_sale_price: string;
  target_sale_price_currency: string;
}

export interface IProducts {
  current_record_count: number;
  is_finished: boolean;
  products: {
    traffic_product_d_t_o: ISingleProduct[];
  };
  total_record_count: any;
}
