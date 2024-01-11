import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Alert, Box, Button, Grid, LinearProgress, Pagination, PaginationItem, Stack } from "@mui/material";
import md5 from "md5";
import { useEffect, useState } from "react";
import AuthGuard from "../../authGuard/AuthGuard";
import ApiServices from "../../services/ApiServices";
import { IProducts } from "../../types/products";
import Utils from "../../utils/utils";
import MenuAppBar from "../MenuAppBar/MenuAppBar";
import ProductCard from "./Cards/ProductCard";
import classes from "./style.module.scss";


// eslint-disable-next-line react-hooks/exhaustive-deps
// eslint-disable @typescript-eslint/no-mixed-operators 

interface IFeedList {
    product_num: number;
    promo_desc: string;
    promo_name: string;
}

const ProductsPage = () => {
    const [productList, setProductList] = useState<IProducts>();
    const [feedList, setFeedList] = useState<IFeedList[]>();
    const [isLoading, setIsLoading] = useState(false);
    const [perPageItem, setPerPageItem] = useState<number>(15)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [activeSlug, setActiveSlug] = useState<string | null>(null)
    const [selectedIndex, setSelectedIndex] = useState<number>(0)
    const [isProductLoading, setIsProductLoading] = useState<boolean>(false)

    const getFeedList = async () => {
        try {
            setIsLoading(true)
            const defaultURI = "https://api-sg.aliexpress.com/sync";
            const appKey = "503950";
            const appSecret = "nJU3gn6b9nGCl9Ohxs7jDg33ROqq3WTZ";

            let param: any = {};
            param["app_key"] = appKey;
            param["access_token"] = Utils.getAliExpressAccessToken();
            param["format"] = "json";
            param["method"] = "aliexpress.ds.feedname.get";
            param["sign_method"] = "md5";
            param["timestamp"] = Date.now();

            const sortedParams: any = Object.fromEntries(Object.entries(param).sort());
            const parameters = Object.entries(sortedParams)?.map(([key, value]: any) => {
                return `${key}=${value}`
            }).join("&")
            // add comment

            const paramString = parameters.replace(/&/g, "").replace(/=/g, "")
            const rawSignature = appSecret + paramString + appSecret;
            const md5Signature = md5(rawSignature).toUpperCase();
            const signature = md5Signature.toUpperCase();
            const mainURI = `${defaultURI}?${parameters}&sign=${signature}`;
            const data = await ApiServices.getAliExpressFeedList(mainURI);
            // console.log(data.aliexpress_ds_feedname_get_response)
            if (data && data.aliexpress_ds_feedname_get_response && data.aliexpress_ds_feedname_get_response.resp_result && data.aliexpress_ds_feedname_get_response.resp_result.result) {
                setFeedList(data.aliexpress_ds_feedname_get_response.resp_result.result.promos.promo)
                return null;
            }
        } catch (ex: any) {
            Utils.showErrorMessage(ex.message)
        } finally {
            setIsLoading(false)
        }
    }

    const getProductRelatedToFeed = async (pageNumberCounts?: any) => {
        try {
            setIsProductLoading(true)
            if (pageNumberCounts) {
                setPageNumber(pageNumberCounts)
            }

            const defaultURI = "https://api-sg.aliexpress.com/sync";
            const appKey = "503950";
            const appSecret = "nJU3gn6b9nGCl9Ohxs7jDg33ROqq3WTZ";

            let param: any = {};
            param["app_key"] = appKey;
            param["access_token"] = Utils.getAliExpressAccessToken();
            param["format"] = "json";
            param["method"] = "aliexpress.ds.recommend.feed.get";
            param["sign_method"] = "md5";
            param["feed_name"] = activeSlug ? activeSlug.toString() : "";
            param["timestamp"] = Date.now();
            param["page_size"] = perPageItem || 15;
            param["page_no"] = pageNumberCounts || 1;

            const sortedParams: any = Object.fromEntries(Object.entries(param).sort());
            const parameters = Object.entries(sortedParams)?.map(([key, value]: any) => {
                return `${key}=${value}`
            }).join("&")

            const paramString = parameters.replace(/&/g, "").replace(/=/g, "")
            const rawSignature = appSecret + paramString + appSecret;
            const md5Signature = md5(rawSignature).toUpperCase();
            const signature = md5Signature.toUpperCase();
            const mainURI = `${defaultURI}?${parameters}&sign=${signature}`;
            const data = await ApiServices.getAliExpressProducts(mainURI);
            if (data && data.aliexpress_ds_recommend_feed_get_response && data.aliexpress_ds_recommend_feed_get_response.result) {
                setProductList(data.aliexpress_ds_recommend_feed_get_response.result)
            } else {
                setProductList(undefined)
            }
        } catch (ex: any) {
            Utils.showErrorMessage(ex.message)
        } finally {
            setIsProductLoading(false)
        }
    }

    useEffect(() => {
        if ((feedList && feedList.length > 0) && !activeSlug) {
            setActiveSlug(feedList[0].promo_name)
        }

    }, [feedList])

    useEffect(() => {
        if (activeSlug) {
            getProductRelatedToFeed();
        }

    }, [activeSlug])

    useEffect(() => {
        getFeedList();
    }, [])


    return (
        <AuthGuard>
            <MenuAppBar>
                {(isLoading && !feedList) ? (
                    <LinearProgress />
                ) : (
                    feedList && feedList.length > 0 ? (
                        <Box sx={{
                            minHeight: "85vh",
                            height: "100%",
                        }}>
                            <Box gap={1} sx={{ display: "flex", justifyContent: "left", alignItems: "center", flexWrap: "wrap" }}>
                                {feedList && feedList.map((item, index) => (
                                    <Box key={index} className={selectedIndex === index ? classes.activeButtonFeedName : ""}>
                                        <Button onClick={() => {
                                            setActiveSlug(item.promo_name)
                                            setSelectedIndex(index)
                                        }} variant="outlined">
                                            <span className={`${selectedIndex === index ? classes.activeProductFeedName : classes.productFeedName}`}>{item.promo_name}</span>
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                            <hr className={classes.productPageHR} />
                            {isProductLoading && <LinearProgress sx={{ my: 2 }} />}
                            {(!isProductLoading && (productList && productList.products && productList.products.traffic_product_d_t_o.length >= 0)) && (
                                <>
                                    <Grid container spacing={2} justifyContent={'normal'}>
                                        {productList.products.traffic_product_d_t_o.map((item, index) => {
                                            return (
                                                <Grid key={item.product_id} item className={classes.gridItem} xs={12} sm={6} md={6} lg={4} xl={3}>
                                                    <ProductCard salePrice={item.sale_price} currency={item.sale_price_currency} discount={item.discount} product_main_image_url={item.product_main_image_url} product_title={item.product_title} second_level_category_name={item.second_level_category_name} />
                                                </Grid>
                                            )
                                        })}
                                    </Grid>
                                    <Stack spacing={2}>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: "center",
                                            padding: "36px 0px"
                                        }}>
                                            <Pagination
                                                boundaryCount={10}
                                                onChange={(e: any, page: number) => {
                                                    getProductRelatedToFeed(page);
                                                }}
                                                defaultPage={pageNumber || 1}
                                                count={Math.ceil(productList.total_record_count / perPageItem).toLocaleString() as any}
                                                renderItem={(item) => (
                                                    <PaginationItem
                                                        slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                                                        {...item}
                                                    />
                                                )}
                                                color="primary"
                                            />
                                        </Box>
                                    </Stack>
                                </>
                            )}
                            {((!productList || !productList.products) && (productList && productList.products.traffic_product_d_t_o.length <= 0)) && <Alert severity="error">We're Experiencing Product Availability Issues. Please Try Again Later.</Alert>}
                        </Box>
                    ) : (
                        <Alert severity="error">Oops! Something Went Wrong. Please Try Again Later.</Alert>
                    )
                )}
            </MenuAppBar>
        </AuthGuard>
    );
};

export default ProductsPage;
