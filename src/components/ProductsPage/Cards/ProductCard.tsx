import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Chip, Stack, Typography } from '@mui/material'

export default function ProductCard() {
    const is_finished = true;
    return (
        <>
            <Card sx={{ maxWidth: "360px", width:"100%"}}>
                <CardHeader
                    title={"test-test-womenJeans-999"}
                    subheader={
                        <Stack flexWrap={"wrap"} flexDirection={"row"} gap={1} alignItems={'center'} pt={2}>
                            <Chip size='small' label="Category - Home Textile" color="info" variant="outlined" />
                            <Chip size='small' label="10% Discount" color="success" variant="outlined" />
                            {is_finished &&
                                <Chip size='small' label="Out of stock" color="error" variant="outlined" />
                            }
                        </Stack>
                    } />
                <CardMedia
                    component="img"
                    height="194"
                    image={`https://ae04.alicdn.com/kf/HTB1zQFrj93PL1JjSZFtxh7lRVXa0.jpeg`}
                    alt={`https://ae04.alicdn.com/kf/HTB1zQFrj93PL1JjSZFtxh7lRVXa0.jpeg`}
                />
                <CardActions sx={{ float: 'right' }} disableSpacing>
                    <Button variant="contained" color='info'>
                        $55.01 Buy Now
                    </Button>
                </CardActions>
            </Card>
        </>
    )
}
