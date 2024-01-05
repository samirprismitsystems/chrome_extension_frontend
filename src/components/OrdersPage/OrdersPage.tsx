import { Chip } from "@mui/material";
import { useEffect, useState } from "react";
import AuthGuard from "../../authGuard/AuthGuard";
import DataTable from "../../common/DataTable/DataTable";
import { enums } from "../../enum";
import ApiServices from "../../services/ApiServices";
import Utils from "../../utils/utils";
import MenuAppBar from "../MenuAppBar/MenuAppBar";


// eslint-disable-next-line react-hooks/exhaustive-deps

// eslint-disable @typescript-eslint/no-mixed-operators 
const OrdersPage = () => {
    const [result, setResult] = useState<any>();
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


    const getStatusBadge = (status: string) => {
        if (status === enums.ORDER_STATUS.UNDER_REVIEW) {
            return <Chip label="Under Review" color="success" variant="outlined" />
        }
    }

    return (
        <AuthGuard>
            <MenuAppBar>
                <DataTable
                    title={"Salla Orders"}
                    data={(result && result.data) || []}
                    columns={[
                        {
                            title: "Name",
                            render(data: any) {
                                return data.items[0].name || "N/A"
                            },
                        },
                        {
                            title: "Qty",
                            render(data: any) {
                                return data.items[0].quantity || "N/A"
                            },
                        },
                        {
                            title: "Amount",
                            render(data: any) {
                                return Utils.formatCurrency(data.total.amount, data.total.currency)
                            },
                        },
                        {
                            title: "Status",
                            render(data: any) {
                                return getStatusBadge(data.status.slug)
                            },
                        },
                        {
                            title: "Customer Name",
                            render(data: any) {
                                return `${data.customer.first_name} ${data.customer.last_name}`
                            },
                        },
                        {
                            title: "Customer Email",
                            render(data: any) {
                                return `${data.customer.email}`
                            },
                        },
                        {
                            title: "Customer Mobile",
                            render(data: any) {
                                return `${data.customer.mobile_code}${data.customer.mobile}`
                            },
                        },
                        {
                            title: "Customer City",
                            render(data: any) {
                                return `${data.customer.city}`
                            },
                        },
                        {
                            title: "Customer Country",
                            render(data: any) {
                                return `${data.customer.country}`
                            },
                        },
                    ]}
                    isLoading={isLoading}
                />
            </MenuAppBar>
        </AuthGuard>
    );
};

export default OrdersPage;
