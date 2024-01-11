import { Alert, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import AuthGuard from "../../authGuard/AuthGuard";
import ApiServices from "../../services/ApiServices";
import { IOrderList } from "../../types/orders";
import Utils from "../../utils/utils";
import MenuAppBar from "../MenuAppBar/MenuAppBar";
import OrderList from "./OrdersList";


// eslint-disable-next-line react-hooks/exhaustive-deps

// eslint-disable @typescript-eslint/no-mixed-operators 
const OrdersPage = () => {
    const [result, setResult] = useState<IOrderList>();
    const [isLoading, setIsLoading] = useState(false);

    const loadData = async () => {
        try {
            setIsLoading(true)
            const data = await ApiServices.getSallaOrders();
            setResult(data)
        } catch (ex: any) {
            Utils.showErrorMessage(ex.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadData();
    }, [])

    return (
        <AuthGuard>
            <MenuAppBar>
                {isLoading && <LinearProgress sx={{ my: 2 }} />}
                {!isLoading && typeof result !== 'string' && (result && result.data) && (
                    <OrderList data={result.data} />
                )}

                {!isLoading && (!result || result && result.data.length <= 0) && (
                    <Alert severity="error">Oops! Something Went Wrong. Please Try Again Later.</Alert>
                )}
            </MenuAppBar>
        </AuthGuard>
    );
};

export default OrdersPage;
