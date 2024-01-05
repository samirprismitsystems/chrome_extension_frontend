interface IEnums {
  USER_INFO: string;
  AUTH0_TOKEN: string;
  IS_LOGIN: string;
  SALLA_TOKEN: string;
  ALI_EXPRESS_TOKEN: string;
  ORDER_STATUS: {
    UNDER_REVIEW: string;
  };
}

const ORDER_STATUS = {
  UNDER_REVIEW: "under_review",
};

export const enums: IEnums = {
  USER_INFO: "userInfo",
  AUTH0_TOKEN: "auth0_token",
  IS_LOGIN: "isLogin",
  SALLA_TOKEN: "salla_token",
  ALI_EXPRESS_TOKEN: "ali_express_token",
  ORDER_STATUS: ORDER_STATUS,
};
