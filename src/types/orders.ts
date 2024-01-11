type Status = {
  id: number;
  name: string;
  slug: string;
  customized: {
    id: number;
    name: string;
  };
};

type Total = {
  amount: number;
  currency: string;
};

type DateInfo = {
  date: string;
  timezone_type: number;
  timezone: string;
};

type Item = {
  name: string;
  quantity: number;
};

type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  mobile: number;
  mobile_code: string;
  email: string;
  urls: {
    customer: string;
    admin: string;
  };
  avatar: string;
  gender: string;
  birthday: DateInfo;
  city: string;
  country: string;
  country_code: string;
  currency: string;
  location: string;
  updated_at: DateInfo;
  groups: string[];
};

export interface IOrderItem{
  id: number;
  reference_id: number;
  total: Total;
  date: DateInfo;
  status: Status;
  can_cancel: boolean;
  can_reorder: boolean;
  is_pending_payment: boolean;
  pending_payment_ends_at: number;
  items: Item[];
  customer: Customer;
};

type Pagination = {
  count: number;
  total: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
  links: any[]; // You can define the specific structure for links if needed
};

export interface IOrderList{
  status: number;
  success: boolean;
  data: IOrderItem[];
  pagination: Pagination;
};
