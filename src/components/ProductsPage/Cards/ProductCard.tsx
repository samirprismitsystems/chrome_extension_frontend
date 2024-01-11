import { Box, Card, CardHeader, CardMedia, Chip, Stack, Typography } from '@mui/material';
import Utils from '../../../utils/utils';

export default function ProductCard(props: {
    product_title: string;
    second_level_category_name: string;
    discount: string;
    product_main_image_url: string;
    salePrice: any;
    currency: string;
}) {
    return (
        <>
            <Card sx={{ maxWidth: "360px", width: "100%" }}>
                <CardMedia
                    component="img"
                    height="194"
                    image={props.product_main_image_url || ""}
                    alt={props.product_main_image_url || "image.png"}
                />
                <CardHeader
                    title={(
                        <>
                            <Typography variant="body1" color="initial" textAlign={'left'}>{Utils.getContent(props.product_title)}</Typography>
                        </>
                    )}
                    subheader={
                        <>
                            <Stack flexWrap={"wrap"} flexDirection={"row"} gap={1} alignItems={'center'} pt={2}>
                                <Chip size='small' label={Utils.getContent(props.second_level_category_name)} color="info" variant="outlined" />
                                <Chip size='small' label={Utils.getContent(`${props.discount} Discount`)} color="success" variant="outlined" />
                            </Stack>
                            <Box my={2}>
                                <Typography variant="body1" color="initial">Price: <span style={{ fontWeight: "bold" }}>{Utils.prettyPrice(props.salePrice, props.currency)}</span></Typography>
                            </Box>
                        </>
                    } />
            </Card>
        </>
    )
}
