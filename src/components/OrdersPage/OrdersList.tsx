import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { IOrderItem } from '../../types/orders';
import Utils from '../../utils/utils';
import { enums } from '../../enum';
import { Chip } from '@mui/material';
const rowsPerPageOptions = [5, 10, 25, 50, 100];

export default function OrderList({ data }: { data: IOrderItem[] }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const getStatusBadge = (status: string) => {
        if (status === enums.ORDER_STATUS.UNDER_REVIEW) {
            return <Chip label="Under Review" color="success" variant="outlined" />
        }
    }
    

    if(!data) return null;
    
    return (
        <Paper>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell><Typography variant="body1" color="initial" fontWeight={'bold'}>Name</Typography></TableCell>
                            <TableCell><Typography variant="body1" color="initial" fontWeight={'bold'}>Qty</Typography></TableCell>
                            <TableCell><Typography variant="body1" color="initial" fontWeight={'bold'}>Amount</Typography></TableCell>
                            <TableCell><Typography variant="body1" color="initial" fontWeight={'bold'}>Status</Typography></TableCell>
                            <TableCell><Typography variant="body1" color="initial" fontWeight={'bold'}>Customer Name</Typography></TableCell>
                            <TableCell><Typography variant="body1" color="initial" fontWeight={'bold'}>Customer Email</Typography></TableCell>
                            <TableCell><Typography variant="body1" color="initial" fontWeight={'bold'}>Customer Mobile</Typography></TableCell>
                            <TableCell><Typography variant="body1" color="initial" fontWeight={'bold'}>Customer City</Typography></TableCell>
                            <TableCell><Typography variant="body1" color="initial" fontWeight={'bold'}>Customer Country</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0 ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : data).map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.items[0].name}
                                </TableCell>
                                <TableCell>{row.items[0].quantity}</TableCell>
                                <TableCell>{Utils.prettyPrice(row.total.amount, row.total.currency)}</TableCell>
                                <TableCell>{getStatusBadge(row.status.slug)}</TableCell>
                                <TableCell> {`${row.customer.first_name} ${row.customer.last_name}`}</TableCell>
                                <TableCell>{row.customer.email}</TableCell>
                                <TableCell>{row.customer.mobile}</TableCell>
                                <TableCell>{row.customer.city}</TableCell>
                                <TableCell>{row.customer.country}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={rowsPerPageOptions}
                component="div"
                count={data.length as any}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
