import { Box, Button, Grid, LinearProgress } from "@mui/material";
import md5 from "md5";
import { useEffect, useState } from "react";
import AuthGuard from "../../authGuard/AuthGuard";
import ApiServices from "../../services/ApiServices";
import Utils from "../../utils/utils";
import MenuAppBar from "../MenuAppBar/MenuAppBar";
import ProductCard from "./Cards/ProductCard";
import classes from "./style.module.scss";

// eslint-disable-next-line react-hooks/exhaustive-deps
// eslint-disable @typescript-eslint/no-mixed-operators 
const listOfItems = [
    1, 2, 3, 4, 5, 6, 7, 8,
    11, 12, 13, 14, 15, 16, 17, 18,
    21, 22, 23, 24, 25, 26, 27, 218]

const ProductsPage = () => {
    const [result, setResult] = useState<any>();
    const [isDisable, setIsDisable] = useState<boolean>(false);
    const [isDataComing, setIsDataComing] = useState(false);
    const [perPageItem, setPerPageItem] = useState<number>(8)

    const loadMoreContent = () => {
        try {
            const data = listOfItems.slice(0, perPageItem)
            if (data.length >= perPageItem) {
                setPerPageItem(perPageItem + perPageItem)
            } else {
                setIsDisable(true)
            }
        } catch (ex: any) {
            Utils.showErrorMessage(ex.message)
        } finally {
            setIsDataComing(false)
        }
    }

    const getData = () => {
        const data = listOfItems.slice(0, perPageItem);
        return data;
    }

    const loadData = async () => {
        try {
            setIsDataComing(true)
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
            const data = await ApiServices.getAliExpressProducts(mainURI);
            console.log(data)
            // setResult(data)s
        } catch (ex: any) {
            Utils.showErrorMessage(ex.message)
        } finally {
            setIsDataComing(false)
        }
    }

    useEffect(() => {
        loadData();
    }, [])

    return (
        <AuthGuard>
            <MenuAppBar>
                <Box sx={{
                    minHeight: "85vh",
                    height: "100%",
                }}>
                    <Grid container spacing={2} justifyContent={'normal'}>
                        {getData().map((indexOfItem, index) => {
                            return (
                                <Grid key={index} item className={classes.gridItem} xs={12} sm={6} md={6} lg={4} xl={3}>
                                    <ProductCard />
                                </Grid>
                            )
                        })}
                    </Grid>
                    {isDataComing && <LinearProgress sx={{ my: 2 }} />}
                    {!isDisable && (
                        <Box py={3}>
                            <Button disabled={isDataComing} className={classes.loadMoreBtn} variant="contained" color="secondary" onClick={loadMoreContent}>
                                Load more
                            </Button>
                        </Box>
                    )}
                </Box>
            </MenuAppBar>
        </AuthGuard>
    );
};

export default ProductsPage;
